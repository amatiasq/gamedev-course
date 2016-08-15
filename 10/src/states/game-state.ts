import {
  State,
  CursorKeys,
} from 'phaser';


export default class GameState extends State {
  private cursors: CursorKeys;

  init() {
    this.game.physics.arcade.gravity.y = 1000;
    this.cursors = this.game.input.keyboard.createCursorKeys();
  }

  create() {
    // TODO
  }

  update() {
    // TODO
  }

}
