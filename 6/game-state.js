var GameState = {

  //initiate game settings
  init: function(level) {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.physics.startSystem(Phaser.Physics.ARCADE);
  },

  //load the game assets before the game starts
  preload: function() {
    this.load.image('space', 'assets/images/space.png');
    this.load.spritesheet('greenEnemy', 'assets/images/green_enemy.png', 50, 46, 3, 1, 1);
    this.load.text('level', 'assets/data/level.json');
  },
  //executed after everything is loaded
  create: function() {
  },

  update: function() {
  },
};
