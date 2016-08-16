import State = Phaser.State;
import Sprite = Phaser.Sprite;


export default class PreloadState extends State {

  preload() {
    const world = this.game.world;
    const preloadBar: Sprite = this.add.sprite(world.centerX, world.centerY, 'bar');
    preloadBar.anchor.set(0.5);
    preloadBar.scale.setTo(3);
    this.load.setPreloadSprite(preloadBar);

    //load game assets    
    this.load.image('box', 'assets/images/box.png');
    this.load.image('pig', 'assets/images/pig.png');
    this.load.image('pole', 'assets/images/pole.png');
    this.load.image('chicken', 'assets/images/bird.png');
    this.load.image('floor', 'assets/images/floor.png');
    this.load.image('concreteBox', 'assets/images/concrete-box.png');
    this.load.image('sky', 'assets/images/sky.png');

    //load levels
    this.load.text('level1', 'assets/levels/level1.json');
  }

  create() {
    this.game.state.start('Game');
  }

}
