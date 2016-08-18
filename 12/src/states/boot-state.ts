import State = Phaser.State;
import ScaleManager = Phaser.ScaleManager;
import Physics = Phaser.Physics;


export default class BootState extends State {

  init() {
    this.game.stage.backgroundColor = '#fff';
    this.scale.scaleMode = ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.game.physics.startSystem(Physics.ARCADE);
  }

  preload() {
    this.load.image('bar', 'assets/images/preloader-bar.png');
  }

  create() {
    this.game.state.start('Preload');
  }
}
