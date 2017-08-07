import Maze from 'Maze';
import Pathfinder from 'Pathfinder';
import Score from 'Score';
import Tile from 'Tile';

// exposes the useful parts of the library

module.exports = {
  Maze: function(seed) {
    return new Maze(seed);
  },
  Tile: function(type) {
    return new Tile(type);
  },
  Score: function(baseMaze) {
    return new Score(baseMaze);
  },
  Pathfinder: Pathfinder,
};