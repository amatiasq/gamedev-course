import Sprite = Phaser.Sprite;
import GameState from "../states/game-state";


export default class Item extends Sprite {
  constructor(
    private state: GameState,
    x: number,
    y: number,
    key: string,
    public params: ItemData
  ) {
    super(state.game, x, y, key);
    this.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this);

    this.params.health = parseInt(String(this.params.health));
    this.params.attack = parseInt(String(this.params.attack));
    this.params.defense = parseInt(String(this.params.defense));
    this.params.gold = parseInt(String(this.params.gold));
  }
}


interface ItemData {
  isQuest: boolean,
  questCode?: String;
  health?: number,
  attack?: number,
  defense?: number,
  gold?: number,
}