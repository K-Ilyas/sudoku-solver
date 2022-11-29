// functpion to create grid
const { createGrid, sudokuSolver, joinTable } = require("../middlewares/puzzle-solver-func");

class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length > 81 || puzzleString.length < 81)
      return 'Expected puzzle to be 81 characters long';
    if (!puzzleString.split("").every((e) => /^\d{1}$/.test(e) || e === '.'))
      return 'Invalid characters in puzzle';
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let grid = createGrid(puzzleString.split(""));
    for (let i = 0; i < grid.length; i++) {
      if (grid[row][i] == value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let grid = createGrid(puzzleString.split(""));
    // Column has the unique numbers (column-clash)
    for (let i = 0; i < grid.length; i++) {
      if (grid[i][column] == value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let grid = createGrid(puzzleString.split(""));
    let sqrt = Math.floor(Math.sqrt(grid.length));
    let boxRowStart = row - row % sqrt;
    let boxColStart = column - column % sqrt;
    for (let r = boxRowStart; r < boxRowStart + sqrt; r++) {
      for (let d = boxColStart; d < boxColStart + sqrt; d++) {
        if (grid[r][d] == value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    let result = createGrid(puzzleString.split(""));
    if (sudokuSolver(result, result.length))
      return joinTable(result);
    else
      return 'Puzzle cannot be solved';
  }
}

module.exports = SudokuSolver;

