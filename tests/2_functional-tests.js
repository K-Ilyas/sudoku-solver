const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzlesAndSolutions } = require("../controllers/puzzle-strings");

chai.use(chaiHttp);

suite('Functional Tests', () => {
    const sudoku = puzzlesAndSolutions[Math.floor(Math.random() * puzzlesAndSolutions.length)];

    suite("request to /api/solve", function () {
        test("Solve a puzzle with valid puzzle string", function (done) {
            chai
                .request(server)
                .post('/api/solve')
                .send({ 'puzzle': sudoku[0] })
                .end(function (err, response) {
                    assert.equal(response.status, 200, "the response status must be 200");
                    assert.equal(response.body.solution, sudoku[1], "the response must be a correct sodkou solution");
                    done();
                })
        });
        test("Solve a puzzle with missing puzzle string", function (done) {
            chai
                .request(server)
                .post('/api/solve')
                .end(function (err, response) {
                    assert.equal(response.status, 200, "the response status must be 200");
                    assert.equal(response.body.error, 'Required field missing', "the puzzle field exist");
                    done();
                })
        });
        test("Solve a puzzle with invalid characters", function (done) {
            chai
                .request(server)
                .post('/api/solve')
                .send({ puzzle: '82..4..6...16..89...983150749.157....--.......53..4...96.415..81..7632./3...28.51' })
                .end(function (err, response) {
                    assert.equal(response.status, 200, "the response status must be 200");
                    assert.equal(response.body.error, 'Invalid characters in puzzle', "the puzzle characters are valid");
                    done();
                })
        });
        test("Solve a puzzle with incorrect length", function (done) {
            chai
                .request(server)
                .post('/api/solve')
                .send({ puzzle: '82..4..6...16..89...983150749.157..53..4...96.415..81..3...28.51' })
                .end(function (err, response) {
                    assert.equal(response.status, 200, "the response status must be 200");
                    assert.equal(response.body.error, "Expected puzzle to be 81 characters long", "the response must be Expected puzzle to be 81 characters long");
                    done();
                })
        });
        test("Solve a puzzle that cannot be solved", function (done) {
            chai
                .request(server)
                .post('/api/solve')
                .send({ puzzle: '5..91111.1...1.1.1.1.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3' })
                .end(function (err, response) {
                    assert.equal(response.status, 200, "the response status must be 200");
                    assert.equal(response.body.error, "Puzzle cannot be solved", "the response must be Puzzle cannot be solved");
                    done();
                })
        });
    });

    suite("request to /api/check", function () {
        test("Check a puzzle placement with all fields", function (done) {
            chai
                .request(server)
                .post('/api/check')
                .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '3' })
                .end(function (err, response) {
                    assert.equal(response.status, 200, "the response status must be 200");
                    assert.isTrue(response.body.valid, "the response must be { valid : 'true' }");
                    done();
                })
        });
        test("Check a puzzle placement with single placement conflict", function (done) {
            chai
                .request(server)
                .post('/api/check')
                .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '4' })
                .end(function (err, response) {
                    assert.equal(response.status, 200, "the response status must be 200");
                    assert.isFalse(response.body.valid, "the response must be { valid : 'true' }");
                    assert.isArray(response.body.conflict, "conflict must be an array");
                    assert.deepEqual(response.body.conflict, ["row"], "the conflict must include row");
                    done();
                })
        });
        test("Check a puzzle placement with multiple placement conflicts", function (done) {
            chai
                .request(server)
                .post('/api/check')
                .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '5' })
                .end(function (err, response) {
                    assert.equal(response.status, 200, "the response status must be 200");
                    assert.isFalse(response.body.valid, "the response must be { valid : 'true' }");
                    assert.isArray(response.body.conflict, "conflict must be an array");
                    assert.deepEqual(response.body.conflict, ["row", "region"], "the conflict must include row and region");
                    done();
                })
        });
        test("Check a puzzle placement with all placement conflicts", function (done) {
            chai
                .request(server)
                .post('/api/check')
                .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '2' })
                .end(function (err, response) {
                    assert.equal(response.status, 200, "the response status must be 200");
                    assert.isFalse(response.body.valid, "the response must be { valid : 'true' }");
                    assert.isArray(response.body.conflict, "conflict must be an array");
                    assert.deepEqual(response.body.conflict, ["row", "column", "region"], "the conflict must include row, column and region");
                    done();
                })
        });
        test("Check a puzzle placement with missing required fields", function (done) {
            chai
                .request(server)
                .post('/api/check')
                .end(function (err, response) {
                    assert.equal(response.status, 200, "the response status must be 200");
                    assert.equal(response.body.error, 'Required field(s) missing', "All required fields exist");
                    done();
                })
        });
        test("Check a puzzle placement with invalid characters", function (done) {
            chai
                .request(server)
                .post('/api/check')
                .send({ puzzle: '82..4..6...16..89...983150749.157....--.......53..4...96.415..81..7632./3...28.51', coordinate: 'A2', value: '2' })
                .end(function (err, response) {
                    assert.equal(response.status, 200, "the response status must be 200");
                    assert.equal(response.body.error, 'Invalid characters in puzzle', "the puzzle characters are valid")
                    done();
                })
        });
        test("Check a puzzle placement with incorrect length", function (done) {
            chai
                .request(server)
                .post('/api/check')
                .send({ puzzle: '82..4..6...16..89...983150749.157........53..4...96.415..81..73...28.51', coordinate: 'A2', value: '2' })
                .end(function (err, response) {
                    assert.equal(response.status, 200, "the response status must be 200");
                    assert.equal(response.body.error, "Expected puzzle to be 81 characters long", "the puzzle is 81 characters")
                    done();
                })
        });
        test("Check a puzzle placement with invalid placement coordinate", function (done) {
            chai
                .request(server)
                .post('/api/check')
                .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A12', value: '2' })
                .end(function (err, response) {
                    assert.equal(response.status, 200, "the response status must be 200");
                    assert.equal(response.body.error, "Invalid coordinate", "valid placement coordinate")
                    done();
                })
        });
        test("Check a puzzle placement with invalid placement value", function (done) {
            chai
                .request(server)
                .post('/api/check')
                .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A1', value: '12' })
                .end(function (err, response) {
                    assert.equal(response.status, 200, "the response status must be 200");
                    assert.equal(response.body.error, "Invalid value", "valid placement value")
                    done();
                })
        });
    });
});

