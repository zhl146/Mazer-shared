export default function Tile(type) {
    this.type = type;
    this.userPlaced = false;
    this.scoreMod = 1;
    this.scoreZoneCenter = false;
};

Tile.Type = {
    Empty: 0,
    Blocker: 1,
};

Tile.prototype.isEmpty = function() {
    return this.type === Tile.Type.Empty;
};
