import seedrandom from 'seedrandom';
import Tile from './MazeTile';
import Pathfinder from './Pathfinder';

import ColorScheme from 'color-scheme';

export default function Maze(seed) {
  let i;
  this.random = seedrandom(seed);
  this.seed = seed;

  // initialize maze params
  this.params = this.generateMazeParams();
  this.mazeTiles = this.generateEmptyMaze();
  this.unusedPoints = this.generateUnusedPointsArray();
  this.wayPoints = this.generateWayPoints();
  this.generateScoreZones()
      .generateBlockers();
};

// make sure that the point is in the bounds
// and make sure that it is empty
Maze.prototype.isPassable = function(point) {
  return this.contains(point) &&
      this.mazeTiles[point.y][point.x].isEmpty();
};

// make sure that the point is in the bounds
// and make sure that it's not a waypoint (waypoints shouldn't be messed with)
Maze.prototype.isModifiable = function(point) {
  return this.contains(point) &&
      !this.wayPoints.containsPoint(point);
};

// makes sure that the point is in the bounds of the maze
Maze.prototype.contains = function(point) {
  return point.x >= 0 &&
      point.y >= 0 &&
      point.x < this.params.numColumns &&
      point.y < this.params.numRows;
};

// takes a point from the list of unused points, removes it from the list and returns it
Maze.prototype.generateNewPoint = function() {
  const randomPointIndex = this.generateRandomIntBetween(0, this.unusedPoints.length - 1);
  return this.unusedPoints.splice(randomPointIndex, 1)[0];
};

// initializes a xsize X ysize maze of empty tiles
Maze.prototype.generateEmptyMaze = function() {
  return this.createArrayofLength(this.params.numRows)
      .map( (element, rowIndex) => this.createArrayofLength(this.params.numColumns)
          .map( (element, colIndex) => new Tile(colIndex, rowIndex, Tile.Type.Empty) )
      );
};

Maze.prototype.generateWayPoints = function() {
  // we need to have at least one valid path through the maze
  let protectedPath = [];

  // holds generated set of points that will create the protected path
  let pathVertices = [];

  // reusable point
  let newPoint;

  // generate start/end/waypoints
  // they must be at least 2 distance apart to be accepted
  let savedPoints = [];
  while ( pathVertices.length < this.params.numPathVertexes ) {
    newPoint = this.generateNewPoint();
    if (pathVertices.pointIsAtLeastThisFar(newPoint, 2) ) {
      pathVertices.push(newPoint);
    } else {
      savedPoints.push(newPoint);
    }
  }
  // we rejected some points in the previous step; make sure we put them back on the unused points array
  savedPoints.forEach( (point) => this.unusedPoints.push(point) );

  // connect vertexes with path to create a random protected path between the start and end
  for (let i = 0; i < this.params.numPathVertexes - 1; i++) {
    const pathSegment = Pathfinder(this, pathVertices[i], pathVertices[i + 1]);
    if (i !== 0) {
      // Shift so that the path so that it's continuous (end of previous equals start of next)
      pathSegment.shift();
    }
    pathSegment.forEach( (point) => protectedPath.push(point) );
  }

  // we shouldn't put anything where the protected path is
  // so they are removed from the unused points array
  protectedPath.forEach( (point) => {
    this.unusedPoints = this.removePointInArray(this.unusedPoints, point);
  });

  // Select random vertices to delete, excluding start and end
  while (pathVertices.length > this.params.numWayPoints + 2) {
    const index = Math.floor(1.0 + this.random() * (pathVertices.length - 2.0));
    pathVertices.splice(index, 1);
  }

  // the leftover points are the waypoints
  return pathVertices;

};

// generates a list of tiles that should have blockers placed on them
// then changes the tile types to blocker
Maze.prototype.generateBlockers = function() {
  // the closer a tile is to a seed, the higher the probability of placing a blocker on it
  const seedPoints = this.generateSeedPoints(this.params.numBlockerSeeds);
  let seedDecayFactor;
  const blockerPoints = [];

  seedPoints.forEach( (seedPoint) => {
    seedDecayFactor = this.generateRandomIntBetween(2, 10) / 10;
    this.unusedPoints.forEach( (unusedPoint) => {
      const distance = seedPoint.calculateDistance(unusedPoint);
      const threshold = Math.exp( -seedDecayFactor * distance );
      if ( this.random() < threshold ) {
        blockerPoints.push(unusedPoint);
        this.unusedPoints.removePoint(unusedPoint);
      }
    })
  });

  seedPoints.forEach( (point) => blockerPoints.push(point) );
  blockerPoints.forEach( (blockerPoint) => this.mazeTiles[blockerPoint.y][blockerPoint.x].toggleType() );
};

// gets some random points to place as seeds
Maze.prototype.generateSeedPoints = function(numSeeds) {
  const seedPoints = [];
  while( seedPoints.length < numSeeds ) {
    seedPoints.push(this.generateNewPoint())
  }
  return seedPoints;
};

// invokes pathfinder to find all paths between waypoints
Maze.prototype.findPath = function() {
  const path = [];

  for (let i = 0; i < this.wayPoints.length - 1; i++) {
    const segment = Pathfinder(this, this.wayPoints[i], this.wayPoints[i + 1]);
    path.push(segment);
  }

  return path;
};

// change a maze tile to blocker type
Maze.prototype.setBlocker = function(point) {
  this.mazeTiles[point.y][point.x].type = Tile.Type.Blocker;
};

// calculates all points that changed and the operation to change them
Maze.prototype.getUserChanges = function(userMaze) {
  const diffPoints = [];
  const changedMaze = userMaze.mazeTiles;

  changedMaze.forEach( (column, columnIndex) => {
    column.forEach( (row, rowIndex) => {
      const operationType = changedMaze[rowIndex][columnIndex].type - this.mazeTiles[rowIndex][columnIndex].type;
      if ( operationType !== 0 ) {
        const newPoint = new Tile(column, row);
        newPoint.operationType = operationType;
        diffPoints.push(newPoint);
      }
    })
  });

  return diffPoints;
};

// generates a random int inclusive of min and max
Maze.prototype.generateRandomIntBetween = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(this.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
};

// generates the maze parameters that define how the maze will look
Maze.prototype.generateMazeParams = function() {

  const mazeColors = this.generateColors();

  const numColumns = Math.floor(this.generateRandomIntBetween(15, 40));
  const numRows = Math.floor(this.generateRandomIntBetween(15, 40));

  const size = numColumns * numRows;

  const numBlockerSeeds = this.generateRandomIntBetween(15, Math.floor(size / 50) );

  const numScoringZones = this.generateRandomIntBetween(1, Math.floor(size / 300));

  let numWayPoints = 1;
  const numPathVertexes = Math.floor( this.generateRandomIntBetween(6, 10) / 10 * Math.sqrt(size) );
  for (let i = 0; i < numPathVertexes / 5; i++) {
    if (this.random() > 0.6) {
      numWayPoints++;
    }
  }

  const maxActionPoints = Math.floor(10 + this.generateRandomIntBetween(5, 15) / 10 * Math.sqrt(size));

  const naturalBlockerRemovalCost = Math.floor(this.generateRandomIntBetween(2, 5));

  return {
    numColumns,
    numRows,
    mazeColors,
    numBlockerSeeds,
    numWayPoints,
    maxActionPoints,
    naturalBlockerRemovalCost,
    numPathVertexes,
    numScoringZones
  }

};

Maze.prototype.generateColors = function() {
  const colorScheme = new ColorScheme;
  const hue = this.generateRandomIntBetween(0, 359000) / 1000;

  const mazeColors = colorScheme.from_hue(hue)
      .scheme('contrast')
      .variation('pale')
      .colors()
      .map( (color) => '#' + color);

  const generatedPathColors = colorScheme.from_hue(hue)
      .scheme('contrast')
      .variation('hard')
      .colors()
      .splice(4)
      .map( (color) => '#' + color);

  const basePathColor = generatedPathColors[0];

  function shadeColor2(color, percent) {
    const f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
  }

  const pathColors = [];

  for (let i = -.4; i <= .8; i+=.2) {
    pathColors.push(shadeColor2(basePathColor, i))
  }

  return {
    'name': 'randomlyGeneratedTileset',
    "colors": {
      'groundNatural': mazeColors[2],
      'groundUser': mazeColors[0],
      'blockerNatural': mazeColors[3],
      'blockerUser': mazeColors[1],
    },
    "pathColors": pathColors
  };
};

Maze.prototype.generateUnusedPointsArray = function() {
  // this creates a 1-D list of all points on our maze
  let unusedPointsArray = [];

  this.mazeTiles.forEach( (column) => {
    column.forEach( (tile) => {
      unusedPointsArray.push(tile);
    })
  });

  return unusedPointsArray;
};

// Flips the tile type. Returns true for success, false for failure.
// only use for user actions because it changes the userPlaced flag
Maze.prototype.doActionOnTile = function(point) {
  if (!this.isModifiable(point)) {
    return false;
  }

  const tile = this.mazeTiles[point.y][point.x];

  // before we do anything, check if the user has enough action points
  // to do the desired action
  const operationCost = this.operationCostForActionOnTile(tile);
  if (this.actionsUsed + operationCost > this.params.maxActionPoints) {
    return false;
  }

  // Modify the tile
  tile.userPlaced = !tile.userPlaced;
  tile.type = (tile.type === Tile.Type.Empty ? Tile.Type.Blocker : Tile.Type.Empty);
  this.actionsUsed += operationCost;

  return true;
};

// calculates the operation cost to do an action on a tile
Maze.prototype.operationCostForActionOnTile = function(tile) {
  let operationCost = 0;
  if (tile.userPlaced) {
    if (tile.type === Tile.Type.Blocker) {
      operationCost = -1
    } else {
      operationCost = - this.params.naturalBlockerRemovalCost;
    }
  }
  else {
    if (tile.type === Tile.Type.Blocker) {
      operationCost =  this.params.naturalBlockerRemovalCost;
    } else {
      operationCost = 1
    }
  }

  return operationCost
};

// returns an array with the point removed from it
Maze.prototype.removePointInArray = function(array, pointToRemove) {
  return array.filter( (pointInArray) => !pointInArray.matches(pointToRemove) );
};

// creates an 0'ed array of the desired length
Maze.prototype.createArrayofLength = function(desiredLength) {
  let newArray = [];
  newArray.length = desiredLength;
  return newArray.fill(0);
};

Maze.prototype.getScoreMod = function(point) {
  return this.mazeTiles[point.y][point.x].scoreMod;
};

Maze.prototype.generateScoreZones = function() {
  const scoreSeeds = this.generateSeedPoints(this.params.numScoringZones);

  scoreSeeds.forEach( ( seedPoint ) => {
    let scoreSize = this.generateRandomIntBetween(2, 6);
    this.expandScoreZone(scoreSize, 7 - scoreSize, seedPoint);
    this.setScoreZoneCenter(seedPoint);
  });

  return this;
};

Maze.prototype.expandScoreZone = function(zoneSize, zoneModifier, seedPoint) {
  for (let rowOffset = -zoneSize; rowOffset <= zoneSize; rowOffset++ ) {
    let absoluteColumn = ( zoneSize - Math.abs(rowOffset) );
    for (let columnOffset = -absoluteColumn; columnOffset <= absoluteColumn; columnOffset++) {
      const newPoint = new Tile(seedPoint.x + rowOffset, seedPoint.y + columnOffset);
      if (this.contains(newPoint)) {
        this.incrementScoreZone(newPoint, zoneModifier);
      }
    }
  }
};

Maze.prototype.isScoreZoneCenter = function (point) {
  return this.mazeTiles[point.y][point.x].scoreZoneCenter;
};

Maze.prototype.incrementScoreZone = function(point, amount) {
  this.mazeTiles[point.y][point.x].scoreMod += amount;
};

Maze.prototype.setScoreZoneCenter = function(point) {
  this.mazeTiles[point.y][point.x].scoreZoneCenter = true;
};

Maze.prototype.getAdjacent = function(startPoint, endPoint) {
  const self = this;
  const pointArray = [];
  let newPoint;

  const addPoint = function ( newPoint, isDiagonal ) {
    if (self.isPassable(newPoint)) {
      newPoint.setParent(self);
      newPoint.setG(isDiagonal ? 14 : 10);
      newPoint.setH(endPoint);
      newPoint.setF();
      pointArray.push(newPoint)
    }
  };

  newPoint = new Tile( startPoint.x, startPoint.y + 1 );
  addPoint(newPoint, false);
  newPoint = new Tile( startPoint.x + 1, startPoint.y + 1 );
  addPoint(newPoint, true);
  newPoint = new Tile( startPoint.x + 1, startPoint.y );
  addPoint(newPoint, false);
  newPoint = new Tile( startPoint.x + 1, startPoint.y - 1 );
  addPoint(newPoint, true);
  newPoint = new Tile( startPoint.x, startPoint.y - 1 );
  addPoint(newPoint, false);
  newPoint = new Tile( startPoint.x - 1, startPoint.y - 1 );
  addPoint(newPoint, true);
  newPoint = new Tile( startPoint.x - 1, startPoint.y );
  addPoint(newPoint, false);
  newPoint = new Tile( startPoint.x - 1, startPoint.y + 1 );
  addPoint(newPoint, true);

  return pointArray;
};

// extra array functions to test arrays with points

Array.prototype.pointIsAtLeastThisFar = function(point, distance) {
  // every only returns true only if every element in the tested array pasts to callback function test
  return this.every( (pointInArray) => pointInArray.calculateDistance(point) > distance );
};

Array.prototype.containsPoint = function(pointToCheck) {
  return ( this.indexOfPoint(pointToCheck) >= 0 );
};

Array.prototype.indexOfPoint = function(pointToFind) {
  // findIndex method returns index of the first element in the array that satisfies the the callback
  // otherwise returns -1
  return this.findIndex( (pointInArray) => pointInArray.matches(pointToFind) );
};

Array.prototype.removePoint = function(pointToRemove) {
  // returns a new array with elements that match the callback
  this.filter( (pointInArray) => !pointInArray.matches(pointToRemove) );
};
