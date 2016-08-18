import State = Phaser.State;
import Sprite = Phaser.Sprite;


export default class PreloadState extends State {

  preload() {
    const world = this.game.world;
    const preloadBar: Sprite = this.add.sprite(world.centerX, world.centerY, 'bar');
    preloadBar.anchor.set(0.5);
    preloadBar.scale.setTo(3);
    this.load.setPreloadSprite(preloadBar);

    this.load.image('block1', 'assets/images/bean_blue.png');
    this.load.image('block2', 'assets/images/bean_green.png');
    this.load.image('block3', 'assets/images/bean_orange.png');
    this.load.image('block4', 'assets/images/bean_pink.png');
    this.load.image('block5', 'assets/images/bean_purple.png');
    this.load.image('block6', 'assets/images/bean_yellow.png');
    this.load.image('block7', 'assets/images/bean_red.png');
    this.load.image('block8', 'assets/images/bean_white.png');
    this.load.image('deadBlock', 'assets/images/bean_dead.png');
    this.load.image('background', 'assets/images/backyard2.png');
  }

  create() {
    this.game.state.start('Game');
  }

}
