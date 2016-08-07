import { Sprite } from 'phaser';
import GameState from '../states/game-state';


export default class Bullet extends Sprite {
  params: BulletData;

  constructor(private state: GameState) {
    super(state.game, 0, 0, 'bullet');
    this.state = state;
    this.game.physics.arcade.enable(this);
  }

  init(x: number, y: number, data: BulletData) {
    this.params = data;
    this.reset(x, y);
    this.body.velocity.x = data.velocity || 100;
  }

}


export interface BulletData {
  velocity: number;
  attack: number;
}

