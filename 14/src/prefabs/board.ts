import Group = Phaser.Group;
import GameState from "../states/game-state";
import {
  MARGIN_X,
  TILE_W,
  MARGIN_Y,
  TILE_H
} from "../constants";


export default class Board extends Group {
  private rows: number;
  private cols: number;

  constructor(private state: GameState, private grid: number[][]) {
    super(state.game);
    this.rows = grid.length;
    this.cols = grid[0].length;

    iterate(this.rows, this.cols, (row: number, col: number) => {
      const y = MARGIN_Y + row * TILE_H * 3 / 4;
      const x = row % 2 === 0 ?
        MARGIN_X + col * TILE_W :
        MARGIN_X + col * TILE_W + TILE_W / 2;

      const tile = new Phaser.Sprite(this.game, x, y, 'grass');
      this.add(tile);
    });
  }
}


function iterate(x: number, y: number, iterator: (i: number, j: number, first: boolean) => void) {
  for (let i = 0; i < x; i++)
    for (let j = 0; j < y; j++)
      iterator(i, j, j === 0);
}
