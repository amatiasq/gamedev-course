import { State } from 'phaser';


export default new class extends State {

  init() {
    this.game.stage.backgroundColor = '#fff';
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  }


  preload() {
    this.load.image('preloadBar', 'assets/images/preloader-bar.png');
  }


  create() {
    this.game.state.start('Preload');
  }
}