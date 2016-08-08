import Sprite = Phaser.Sprite;
import GameState from "../states/game-state";


export default class Player extends Sprite {
  buttons: {
    up?: boolean;
    down?: boolean;
    left?: boolean;
    right?: boolean;
    [key: string] : boolean;
  };

  constructor(
    private state: GameState,
    x: number,
    y: number,
    private params: PlayerData
  ) {
    super(state.game, x, y, 'player');
    this.anchor.setTo(0.5);
    this.animations.add('walk', [ 0, 1, 0 ], 6, false);
    this.game.physics.arcade.enable(this);
  }
}


export interface PlayerData {
  items: any[],
  health: number,
  attack: number,
  defence: number,
  gold: number,
}