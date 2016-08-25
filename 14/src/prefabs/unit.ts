import Sprite = Phaser.Sprite;
import GameState from "../states/game-state";


export default class Unit extends Sprite {
  constructor(private state: GameState, public data: IUnitData) {
    super(state.game, 0, 0, data.asset);
  }
}


export interface IUnitData {
  asset: string;
}