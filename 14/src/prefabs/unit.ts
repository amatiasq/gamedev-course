import { Sprite } from 'phaser';
import Board from './board';
import GameState from '../states/game-state';


export default class Unit extends Sprite {
  private state: GameState;
  private board: Board;
  data: IUnitData;


  constructor(state: GameState, data: IUnitData) {
    const position = state.board.getXYFromRowCol(data.row, data.col);
    super(state.game, position.x, position.y, data.asset);
    this.state = state;
    this.board = state.board;
    this.data = data;
    this.anchor.setTo(0.5);
  }

  playTurn() {
    if (this.data.isPlayer)
      this.showMovementOptions();
    else
      this.aiEnemyMovement();
  }

  aiEnemyMovement() {
    const tile = this.board.getFromRowCol(this.data.row, this.data.col);
    const neighbours = this.board.getAdjacent(tile, { blocked: false });
    const withEnemies = neighbours.filter((tile: Sprite) => {
      let found = false;

      this.state.playerUnits.forEachAlive((unit: Unit) => {
        if (tile.data.row === unit.data.row && tile.data.col === unit.data.col)
          found = true;
      }, this);

      return found;
    });

    const target = withEnemies[0] || neighbours[Math.floor(Math.random()  * neighbours.length)];
    this.moveUnit(target);
  }

  showMovementOptions() {
    if (this.state.uiBlocked) return;

    const tile = this.board.getFromRowCol(this.data.row, this.data.col);
    const neighbours = this.board.getAdjacent(tile, { blocked: false });
    neighbours.forEach((tile: Sprite) => {
      tile.alpha = 0.7;
      tile.events.onInputDown.add(this.moveUnit, this);
    });
  }

  moveUnit(tile: Sprite) {
    this.state.clearSelection();
    this.state.uiBlocked = true;
    const position = this.board.getXYFromRowCol(tile.data.row, tile.data.col);
    const movement = this.game.add.tween(this);
    movement.to(position, 200);
    movement.onComplete.add(() => {
      this.state.uiBlocked = false;
      this.data.row = tile.data.row;
      this.data.col = tile.data.col;

      this.checkBattle();
      this.state.prepareNextUnit();
    }, this);
    movement.start();
  }

  attack(enemy: Unit) {
    enemy.data.health -= this.getDamage(enemy);
    this.data.health -= enemy.getDamage(this);

    if (enemy.data.health <= 0)
      enemy.kill();

    if (this.data.health <= 0)
      this.kill(); 
  }

  private checkBattle() {
    const rivals = this.data.isPlayer ? this.state.enemyUnits : this.state.playerUnits;
    let enemy: Unit;

    rivals.forEachAlive((unit: Unit) => {
      if (this.data.row === unit.data.row && this.data.col === unit.data.col)
        enemy = unit;
    }, this);

    while (enemy && this.alive && enemy.alive)
      this.attack(enemy);
  }

  private getDamage(attacked: Unit) {
    return Math.max(0, this.data.attack * Math.random() - attacked.data.defense * Math.random());
  }
}


export interface IUnitData {
  asset: string;
  isPlayer: boolean;
  row: number;
  col: number;
  attack: number;
  defense: number;
  health: number;
}