import TileSprite = Phaser.TileSprite;
import Group = Phaser.Group;
import Physics = Phaser.Physics;
import State = Phaser.State;
import CursorKeys = Phaser.CursorKeys;
import CollisionGroup = Phaser.Physics.P2.CollisionGroup;
import Sprite = Phaser.Sprite;
import Body = Phaser.Physics.P2.Body;
import Shape = p2.Shape;
import Equation = p2.Equation;
import Point = Phaser.Point;
import Timer = Phaser.Timer;


const MAX_DISTANCE_SHOOT = 190;
const MAX_SPEED_SHOOT = 1000;
const SHOOT_FACTOR = 12;
const KILL_DIFFERENCE = 25;


export default class GameState extends State {
  private level: string;
  private blocks: Group;
  private blocksCollisionGroup: CollisionGroup;
  private enemiesCollisionGroup: CollisionGroup;
  private chickensCollisionGroup: CollisionGroup;
  private allCollisionGroups: Array<CollisionGroup>;
  private enemies: Group;
  private isChickenReady: boolean;
  private pole: Sprite;
  private chicken: Sprite;
  private isPreparingShot: boolean;
  private totalEnemies: number;
  private deadEnemies: number;
  private chickensLeft: number;
  private chickenHud: Group;

  init(level: string = 'level1') {
    this.level = level;
    this.physics.p2.gravity.y = 1000;

    this.blocksCollisionGroup = this.physics.p2.createCollisionGroup();
    this.enemiesCollisionGroup = this.physics.p2.createCollisionGroup();
    this.chickensCollisionGroup = this.physics.p2.createCollisionGroup();

    this.allCollisionGroups = [
      this.blocksCollisionGroup,
      this.enemiesCollisionGroup,
      this.chickensCollisionGroup,
    ];
  }

  create() {
    const sky = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'sky');
    this.world.sendToBack(sky);

    this.chickenHud = this.add.group();


    this.blocks = this.add.group();
    this.blocks.enableBody = true;
    this.blocks.physicsBodyType = Physics.P2JS;

    this.enemies = this.add.group();
    this.enemies.enableBody = true;
    this.enemies.physicsBodyType = Physics.P2JS;

    const floor = this.add.tileSprite(this.world.width / 2, this.world.height - 24, this.world.width, 48, 'floor');
    this.blocks.add(floor);
    floor.body.setCollisionGroup(this.blocksCollisionGroup);
    floor.body.collides(this.allCollisionGroups);
    floor.body.static = true;

    this.loadLevel();

    this.pole = this.add.sprite(200, 500, 'pole');
    this.pole.anchor.setTo(0.5, 0);

    this.input.onDown.add(this.prepareShot, this);
    this.setupChicken();
  }

  update() {
    if (!this.isPreparingShot)
      return;

    this.chicken.x = this.input.activePointer.x;
    this.chicken.y = this.input.activePointer.y;
    const distance = Point.distance(this.chicken.position, this.pole.position);

    if (distance > MAX_DISTANCE_SHOOT) {
      this.isPreparingShot = false;
      this.isChickenReady = true;
      this.chicken.position = Object.create(this.pole.position);
    }

    if (this.input.activePointer.isUp) {
      this.isPreparingShot = false;
      this.throwChicken();
    }
  }

  updateDeadCount() {
    this.deadEnemies++;

    if (this.deadEnemies === this.totalEnemies) {
      console.log('YAY!');
      this.gameOver();
    }
  }

  gameOver() {
    this.game.state.start('Game', true, false, this.level);
  }

  private prepareShot() {
    if (!this.isChickenReady) return;
    this.isPreparingShot = true;
    this.isChickenReady = false;
  }

  private setupChicken() {
    this.chicken = this.add.sprite(this.pole.x, this.pole.y, 'chicken');
    this.chicken.anchor.setTo(0.5);
    this.isChickenReady = true;
    this.refreshStats();
  }

  private throwChicken() {
    this.physics.p2.enable(this.chicken);
    this.chicken.body.setCollisionGroup(this.chickensCollisionGroup);
    this.chicken.body.collides(this.allCollisionGroups);
    const diff = Point.subtract(this.pole.position, this.chicken.position);
    diff.multiply(SHOOT_FACTOR, SHOOT_FACTOR)
    diff.setMagnitude(Math.min(diff.getMagnitude(), MAX_SPEED_SHOOT));
    diff.copyTo(this.chicken.body.velocity);
    this.endTurn();
  }

  private endTurn() {
    this.chickensLeft--;
    this.time.events.add(3 * Timer.SECOND, () => {
      this.chicken.kill();

      this.time.events.add(Timer.SECOND, () => {
        if (this.chickensLeft > 0)
          this.setupChicken();
        else
          this.gameOver();
      });
    });
  }

  private loadLevel() {
    const data = JSON.parse(this.cache.getText(this.level));
    data.blocks.forEach((block: any) => this.addBox(block.x, block.y, block.asset, block.mass));
    data.enemies.forEach((block: any) => this.addEnemy(block.x, block.y, block.asset));
    this.totalEnemies = data.enemies.length;
    this.deadEnemies = 0;
    this.chickensLeft = 3;
  }

  private addBox(x: number, y: number, asset: string, mass: number): Sprite {
    const box = new Sprite(this.game, x, y, asset);
    this.blocks.add(box);
    box.body.mass = mass;
    box.body.setCollisionGroup(this.blocksCollisionGroup);
    box.body.collides(this.allCollisionGroups);
    return box;
  }

  private addEnemy(x: any, y: any, asset: any): Sprite {
    const enemy = new Sprite(this.game, x, y, asset);
    this.enemies.add(enemy);
    enemy.body.setCollisionGroup(this.enemiesCollisionGroup);
    enemy.body.collides(this.allCollisionGroups);
    enemy.body.onBeginContact.add(hitEnemy, {
      state: this,
      enemy: enemy,
    });
    return enemy;
  }

  private refreshStats() {
    this.chickenHud.removeAll();

    for (let i = 0; i < this.chickensLeft - 1; i++)
      this.chickenHud.create(this.game.width - 70 - i * 60, 20, 'chicken');
  }
}


function hitEnemy(bodyB: Body, shapeA: Shape, shapeB: Shape, shapeC: Shape, equations: Equation) {
  var velocityDiff = Point.distance(
    new Point(equations[0].bodyA.velocity[0], equations[0].bodyA.velocity[1]),
    new Point(equations[0].bodyB.velocity[0], equations[0].bodyB.velocity[1])
  );

  if (velocityDiff > KILL_DIFFERENCE) {
    (<Sprite>this.enemy).kill();
    (<GameState>this.state).updateDeadCount();
  }
}
