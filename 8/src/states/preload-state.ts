import {
  State,
  Sprite,
} from 'phaser';


export default new class extends State {

  preload() {
    const world = this.game.world;
    const preloadBar = this.add.sprite(world.centerX, world.centerY, 'preloadBar');
    preloadBar.anchor.set(0.5);
    preloadBar.scale.setTo(3);
    this.load.setPreloadSprite(preloadBar);

    // Load assets
  }

  create() {
    this.game.state.start('Game');
  }

}
