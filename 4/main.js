var GameState = {

  init: function() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.world.setBounds(0, 0, 360, 700);

    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.physics.arcade.gravity.y = 1000;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.RUNNING_SPEED = 180;
    this.JUMPING_SPEED = 550;
  },

  preload: function() {
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('platform', 'assets/images/platform.png');
    this.load.image('goal', 'assets/images/gorilla3.png');
    this.load.image('arrowButton', 'assets/images/arrowButton.png');
    this.load.image('actionButton', 'assets/images/actionButton.png');
    this.load.image('barrel', 'assets/images/barrel.png');

    this.load.spritesheet('player', 'assets/images/player_spritesheet.png', 28, 30, 5, 1, 1);
    this.load.spritesheet('fire', 'assets/images/fire_spritesheet.png', 20, 21, 2, 1, 1);

    this.load.text('level', 'level.json');
  },

  create: function() {
    this.ground = this.add.sprite(0, 638, 'ground');
    this.physics.arcade.enable(this.ground);
    this.ground.body.allowGravity = false;
    this.ground.body.immovable = true;

    var level = this.level = JSON.parse(this.cache.getText('level'));

    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    level.platforms.forEach(function(platform) {
      this.platforms.create(platform.x, platform.y, 'platform');
    }, this);
    this.platforms.setAll('body.allowGravity', false);
    this.platforms.setAll('body.immovable', true);

    this.fires = this.add.group();
    this.fires.enableBody = true;
    level.fireData.forEach(function(data) {
      var fire = this.fires.create(data.x, data.y, 'fire');
      fire.animations.add('fire', [0,1], 4, true);
      fire.play('fire');
    }, this);
    this.fires.setAll('body.allowGravity', false);

    this.goal = this.add.sprite(level.goal.x, level.goal.y, 'goal');
    this.physics.arcade.enable(this.goal);
    this.goal.body.allowGravity = false;

    this.player = this.add.sprite(level.playerStart.x, level.playerStart.y, 'player', 3);
    this.player.anchor.setTo(0.5);
    this.player.animations.add('walking', [0,1,2,1], 6, true);
    this.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;
    this.player.props = {};

    this.camera.follow(this.player);
    this.createOnScreenControls();

    this.barrels = this.add.group();
    this.barrels.enableBody = true;

    this.time.events.loop(Phaser.Timer.SECOND * level.barrelFrequency, this.addBarrel, this);
    this.addBarrel();
  },

  addBarrel: function() {
    var barrel = this.barrels.getFirstExists(false) || this.barrels.create(0, 0, 'barrel');
    barrel.reset(this.level.goal.x, this.level.goal.y);
    barrel.body.velocity.x = this.level.barrelSpeed;
    barrel.body.collideWorldBounds = true;
    barrel.body.bounce.set(1, 0.5);
  },

  update: function() {
    this.physics.arcade.collide(this.player, this.ground, this.landed);
    this.physics.arcade.collide(this.player, this.platforms);
    this.physics.arcade.collide(this.barrels, this.ground);
    this.physics.arcade.collide(this.barrels, this.platforms);

    this.physics.arcade.overlap(this.player, this.fires, this.killPlayer);
    this.physics.arcade.overlap(this.player, this.barrels, this.killPlayer);
    this.physics.arcade.overlap(this.player, this.goal, this.win);

    this.player.body.velocity.x = 0;

    if (this.cursors.left.isDown || this.player.props.moveLeft) {
      this.player.scale.x = 1;
      this.player.body.velocity.x -= this.RUNNING_SPEED;
      this.player.play('walking');
    } else if (this.cursors.right.isDown || this.player.props.moveRight) {
      this.player.scale.x = -1;
      this.player.body.velocity.x += this.RUNNING_SPEED;
      this.player.play('walking');
    } else {
      this.player.animations.stop();
      this.player.frame = 3;
    }

    if ((this.cursors.up.isDown || this.player.props.mustJump) && this.player.body.touching.down) {
      this.player.body.velocity.y = -this.JUMPING_SPEED;
      this.player.props.mustJump = false;
    }

    this.barrels.forEach(function(barrel) {
      if (barrel.x < 10 && barrel.y > 600)
        barrel.kill();
    }, this);
  },

  killPlayer: function(player, fire) {
    console.log('Auch!');
    game.state.start('GameState');
  },

  win: function(player, goal) {
    console.log('YAY!');
    game.state.start('GameState');
  },

  createOnScreenControls: function() {
    this.leftArrow = this.add.button(20, 535, 'arrowButton');
    this.rightArrow = this.add.button(110, 535, 'arrowButton');
    this.actionButton = this.add.button(280, 535, 'actionButton');
    this.leftArrow.alpha = 0.5;
    this.rightArrow.alpha = 0.5;
    this.actionButton.alpha = 0.5;
    this.leftArrow.fixedToCamera = true;
    this.rightArrow.fixedToCamera = true;
    this.actionButton.fixedToCamera = true;

    this.actionButton.events.onInputDown.add(function() {
      this.player.props.mustJump = true;
    }, this);
    this.actionButton.events.onInputUp.add(function() {
      this.player.props.mustJump = false;
    }, this);
    this.actionButton.events.onInputOver.add(function() {
      this.player.props.mustJump = true;
    }, this);
    this.actionButton.events.onInputOut.add(function() {
      this.player.props.mustJump = false;
    }, this);

    this.leftArrow.events.onInputDown.add(function() {
      this.player.props.moveLeft = true;
    }, this);
    this.leftArrow.events.onInputUp.add(function() {
      this.player.props.moveLeft = false;
    }, this);
    this.leftArrow.events.onInputOver.add(function() {
      this.player.props.moveLeft = true;
    }, this);
    this.leftArrow.events.onInputOut.add(function() {
      this.player.props.moveLeft = false;
    }, this);

    this.rightArrow.events.onInputDown.add(function() {
      this.player.props.moveRight = true;
    }, this);
    this.rightArrow.events.onInputUp.add(function() {
      this.player.props.moveRight = false;
    }, this);
    this.rightArrow.events.onInputOver.add(function() {
      this.player.props.moveRight = true;
    }, this);
    this.rightArrow.events.onInputOut.add(function() {
      this.player.props.moveRight = false;
    }, this);
  },

  landed: function(player, ground) {

  },
};


var game = new Phaser.Game(360, 640, Phaser.AUTO);
game.state.add('GameState', GameState);
game.state.start('GameState');
