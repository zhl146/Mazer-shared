"use strict";
import test from 'tape';
import Point from '../src/MazeTile'

test('the point should report the correct x and y coordinates', assert => {
  let samplePoint = new Point(10, 10);
  assert.equal(samplePoint.x, 10, 'point has the correct x coordinate value');
  assert.equal(samplePoint.y, 10, 'point has the correct y coordinate value');
  assert.end();
});

test('the point should copy correctly and match', assert => {
  let samplePointA = new Point(10, 10);
  let samplePointB = samplePointA.copy();
  assert.deepEqual(samplePointB, samplePointA, 'copied point matches the point that was used to create it');
  assert.end();
});

test('points should be able to test equality with other points on the basis of x and y coords', assert => {
  let samplePointA = new Point(5, 5);
  let samplePointB = new Point (5,5);
  samplePointA.type = 0;
  samplePointB.type = 1;

  assert.ok(samplePointA.matches(samplePointB), 'two points should match even though their types are different' )
  assert.end();
});
