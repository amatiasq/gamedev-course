import { Sprite } from 'phaser';
import Pool from '../prefabs/pool';
import GameState from '../states/game-state';


export default class Zombie extends Sprite {
  private bullets: Pool<Sprite>;
  private suns: Pool<Sprite>;
  public params: ZombieData;

  constructor(private state: GameState) {
    super(state.game, 0, 0, 'zombie');
    this.bullets = state.bullets;
    this.suns = state.suns;

    this.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this);
  }


  init(x: number, y: number, data: ZombieData): Zombie {
    this.params = data;
    this.reset(x, y, data.health);
    this.loadTexture(data.asset);
    this.resetVelocity();

    if (data.animationFrames) {
      const animation = data.asset + 'Anim';
      this.animations.add(animation, data.animationFrames, 4, true);
      this.play(animation);
    }

    return this;
  }

  resetVelocity() {
    this.body.velocity.x = this.params.velocity;
  }

  damage(amount: number): Zombie {
    super.damage(amount);

    const emitter = this.game.add.emitter(this.x, this.y, 50);
    emitter.makeParticles('bloodParticle');
    emitter.minParticleSpeed.setTo(-100, -100);
    emitter.maxParticleSpeed.setTo(100, 100);
    emitter.gravity = 300;
    emitter.start(true, 200, null, 100);

    if (this.health <= 0) {
      const corpse = this.game.add.sprite(this.x, this.bottom, 'deadZombie');
      corpse.anchor.setTo(0.5, 1);
    }

    return this;
  }

}


export interface ZombieData {
  asset: string;
  health: number;
  attack: number,
  velocity: number,
  animationFrames: number[],
}