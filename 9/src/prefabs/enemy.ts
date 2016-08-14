import Sprite = Phaser.Sprite;
import GameState from "../states/game-state";


export default class Enemy extends Sprite {
  private healthBar: Sprite;

  constructor(
    private state: GameState,
    x: number,
    y: number,
    asset: string,
    public params: EnemyData
  ) {
    super(state.game, x, y, asset);
    this.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this);

    this.healthBar = new Sprite(this.game, this.x, this.y, 'bar');
    this.healthBar.anchor.setTo(0.5);
    this.game.add.existing(this.healthBar);
  }



  update() {
    super.update();
    this.body.velocity.setTo(0);
    this.refreshHealthBar();
  }

  kill(): Sprite {
    this.healthBar.kill();
    return super.kill();
  }

  private refreshHealthBar() {
    this.healthBar.x = this.x;
    this.healthBar.y = this.y - 25;
    this.healthBar.scale.setTo(this.params.health, 0.5);
  }
}


interface EnemyData {
  attack: number,
  health: number,
  defense: number,
}