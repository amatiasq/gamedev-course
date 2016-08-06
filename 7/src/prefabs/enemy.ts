import {
  Game,
  Sprite,
  Tilemap,
  Math as PhaserMath,
} from 'phaser';


export default class Enemy extends Sprite {

  constructor(
    game: Game,
    private map: Tilemap,
    x: number,
    y: number,
    key: string,
    velocity: number = randomVelocity()
  ) {
    super(game, x, y, key);
    this.anchor.set(0.5);
    this.game.physics.arcade.enableBody(this);
    this.body.collideWorldBounds = true;
    this.body.bounce.set(1, 0);
    this.body.velocity.x = velocity;
  }

  update() {
    super.update();
    const direction = this.body.velocity.x > 0 ? 1 : -1;
    this.scale.setTo(-direction, 1);

    const tile = this.map.getTileWorldXY(
      this.left + direction,
      this.bottom + 1,
      this.map.tileWidth,
      this.map.tileHeight,
      'collisionLayer'
    );

    if (!tile && this.body.blocked.down)
      this.body.velocity.x *= -1;
  }
}


function randomVelocity() {
  const magnitude = PhaserMath.between(40, 60);
  const direction = Math.random() < 0.5 ? -1 : 1;
  return magnitude * direction;
}