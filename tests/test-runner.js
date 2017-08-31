import MazeTests from './Maze.test';
import PointTests from './Point.test';
import ScoreTests from './Score.test';

let unitTests = [];
unitTests.push(new MazeTests());
unitTests.push(new PointTests());
//unitTests.push(new ScoreTests());

unitTests.forEach( (unitTest) => {
  unitTest.runTests();
});


