import Sprite = Phaser.Sprite;
import GameState from "../states/game-state";


export default class Block extends Sprite {
  constructor(
    private state: GameState,
    x: number,
    y: number,
    public data: IBlockData
  ) {
    super(state.game, x, y, data.asset);
    this.anchor.setTo(0.5);
  }
}


interface IBlockData {
  asset: string,
}