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
    let closedSet = new Set();

    // list of tiles to explore
    let openSet = new BinaryHeap( point => point.f );

    const gTracker = new Array(maze.params.numRows);
    gTracker.fill(new Array(maze.params.numColumns).fill(-1));

    // add the start point
    openSet.push(start);
    let currentPoint;

    gTracker[start.y][start.x] = 0;

    let counter = 0;
    while ( openSet.size() ) { //while openSet still has candidates
        // set currentpoint to the point in openset with the lowest f
        currentPoint = openSet.pop();

        if ( counter >= 2000) {
            console.log('cant get to end');
            break;
        }
        counter ++;

        if ( currentPoint.x === end.x && currentPoint.y === end.y ) {
            break;
        }
        closedSet.add(currentPoint);
        maze.getAdjacent( currentPoint, end ).forEach( (neighbor) => {

            if (closedSet.has(neighbor)) return; //this acts like a continue statement (does not execute code below

            const neighborG = gTracker[neighbor.y][neighbor.x];
            if (neighborG < 0 || neighbor.g < neighborG) {
                openSet.push(neighbor);
                gTracker[neighbor.y][neighbor.x] = neighbor.g;
            }
        })
    }

    lastGTracker.unshift(gTracker);
    lastGTracker.pop();

    if (gTracker[end.y][end.x] < 0) {
        // Never visited end node, so no path
        return [];
    }

    const path = [];

    let node = currentPoint;

    while (node.parent) {
        path.unshift(node.parent);
        node = node.parent;
    }
    lastGTracker.unshift(gTracker);
    lastGTracker.pop();

    return path;
};
