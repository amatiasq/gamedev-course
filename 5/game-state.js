var GameState = {

  //initiate game settings
  init: function(level) {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.physics.startSystem(Phaser.Physics.ARCADE);

    this.PLAYER_SPEED = 200;
    this.BULLET_SPEED = 1000;
    this.levelsCount = 3;
    this.levelIndex = level || 1;
    console.log('Running level', this.levelIndex);
  },

  //load the game assets before the game starts
  preload: function() {
    this.load.image('space', 'assets/images/space.png');
    this.load.image('player', 'assets/images/player.png');
    this.load.image('bullet', 'assets/images/bullet.png');
    this.load.image('enemyParticle', 'assets/images/enemyParticle.png');

    this.load.spritesheet('yellowEnemy', 'assets/images/yellow_enemy.png', 50, 46, 3, 1, 1);
    this.load.spritesheet('redEnemy', 'assets/images/red_enemy.png', 50, 46, 3, 1, 1);
    this.load.spritesheet('greenEnemy', 'assets/images/green_enemy.png', 50, 46, 3, 1, 1);

    this.load.audio('orchestra', [ 'assets/audio/8bit-orchestra.ogg', 'assets/audio/8bit-orchestra.mp3' ])

    this.load.text('level1', 'assets/data/level1.json');
    this.load.text('level2', 'assets/data/level2.json');
    this.load.text('level3', 'assets/data/level3.json');
  },
  //executed after everything is loaded
  create: function() {
    this.background = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'space');
    this.background.autoScroll(0, 30);

    this.player = this.add.sprite(this.world.centerX, this.world.height, 'player');
    this.player.anchor.setTo(0.5, 1);
    this.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;

    this.bullets = this.add.group();
    this.bullets.enableBody = true;
    this.shooting = this.time.events.loop(Phaser.Timer.SECOND / 5, this.fire, this);

    this.orchestra = this.add.audio('orchestra');
    this.orchestra.play();
    this.loadLevel();
  },

  update: function() {
    this.physics.arcade.overlap(this.bullets, this.enemies, this.damage, null, this);
    this.physics.arcade.overlap(this.enemyBullets, this.player, this.killPlayer, null, this);

    this.player.body.velocity.x = 0;

    if (this.input.activePointer.isDown) {
      var targetX = this.input.activePointer.position.x;
      this.player.body.velocity.x = targetX < this.world.centerX ?
        -this.PLAYER_SPEED : this.PLAYER_SPEED;
    }
  },

  loadLevel: function() {
    this.level = JSON.parse(this.cache.getText('level' + this.levelIndex));

    this.levelTimer = this.time.events.add(Phaser.Timer.SECOND * this.level.duration, function() {
      console.log('Level complete');
      this.orchestra.stop();
      this.state.start('GameState', true, false, this.levelIndex < this.levelsCount ? this.levelIndex + 1 : 1);
    }, this);

    this.initEnemies();
  },

  initEnemies: function() {
    this.enemyBullets = this.add.group();
    this.enemyBullets.enableBody = true;
    this.enemies = this.add.group();
    this.enemies.enableBody = true;
    this.enemyIndex = 0;
    this.scheduleNextEnemy();
  },

  scheduleNextEnemy: function() {
    var enemy = this.level.enemies[this.enemyIndex];
    if (!enemy) return;

    var time = enemy.time - (this.enemyIndex === 0 ? 0 : this.level.enemies[this.enemyIndex - 1].time);
    this.nextEnemy = this.time.events.add(Phaser.Timer.SECOND * time, function() {
      this.createEnemy(enemy.x * this.world.width, -100, enemy.health, enemy.key, enemy.scale, enemy.speedX, enemy.speedY);
      this.enemyIndex++;
      this.scheduleNextEnemy();
    }, this);
  },

  createEnemy: function(x, y, health, key, scale, speedX, speedY) {
    var enemy = this.enemies.getFirstExists(false);

    if (!enemy) {
      enemy = new Enemy(this.game, 0, 0, key, 1, this.enemyBullets);
      this.enemies.add(enemy);
    }

    enemy.reset(x, y, health, key, scale, speedX, speedY);
  },

  damage: function(bullet, enemy) {
    enemy.damage(1);
    bullet.kill();
  },

  killPlayer: function() {
    this.player.kill();
    this.orchestra.stop();
    this.state.start('GameState');
  },

  fire: function() {
    var bullet = this.bullets.getFirstExists(false);

    if (!bullet) {
      bullet = new PlayerBullet(this.game, 0, 0);
      this.bullets.add(bullet);
    }

    bullet.reset(this.player.x, this.player.top);
    bullet.body.velocity.y = -this.BULLET_SPEED;
  },
};
