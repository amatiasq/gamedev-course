import State = Phaser.State;
import Board from "../prefabs/board";


export default class GameState extends State {
  private map: IMap;
  private board: Board;

  create() {
    this.map = <IMap>JSON.parse(this.cache.getText('map'));
    this.board = new Board(this, this.map.grid);
  }

  update() {
    // TODO
  }

}


interface IMap {
  grid: number[][],
}