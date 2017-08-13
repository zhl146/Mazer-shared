"use strict";
import test from 'tape';
import Maze from "../src/Maze";
import Score from "../src/Score";

export default class ScoreTest{

    constructor(){
        const diffPoints = [
            {"x":9,"y":12,"operationType":1},
            {"x":16,"y":12,"operationType":1},
            {"x":17,"y":12,"operationType":1},
            {"x":18,"y":12,"operationType":1},
            {"x":8,"y":13,"operationType":1},
            {"x":14,"y":13,"operationType":1},
            {"x":15,"y":13,"operationType":1},
            {"x":21,"y":13,"operationType":1},
            {"x":22,"y":13,"operationType":1},
            {"x":23,"y":13,"operationType":1},
            {"x":25,"y":13,"operationType":1},
            {"x":0,"y":14,"operationType":1},
            {"x":1,"y":14,"operationType":1},
            {"x":2,"y":14,"operationType":1},
            {"x":3,"y":14,"operationType":1},
            {"x":4,"y":14,"operationType":1},
            {"x":5,"y":14,"operationType":1},
            {"x":6,"y":14,"operationType":1},
            {"x":7,"y":14,"operationType":1}
        ];

        this.baseMaze = new Maze(5000);
        this.Score = new Score(this.baseMaze);
        this.changedMaze = new Maze(5000);
        diffPoints.forEach( (point) => this.changedMaze.doActionOnTile(point) );
    }

    testCalculateScore(assert){
        let numericScore = this.Score.calculateScore(this.changedMaze);
        assert.equal(numericScore, -1543);
        assert.end();
    }

    runTests(){
        test('testing the constructor for mazer', this.testCalculateScore.bind(this));
    }
}

