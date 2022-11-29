
// function create grid
function createGrid(puzzleArray) {
    if (puzzleArray.length === 0)
        return [];
    else {
        let grid = createGrid(puzzleArray.slice(9));
        grid.unshift(puzzleArray.slice(0, 9));
        return grid
    }
}

function joinTable(arr) {
    if (arr.length === 0)
        return "";
    else
        return arr[0].join("").concat(joinTable(arr.slice(1)))
}

function sudokuSolver(grid, n) {
    let row = -1;
    let col = -1;
    let isEmpty = true;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] == ".") {
                row = i;
                col = j;

                // We still have some remaining
                // missing values in Sudoku
                isEmpty = false;
                break;
            }
        }
        if (!isEmpty) {
            break;
        }
    }

    // No empty space left
    if (isEmpty) {
        return true;
    }

    // Else for each-row backtrack
    for (let num = 1; num <= n; num++) {
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (sudokuSolver(grid, n)) {

                // print(board, n);
                return true;
            }
            else {

                // Replace it
                grid[row][col] = ".";
            }
        }
    }
    return false;
}


function isSafe(grid, row, col, value) {
    // Row has the unique (row-clash)
    for (let d = 0; d < grid.length; d++) {

        // Check if the number we are trying to
        // place is already present in
        // that row, return false;
        if (grid[row][d] == value) {
            return false;
        }
    }
    // Column has the unique numbers (column-clash)
    for (let r = 0; r < grid.length; r++) {
        // Check if the number
        // we are trying to
        // place is already present in
        // that column, return false;
        if (grid[r][col] == value) {
            return false;
        }
    }
    // Corresponding square has
    // unique number (box-clash)
    let sqrt = Math.floor(Math.sqrt(grid.length));
    let boxRowStart = row - row % sqrt;
    let boxColStart = col - col % sqrt;
    for (let r = boxRowStart;
        r < boxRowStart + sqrt; r++) {
        for (let d = boxColStart;
            d < boxColStart + sqrt; d++) {
            if (grid[r][d] == value) {
                return false;
            }
        }
    }

    // If there is no clash, it's safe
    return true;
}


exports.createGrid = createGrid;
exports.sudokuSolver = sudokuSolver;
exports.joinTable = joinTable;