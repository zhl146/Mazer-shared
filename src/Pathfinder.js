import BinaryHeap from './BinaryHeap';
import Tile from './MazeTile';

// NOT A CLASS/CONSTRUCTOR
// JUST A FUNCTION
// takes a maze, start point, and end point
// returns an array of points as an ending path
// return empty array if fails to find solution
export default function Pathfinder(maze, startTile, endTile) {

  // before doing anything else, let's check if we have valid starting and ending points
  if (!maze.isPassable(startTile)) {
    console.log("Start point is impassable", startTile);
    return [];
  }

  if (!maze.isPassable(endTile)) {
    console.log("End point is impassable", endTile);
    return [];
  }

  const pathGrid = maze.mazeTiles.map( (row) => {
    return row.map( (tile) => {
      return {
        x: tile.x,
        y: tile.y,
        f: null,
        g: null,
        h: null,
        cost: 1,
        visited: false,
        closed: false,
        parent: null,
        blocked: tile.type === Tile.Type.Blocker,
      }
    })
  });

  const startPoint = pathGrid[startTile.y][startTile.x];
  const endPoint = pathGrid[endTile.y][endTile.x];

  // list of tiles to explore
  let openSet = new BinaryHeap( point => point.f );

  // add the start point
  openSet.push(startPoint);
  let currentPoint;

  let counter = 0;
  while ( openSet.size() ) { //while openSet still has candidates
    // set currentpoint to the point in openset with the lowest f
    currentPoint = openSet.pop();

    // prevent infinite looping while developing
    // should remove for prod
    if ( counter >= 2000) {
      console.log('cant get to end');
      break;
    }
    counter ++;

    // hit the endpoint and we should break the loop
    if ( currentPoint.x === endPoint.x && currentPoint.y === endPoint.y ) {
      const path = [];
      let node = currentPoint;
      path.unshift(node);
      while (node.parent) {
        path.unshift(node.parent);
        node = node.parent;
      }
      return path;
    }

    currentPoint.closed = true;

    const pointArray = [];

    for (let i = - 1; i <= 1; i ++) {
      for (let j = - 1; j <= 1; j ++) {
        if (i === 0 && j === 0) continue;
        const x = currentPoint.x + i;
        const y = currentPoint.y + j;
        const cost = Math.abs(i) + Math.abs(j) === 2 ? 14 : 10;
        if (pathGrid[y] && pathGrid[y][x] && !pathGrid[y][x].blocked) {
          pathGrid[y][x].cost = cost;
          pointArray.push(pathGrid[y][x])
        }
      }
    }

    pointArray.forEach( (neighbor) => {

      if (neighbor.closed) {
        // Not a valid node to process, skip to next neighbor.
        return;
      }

      // The g score is the shortest distance from start to current node.
      // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
      let gScore = currentPoint.g + neighbor.cost;

      if (!neighbor.visited || gScore < neighbor.g) {

        // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
        neighbor.visited = true;

        // if we've been here before, we need to remove it before adding it again with a new gScore
        if (neighbor.visited) {
          openSet.remove(neighbor);
        }

        neighbor.parent = currentPoint;
        neighbor.h = neighbor.h || 10 * (Math.abs(currentPoint.x - endPoint.x) + Math.abs(currentPoint.y - endPoint.y));
        neighbor.g = gScore;
        neighbor.f = neighbor.g + neighbor.h;

        openSet.push(neighbor);
      }
    })
  }
};
