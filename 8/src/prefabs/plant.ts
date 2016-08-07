import { Sprite, Timer, Math } from 'phaser';
import Pool from '../prefabs/pool';
import GameState from '../states/game-state';


export default class Plant extends Sprite {
  private bullets: Pool<Sprite>;
  private suns: Pool<Sprite>;
  private shootingTimer: Timer;
  private producingTimer: Timer;
  private shootAnimation: string;
  params: PlantData;
  private patch: any;

  constructor(private state: GameState) {
    super(state.game, 0, 0, 'plant');
    this.bullets = state.bullets;
    this.suns = state.suns;

    this.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this);
    this.body.immovable = true;

    this.shootingTimer = this.game.time.create(false);
    this.producingTimer = this.game.time.create(false);
  }

  init(x: number, y: number, data: PlantData, patch: Sprite): Plant {
    this.params = data;
    this.patch = patch;
    this.reset(x, y, data.health);
    this.loadTexture(data.asset);
    this.shootAnimation = null;

    if (data.shoot) {
      this.shootingTimer.start();
      this.scheduleShooting();

      if (data.shoot.animation) {
        this.shootAnimation = data.asset + 'Anim';
        this.animations.add(this.shootAnimation, data.shoot.animation, 6, false);
      }
    }

    if (data.sunProduction) {
      this.producingTimer.start();
      this.scheduleProduction();
    }

    return this;
  }

  kill(): Sprite {
    super.kill();
    this.shootingTimer.stop();
    this.producingTimer.stop();
    this.patch.params.isBusy = false;
    this.patch = null;
    return this;
  }

  private scheduleShooting() {
    this.shoot();
    this.shootingTimer.add(Timer.SECOND * this.params.shoot.interval, this.scheduleShooting, this);
  }

  private shoot() {
    if (!this.params.shoot) return;

    if (this.shootAnimation)
      this.play(this.shootAnimation);

    this.bullets.get(this.x, this.y - 10, {
      velocity: this.params.shoot.velocity,
      attack: this.params.shoot.damage,
    });
  }

  private scheduleProduction() {
    this.produceSun();
    this.producingTimer.add(Timer.SECOND * this.params.sunProduction.interval, this.produceSun, this);
  }

  private produceSun() {
    const diffX = Math.between(-40, 40);
    const diffY = Math.between(-40, 40);
    this.suns.get(this.x + diffX, this.y + diffY, {
      velocity: this.params.sunProduction.velocity,
      value: this.params.sunProduction.value,
    });
  }
}


export interface PlantData {
  asset: string;
  health: number;

  shoot?: {
    interval: number,
    velocity: number,
    damage: number,
    animation?: number[],
  },

  sunProduction?: {
    interval: number;
    velocity: number,
    value: number,
  }
}