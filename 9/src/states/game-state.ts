import Tilemap = Phaser.Tilemap;
import TilemapLayer = Phaser.TilemapLayer;
import State = Phaser.State;
import CursorKeys = Phaser.CursorKeys;
import Player from "../prefabs/player";
import ScreenControls from "../plugins/screen-controls";

const PLAYER_SPEED = 90;


export default class GameState extends State {
  private level: string;
  private cursors: CursorKeys;
  private map: Tilemap;
  private backgroundLayer: TilemapLayer;
  private collisionLayer: TilemapLayer;
  private player: Player;
  private screenControls: ScreenControls;

  init(level: string) {
    this.level = level || 'map1';
    this.game.physics.arcade.gravity.y = 0;
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.screenControls = this.game.plugins.add(ScreenControls);
  }

  create() {
    this.loadLevel();

    this.player = new Player(this, 100, 100, {
      items: [],
      health: 25,
      attack: 20,
      defence: 8,
      gold: 100,
    });

    this.initGui();
    this.add.existing(this.player);
  }

  update() {
    this.player.body.velocity.setTo(0);

    if (this.cursors.up.isDown || this.player.buttons.up)
      this.player.body.velocity.y = -PLAYER_SPEED;

    if (this.cursors.down.isDown || this.player.buttons.down)
      this.player.body.velocity.y = PLAYER_SPEED;

    if (this.cursors.left.isDown || this.player.buttons.left) {
      this.player.body.velocity.x = -PLAYER_SPEED;
      this.player.scale.setTo(1, 1);
    }

    if (this.cursors.right.isDown || this.player.buttons.right) {
      this.player.body.velocity.x = PLAYER_SPEED;
      this.player.scale.setTo(-1, 1);
    }

    if (this.game.input.activePointer.isUp)
      this.screenControls.stopMovement();

    if (this.player.body.velocity.isZero()) {
      this.player.animations.stop();
      this.player.frame = 0;
    }
    else {
      this.player.play('walk');
    }
  }

  private loadLevel() {
    this.map = this.add.tilemap(this.level);
    this.map.addTilesetImage('terrains', 'tilesheet');
    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    this.collisionLayer = this.map.createLayer('collisionLayer');
    this.game.world.sendToBack(this.backgroundLayer);
    this.map.setCollisionBetween(1, 16, true, 'collisionLayer');
    this.collisionLayer.resizeWorld();
  }

  private gameOver() {
    this.game.state.start('Game', true, false, this.level);
  }

  private initGui() {
    this.screenControls.setup(this.player, {
      up: true,
      down: true,
      left: true,
      right: true,
      upleft: true,
      upright: true,
      downleft: true,
      downright: true,
      action: true,
    });
  }
}
