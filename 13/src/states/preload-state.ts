import State = Phaser.State;
import Sprite = Phaser.Sprite;


export default class PreloadState extends State {

  preload() {
    const world = this.game.world;
    const preloadBar: Sprite = this.add.sprite(world.centerX, world.centerY, 'bar');
    preloadBar.anchor.set(0.5);
    preloadBar.scale.setTo(100, 1);
    this.load.setPreloadSprite(preloadBar);

    this.load.image('panel', 'assets/images/blue_panel.png');
    this.load.image('livingroom', 'assets/images/livingroom/livingroom.png');
    this.load.image('armless-chair', 'assets/images/livingroom/armless-chair.png');
    this.load.image('key', 'assets/images/livingroom/key.png');
    this.load.image('lamp', 'assets/images/livingroom/lamp.png');
    this.load.image('tv', 'assets/images/livingroom/tv.png');
    this.load.image('fancy-table', 'assets/images/livingroom/fancy-table.png');
    this.load.image('door', 'assets/images/livingroom/door.png');
    this.load.image('openDoor', 'assets/images/livingroom/opendoor.png');

    //bedroom
    this.load.image('bedroom', 'assets/images/bedroom/bedroom.png');
    this.load.image('medal', 'assets/images/bedroom/flat_medal6.png');
    this.load.image('gem', 'assets/images/bedroom/gem.png');
    this.load.image('chair', 'assets/images/bedroom/wooden-chair-viyana.png');


    //data files
    this.load.text('livingroom', 'assets/data/livingroom.json');
    this.load.text('bedroom', 'assets/data/bedroom.json');
    }

  create() {
    this.game.state.start('Game');
  }

}
