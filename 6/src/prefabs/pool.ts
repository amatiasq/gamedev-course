import { Group } from 'phaser';


interface CreatorFunction<T> {
  () : T;
}


export default class Pool<T> extends Group {

  constructor(
    game : Phaser.Game,
    private creator : CreatorFunction<T>
  ) {
    super(game);
  }


  get(...args : any[]) : T {
    let entity = this.getFirstDead(false) || this.creator();
    entity.reset(...args);
    this.add(entity);
    return entity;
  }

}
