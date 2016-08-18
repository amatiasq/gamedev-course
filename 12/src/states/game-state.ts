import State = Phaser.State;
import CursorKeys = Phaser.CursorKeys;
import Board from "../prefabs/board";


const NUM_ROWS = 8;
const NUM_COLS = 8;
const NUM_VARIATIONS = 7;
const BLOCK_SIZE = 35;
const ANIMATION_TIME = 200;


export default class GameState extends State {
  private cursors: CursorKeys;
  private board: Board;

  create() {
    this.add.sprite(0, 0, 'background');
    this.board = new Board(this, NUM_ROWS, NUM_COLS, NUM_VARIATIONS);
    (<any>window).board = this.board;
    this.board.populateGrid();
    this.board.populateReserve();
  }

  update() {
    // TODO
  }

}
