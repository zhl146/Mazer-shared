export default class MazeTile{
  constructor(x,
              y,
              type = MazeTile.Type.Empty,
              waypointIndex = null,
              userPlaced = false,
              scoreMod = 1,
              scoreZoneCenter = false){
    // coordinates
    this.x = x;
    this.y = y;

    this.type = type;
    this.waypointIndex = waypointIndex;
    // stuff for presentation
    this.userPlaced = userPlaced;

    // stuff for scoring
    this.scoreMod = scoreMod;
    this.scoreZoneCenter = scoreZoneCenter;
  }

  calculateDistance( point ) {
    const xDiff = this.x - point.x;
    const yDiff = this.y - point.y;
    return Math.sqrt(xDiff*xDiff + yDiff*yDiff);
  }

  copy() {
    return new MazeTile(
        this.x,
        this.y,
        this.type,
        this.waypointIndex,
        this.userPlaced,
        this.scoreMod,
        this.scoreZoneCenter
    );
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
  WayPoint: 4
};