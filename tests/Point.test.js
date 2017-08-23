"use strict";
import test from 'tape';
import Point from '../src/MazeTile'

export default class PointTest {
  constructor(){

  }

  valueStorageTest(assert){
    let samplePoint = new Point(10, 10);
    assert.equal(samplePoint.x, 10, 'point has the correct x coordinate value');
    assert.equal(samplePoint.y, 10, 'point has the correct y coordinate value');
    assert.end();
  }

  copyTest(assert){
    let samplePointA = new Point(10, 10);
    let samplePointB = samplePointA.copy();
    assert.deepEqual(samplePointB, samplePointA, 'copied point matches the point that was used to create it');
    assert.end();
  }

  runTests(){
    test('the point should report the correct x and y coordinates', this.valueStorageTest);
    test('the point should copy correctly and match', this.copyTest);
  }

}