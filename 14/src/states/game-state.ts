import Board from '../prefabs/board';
import Unit, { IUnitData } from '../prefabs/unit';
import {
  State,
  Sprite,
  Group,
} from 'phaser';


export default class GameState extends State {
  board: Board;
  uiBlocked: boolean;
  playerUnits: Group;
  enemyUnits: Group;
  places: Group;
  playerBase: Sprite;
  enemyBase: Sprite;
  private map: IMap;
  private units: Unit[];
  private currentUnitIndex: number;

  create() {
    this.map = JSON.parse(this.cache.getText('map')) as IMap;
    this.board = new Board(this, this.map.grid);
    this.places = this.add.group();
    this.initPlaces();

    this.units = [];
    this.playerUnits = this.add.group();
    this.enemyUnits = this.add.group();
    this.initUnits();

    this.newTurn();
  }

  update() {
    // TODO
  }

  clearSelection() {
    this.board.forEach((tile: Sprite) => {
      tile.alpha = 1;
      tile.events.onInputDown.removeAll()
    }, this)
  }

  private initPlaces() {
    const player = this.board.getXYFromRowCol(this.map.playerBase.row, this.map.playerBase.col);
    this.playerBase = new Sprite(this.game, player.x, player.y, this.map.playerBase.asset);
    this.playerBase.anchor.setTo(0.5);
    this.playerBase.data = Object.create(this.map.playerBase);
    this.places.add(this.playerBase);

    const enemy = this.board.getXYFromRowCol(this.map.enemyBase.row, this.map.enemyBase.col);
    this.enemyBase = new Sprite(this.game, enemy.x, enemy.y, this.map.enemyBase.asset);
    this.enemyBase.anchor.setTo(0.5);
    this.enemyBase.data = Object.create(this.map.enemyBase);
    this.places.add(this.enemyBase);
  }

  private checkGameEnd() {
    const unit = this.units[this.currentUnitIndex - 1];
    if (!unit) return;

    if (unit.data.isPlayer) {
      if (unit.data.row === this.enemyBase.data.row && unit.data.col === this.enemyBase.data.col) {
        console.log('YOU WON!');
        return true;
      }
    }
    else {
      if (unit.data.row === this.playerBase.data.row && unit.data.col === this.playerBase.data.col) {
        console.log('YOU LOOSE!');
        return true;
      }
    }
  }

  private newTurn() {
    this.units = shuffle(this.units);
    this.currentUnitIndex = 0;
    this.prepareNextUnit();
  }

  prepareNextUnit() {
    if (this.checkGameEnd())
      return;

    if (this.currentUnitIndex >= this.units.length)
      return this.newTurn();

    this.clearSelection();
    const unit = this.units[this.currentUnitIndex];
    this.currentUnitIndex++;

    if (unit.alive) {
      unit.playTurn();
    }
    else {
      this.prepareNextUnit();
    }
  }

  private initUnits() {
    const player = JSON.parse(this.cache.getText('playerUnits'));
    const enemy = JSON.parse(this.cache.getText('enemyUnits'));
    player.forEach((entry: IUnitData) => entry.isPlayer = true);

    player.concat(enemy).forEach((entry: IUnitData) => {
      const unit = new Unit(this, Object.create(entry));
      this.units.push(unit);
      (entry.isPlayer ? this.playerUnits : this.enemyUnits).add(unit);

      if (entry.isPlayer)
        unit.events.onInputDown.add(unit.showMovementOptions, unit);
    });
  }
}


function shuffle(array: any[]) {
  const result = array.slice();
  let counter = array.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter--;
    let temp = result[counter];
    result[counter] = result[index];
    result[index] = temp;
  }

  return result;
}


interface IMap {
  grid: number[][],

  playerBase: {
    asset: string;
    row: number;
    col: number;
  };

  enemyBase: {
    asset: string;
    row: number;
    col: number;
  };
}
