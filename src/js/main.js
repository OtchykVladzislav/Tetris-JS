var canvas = document.getElementById('draw');
var ctx = canvas.getContext('2d');

const colums = 12;
const row = 24;
const boxes = 25;

var score = 0;
var line = 0;
let rand;

ctx.scale(boxes,boxes)

var player = {
    pos: {x: 5, y: 1},
    matrix: null,
    color: null
}
let getEmptyBoard = [] 

var figures = [
    [
        [0,1,0],
        [1,1,1],
        [0,0,0]
    ],
    [
        [0,2,0],
        [0,2,0],
        [2,2,0]
    ],
    [
        [0,3,0],
        [0,3,0],
        [0,3,3]
    ],
    [
        [0,4,0,0],
        [0,4,0,0],
        [0,4,0,0],
        [0,4,0,0]
    ],
    [
        [5,5],
        [5,5]
    ],
    [
        [0,6,6],
        [6,6,0],
        [0,0,0]
    ],
    [
        [7,7,0],
        [0,7,7],
        [0,0,0]
    ]
]

var colors = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#87fa2f',
    '#3877FF'
];


rand = Math.floor(Math.random() * figures.length)
player.matrix = figures[rand];
player.color = colors[rand + 1];


document.getElementById("play").addEventListener("click", () => {
    score = 0;
    line = 0;
    isTimer()
    isUpdate()
})

function elemTable(){
    getEmptyBoard = []
    const r = new Array(colums + 2).fill(1);
    getEmptyBoard.push(r);

    for (let i = 0; i < row; i++) {
        let rows = new Array(colums).fill(0);
        rows.push(1);
        rows.unshift(1);

        getEmptyBoard.push(rows);
    }

    getEmptyBoard.push(r);
    getEmptyBoard.push(r);
}


function isCollides (object, matrix) {
    for (let i = 0; i < object.matrix.length; i++) {
        for (let j = 0; j < object.matrix[i].length; j++) {
            if(object.matrix[i][j] && matrix[object.pos.y + i + 1][object.pos.x + j + 1]){
                return 1
            }
        }
    }
    return 0
}

function mergeArena(matrix, x, y) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            getEmptyBoard[y+i+1][x+j+1] = getEmptyBoard[y+i+1][x+j+1] || matrix[i][j];
        }
        
    }
    
}

function clearBlocks() {
    for (let i = 1; i < getEmptyBoard.length-2; i++) {
        let clear = 1;

        for (let j = 1; j < getEmptyBoard[i].length-1; j++) {
            if (!getEmptyBoard[i][j])
                clear = 0;
        }

        if (clear) {
            let r = new Array(colums).fill(0);
            r.push(1);
            r.unshift(1);

            getEmptyBoard.splice(i, 1);
            getEmptyBoard.splice(1, 0, r);
        }
    }
}


function isRotate(oldMatrix, num) {
    let matrix = []
    for(let i in oldMatrix) matrix.push([]);

    if(num == 1){
        oldMatrix.map((row, i) =>
            row.map((val, j) => matrix[j][oldMatrix.length - 1 - i] = oldMatrix[i][j]) 
        );
    }
    else{
        oldMatrix.map((row, i) =>
            row.map((val, j) => matrix[oldMatrix.length - 1 - j][i] = oldMatrix[i][j])
        );
    }

    return matrix
}

function loseBack() {
    document.getElementById("wrapper").style.display = "none";
    document.getElementById("modal").style.display = "flex";
    return setTimeout(() => {
        location.reload()
    }, 4000)
}

function gameOver() {
    for (let j = 1; j < getEmptyBoard[1].length-1; j++)
        if (getEmptyBoard[1][j]){
            document.getElementById("play").style.display = "block"
            document.getElementById("timer").style.display = "none"
            loseBack()
        }
    return;
}

function checkLine(){
    for(let i = 1; i < getEmptyBoard.length - 2; i++){
        if(getEmptyBoard[i].includes(0,1) === false){
            line++ 
            score += getEmptyBoard[i].reduce((prev, next) => prev + next, 0) - 1 
        }
    }
}

function isDrawArena() {
    ctx.fillStyle = "white"
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    for (let i = 1; i < getEmptyBoard.length-2; i++) {
        for (let j = 1; j < getEmptyBoard[i].length-1; j++) {
            if (getEmptyBoard[i][j]) {
                ctx.fillStyle = colors[getEmptyBoard[i][j]];
                ctx.fillRect(j-1, i-1, 1, 1);
            }
        }
    }
}

function isDrawMatrix(matrix, x, y) {
    for(let i = 0; i < matrix.length; i++){
        for(let j = 0; j < matrix[i].length; j++){
            if (matrix[i][j]) ctx.fillRect(x + j, y + i, 1, 1);
        }
    }
}

let interval = 1000;
let lastTime = 0;
let count = 0;

function isUpdate(time = 0) {
    
    const dt = time - lastTime;
    lastTime = time;
    count += dt;

    if (count >= interval) {
        player.pos.y++;
        count = 0;
    }

    if (isCollides(player, getEmptyBoard)) {
        mergeArena(player.matrix, player.pos.x, player.pos.y - 1);
        checkLine();
        clearBlocks()
        gameOver()

        player.pos.y = 1;
        player.pos.x = 5;

        rand = Math.floor(Math.random() * figures.length)
        player.matrix = figures[rand];
        player.color = colors[rand + 1];

        interval = 1000
    }

    isDrawArena()
    ctx.fillStyle = player.color;
    isDrawMatrix(player.matrix, player.pos.x, player.pos.y)

    document.getElementById("score").innerText = score
    document.getElementById("line").innerText = line
    requestAnimationFrame(isUpdate)
}

document.addEventListener("keydown", event => {

    if (event.keyCode === 37 && interval-1) {
        player.pos.x--;
        if(isCollides(player, getEmptyBoard)){
            player.pos.x++;
        }
    } else if (event.keyCode === 39 && interval-1) {
        player.pos.x++;
        if(isCollides(player, getEmptyBoard)){
            player.pos.x--;
        }
    } else if (event.keyCode === 40) {
        player.pos.y++;
    } else if (event.keyCode === 38) {
        player.matrix = isRotate(player.matrix, 1)
        if(isCollides(player, getEmptyBoard)){
            player.matrix = isRotate(player.matrix, -1)
        }
    } else if (event.keyCode === 32) {
        interval = 1
    }
});

elemTable();



////////
function isTimer(){
    let sec = 0;
    let min = 0;
    let hour = 0;
    document.getElementById("play").style.display = "none"
    document.getElementById("timer").style.display = "block"
    return setInterval(() => {
        let secText, minText, hourText
        sec++
        if(sec == 60){
            min++
            sec = 0
        }
        else if(min == 60){
            hour++
            min = 0
        }


        if(sec < 10){
            secText = "0" + sec
        }
        else{
            secText = sec
        }
        
        if(min < 10){
            minText = "0" + min
        }
        else{
            minText = min
        }
        if(hour < 10){
            hourText = "0" + hour
        }
        else{
            hourText = hour
        }


        document.getElementById("timer").innerText = hourText+":"+minText+":"+secText;
    }, 1000)
}