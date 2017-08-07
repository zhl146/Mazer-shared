import MazeTests from './Maze.test';
import PointTests from './Point.test';

let unitTests = [];
unitTests.push(new MazeTests());
unitTests.push(new PointTests());

unitTests.forEach( (unitTest) => {
  unitTest.runTests();
});


