"use strict";
import test from 'tape';
import Maze from '../src/Maze';
import MazeTile from '../src/MazeTile';

test('testing the constructor', assert => {
  const seed = Math.random();
  const testMaze1 = new Maze(seed);
  const testMaze2 = new Maze(seed);
  assert.notEqual(testMaze1.random, null, 'testmaze has a valid random generator');
  assert.equal(testMaze1.random(), testMaze2.random(), 'testmaze 1 and testmaze 2 generate the same random number given the same seed');
  assert.ok(testMaze1.mazeTiles, 'mazetiles exist');
  assert.equal(testMaze1.score, 0, 'the score should start at zero');
  assert.equal(testMaze1.actionsUsed, 0, 'there should be no actions used in a new maze');
  assert.ok(testMaze1.params, 'params exist');
  assert.end();
});

test('testing valid path in generated maze', assert => {
  const testMaze1 = new Maze(Math.random());
  assert.ok(testMaze1.path.every( segment => segment.length > 0 ), 'there should be a valid path between all waypoints in a maze');
  assert.equal(testMaze1.wayPoints[0].x, testMaze1.path[0][0].x, 'the starting point x coordinate should be correct in the path');
  assert.equal(testMaze1.wayPoints[0].y, testMaze1.path[0][0].y, 'the starting point y coordinate should be correct in the path');
  assert.end();
});

test('testing doActionOnTile method validation', assert => {
  const seed = Math.random();
  const testMaze1 = new Maze(seed);

  const startPoint = testMaze1.mazeTiles.reduce( (startPoint, row) => {
    let foundStart = row.find( tile => tile.type === MazeTile.Type.Start );
    if (foundStart) return foundStart;
    return startPoint;
  }, null );

  assert.equal(testMaze1.mazeTiles[testMaze1.wayPoints[0].y][testMaze1.wayPoints[0].x],
      testMaze1.mazeTiles[startPoint.y][startPoint.x],
      'start point should be set correctly as the first waypoint');

  let testTile = testMaze1.mazeTiles[startPoint.y][startPoint.x];
  assert.equal(testMaze1.doActionOnTile(testTile), false, 'should not be able to modify a tile that is unmodifiable');

  testMaze1.actionsUsed = testMaze1.params.maxActionPoints;
  testTile = testMaze1.mazeTiles[0].find( tile => testMaze1.isModifiable(tile) );
  assert.equal(testMaze1.doActionOnTile(testTile), false, 'should return false due to not enough action points');
  testMaze1.actionsUsed = 0;

  let startNeighbors = [];
  if (testMaze1.contains({y: startPoint.y + 1, x: startPoint.x}))
  startNeighbors.push(testMaze1.mazeTiles[startPoint.y + 1][startPoint.x]);
  if (testMaze1.contains({y: startPoint.y + 1, x: startPoint.x + 1}))
    startNeighbors.push(testMaze1.mazeTiles[startPoint.y + 1][startPoint.x + 1]);
  if (testMaze1.contains({y: startPoint.y , x: startPoint.x + 1}))
    startNeighbors.push(testMaze1.mazeTiles[startPoint.y][startPoint.x + 1]);
  if (testMaze1.contains({y: startPoint.y - 1, x: startPoint.x + 1}))
    startNeighbors.push(testMaze1.mazeTiles[startPoint.y - 1][startPoint.x + 1]);
  if (testMaze1.contains({y: startPoint.y - 1, x: startPoint.x}))
    startNeighbors.push(testMaze1.mazeTiles[startPoint.y - 1][startPoint.x]);
  if (testMaze1.contains({y: startPoint.y - 1, x: startPoint.x - 1}))
    startNeighbors.push(testMaze1.mazeTiles[startPoint.y - 1][startPoint.x - 1]);
  if (testMaze1.contains({y: startPoint.y, x: startPoint.x - 1}))
    startNeighbors.push(testMaze1.mazeTiles[startPoint.y][startPoint.x - 1]);
  if (testMaze1.contains({y: startPoint.y + 1, x: startPoint.x - 1}))
    startNeighbors.push(testMaze1.mazeTiles[startPoint.y + 1][startPoint.x - 1]);

  startNeighbors.forEach( neighbor => {
    testMaze1.setTileType(neighbor, MazeTile.Type.Empty);
  });

  startNeighbors.forEach( (neighbor, index) => {
    if ( index !== startNeighbors.length - 1) {
      assert.ok(testMaze1.doActionOnTile(neighbor), 'we should be able to block all neighboring tiles except the last one');
    } else {
      assert.notOk(testMaze1.doActionOnTile(neighbor), 'we should not be able to block the last neighbor around the start');
    }
  });

  assert.end();
});

test('testing getUserChanges method', assert => {
  const seed = Math.random();
  //const seed = 0.53942283843073;
  const testMaze1 = new Maze(seed);
  const userMaze = new Maze(seed);

  const mazePoints = testMaze1.mazeTiles.reduce((tilesArray, columns) => tilesArray.concat(columns) , []);
  const testTile = mazePoints.find( tile => userMaze.isModifiable(tile) );
  // console.log("testMaze1Tile: "+JSON.stringify(testMaze1.mazeTiles[testTile.y][testTile.x], null, 2));
  // console.log("ChangedMazeTile: "+JSON.stringify(userMaze.mazeTiles[testTile.y][testTile.x], null, 2));
  // console.log("TestTile: "+JSON.stringify(testTile, null, 2));

  userMaze.doActionOnTile(testTile);

  let changedTile = testMaze1.getUserChanges(userMaze)[0];
  // console.log("testMaze1Tile: "+JSON.stringify(testMaze1.mazeTiles[testTile.y][testTile.x], null, 2));
  // console.log("ChangedMazeTile: "+JSON.stringify(userMaze.mazeTiles[testTile.y][testTile.x], null, 2));
  // console.log('test: '+JSON.stringify(testTile));
  // console.log('c: '+JSON.stringify(changedTile));
  assert.equal(testTile.x ,changedTile.x , "The found 'change' should be at the same x coordinate");
  assert.equal(testTile.y, changedTile.y, "The found 'change' should be at the same y coordinate");
  assert.end();
});

test('testing if the maze can determine cost correctly', assert => {
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
});