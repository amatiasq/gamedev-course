import Sprite = Phaser.Sprite;
import GameState from "../states/game-state";


const ANIMATION_TIME = 200;


export default class Block extends Sprite {
  data: IBlockData;
  row: number;
  column: number;

  constructor(
    private state: GameState,
    x: number,
    y: number
  ) {
    super(state.game, x, y);
    this.anchor.setTo(0.5);
    this.inputEnabled = true;
    this.events.onInputDown.add(state.pickBlock, state);
  }

  init(x: number, y: number, data: IBlockData) {
    this.reset(x, y);
    this.data = data;
    this.loadTexture(data.asset);
    this.row = data.row;
    this.column = data.column;
  }

  kill() {
    this.loadTexture('deadBlock');
    this.column = null;
    this.row = null;
    this.game.time.events.add(ANIMATION_TIME / 2, () => super.kill());
    return this;
  }
}


export interface IBlockData {
  asset: string,
  row: number,
  column: number,
}