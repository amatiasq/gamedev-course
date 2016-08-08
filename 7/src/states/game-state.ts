import {
  State,
  Group,
  CursorKeys,
  Tilemap,
  TilemapLayer,
  Sprite,
  Button,
} from 'phaser';
import Enemy from '../prefabs/enemy';

const RUNNING_SPEED = 180;
const JUMPING_SPEED = 500;
const BOUNCING_SPEED = 150;


export default new class extends State {
  private cursors: CursorKeys;
  private player: ISprite;
  private leftArrow: Button;
  private rightArrow: Button;
  private actionButton: Button;
  private map: Tilemap;
  private backgroundLayer: TilemapLayer;
  private collisionLayer: TilemapLayer;
  private goal: ISprite;
  private currentLevel: string;
  private enemies: Group;


  init(level: string) {
    this.currentLevel = level || 'myLevel';
    this.game.physics.arcade.gravity.y = 1000;
    this.cursors = this.game.input.keyboard.createCursorKeys();
  }


  create() {
    this.loadLevel();
    this.createOnScreenControls();
  }


  update() {
    this.game.physics.arcade.collide(this.enemies, this.collisionLayer);
    this.game.physics.arcade.collide(this.player, this.collisionLayer);
    this.game.physics.arcade.collide(this.player, this.enemies, this.hitEnemy, null, this);
    this.game.physics.arcade.overlap(this.player, this.goal, this.changeLevel, null, this);

    this.player.body.velocity.x = 0;

    if (this.cursors.left.isDown ||this.player.params.isMovingLeft) {
      this.player.body.velocity.x = -RUNNING_SPEED;
      this.player.scale.setTo(1, 1);
      this.player.play('walking');
    }
    else if (this.cursors.right.isDown || this.player.params.isMovingRight) {
      this.player.body.velocity.x = RUNNING_SPEED;
      this.player.scale.setTo(-1, 1);
      this.player.play('walking');
    }
    else {
      this.player.animations.stop();
      this.player.frame = 3;
    }

    if (
      (this.cursors.up.isDown || this.player.params.mustJump) &&
      (this.player.body.blocked.down || this.player.body.touching.down)
    ) {
      this.player.body.velocity.y = -JUMPING_SPEED;
      this.player.params.mustJump = false;
    }

    if (this.player.bottom === this.game.world.height) {
      this.gameOver();
    }
  }

  private changeLevel(player: ISprite, goal: ISprite) {
    this.game.state.start('Game', true, false, goal.params.nextLevel);
  }

  private hitEnemy(player :ISprite, enemy: Sprite) {
    if (!enemy.body.touching.up)
      return this.gameOver();

    enemy.kill();
    this.player.body.velocity.y = -BOUNCING_SPEED;
  }

  private gameOver() {
    this.game.state.start('Game', true, false, this.currentLevel);
  }

  private loadLevel() {
    this.map = this.add.tilemap(this.currentLevel);
    this.map.addTilesetImage('tiles_spritesheet', 'gameTiles');
    this.map.objects['objectsLayer'].forEach((entry: any) => entry.y -= this.map.tileHeight);

    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    this.collisionLayer = this.map.createLayer('collisionLayer');

    this.game.world.sendToBack(this.backgroundLayer);
    this.map.setCollisionBetween(1, 160, true, 'collisionLayer');
    this.backgroundLayer.resizeWorld();

    const playerData = this.findObjectsByType('player')[0];
    this.player = <ISprite>this.add.sprite(playerData.x, playerData.y, 'player', 3);
    this.player.animations.add('walking', [ 0, 1, 2, 1 ], 6, true);
    this.player.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this.player);
    this.player.params = {};
    this.player.body.collideWorldBounds = true;

    const goalData = this.findObjectsByType('goal')[0];
    this.goal = <ISprite>this.add.sprite(goalData.x, goalData.y, 'goal');
    this.game.physics.arcade.enable(this.goal);
    this.goal.body.allowGravity = false;
    this.goal.params = { nextLevel: goalData.properties.nextLevel };

    this.enemies = this.add.group();
    const enemiesData = this.findObjectsByType('enemy');

    enemiesData.forEach((data: any) => {
      this.enemies.add(new Enemy(
        this.game,
        this.map,
        data.x,
        data.y,
        'slime',
        parseInt(data.properties.velocity, 10)
      ));
    });

    this.game.camera.follow(this.player);
  }

  private findObjectsByType(type: string): any[] {
    return this.map.objects['objectsLayer']
      .filter((entry: any) => entry.properties.type === type);
  }

  private createOnScreenControls() {
    this.leftArrow = this.add.button(20, this.game.height - 60, 'arrowButton');
    this.rightArrow = this.add.button(110, this.game.height - 60, 'arrowButton');
    this.actionButton = this.add.button(this.game.width - 100, this.game.height - 60, 'actionButton');

    this.leftArrow.fixedToCamera = true;
    this.rightArrow.fixedToCamera = true;
    this.actionButton.fixedToCamera = true;

    this.leftArrow.events.onInputDown.add(() => this.player.params.isMovingLeft = true);
    this.leftArrow.events.onInputUp.add(() => this.player.params.isMovingLeft = false);
    this.leftArrow.events.onInputOver.add(() => this.player.params.isMovingLeft = true);
    this.leftArrow.events.onInputOut.add(() => this.player.params.isMovingLeft = false);
    this.rightArrow.events.onInputDown.add(() => this.player.params.isMovingRight = true);
    this.rightArrow.events.onInputUp.add(() => this.player.params.isMovingRight = false);
    this.rightArrow.events.onInputOver.add(() => this.player.params.isMovingRight = true);
    this.rightArrow.events.onInputOut.add(() => this.player.params.isMovingRight = false);
    this.actionButton.events.onInputDown.add(() => this.player.params.mustJump = true);
    this.actionButton.events.onInputUp.add(() => this.player.params.mustJump = false);
  }

}


interface ISprite extends Sprite {
  params: any;
}
