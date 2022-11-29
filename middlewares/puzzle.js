
const SudokuSolver = require('../controllers/sudoku-solver.js');
const { createGrid } = require("./puzzle-solver-func");

const solver = new SudokuSolver();

const rows = {
    'A': 0,
    'B': 1,
    'C': 2,
    'D': 3,
    'E': 4,
    'F': 5,
    'G': 6,
    'H': 7,
    'I': 8
}

// function check
function check(puzzle, coordinate, value, done) {
    const validate = solver.validate(puzzle);
    if (validate === true) {
        console.log(coordinate);
        if (!/^[1-9]{1}$/.test(value))
            return done({ error: 'Invalid value' });
        if (!/^[A-I]{1}[1-9]{1}$/.test(coordinate))
            return done({ error: 'Invalid coordinate' });
        const [checkRowPlacement, checkColPlacement, checkRegionPlacement] = [
            solver.checkRowPlacement(puzzle, rows[coordinate[0]], coordinate[1] - 1, value)
            , solver.checkColPlacement(puzzle, rows[coordinate[0]], coordinate[1] - 1, value)
            , solver.checkRegionPlacement(puzzle, rows[coordinate[0]], coordinate[1] - 1, value)
        ];
        const grid = createGrid(puzzle.split(""));
        if (grid[rows[coordinate[0]]][coordinate[1] - 1] == value || (checkRowPlacement && checkColPlacement && checkRegionPlacement))
            return done(null, { valid: true })
        else {
            const conflict = [];
            if (!checkRowPlacement)
                conflict.push("row");
            if (!checkColPlacement)
                conflict.push("column");
            if (!checkRegionPlacement)
                conflict.push("region");
            return done({ "valid": false, "conflict": conflict })
        }
    }
    else
        done({ error: validate });
}


function solve(puzzle, done) {
    const validate = solver.validate(puzzle);
    console.log(validate);
    if (validate === true) {
        const result = solver.solve(puzzle);
        if (/^[1-9]{81}$/.test(result))
            return done(null, { solution: result });
        else
            return done({ error: result });
    }
    else
        done({ error: validate });
}

exports.check = check;
exports.solve = solve;
exports.createGrid = createGrid;
