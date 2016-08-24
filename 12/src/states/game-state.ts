import State = Phaser.State;
import CursorKeys = Phaser.CursorKeys;
import Board from "../prefabs/board";
import { IBlockData, default as Block } from "../prefabs/block";
import Pool from "../prefabs/pool";


const NUM_ROWS = 8;
const NUM_COLS = 8;
const NUM_VARIATIONS = 5;
const BLOCK_SIZE = 35;
const ANIMATION_TIME = 200;
const BLOCK_SPACE = BLOCK_SIZE + 6;


export default class GameState extends State {
  private board: Board;
  private blocks: Pool<Block>;
  private isBlocked: boolean;
  private selectedBlock: Block;

  create() {
    this.add.sprite(0, 0, 'background');
    this.blocks = new Pool<Block>(this.game, () => {
      return new Block(this, 0, 0);
    });

    this.add.existing(this.blocks);
    this.board = new Board(this, NUM_ROWS, NUM_COLS, NUM_VARIATIONS);
    (<any>window).board = this.board;
    this.board.populateGrid();
    this.board.populateReserve();
    console.log(this.board.log());

    this.drawBoard();
  }

  update() {
    // TODO
  }

  swap(first: Block, second: Block, isReversing: boolean = false) {
    const firstMovement = this.add.tween(first);
    firstMovement.to(second.position.clone(), ANIMATION_TIME);
    firstMovement.start();

    const secondMovement = this.add.tween(second);
    secondMovement.to(first.position.clone(), ANIMATION_TIME);
    secondMovement.start();

    if (isReversing) {
      this.clearSelection();
      return;
    }

    secondMovement.onComplete.add(() => {
      this.board.swap(first, second);
      const chains = this.board.findAllChains();

      if (chains.length)
        this.updateBoard();
      else {
        console.log('nochains', chains);
        console.log(this.board.log());
        this.swap(first, second, true);
      }
    });
  }

  getBlockAt(row: number, col: number): Block {
    let foundBlock: Block = null;

    this.blocks.forEachAlive((block: Block) => {
      if (block.row === row && block.column === col)
        foundBlock = block;
    }, this);

    return foundBlock;
  }

  dropBlock(sourceRow: number, targetRow: number, col: number) {
    const block = this.getBlockAt(sourceRow, col);
    const targetY = this.getY(targetRow);
    block.row = targetRow;

    const movement = this.add.tween(block);
    movement.to({ y: targetY }, ANIMATION_TIME);
    movement.start();
  }

  dropReserveBlock(sourceRow: number, targetRow: number, col: number) {
    const sourceY = -BLOCK_SPACE * NUM_ROWS + sourceRow * BLOCK_SPACE;
    const targetY = this.getY(targetRow);
    const block = this.createBlock(
      this.getX(col), sourceY, {
        asset: 'block' + this.board.getAt(targetRow, col),
        row: targetRow,
        column: col,
      }
    );

    const movement = this.add.tween(block);
    movement.to({ y: targetY }, ANIMATION_TIME);
    movement.start();
  }

  pickBlock(block: Block) {
    if (this.isBlocked) return;

    if (this.selectedBlock) {
      if (this.board.checkAdjacent(this.selectedBlock, block)) {
        this.isBlocked = true;
        this.swap(this.selectedBlock, block);
      }
    }
    else {
      block.scale.setTo(1.5);
      this.selectedBlock = block;
    }
  }

  updateBoard() {
    this.board.clearChains();
    this.board.updateGrid();

    this.time.events.add(ANIMATION_TIME, () => {
      if (this.board.findAllChains().length)
        this.updateBoard();
      else
        this.clearSelection();
    });
  }

  clearSelection() {
    this.isBlocked = false;
    this.selectedBlock.scale.setTo(1);
    this.selectedBlock = null;
  }

  private drawBoard() {
    const bitmap = this.add.bitmapData(BLOCK_SIZE + 4, BLOCK_SIZE + 4);
    bitmap.ctx.fillStyle = '#000';
    bitmap.ctx.fillRect(0, 0, BLOCK_SIZE + 4, BLOCK_SIZE + 4);

    this.board.forEach((value: number, row: number, column: number) => {
      const x = this.getX(column);
      const y = this.getY(row);
      const square = this.add.sprite(x, y, bitmap);
      square.anchor.setTo(0.5);
      square.alpha = 0.2;
      this.createBlock(x, y, { asset: 'block' + value, row, column });
    });

    this.world.bringToTop(this.blocks);
  }

  private createBlock(x: number, y: number, data: IBlockData): Block {
    return this.blocks.get(x, y, data);
  }

  private getX(column: number): number {
    return 36 + column * BLOCK_SPACE;
  }

  private getY(row: number): number {
    return 150 + row * BLOCK_SPACE;
  }
}
