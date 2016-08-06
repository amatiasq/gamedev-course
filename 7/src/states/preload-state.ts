import {
  State,
  Sprite,
  Tilemap,
} from 'phaser';


export default new class extends State {

  private preloadBar: Sprite;


  preload() {
    this.preloadBar = this.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      'preloadBar'
    );

    this.preloadBar.anchor.set(0.5);
    this.preloadBar.scale.setTo(3);
    this.load.setPreloadSprite(this.preloadBar);

    this.load.image('platform', 'assets/images/platform.png');
    this.load.image('goal', 'assets/images/goal.png');
    this.load.image('slime', 'assets/images/slime.png');
    this.load.spritesheet('player', 'assets/images/player_spritesheet.png', 28, 30, 5, 1, 1);
    this.load.spritesheet('fly', 'assets/images/fly_spritesheet.png', 35, 18, 2, 1, 2);
    this.load.image('arrowButton', 'assets/images/arrowButton.png');
    this.load.image('actionButton', 'assets/images/actionButton.png');
    this.load.image('gameTiles', 'assets/images/tiles_spritesheet.png');
    this.load.tilemap('myLevel', 'assets/levels/my-level.json', null, Tilemap.TILED_JSON);
    this.load.tilemap('level1', 'assets/levels/level1.json', null, Tilemap.TILED_JSON);
    this.load.tilemap('level2', 'assets/levels/level2.json', null, Tilemap.TILED_JSON);
  }


  create() {
    this.game.state.start('Game');
  }

}