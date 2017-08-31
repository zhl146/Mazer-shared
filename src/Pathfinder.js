import PF from 'pathfinding';
import Tile from './MazeTile';

const Pathfinder = {
  findPath: function(startPoint, endPoint, mazeTiles) {
    let pathfinder = new PF.AStarFinder({
      diagonalMovement: 1,
      heuristic: PF.Heuristic.octile
    });

    let pathingGrid = new PF.Grid(mazeTiles.map( (row) => row.map( (tile) => tile.type === Tile.Type.Blocker ? 1 : 0  )));

    let calculatedPath = pathfinder.findPath(startPoint.x, startPoint.y, endPoint.x, endPoint.y, pathingGrid)

    return calculatedPath.map( point => ( {x: point[0], y: point[1]} ) );
  },
  findCompressedPath: function(startPoint, endPoint, mazeTiles) {
    let pathfinder = new PF.AStarFinder({
      diagonalMovement: 1,
      heuristic: PF.Heuristic.octile
    });

    let pathingGrid = new PF.Grid(mazeTiles.map(( row ) => row.map(( tile ) => tile.type === Tile.Type.Blocker ? 1 : 0)));

    let calculatedPath = pathfinder.findPath(startPoint.x, startPoint.y, endPoint.x, endPoint.y, pathingGrid);

    return PF.Util.compressPath(calculatedPath).map(point => ( {x: point[0], y: point[1]} ));
  },
  findSmoothPath: function(startPoint, endPoint, mazeTiles) {
    let pathfinder = new PF.AStarFinder({
      diagonalMovement: 1,
      heuristic: PF.Heuristic.octile
    });

    let pathingGrid = new PF.Grid(mazeTiles.map(( row ) => row.map(( tile ) => tile.type === Tile.Type.Blocker ? 1 : 0)));

    let calculatedPath = pathfinder.findPath(startPoint.x, startPoint.y, endPoint.x, endPoint.y, pathingGrid);

    pathingGrid = new PF.Grid(mazeTiles.map(( row ) => row.map(( tile ) => tile.type === Tile.Type.Blocker ? 1 : 0)));

    return PF.Util.smoothenPath(pathingGrid, calculatedPath).map(point => ( {x: point[0], y: point[1]} ));
  }
};

export default Pathfinder;