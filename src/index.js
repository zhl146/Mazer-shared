import Maze from './Maze';
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
};