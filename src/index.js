import Maze from './Maze';
import MazeTile from './MazeTile';

// exposes the useful parts of the library

export const createMaze = (seed) => new Maze(seed);
export const TileTypes = MazeTile.Type;
