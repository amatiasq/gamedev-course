import { Sprite, Timer, Math } from 'phaser';
import GameState from '../states/game-state';


export default class Sun extends Sprite {
  private expirationTimer: Timer;
  params: SunData;

  constructor(private state: GameState) {
    super(state.game, 0, 0, 'sun');
    this.state = state;
    this.game.physics.arcade.enable(this);
    this.expirationTimer = this.game.time.create(false);
    this.anchor.setTo(0.5);

    this.events.onInputDown.add(this.pickUp, this);

    this.animations.add('shine', [ 0, 1 ], 10, true);
    this.play('shine');
  }

  init(x: number, y: number, data: SunData) {
    this.params = data;
    this.reset(x, y);
    this.body.velocity.y = data.velocity || 0;
    this.inputEnabled = Boolean(data.value);

    if (this.inputEnabled) {
      this.input.pixelPerfectClick = true;
    }

    if (!data.eternal) {
      this.expirationTimer.start();
      this.expirationTimer.add(Math.between(2, 6) * Timer.SECOND, this.kill, this);
    }
  }

  pickUp() {
    this.state.increaseSun(this.params.value);
    this.kill();
  }

  kill(): Sun {
    super.kill();
    this.expirationTimer.stop();
    return this;
  }
}


export interface SunData {
  velocity: number;
  value: number;
  eternal?: boolean;
}