import { State } from 'phaser';


export default new class extends State {

  preload() {
    const preloadBar = this.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      'preloadbar'
    );

    preloadBar.anchor.setTo(0.5);
    preloadBar.scale.setTo(3);
    this.load.setPreloadSprite(preloadBar);

    this.load.image('playerDead', 'assets/images/player_dead.png');
    this.load.image('floor', 'assets/images/floor.png');
    this.load.image('water', 'assets/images/water.png');
    this.load.image('coin', 'assets/images/coin.png');
    this.load.image('background', 'assets/images/background.png');
    this.load.spritesheet('player', 'assets/images/player_spritesheet.png', 51, 67, 5, 2, 3);
    this.load.audio('coin', [
      'assets/audio/coin.mp3',
      'assets/audio/coin.ogg',
    ]);
  }

  create() {
    this.game.state.start('GameState');
  }

}
