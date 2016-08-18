import State = Phaser.State;
import TownModel from "../prefabs/town-model";
import Timer = Phaser.Timer;
import TimerEvent = Phaser.TimerEvent;
import Text = Phaser.Text;
import Group = Phaser.Group;
import Building from "../prefabs/building";
import Point = Phaser.Point;
import Button = Phaser.Button;
import Sprite = Phaser.Sprite;


const STEP = 2 * Timer.SECOND;


export default class GameState extends State {
  private town: TownModel;
  private timer: TimerEvent;
  private buildings: Group;
  private moneyLabel: Text;
  private foodLabel: Text;
  private populationLabel: Text;
  private jobsLabel: Text;
  private isDraggingMapBlocked: boolean;
  private isDraggingMap: boolean;
  private startDragPoint: Point;
  private endDragPoint: Point;
  private buttons: Group;
  private isBuilding: boolean;
  private selectedBuilding: IButtonData;
  private isDraggingBuilding: boolean;
  private shadowBuilding: Sprite;

  init() {
    this.game.physics.arcade.gravity.y = 0;
    this.game.input.maxPointers = 1;
    this.startDragPoint = new Point();
    this.endDragPoint = new Point();
  }

  create() {
    this.add.tileSprite(0, 0, 1200, 800, 'grass');
    this.game.world.setBounds(0, 0, 1200, 800);

    this.buildings = this.add.group();
    this.physics.arcade.enable(this.buildings);

    this.buildings.add(new Building(this, 100, 100, {
      asset: 'house',
      housing: 100,
    }));

    this.buildings.add(new Building(this, 200, 100, {
      asset: 'crops',
      food: 101,
    }));

    this.buildings.add(new Building(this, 300, 100, {
      asset: 'factory',
      jobs: 10,
    }));

    this.town = new TownModel({
      population: 100,
      food: 100,
      money: 100,
      jobs: 3,
    }, {}, <Array<Building>><any>this.buildings);

    this.timer = this.time.events.loop(STEP, this.step, this);
    this.initGui();
  }

  update() {
    if (!this.isDraggingMapBlocked) {
      if (this.isDraggingMap) {
        this.input.activePointer.position.copyTo(this.endDragPoint);

        const cameraPos = new Point().copyFrom(<Point><any>this.camera);
        const diff = Point.subtract(this.startDragPoint, this.endDragPoint);
        Point.add(cameraPos, diff).copyTo(this.camera)
        this.input.activePointer.position.copyTo(this.startDragPoint);

        if (this.input.activePointer.isUp)
          this.isDraggingMap = false;

      } else if (this.input.activePointer.isDown) {
        this.isDraggingMap = true;
        this.input.activePointer.position.copyTo(this.startDragPoint);
      }
    }

    if (this.isBuilding && this.input.activePointer.isDown) {
      this.isDraggingMapBlocked = true;
      this.isDraggingBuilding = true;
    }

    if (this.isDraggingBuilding) {
      if (!this.shadowBuilding || !this.shadowBuilding.alive) {
        this.shadowBuilding = this.add.sprite(0, 0, this.selectedBuilding.asset);
        this.shadowBuilding.alpha = 0.7;
        this.shadowBuilding.anchor.setTo(0.5);
        this.physics.arcade.enable(this.shadowBuilding);
      }

      this.shadowBuilding.x = this.input.activePointer.worldX;
      this.shadowBuilding.y = this.input.activePointer.worldY;
    }

    if (this.isDraggingBuilding && this.input.activePointer.isUp) {
      if (this.canBuild())
        this.createBuilding(this.input.activePointer.worldX, this.input.activePointer.worldY, this.selectedBuilding);
      this.clearSelection();
    }
  }

  private step() {
    this.town.step();
    this.refreshStats();
  }

  private initGui() {
    const style = {font: '14px Arial', fill: '#fff'};

    this.add.sprite(10, 10, 'money').fixedToCamera = true;
    this.moneyLabel = this.add.text(45, 15, '0', style);
    this.moneyLabel.fixedToCamera = true;

    this.add.sprite(100, 10, 'food').fixedToCamera = true;
    this.foodLabel = this.add.text(135, 15, '0', style);
    this.foodLabel.fixedToCamera = true;

    this.add.sprite(190, 10, 'population').fixedToCamera = true;
    this.populationLabel = this.add.text(225, 15, '0/0', style);
    this.populationLabel.fixedToCamera = true;

    this.add.sprite(280, 10, 'jobs').fixedToCamera = true;
    this.jobsLabel = this.add.text(315, 15, '0', style);
    this.jobsLabel.fixedToCamera = true;

    const data = JSON.parse(this.cache.getText('buttonData'));
    this.buttons = this.add.group();

    data.forEach((entry: IButtonData, index: number) => {
      const button = new Button(
        this.game,
        this.game.width - 60 - 60 * index,
        this.game.height - 60,
        entry.btnAsset,
        this.clickBuildBtn,
        this
      );
      button.fixedToCamera = true;
      button.data = entry;
      this.buttons.add(button);
    });

    //refresh stats
    this.refreshStats();
  }

  private clickBuildBtn(button: Button) {
    this.clearSelection();
    if (this.town.stats.money < button.data.cost) return;
    button.alpha = 0.5;
    this.selectedBuilding = button.data;
    this.isBuilding = true;
  }

  refreshStats() {
    this.moneyLabel.text = String(Math.round(this.town.stats.money));
    this.foodLabel.text = String(Math.round(this.town.stats.food));
    this.populationLabel.text = Math.round(this.town.stats.population) + '/' + Math.round(this.town.stats.housing);
    this.jobsLabel.text = String(Math.round(this.town.stats.jobs));
  }

  private clearSelection() {
    this.isDraggingMapBlocked = false;
    this.isDraggingMap = false;
    this.isDraggingBuilding = false;
    this.isBuilding = false;
    this.selectedBuilding = null;
    this.buttons.setAll('alpha', 1);

    if (this.shadowBuilding)
      this.shadowBuilding.kill();
  }

  private createBuilding(x: number, y: number, data: IButtonData) {
    this.town.stats.money -= data.cost;
    const building = new Building(this, x, y, data);
    this.buildings.add(building);
  }

  private canBuild() {
    return !this.physics.arcade.overlap(this.shadowBuilding, this.buildings);
  }
}


interface IButtonData {
  btnAsset: string,
  asset: string,
  cost: number,
  jobs?: number,
  housing?: number,
  food?: number,
}
