import Sprite = Phaser.Sprite;
import GameState from "../states/game-state";


export default class Thing extends Sprite {
  constructor(private state: GameState, data: IThingData) {
    super(state.game, data.x, data.y, data.asset);
    this.anchor.setTo(0.5);
  }
}


export interface IThingData {
  asset: string,
  x: number,
  y: number,
}