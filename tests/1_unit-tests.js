const chai = require('chai');
const assert = chai.assert;
const { puzzlesAndSolutions } = require("../controllers/puzzle-strings");
const Solver = require('../controllers/sudoku-solver.js');
const { rows } = require("../middlewares/puzzle");
let solver = new Solver();


suite('Unit Tests', () => {
    const sudoku = puzzlesAndSolutions[Math.floor(Math.random() * puzzlesAndSolutions.length)];
    test("Logic handles a valid puzzle string of 81 characters", function () {
        assert.isTrue(solver.validate(sudoku[0]), "the function must return true");
    });
    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function () {
        assert.equal(solver.validate("82..4..6...16..89...983150749.157....--.......53..4...96.415..81..7632./3...28.51"), "Invalid characters in puzzle", "the function must return Invalid characters in puzzle");
    });
    test("Logic handles a puzzle string that is not 81 characters in length", function () {
        assert.equal(solver.validate("82..4..6...16..89...983150749.157..53..4...96.415..81..3...28.51"), "Expected puzzle to be 81 characters long", "the function must return Expected puzzle to be 81 characters long'");
    });
    test("Logic handles a valid row placement", function () {
        assert.isTrue(solver.checkRowPlacement(puzzlesAndSolutions[0][0], rows["A"], "2", "6"), "the checkRowPlacement function must return true");
    });
    test("Logic handles an invalid row placement", function () {
        assert.isFalse(solver.checkRowPlacement(puzzlesAndSolutions[0][0], rows["A"], "2", "4"), "the checkRowPlacement function must return false");
    });
    test("Logic handles a valid column placement", function () {
        assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[0][0], rows["B"], "1", "1"), "the checkColPlacement function must return true");
    });
    test("Logic handles an invalid column placement", function () {
        assert.isFalse(solver.checkColPlacement(puzzlesAndSolutions[0][0], rows["B"], "1", "7"), "the checkColPlacement function must return false");
    });
    test("Logic handles a valid region (3x3 grid) placement", function () {
        assert.isTrue(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], rows["C"], "1", "9"), "the checkRegionPlacement function must return true");
    });
    test("Logic handles an invalid region (3x3 grid) placement", function () {
        assert.isFalse(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], rows["C"], "1", "6"), "the checkRegionPlacement function must return fasle");
    });
    test("Valid puzzle strings pass the solver", function () {
        assert.match(solver.solve(sudoku[0]), /^[1-9]{81}$/, "the solve function must return 81 valid characters from 1 to 9");
    });
    test("Invalid puzzle strings fail the solver", function () {
        assert.equal(solver.solve("5..91111.1...1.1.1.1.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3"), "Puzzle cannot be solved", "solve function must return Puzzle cannot be solved");
    });
    test("Solver returns the expected solution for an incomplete puzzle", function () {
        assert.equal(solver.solve(sudoku[0]), sudoku[1], "solve function must return the right solution");
    });
});
