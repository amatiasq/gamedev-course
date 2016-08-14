import {
  State,
  Sprite,
  Tilemap,
} from 'phaser';


export default class PreloadState extends State {

  preload() {
    const world = this.game.world;
    const preloadBar = this.add.sprite(world.centerX, world.centerY, 'bar');
    preloadBar.anchor.set(0.5);
    preloadBar.scale.setTo(100, 1);
    this.load.setPreloadSprite(preloadBar);

    // Load assets
    this.load.image('sword', 'assets/images/attack-icon.png');
    this.load.image('quest', 'assets/images/quest-button.png');
    this.load.image('chest', 'assets/images/chest-gold.png');
    this.load.image('coin', 'assets/images/coin.png');
    this.load.image('potion', 'assets/images/potion.png');
    this.load.image('shield', 'assets/images/shield.png');
    this.load.image('scroll', 'assets/images/scroll-skull.png');
    this.load.image('strangeItem', 'assets/images/gods-helmet.png');

    this.load.image('monster', 'assets/images/demon.png');
    this.load.image('dragon', 'assets/images/goldendragon.png');
    this.load.image('snake', 'assets/images/snake.png');
    this.load.image('skeleton', 'assets/images/swordskeleton.png');

    this.load.image('sword', 'assets/images/attack-icon.png')
    this.load.spritesheet('player', 'assets/images/player.png', 30, 30, 2, 0, 2);
    this.load.image('tilesheet', 'assets/images/terrains.png');

    //load game data
    this.load.tilemap('map1', 'assets/levels/world.json', null, Tilemap.TILED_JSON);
  }

  create() {
    this.game.state.start('Game');
  }

}
