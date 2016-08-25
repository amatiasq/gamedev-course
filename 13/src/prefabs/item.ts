import Sprite = Phaser.Sprite;
import GameState from "../states/game-state";
import { IThingData } from "./thing";


export default class Item extends Sprite {
  constructor(
    private state: GameState,
    x: number,
    y: number,
    public data: IThingData
  ) {
    super(state.game, x, y, data.asset);
    this.anchor.setTo(0.5);
    this.inputEnabled = true;
    this.input.pixelPerfectClick = true;
    this.events.onInputDown.add(this.state.selectItem, this.state);
  }
}
