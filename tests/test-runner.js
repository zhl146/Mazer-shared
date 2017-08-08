import MazeTests from './Maze.test';
import PointTests from './Point.test';
import BinaryHeapTests from './BinaryHeap.test';

let unitTests = [];
unitTests.push(new MazeTests());
unitTests.push(new PointTests());
unitTests.push(new BinaryHeapTests());

unitTests.forEach( (unitTest) => {
  unitTest.runTests();
});


