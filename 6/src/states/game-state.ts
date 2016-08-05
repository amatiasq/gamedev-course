import {
  State,
  Group,
  Sprite,
  TileSprite,
  Text,
  BitmapData,
  Sound,
  CursorKeys,
} from 'phaser';

import Pool from '../prefabs/pool';
import Platform from '../prefabs/platform';
const MAX_JUMP_DISTANCE = 120;

var a = 0;


export default new class extends State {

  floorPool: Pool<Sprite>;
  coinsPool: Pool<Sprite>;
  platformPool: Pool<Platform>;
  player: Sprite;
  background : TileSprite;
  water : TileSprite;
  panel : Sprite;
  currentPlatform: Platform;
  coinsCountLabel: Text;
  overlay: BitmapData;
  coinSound : Sound;
  cursors: CursorKeys;
  isJumping: boolean;
  jumpPeak: boolean;
  myCoins: number;
  startJumpY: number;
  levelSpeed: number;

  init() {
    this.floorPool = new Pool<Sprite>(this.game, () => new Phaser.Sprite(this.game, 0, 0, 'floor'));
    this.add.existing(this.floorPool);

    this.coinsPool = new Pool<Sprite>(this.game, () => new Phaser.Sprite(this.game, 0, 0, 'coin'));
    this.add.existing(this.coinsPool);
    this.coinsPool.enableBody = true;

    this.platformPool = new Pool<Platform>(this.game, () => new Platform(this.game, this.floorPool, this.coinsPool));
    this.add.existing(this.platformPool);

    this.game.physics.arcade.gravity.y = 1000;
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.myCoins = 0;
    this.levelSpeed = -200;
  }

  create() {
    this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
    this.background.tileScale.y = 2;
    this.background.autoScroll(this.levelSpeed / 6, 0);
    this.game.world.sendToBack(this.background);

    this.water = this.add.tileSprite(0, this.game.height - 30, this.game.width, 30, 'water');
    this.water.autoScroll(this.levelSpeed / 2, 0);

    this.player = this.add.sprite(50, 150, 'player');
    this.player.anchor.setTo(0.5);
    this.player.animations.add('running', [ 0, 1, 2, 3, 2, 1 ], 15, true);
    this.game.physics.arcade.enable(this.player);

    this.player.body.setSize(38, 60, 7, 4);
    this.player.play('running');

    this.currentPlatform = new Platform(this.game, this.floorPool, this.coinsPool);
    this.currentPlatform.reset(18, 0, 200, this.levelSpeed);
    this.platformPool.add(this.currentPlatform);

    this.coinSound = this.add.audio('coin');
    this.createPlatform();

    const style = { font: '30px Arial', fill: '#FFF' };
    this.coinsCountLabel = this.add.text(10, 20, '0', style);
  }

  restart() {
    this.game.state.start('GameState');
  }

  update() {
     if (!this.player.alive) return;

    this.player.x = 50;
    this.coinsPool.forEachAlive((coin : Sprite) => coin.right <= 0 && coin.kill(), this);

    this.platformPool.forEachAlive((platform : Platform) => {
      this.game.physics.arcade.collide(this.player, platform);
      const lastTile = <Sprite>platform.children.slice(-1)[0];

      if (lastTile && lastTile.right < 0) {
        platform.kill();
        this.platformPool.add(platform);
      }
    }, this);

    this.game.physics.arcade.overlap(this.player, this.coinsPool, (player : Sprite, coin : Sprite) => {
      coin.kill();
      this.myCoins++;
      this.coinsCountLabel.text = this.myCoins.toString()
      this.coinSound.play();
    });

    if (this.cursors.up.isDown || this.game.input.activePointer.isDown)
      this.playerJump();
    else if (this.cursors.up.isUp || this.game.input.activePointer.isDown)
      this.isJumping = false;

    const lastTile = <Sprite>this.currentPlatform.children.slice(-1)[0];

    if (lastTile && lastTile.right < this.game.width)
      this.createPlatform();

    if (this.player.top >= this.world.height || this.player.right <= 0)
      this.gameOver();
  }

  gameOver() {
    this.player.kill();

    const highScore = parseInt(localStorage.getItem('highScore'), 10);
    if (this.myCoins > highScore)
      localStorage.setItem('highScore', this.myCoins.toString());

    this.overlay = this.add.bitmapData(this.game.width, this.game.height);
    this.overlay.ctx.fillStyle = '#000';
    this.overlay.ctx.fillRect(0, 0, this.game.width, this.game.height);

    this.panel = this.add.sprite(0, 0, this.overlay);
    this.panel.alpha = 0.55;

    const gameOverPanel = this.add.tween(this.panel);
    gameOverPanel.to({ y: 0 }, 500);

    gameOverPanel.onComplete.add(() => {
      this.background.stopScroll();
      this.water.stopScroll();

      this.add.text(
        this.game.width / 2,
        this.game.height / 2,
        'GAME OVER',
        { font: '30px Arial', fill: '#fff' }
      ).anchor.setTo(0.5);

      const style = { font: '20px Arial', fill: '#fff' };

      this.add.text(
        this.game.width / 2,
        this.game.height / 2 + 50,
        'Hight score:' + highScore,
        style
      ).anchor.setTo(0.5);

      this.add.text(
        this.game.width / 2,
        this.game.height / 2 + 80,
        'Your score:' + this.myCoins,
        style
      ).anchor.setTo(0.5);

      this.add.text(
        this.game.width / 2,
        this.game.height / 2 + 120,
        'Tap to play again',
        style
      ).anchor.setTo(0.5);

      this.game.input.onDown.addOnce(() => this.restart());
    });

    gameOverPanel.start();
  }

  playerJump() {
    if (this.player.body.touching.down) {
      this.startJumpY = this.player.y;
      this.isJumping = true;
      this.jumpPeak = false;
      this.player.body.velocity.y = -300;
    }
    else if (this.isJumping && !this.jumpPeak) {
      const distanceJumped = this.startJumpY - this.player.y;
      if (distanceJumped <= MAX_JUMP_DISTANCE)
        this.player.body.velocity.y = -300;
      else
        this.jumpPeak = true;
    }
  }

  createPlatform() {
    const data = this.generateRandomPlatform();
    this.currentPlatform = this.platformPool.get(
      data.numTiles,
      this.game.width + data.separation,
      data.y,
      this.levelSpeed
    );

    this.platformPool.add(this.currentPlatform);
  }

  generateRandomPlatform() {
    const minSeparation = 60;
    const maxSeparation = 150;
    const separation = minSeparation + Math.random() * (maxSeparation - minSeparation);

    const minDiffY = -120;
    const maxDiffY = 120;
    let y = this.currentPlatform.children[0].y + minDiffY + Math.random() * (maxDiffY - minDiffY);
    y = Math.min(this.game.height, Math.max(150, y));

    const minTiles = 1;
    const maxTiles = 5;
    const numTiles = minTiles + Math.random() * (maxTiles - minTiles);

    return { separation, y, numTiles };
  }

  render() {
    // this.game.debug.body(this.player);
    // this.game.debug.bodyInfo(this.player, 0, 30);

    if (a % 100 === 0) {
      console.clear();
      console.log('Platforms:', this.platformPool.length)
      console.log('Tiles:', this.floorPool.length)
      console.log('Coins:', this.coinsPool.length)
    }

    a++
  }

};
