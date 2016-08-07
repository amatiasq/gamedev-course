///<reference path="../../node_modules/phaser/typescript/phaser.comments.d.ts"/>
import {
  State,
  CursorKeys,
  Sprite,
  Text,
  Timer,
  Math as PhaserMath,
  Sound,
  Group,
  Button,
  ArrayUtils,
} from 'phaser';

import Pool from '../prefabs/pool';
import Bullet from '../prefabs/bullet';
import Plant, { PlantData } from '../prefabs/plant';
import Zombie from '../prefabs/zombie';
import Sun from '../prefabs/sun';

const HOUSE_X = 60;
const SUN_FREQUENCY = 5;
const ZOMBIE_Y_POSITIONS = [ 49, 99, 149, 199, 249 ]


export default class GameState extends State {
  private cursors: CursorKeys;
  private currentLevel: string;
  private background: Sprite;
  plants: Pool<Plant>;
  zombies: Pool<Zombie>;
  bullets: Pool<Bullet>;
  suns: Pool<Sun>;
  stats: any;
  private sunLabel: Text;
  private sunGenerationTimer: Timer;
  private hitSound: Sound;
  private buttonData: any;
  private buttons: Group;
  private selectedButton: { cost: number, plant: PlantData };
  private plantLabel: Text;
  private patches: Group;
  private levelData: any;
  private currentEnemyIndex: number;

  init(level: string) {
    this.currentLevel = level || 'level1';
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.stats = {
      sun: 50,
    };
  }

  create() {
    this.background = this.add.sprite(0, 0, 'background');
    this.hitSound = this.add.audio('hit');

    this.createLandPatches();

    this.plants = this.add.existing(new Pool<Plant>(this.game, () => new Plant(this)));
    this.zombies = this.add.existing(new Pool<Zombie>(this.game, () => new Zombie(this)));
    this.bullets = this.add.existing(new Pool<Bullet>(this.game, () => new Bullet(this)));
    this.suns = this.add.existing(new Pool<Sun>(this.game, () => new Sun(this)));

    this.createGui();

    this.sunGenerationTimer = this.game.time.create(false);
    this.sunGenerationTimer.start();
    this.scheduleGeneration();

    this.loadLevel();
  }

  update() {
    this.game.physics.arcade.collide(this.plants, this.zombies, this.attackPlant, null, this);
    this.game.physics.arcade.collide(this.bullets, this.zombies, this.hitZombie, null, this);

    this.zombies.forEachAlive((zombie: Zombie) => {
      if (zombie.x <= HOUSE_X)
        this.gameOver();
    }, this)
  }

  increaseSun(amount: number) {
    this.stats.sun += amount;
    this.updateStats();
  }

  private updateStats() {
    this.sunLabel.text = this.stats.sun;
  }

  private attackPlant(plant: Plant, zombie: Zombie) {
    plant.damage(zombie.params.attack);
    zombie.resetVelocity();
  }

  private hitZombie(bullet: Bullet, zombie: Zombie) {
    bullet.kill();
    zombie.damage(bullet.params.attack);
    zombie.resetVelocity();
    this.hitSound.play();

    if (!zombie.alive) {
      this.stats.killed++;

      if (this.stats.killed === this.stats.totalEnemies)
        this.game.state.start('Game', true, false, this.levelData.nextLevel);
    }
  }

  private gameOver() {
    this.game.state.start('Game');
  }

  private createGui() {
    const style = { font: '14px Arial', fill: '#fff' };
    const sun = this.suns.get(10, this.game.height - 20, { eternal: true });
    sun.scale.setTo(0.5);
    this.sunLabel = this.add.text(22, this.game.height - 28, '', style);
    this.updateStats();

    this.buttonData = JSON.parse(this.game.cache.getText('buttonData'));
    this.buttons = this.add.group();

    this.buttonData.forEach((entry: any, index: number) => {
      const button = this.game.add.button(80 + index * 40, this.game.height - 35, entry.button, this.clickButton, this);
      this.buttons.add(button);
      button.params = { data: entry };
    });

    this.plantLabel = this.add.text(300, this.game.height - 28, '', style);
  }

  private scheduleGeneration() {
    this.sunGenerationTimer.add(Timer.SECOND * SUN_FREQUENCY, () => {
      this.generateRandomSun();
      this.scheduleGeneration();
    });
  }

  private generateRandomSun() {
    this.suns.get(PhaserMath.between(40, 460), -20, {
      velocity: 50,
      value: 100,
    });
  }

  private clickButton(button: Button) {
    const wasSelected = button.params.isSelected;
    this.clearSelection();

    if (!wasSelected) {
      this.plantLabel.text = 'Cost ' + button.params.data.cost;

      if (this.stats.sun < button.params.data.cost) {
        this.plantLabel.text += ' - Too expensive!';
        return;
      }

      button.params.isSelected = true;
      button.alpha = 0.5;
      this.selectedButton = button.params.data;
    }
  }

  private clearSelection() {
    this.selectedButton = null;
    this.plantLabel.text = '';

    this.buttons.forEach((button: Button) => {
      button.alpha = 1;
      button.params.isSelected = false;
    }, this);
  }

  private createLandPatches() {
    this.patches = this.add.group();
    const rectangle = this.add.bitmapData(40, 50);
    rectangle.ctx.fillStyle = '#000';
    rectangle.ctx.fillRect(0, 0, 40, 50);

    let dark = false;

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 5; j++) {
        const patch = new Sprite(this.game, 64 + i * 40, 24 + j * 50, rectangle)
        this.patches.add(patch);
        dark = !dark;

        patch.alpha = dark ? 0.2 : 0.1;
        patch.params = {};
        patch.inputEnabled = true;
        patch.events.onInputDown.add(this.plantPlant, this);
      }
    }
  }

  private plantPlant(patch: Sprite) {
    if (!this.selectedButton || patch.params.isBusy) return;
    patch.params.isBusy = true;
    this.plants.get(patch.x + patch.width / 2, patch.y + patch.height / 2, this.selectedButton.plant, patch);
    this.increaseSun(-this.selectedButton.cost);
    this.clearSelection();
  }

  private loadLevel() {
    this.levelData = JSON.parse(this.game.cache.getText(this.currentLevel));
    this.currentEnemyIndex = -1;
    this.stats.killed = 0;
    this.stats.totalEnemies = this.levelData.zombies.length;
    this.scheduleNextEnemy();
  }

  private scheduleNextEnemy() {
    const current = this.levelData.zombies[this.currentEnemyIndex]
    const next = this.levelData.zombies[this.currentEnemyIndex + 1];
    if (!next) return;

    const delay = Timer.SECOND * (next.time - (current ? current.time : 0));
    this.game.time.events.add(delay, () => {
      const y = ArrayUtils.getRandomItem<number>(ZOMBIE_Y_POSITIONS);
      this.zombies.get(this.game.world.width + 40, y, next);
      this.currentEnemyIndex++;
      this.scheduleNextEnemy()
    })
  }
}
