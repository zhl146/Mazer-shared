import BinaryHeap from './BinaryHeap';

// NOT A CLASS/CONSTRUCTOR
// JUST A FUNCTION
// takes a maze, start point, and end point
// returns an array of points as an ending path
// return empty array if fails to find solution
export default function Pathfinder(maze, start, end) {
    const lastGTracker = [null, null, null, null, null];

    if (!maze.isPassable(start)) {
        console.log("Start point is impassable", start);
        return [];
    }

    if (!maze.isPassable(end)) {
        console.log("End point is impassable", end);
        return [];
    }

    start.g = 0;
    start.f = 0;

    // list of tiles that have been explored
    const closedSet = new PointSet();

    // list of tiles to explore
    let openSet = new BinaryHeap(function ( point ) {
        return point.f;
    });

    const gTracker = new Array(maze.ysize);

    for (let i = 0; i < maze.ysize; i++ ) {
        gTracker[i] = new Array(maze.xsize);
        for (let j = 0; j < maze.xsize; j++) {
            gTracker[i][j] = -1;
        }
    }

    // add the ending point
    openSet.push(start);
    gTracker[start.y][start.x] = 0;

    let counter = 0;
    while ( openSet.size() ) {
        var currentPoint = openSet.pop();
        if ( counter >= 2000) { break;}
        counter ++;

        if ( currentPoint.x === end.x && currentPoint.y === end.y ) {
            break;
        }

        closedSet.add(currentPoint);

        for ( const neighbor of maze.getAdjacent( currentPoint, end ) ) {
            if (closedSet.has(neighbor)) {
                continue;
            }

            const neighborG = gTracker[neighbor.y][neighbor.x];
            const currentG = gTracker[currentPoint.y][currentPoint.x];

            if (neighborG < 0) {
                openSet.push(neighbor);
                gTracker[neighbor.y][neighbor.x] = neighbor.g;
            }
            else if (neighbor.g < neighborG) {
                openSet.push(neighbor);
                gTracker[neighbor.y][neighbor.x] = neighbor.g;
            }
        }
    }

    lastGTracker.unshift(gTracker);
    lastGTracker.pop();

    if (gTracker[end.y][end.x] < 0) {
        // Never visited end node, so no path
        return [];
    }

    const path = [];
    let node = currentPoint;
    path.unshift(node);
    while (node.parent) {
        path.unshift(node.parent);
        node = node.parent;
    }
    lastGTracker.unshift(gTracker);
    lastGTracker.pop();
    return path;
};

function PointSet()
{
  // this is a set of x, y pairs
  // looks like { 'x coord': ('y coord' : true) }
  // if the point is in the set, it's value is true
  this.set = {};
}

PointSet.prototype.add = function(point) {
  // checks if the x value exists, otherwise set it to an empty object
  if (!this.set[point.x]) this.set[point.x] = {};
  // sets the point to true;
  this.set[point.x][point.y] = true;
};

// checks if the pointset contains a point
PointSet.prototype.has = function(point) {
  // doesn't the second condition imply the first?
  return (this.set[point.x] && this.set[point.x][point.y]);
};

PointSet.prototype.del = function(point) {
  if (!this.set[point.x]) return;
  delete this.set[point.x][point.y];
};
