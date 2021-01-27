let StoreText = ''

function qs (qs){
    return document.querySelector(qs)
}

function qsa (qsa){
    return document.querySelectorAll(qsa)
}

function clearPrivious () {
    for (let i = 1; i < 82; i++){
        if (document.getElementById(i) !== null){
            document.getElementById(i).remove()
        }
    }
}

for (let i = 0; i < 10; i++){
    qsa('.number')[i].addEventListener('click', function(){
        if (i === 9){
            StoreText = ''
        } else {
            StoreText = qsa('.number')[i].innerText
        }
    })
}

qs('.btn-board').addEventListener('click', function(){
    clearPrivious()
    for(let i = 1; i < 82; i++){
        let cell = document.createElement('p')
        cell.classList.add('cell')
        cell.id = i
        if ((i > 18 && i < 28) || (i > 45 && i < 55)){
            cell.classList.add('border-buttom')
        }
        if (i % 9 === 3 || i % 9 === 6){
            cell.classList.add('border-right')
        }
        cell.addEventListener('click', function(){
            cell.innerText = StoreText
        })
        qs('.board').appendChild(cell)
        
    }
})


qs('.clear').addEventListener('click', function() {
    for(let i = 1; i < 82; i ++){
        document.getElementById(i).innerText = ''
    }
})


qs('.solve').addEventListener('click', function() {
    let arr = []
    let array = []
    for(let i = 1; i < 82; i ++){
        array.push(document.getElementById(i).innerText)
        if ( i % 9 === 0){
            arr.push(array)
            array = []
        }
    }
    let solvedArr = solve(convert(arr))
    if (solvedArr === false || solvedArr === undefined){
        let err = document.createElement('div')
        err.classList.add('error')
        err.innerHTML = '<h1>WRONG INPUT!!!</h1>'
        qs('.main').appendChild(err)
    } else {
        insert(solvedArr)
        console.log(solvedArr)
    }
})

function insert (board){
    let id = 1
    for (let i = 0; i < 9; i++){
        for (let index = 0; index < 9; index++){
            document.getElementById(id).innerText = board[i][index]
            id++
        }
    }
}

function convert (arr){
    for(let i = 0; i < 9; i++){
        for (let index = 0; index < 9; index++){
            if (Number(arr[i][index])){
                arr[i][index] = Number(arr[i][index])
            } else {
                arr[i][index] = null
            }
        }
    }
    return arr
}

function randomNums () {
    let count  = 1
    let array = []
    while (count < 10){
        let num = Math.ceil(Math.random() * 9)
        if (array.indexOf(num) === -1){
            array.push(num)
            count++
        }
    }
    return array
}

console.log(randomNums())

function solve (board) {
    if (solved(board)) {
        return board 
    }
    else {
        const posibilities = nextBoard(board)
        const validBoards = keepOnlyValid(posibilities)
        return searchForSolution(validBoards)
    }
}

function solved(board){
    // THIS FUNCTION WORKS.
    // Board -> Boolean
    // checks to see if the given puzzle is solved
    for (var i = 0; i < 9; i++){
        for (var j = 0; j < 9; j++){
            if (board[i][j] == null){
                return false
            }
            if (board[i].indexOf(j + 1) === -1) {
                return false
            }
        }
    }
    return true
}

function searchForSolution(boards){
    // List[Board] -> Board or false
    // finds a valid solution to the sudoku problem
    if (boards.length < 1){
        return false
    }
    else {
        // backtracking search for solution
        var first = boards.pop()
        const tryPath = solve(first)
        if (tryPath){
            return tryPath
        }
        else{
            return searchForSolution(boards)
        }
    }
}

function nextBoard(board){ 
    // THIS FUNCTION WORKS.
    // Board -> List[Board]
    // finds the first emply square and generates 9 different boards filling in that square with numbers 1...9
    var res = []
    const firstEmpty = findEmptySquare(board)
    if (firstEmpty != undefined){
        const y = firstEmpty[0]
        const x = firstEmpty[1]
        for (var i = 1; i < 10; i++){
            var newBoard = [...board]
            var row = [...newBoard[y]]
            row[x] = i
            newBoard[y] = row
            res.push(newBoard)
        }
    }
    return res
}

function findEmptySquare(board){
    // THIS FUNCTION WORKS.
    // Board -> [Int, Int] 
    // (get the i j coordinates for the first empty square)
    for (var i = 0; i < 9; i++){
        for (var j = 0; j < 9; j++){
            if (board[i][j] == null) {
                return [i, j]
            }
        }
    }
}

function keepOnlyValid(boards){
    // THIS FUNCTION WORKS.
    // List[Board] -> List[Board]
    // filters out all of the invalid boards from the list
    var res = []
    for (var i = 0; i < boards.length; i++){
        if (validBoard(boards[i])){
            res.push(boards[i])
        }
    }
    return res
}

function validBoard(board){
    // THIS FUNCTION WORKS.
    // Board -> Boolean
    // checks to see if given board is valid
    return rowsGood(board) && columnsGood(board) && boxesGood(board)
}

function rowsGood(board){
    // THIS FUNCTION WORKS.
    // Board -> Boolean
    // makes sure there are no repeating numbers for each row
    for (var i = 0; i < 9; i++){
        var cur = []
        for (var j = 0; j < 9; j++){
            if (cur.includes(board[i][j])){
                return false
            }
            else if (board[i][j] != null){
                cur.push(board[i][j])
            }
        }
    }
    return true
}

function columnsGood(board){
    // THIS FUNCTION WORKS.
    // Board -> Boolean
    // makes sure there are no repeating numbers for each column
    for (var i = 0; i < 9; i++){
        var cur = []
        for (var j = 0; j < 9; j++){
            if (cur.includes(board[j][i])){
                return false
            }
            else if (board[j][i] != null){
                cur.push(board[j][i])
            }
        }
    }
    return true
}


function boxesGood(board){
    // transform this everywhere to update res
    const boxCoordinates = [[0, 0], [0, 1], [0, 2],
                            [1, 0], [1, 1], [1, 2],
                            [2, 0], [2, 1], [2, 2]]
    // THIS FUNCTION WORKS.
    // Board -> Boolean
    // makes sure there are no repeating numbers for each box
    for (var y = 0; y < 9; y += 3){
        for (var x = 0; x < 9; x += 3){
            // each traversal should examine each box
            var cur = []
            for (var i = 0; i < 9; i++){
                var coordinates = [...boxCoordinates[i]]
                coordinates[0] += y
                coordinates[1] += x
                if (cur.includes(board[coordinates[0]][coordinates[1]])){
                    return false
                }
                else if (board[coordinates[0]][coordinates[1]] != null){
                    cur.push(board[coordinates[0]][coordinates[1]])
                }
            }
        }
    }
    return true
}

