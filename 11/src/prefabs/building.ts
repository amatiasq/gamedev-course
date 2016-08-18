import Sprite = Phaser.Sprite;
import GameState from "../states/game-state";


export default class Building extends Sprite {
  housing: number;
  food: number;
  jobs: number;

  constructor(
    private state: GameState,
    x: number,
    y: number,
    public data: BuildingData
  ) {
    super(state.game, x, y, data.asset);
    this.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this);
    this.food = data.food;
    this.jobs = data.jobs;
    this.housing = data.housing;
  }
}


interface BuildingData {
  asset: string,
  food?: number,
  jobs?: number,
  housing?: number,
}