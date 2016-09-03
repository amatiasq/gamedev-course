import Group = Phaser.Group;
import GameState from "../states/game-state";
import {
  Sprite,
  Point,
} from 'phaser';
import {
  MARGIN_X,
  TILE_W,
  MARGIN_Y,
  TILE_H
} from "../constants";


export default class Board extends Group {
  private rows: number;
  private cols: number;
  private terrains: { asset: string, blocked?: boolean}[] = [
    { asset: 'grass' },
    { asset: 'water', blocked: true },
    { asset: 'rocks' },
    { asset: 'grasstrees' },
    { asset: 'grass' },
  ];

  constructor(private state: GameState, private grid: number[][]) {
    super(state.game);
    this.rows = grid.length;
    this.cols = grid[0].length;

    iterate(this.rows, this.cols, (row: number, col: number) => {
      const pos = this.getCellCorner(row, col);
      const data = this.terrains[this.grid[row][col]];
      const tile = new Sprite(this.game, pos.x, pos.y, data.asset);
      tile.data.row = row;
      tile.data.col = col;
      tile.data.asset = data.asset;
      tile.data.blocked = data.blocked;
      tile.inputEnabled = true;
      tile.input.pixelPerfectClick = true;
      this.add(tile);
    });
  }

  getFromRowCol(row: number, col: number): Sprite {
    let tile: Sprite

    this.forEach((entry: Sprite) => {
      if (entry.data.row === row && entry.data.col === col)
        tile = entry;
    }, this);

    return tile || null;
  }

  getXYFromRowCol(row: number, col: number): Point {
    return this.getCellCorner(row, col)
      .add(TILE_W / 2, TILE_H / 2);
  }

  getCellCorner(row: number, col: number): Point {
    return new Point(
      row % 2 === 0 ?
        MARGIN_X + col * TILE_W :
        MARGIN_X + col * TILE_W + TILE_W / 2,
      MARGIN_Y + row * TILE_H * 3 / 4
    );
  }

  getAdjacent(tile: Sprite, { blocked = true } = {}) {
    const adjacent = [] as Sprite[];
    const { row, col } = tile.data;
    const neighbours = row % 2 ? [
      { r: -1, c: 0 },
      { r: -1, c: 1 },
      { r: 0, c: -1 },
      { r: 0, c: 1 },
      { r: 1, c: 0 },
      { r: 1, c: 1 },
    ] : [
      { r: -1, c: 0 },
      { r: -1, c: -1 },
      { r: 0, c: -1 },
      { r: 0, c: 1 },
      { r: 1, c: 0 },
      { r: 1, c: -1 },
    ];

    return neighbours
      .map(({ r, c }) => this.getFromRowCol(row + r, col + c))
      .filter(Boolean)
      .filter((tile: Sprite) => blocked || !tile.data.blocked);
  }
}


function iterate(x: number, y: number, iterator: (i: number, j: number, first: boolean) => void) {
  for (let i = 0; i < x; i++)
    for (let j = 0; j < y; j++)
      iterator(i, j, j === 0);
}
