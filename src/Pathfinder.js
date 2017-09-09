import PF from 'pathfinding';
import Tile from './MazeTile';

// this is just a wrapper around the pathfinder.js library
// we use this because pathfinder.js was used as a drop-in replacement for our own pathfinding code
// we decided it was a pain to maintain our own code, so we outsourced the pathfinding to an external lib
const Pathfinder = {

  findPath: function(startPoint, endPoint, mazeTiles) {
    let pathfinder = new PF.AStarFinder({
      diagonalMovement: 1,
      heuristic: PF.Heuristic.octile
    });

    // turn mazetiles into an appropriate pathing grid for the pathfinder library
    let pathingGrid = new PF.Grid(mazeTiles.map( (row) => row.map( (tile) => tile.type === Tile.Type.Blocker ? 1 : 0  )));

    // calculate path using pathfinder API
    let calculatedPath = pathfinder.findPath(startPoint.x, startPoint.y, endPoint.x, endPoint.y, pathingGrid);

    // convert path (an array of [x, y] arrays) into an array of objects of format {x: xCoord, y: yCoord} and return
    return calculatedPath.map( point => ( {x: point[0], y: point[1]} ) );
  },

  // this function does the same thing as the one above, but it returns a path which has redundant points stripped out
  // for example, [0,1], [0,2], [0,3] would just become [0,1], [0,3]
  findCompressedPath: function(startPoint, endPoint, mazeTiles) {
    let pathfinder = new PF.AStarFinder({
      diagonalMovement: 1,
      heuristic: PF.Heuristic.octile
    });

    let pathingGrid = new PF.Grid(mazeTiles.map(( row ) => row.map(( tile ) => tile.type === Tile.Type.Blocker ? 1 : 0)));

    let calculatedPath = pathfinder.findPath(startPoint.x, startPoint.y, endPoint.x, endPoint.y, pathingGrid);

    return PF.Util.compressPath(calculatedPath).map(point => ( {x: point[0], y: point[1]} ));
  }

};

export default Pathfinder;