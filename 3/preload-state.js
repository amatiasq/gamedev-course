var PreloadState = {
  preload: function() {
    this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.logo.anchor.setTo(0.5);

    this.bar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadBar');
    this.bar.anchor.setTo(0.5);
    this.load.setPreloadSprite(this.bar);

    this.load.image('backyard', 'assets/images/backyard.png');
    this.load.image('apple', 'assets/images/apple.png');
    this.load.image('candy', 'assets/images/candy.png');
    this.load.image('rotate', 'assets/images/rotate.png');
    this.load.image('rotate', 'assets/images/rotate.png');
    this.load.image('toy', 'assets/images/rubber_duck.png');
    this.load.image('arrow', 'assets/images/arrow.png');
    this.load.spritesheet('pet', 'assets/images/pet.png', 97, 83, 5, 1, 1);
  },

  create: function() {
    this.state.start('HomeState');
  },
};
