import { Group } from 'phaser';


export default class Pool extends Group {

  private creator : Function;


  constructor(game : Phaser.Game, creator : Function) {
    super(game);
    this.creator = creator;
  }


  get(...args : any[]) {
    let entity = this.getFirstDead(false) || this.creator();
    entity.reset(...args);
    this.add(entity);
    return entity;
  }
}
