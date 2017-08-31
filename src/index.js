import Maze from './Maze';
import Pathfinder from './Pathfinder_deprecated';
import Score from './Score';
import MazeTile from './MazeTile';

// exposes the useful parts of the library

module.exports = {
  Maze: function(seed) {
    return new Maze(seed);
  },
  MazeTile: function(type) {
    return new MazeTile(type);
  },
  MazeTileEnum: MazeTile.Type,
  Score: function(baseMaze) {
    return new Score(baseMaze);
  },
  Pathfinder: Pathfinder,
};