"use strict";
import test from 'tape';
import MazeTile from '../src/MazeTile'

test('the point should report the correct x and y coordinates', assert => {
  let samplePoint = new MazeTile(10, 10);
  assert.equal(samplePoint.x, 10, 'point has the correct x coordinate value');
  assert.equal(samplePoint.y, 10, 'point has the correct y coordinate value');
  assert.end();
});

test('the point should copy correctly and match', assert => {
  let samplePointA = new MazeTile(10, 10);
  let samplePointB = samplePointA.copy();
  assert.deepEqual(samplePointB, samplePointA, 'copied point matches the point that was used to create it');
  assert.end();
});
