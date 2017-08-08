"use strict";
import test from 'tape';
import Maze from '../src/Maze';

export default class MazeTest {
  constructor(){

  }

  mazeConstructorTest(assert){
    let testMaze1 = new Maze(3000);
    let testMaze2 = new Maze(3000);
    assert.notEqual(testMaze1.random, null, 'testmaze 1 has a valid random value');
    assert.equal(testMaze1.random(), testMaze2.random(), 'testmaze 1 and testmaze 2 generate the same random number given the same seed');
    assert.notEqual(testMaze1.mazeTiles, undefined);
    assert.notEqual(testMaze1.mazeTiles, null);
    assert.end();
  }

  runTests(){
    test('testing the constructor for mazer', this.mazeConstructorTest);
  }
}