"use strict";
import test from 'tape';
import Maze from '../src/Maze';
import MazeTile from '../src/MazeTile';

export default class MazeTest {
    constructor(){

    }

    mazeConstructorTest(assert){
        const seed = Math.random();
        const testMaze1 = new Maze(seed);
        const testMaze2 = new Maze(seed);
        assert.notEqual(testMaze1.random, null, 'testmaze 1 has a valid random value');
        assert.equal(testMaze1.random(), testMaze2.random(), 'testmaze 1 and testmaze 2 generate the same random number given the same seed');
        assert.notEqual(testMaze1.mazeTiles, undefined);
        assert.notEqual(testMaze1.mazeTiles, null);
        assert.end();
    }

    mazePathTest(assert) {
        const testMaze1 = new Maze(Math.random());
        const path = testMaze1.findPath();
        assert.notDeepEqual(testMaze1.findPath(), [], 'there should be a valid path between all waypoints in a maze');
        assert.equal(testMaze1.wayPoints[0].x, path[0][0].x);
      assert.equal(testMaze1.wayPoints[0].y, path[0][0].y);
        assert.end();
    }

    mazeDiffTest(assert) {
        const seed = Math.random();
        //const seed = 0.53942283843073;
        const testMaze1 = new Maze(seed);
        const userMaze = new Maze(seed);

        const testTile = userMaze.mazeTiles[0].find( (tile) => userMaze.isModifiable(tile) );
        // console.log("testMaze1Tile: "+JSON.stringify(testMaze1.mazeTiles[testTile.y][testTile.x], null, 2));
        // console.log("ChangedMazeTile: "+JSON.stringify(userMaze.mazeTiles[testTile.y][testTile.x], null, 2));
        // console.log("TestTile: "+JSON.stringify(testTile, null, 2));

        userMaze.doActionOnTile(testTile);

        let changedTile = testMaze1.getUserChanges(userMaze)[0];
        // console.log("testMaze1Tile: "+JSON.stringify(testMaze1.mazeTiles[testTile.y][testTile.x], null, 2));
        // console.log("ChangedMazeTile: "+JSON.stringify(userMaze.mazeTiles[testTile.y][testTile.x], null, 2));
        // console.log('test: '+JSON.stringify(testTile));
        // console.log('c: '+JSON.stringify(changedTile));
        console.log(testMaze1.seed);
        assert.equal(testTile.x ,changedTile.x , "The found 'change' should be at the same x coordinate");
        assert.equal(testTile.y, changedTile.y, "The found 'change' should be at the same y coordinate");
        assert.end();
    }

    mazeBlockerTest(assert){
        const seed = Math.random();
        const testMaze = new Maze(seed);
        const testTile = testMaze.mazeTiles[0].find( (tile) => testMaze.isModifiable(tile) );
        testMaze.setBlocker(testTile);
        assert.deepEqual(testTile.type, MazeTile.Type.Blocker);
        assert.end();
    }

    mazeCostTest(assert){
        const seed = Math.random();
        const testMaze = new Maze(seed);
        const mazePoints = testMaze.mazeTiles.reduce((tilesArray, columns) => tilesArray.concat(columns) , []);
        const testTile = mazePoints.find(
            (tile) => testMaze.isModifiable(tile) && MazeTile.Type.Empty===tile.type
        );
        const testTile2 = mazePoints.find(
            (tile) => testMaze.isModifiable(tile) && MazeTile.Type.Blocker===tile.type
        );
        assert.deepEqual(
            testMaze.operationCostForActionOnTile(testTile),
            1,
            "The cost to place a blocker should be 1"
        );
        assert.deepEqual(
            testMaze.operationCostForActionOnTile(testTile2),
            testMaze.params.naturalBlockerRemovalCost,
            "The cost to remove a natural blocker tile should be maze determined"
        );
        testMaze.doActionOnTile(testTile);
        testMaze.doActionOnTile(testTile2);
        assert.deepEqual(
            testMaze.operationCostForActionOnTile(testTile2),
            - testMaze.params.naturalBlockerRemovalCost,
            "The cost to re-add a natural blocker should be maze determined"
        );
        assert.deepEqual(
            testMaze.operationCostForActionOnTile(testTile),
            -1,
            "The cost to remove a user placed blocker should be -1"
        );
        assert.end();
    }



    runTests(){
        test('testing the constructor for mazer', this.mazeConstructorTest);
        test('testing valid path in maze', this.mazePathTest);
        test('testing changing of tiles in maze', this.mazeDiffTest);
        test('testing if the maze can set a blocker', this.mazeBlockerTest);
        test('testing if the maze can determine cost correctly', this.mazeCostTest);
    }
}