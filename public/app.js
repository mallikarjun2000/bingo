let box = document.getElementById('box')
let fillBtn = document.getElementById('fill')
let resetBtn = document.getElementById('reset');
let selectedNumber = document.getElementById('selected-number');
let bingo = document.getElementsByClassName('bingo');
let startBtn = document.getElementById('start');
let numberClickAudio = document.getElementById('number_click_sound');
let playersListDiv = document.getElementById('players-list');
let isGameStarted = false
let cellsVisited = [];
let cellsMarked = [];
let r = c = 5;
let numberBoxes = [];
let numbersList = [];
let textLetters = ['B', 'I', 'N', 'G', 'O'];
let count = -1;
//let playerName = prompt('enter your name:')
let players = ['you']

function init() {
    for (let i = 0; i < 5; i++) {
        let letter = document.createElement('h3');
        letter.classList.add('bingo-count');
        letter.innerHTML = textLetters[i];
        bingo[0].appendChild(letter);
    }
    let divIds = 0;
    for (let i = 0; i < r; i++) {
        let temp = []
        for (let j = 0; j < c; j++) {
            let div = document.createElement('div')
            div.className = 'small-box'
            div.id = divIds++;
            box.appendChild(div);
            temp.push(div)
        }
        numberBoxes.push(temp);
    }
    // players.forEach((item)=>{
    //     let singlePlayer = document.createElement('p');
    //     singlePlayer.innerHTML = item;
    //     singlePlayer.className = 'single-player-name';
    //     playersListDiv.appendChild(singlePlayer)
    // })
}

// document.getElementById('close').addEventListener('click',(e)=>{
//     let x = document.getElementsByClassName('single-player-name');
//     x.forEach((item)=>{
//     item.style.display = 'none'
// })
// })

function markBingo(){
    let bingoLetters = document.getElementsByClassName('bingo-count');
    bingoLetters[count].style.textDecoration='line-through';
    if(count === 4){
        alert('congratulations you won the game!')
        resetBoxes();
    }
}

function fillBoxes(){
    for (let i = 0; i < r; i++) {
        let temp = []
        for (let j = 0; j < c; j++) {
            while (true) {
                let x = getRandomInt(1, 25);
                if (!numbersList.includes(x)) {
                    numberBoxes[i][j].innerHTML = x;
                    numbersList.push(x);
                    break;
                }
            }
            temp.push(false);
        }
        cellsVisited.push(temp);
        cellsMarked.push(temp);
    }
    numbersList = [];
}

function resetBoxes(){
    let bingoLetters = document.getElementsByClassName('bingo-count');
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
            numberBoxes[i][j].innerHTML = ''
            cellsVisited[i][j] = false;
            cellsMarked[i][j] = false;
            numberBoxes[i][j].classList.remove('selected')
            numberBoxes[i][j].classList.remove('marked')
        }
        bingoLetters[i].style.textDecoration='none';
    }
    selectedNumber.innerHTML = '-'
}

init();
fillBoxes();

startBtn.addEventListener('click', e => {
    if (isGameStarted) {
        isGameStarted = false;
        selectedNumber.innerHTML = '-';
        startBtn.innerHTML = 'START'
        resetBtn.disabled = false;
        fillBtn.disabled = false;
    }
    else {
        isGameStarted = true;
        //selectedNumber.innerHTML = '-';
        startBtn.innerHTML = 'STOP'
        resetBtn.disabled = true;
        fillBtn.disabled = true;
    }
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

fillBtn.addEventListener('click', (e) => {
    fillBoxes();
})


resetBtn.addEventListener('click', (e) => {
    resetBoxes();
})


/**
 * Fuction to check for marked Lines
 */
function checkForCrossLines(row, col) {
    let i=row;
    let cellCount = 0;
    for(let j=0;j<c;j++){
        if(j !== col && cellsVisited[i][j]){
            cellCount++;
        }
    }
    if(cellCount === 4){
        // row is completed;
        for(let j=0;j<c;j++){
            numberBoxes[i][j].classList.add('marked');
        }
        count++;
        // mark the bingo.
        markBingo();
    }

    cellCount = 0;
    i=col;
    for(let j=0;j<r;j++){
        if( j!== row && cellsVisited[j][i]){
            cellCount++;
        }
    }
    if(cellCount === 4){
        // col is completed
        for(let j=0;j<r;j++){
            numberBoxes[j][i].classList.add('marked');
        }
        count++;
        // mark the bingo
        markBingo();
    }
    if(Math.abs(row-col) === 0 || Math.abs(row+col) === 4){
        cellCount = 0;
        if(row === col){
            for(let j=0;j<r;j++){
                if(j !== row && cellsVisited[j][j]){
                    cellCount++;
                }
            }
            if(cellCount === 4){
                // left diagonal completed!
                for(let j=0;j<r;j++){
                    numberBoxes[j][j].classList.add('marked')
                }
                count++;
                // mark the bingo
                markBingo();
            }
        }
        if(row + col === 4){
            cellCount = 0;
            for(let j=0;j<r;j++){
                if(j !== row && cellsVisited[j][5-j-1]){
                    cellCount++;
                }
            }
            if(cellCount === 4){
                // mark the right diagonal
                for(let j=0;j<r;j++){
                    numberBoxes[j][5-j-1].classList.add('marked')
                }
                count++;
                // mark the bingo
                markBingo();
            }
        }
    }
}


box.addEventListener('click', e => {
    numberClickAudio.play();
    numberClickAudio.playbackRate = 3;
    let number = parseInt(e.target.innerHTML)
    if (number >= 1 && number <= 25) {
        let cellId = e.target.id;
        let cellRow = Math.floor(cellId / 5);
        let cellColumn = Math.floor(cellId % 5);
        if (cellsVisited[cellRow][cellColumn] === false)
            e.target.classList.add('selected');
        selectedNumber.innerHTML = number;
        checkForCrossLines(cellRow,cellColumn);
        cellsVisited[cellRow][cellColumn] = true;
    }
});