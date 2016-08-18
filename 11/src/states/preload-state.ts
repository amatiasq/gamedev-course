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
    this.load.image('grass', 'assets/images/grass.png');
    this.load.image('tree', 'assets/images/tree.png');
    this.load.image('crops', 'assets/images/crops.png');
    this.load.image('factory', 'assets/images/factory.png');
    this.load.image('house', 'assets/images/house.png');

    this.load.image('food', 'assets/images/food.png');
    this.load.image('money', 'assets/images/money.png');
    this.load.image('population', 'assets/images/population.png');
    this.load.image('jobs', 'assets/images/worker.png');

    this.load.image('buttonFarm', 'assets/images/button_farm.png');
    this.load.image('buttonFactory', 'assets/images/button_factory.png');
    this.load.image('buttonHouse', 'assets/images/button_house.png');

    //load game data
    this.load.text('buttonData', 'assets/data/buttons.json');
  }

  create() {
    this.game.state.start('Game');
  }

}
