function Enemy(game, x, y, key, health, bullets) {
  Phaser.Sprite.call(this, game, x, y, key);
  this.game = game;
  game.physics.arcade.enable(this);
  this.animations.add('getHit', [0,1,2,1,0], 25, false);
  this.anchor.setTo(0.5);
  this.health = health;
  this.bullets = bullets;

  this.timer = game.time.create(false);
  this.timer.start();
  this.scheduleShoot();
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
  var padding = this.width / 2;

  if (this.x < padding) {
    this.x = padding + 2;
    this.body.velocity.x *= -1;
  } else if (this.x > this.game.world.width - padding) {
    this.x = this.game.world.width - padding - 2;
    this.body.velocity.x *= -1;
  }

  if (this.top > this.game.world.height)
    this.kill();
};

Enemy.prototype.reset = function(x, y, health, key, scale, speedX, speedY) {
  Phaser.Sprite.prototype.reset.call(this, x, y, health);
  this.loadTexture(key);
  this.scale.setTo(scale);
  this.body.velocity.setTo(speedX, speedY);
  this.timer.resume();
};

Enemy.prototype.damage = function(amount) {
  Phaser.Sprite.prototype.damage.call(this, amount);
  this.play('getHit');
  if (this.health > 0) return;

  var emitter = this.game.add.emitter(this.x, this.y, 100);
  emitter.makeParticles('enemyParticle');
  emitter.minParticleSpeed.setTo(-200, -200);
  emitter.maxParticleSpeed.setTo(200, 200);
  emitter.gravity = 0;
  emitter.start(true, 500, null, 100);
  this.timer.pause();
};

Enemy.prototype.scheduleShoot = function() {
  this.shoot();
  this.timer.add(Phaser.Timer.SECOND * 2, this.scheduleShoot, this);
};

Enemy.prototype.shoot = function() {
  var bullet = this.bullets.getFirstExists(false);

  if (!bullet) {
    bullet = new EnemyBullet(this.game, this.x, this.bottom);
    this.bullets.add(bullet);
  }

  bullet.reset(this.x, this.bottom);
  bullet.body.velocity.y = 100;
};
