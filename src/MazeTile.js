export default class MazeTile{
  constructor(x, y, type){
    // coordinates
    this.x = x;
    this.y = y;

    this.type = type || MazeTile.Type.Empty;
    this.waypointIndex = null;
    // stuff for presentation
    this.userPlaced = false;

    // stuff for scoring
    this.scoreMod = 1;
    this.scoreZoneCenter = false;
  }


  calculateDistance( point ) {
    const xDiff = this.x - point.x;
    const yDiff = this.y - point.y;
    return Math.sqrt(xDiff*xDiff + yDiff*yDiff);
  }

  copy() {
    return new MazeTile(this.x, this.y);
  }

  matches(pointToCompare) {
    return ( this.x === pointToCompare.x && this.y === pointToCompare.y );
  }

  toggleType() {
    this.type = (this.type === MazeTile.Type.Empty? MazeTile.Type.Blocker: MazeTile.Type.Empty);
  }

}

MazeTile.Type = {
  Empty: 0,
  Blocker: 1,
  Start: 2,
  End: 3,
  WayPoint: 4,
  Path: 5
};