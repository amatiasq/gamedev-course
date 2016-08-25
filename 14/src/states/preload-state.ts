import State = Phaser.State;
import Sprite = Phaser.Sprite;


export default class PreloadState extends State {

  preload() {
    const world = this.game.world;
    const preloadBar: Sprite = this.add.sprite(world.centerX, world.centerY, 'bar');
    preloadBar.anchor.set(0.5);
    preloadBar.scale.setTo(3);
    this.load.setPreloadSprite(preloadBar);

    // Load assets
    this.load.image('grass', 'assets/images/grass2.png');
    this.load.image('grasstrees', 'assets/images/grass3.png');
    this.load.image('grasstrees2', 'assets/images/grass4.png');
    this.load.image('rocks', 'assets/images/rocks.png');
    this.load.image('water', 'assets/images/water.png');
    this.load.image('black', 'assets/images/black.png');
    this.load.image('sacredWarrior', 'assets/images/leopard-warrior.png');
    this.load.image('warrior', 'assets/images/warrior.png');
    this.load.image('wolf', 'assets/images/wolf.png');
    this.load.image('orc', 'assets/images/orc.png');
    this.load.image('ogre', 'assets/images/ogre.png');
    this.load.image('house', 'assets/images/house-1.png');
    this.load.image('darkTemple', 'assets/images/dark-temple.png');

    //data files
    this.load.text('map', 'assets/data/map.json');
    this.load.text('playerUnits', 'assets/data/playerUnits.json');
    this.load.text('enemyUnits', 'assets/data/enemyUnits.json');
  }

  create() {
    this.game.state.start('Game');
  }

}
