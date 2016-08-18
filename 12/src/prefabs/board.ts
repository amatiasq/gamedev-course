import GameState from "../states/game-state";


const RESERVE_ROWS = 5;


export default class Board {
  private grid: number[][];
  private reserveGrid: number[][];


  constructor(
    private state: GameState,
    private rows: number,
    private cols: number,
    private variations: any
  )
  {
    this.grid = [];
    this.reserveGrid = [];

    iterate(rows, cols, (i: number, j: number, first: boolean) => {
      if (first) this.grid.push([]);
      this.grid[i].push(0);
    });

    iterate(RESERVE_ROWS, cols, (i: number, j: number, first: boolean) => {
      if (first) this.reserveGrid.push([]);
      this.reserveGrid[i].push(0);
    });
  }

  populateGrid() {
    iterate(this.rows, this.cols, (i: number, j: number) => {
      this.grid[ i ][ j ] = Math.floor(Math.random() * this.variations) + 1;
    });
  }

  populateReserve() {
    iterate(RESERVE_ROWS, this.cols, (i: number, j: number) => {
      this.reserveGrid[ i ][ j ] = Math.floor(Math.random() * this.variations) + 1;
    });
  }

  log() {
    let result = '';

    iterate(RESERVE_ROWS, this.cols, (i: number, j: number, first: boolean) => {
      if (first) result += '\n';
      result += this.reserveGrid[i][j] + ' ';
    });

    result += '\n'
    for (let i = 0; i < this.cols; i++)
      result += '--';
    result = result.slice(0, -1);

    iterate(this.rows, this.cols, (i: number, j: number, first: boolean) => {
      if (first) result += '\n';
      result += this.grid[i][j] + ' ';
    });

    return result + '\n';
  }
}


function iterate(x: number, y: number, iterator: (i: number, j: number, first: boolean) => void) {
  for (let i = 0; i < x; i++)
    for (let j = 0; j < y; j++)
      iterator(i, j, j === 0);
}