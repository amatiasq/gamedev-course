import GameState from "../states/game-state";


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

    iterate(rows, cols, (i: number, j: number, first: boolean) => {
      if (first) this.reserveGrid.push([]);
      this.reserveGrid[i].push(0);
    });
  }

  getAt(row: number, col: number): number {
    return this.grid[row][col];
  }

  getReserve(row: number, col: number): number {
    return this.reserveGrid[row][col];
  }

  forEach(iterator: (value: number, x: number, y: number) => void) {
    iterate(this.rows, this.cols, (x: number, y: number) => {
      iterator(this.grid[ x ][ y ], x, y);
    });
  }

  populateGrid() {
    iterate(this.rows, this.cols, (i: number, j: number) => {
      this.grid[ i ][ j ] = Math.floor(Math.random() * this.variations) + 1;
    });

    if (this.findAllChains().length)
      this.populateGrid();
  }

  populateReserve() {
    iterate(this.rows, this.cols, (i: number, j: number) => {
      this.reserveGrid[ i ][ j ] = Math.floor(Math.random() * this.variations) + 1;
    });
  }

  checkAdjacent(source: Position, target: Position): boolean {
    var diffX = Math.abs(source.column - target.column);
    var diffY = Math.abs(source.row - target.row);
    return (diffX === 1 && diffY === 0) || (diffX === 0 && diffY === 1);
  }

  swap(source: Position, target: Position) {
    const tmp = this.get(target.row, target.column);
    this.grid[target.row][target.column] = this.get(source.row, source.column);
    this.grid[source.row][source.column] = tmp;

    const { row, column } = source;
    source.row = target.row;
    source.column = target.column;
    target.row = row;
    target.column = column;
  }

  get(row: number, column: number): number {
    if (typeof row !== 'number') {
      column = (<Position><any>row).column;
      row = (<Position><any>row).row;
    }

    const list = this.grid[row];
    return list && list[column] || null;
  }

  isChained({ row, column: col }: Position): boolean {
    let isChained = false;
    const variation = this.grid[row][col];

    // left
    if (this.get(row, col - 1) === variation && this.get(row, col - 2) === variation)
      isChained = true;

    // right
    if (this.get(row, col + 1) === variation && this.get(row, col + 2) === variation)
      isChained = true;

    // up
    if (this.get(row - 1, col) === variation && this.get(row - 2, col) === variation)
      isChained = true;

    // down
    if (this.get(row + 1, col) === variation && this.get(row + 2, col) === variation)
      isChained = true;

    // center - horizontal
    if (this.get(row, col - 1) === variation && this.get(row, col + 1) === variation)
      isChained = true;

    // center - vertical
    if (this.get(row - 1, col) === variation && this.get(row + 1, col) === variation)
      isChained = true;

    return isChained;
  }

  findAllChains(): Position[] {
    const chained = <Position[]>[];

    iterate(this.rows, this.cols, (i: number, j: number) => {
      if (this.isChained({ row: i, column: j }))
        chained.push({ row: i, column: j })
    });

    return chained;
  }

  clearChains() {
    this.findAllChains().forEach(({ row, column }: Position) => {
      this.grid[row][column] = 0;
      this.state.getBlockAt(row, column).kill();
    });
  }

  dropBlock(sourceRow: number, targetRow: number, col: number) {
    this.grid[targetRow][col] = this.grid[sourceRow][col];
    this.grid[sourceRow][col] = 0;
    this.state.dropBlock(sourceRow, targetRow, col);
  }

  dropReserveBlock(sourceRow: number, targetRow: number, col: number) {
    this.grid[targetRow][col] = this.reserveGrid[sourceRow][col];
    this.reserveGrid[sourceRow][col] = 0;
    this.state.dropReserveBlock(sourceRow, targetRow, col);
  }

  updateGrid() {
    for (let i = this.rows - 1; i >= 0; i--) {
      for (let j = 0; j < this.cols; j++) {
        if (this.grid[i][j] !== 0) continue;
        let foundBlock = false;

        for (let k = i - 1; k >= 0; k--) {
          if (this.grid[k][j] > 0) {
            this.dropBlock(k, i, j);
            foundBlock = true;
            break;
          }
        }

        if (foundBlock) continue;

        for (let k = this.rows - 1; k >= 0; k--) {
          if (this.reserveGrid[ k ][ j ]) {
            this.dropReserveBlock(k, i, j);
            break;
          }
        }
      }
    }

    this.populateReserve();
  }

  log() {
    let result = '';

    iterate(this.rows, this.cols, (i: number, j: number, first: boolean) => {
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

interface Position {
  row: number,
  column: number,
}