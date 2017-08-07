import MazeTests from './maze.test';
import PointTests from './Point.test';

let unitTests = [];
unitTests.push(new MazeTests());
unitTests.push(new PointTests());

unitTests.forEach(function(unitTest){
    unitTest.unitTests();
});

