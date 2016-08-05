import {
  Game,
  Group,
  Sprite,
} from 'phaser';

import Pool from '../prefabs/pool';
const TILE_SIZE = 40;


export default class Platform extends Group {

  constructor(
    game : Game,
    private floorPool : Pool<Sprite>,
    private coinsPool : Pool<Sprite>
  ) {
    super(game);
    this.enableBody = true;
  }


  reset(numTiles : number, x : number, y : number, speed : number) {
    this.alive = true;

    for (var i = 0; i < numTiles; i++)
      this.add(this.floorPool.get(x + i * TILE_SIZE, y));

    this.setAll('body.immovable', true);
    this.setAll('body.allowGravity', false);
    this.setAll('body.velocity.x', speed);

    this.addCoins(speed);
  }


  kill() {
    this.alive = false;
    this.callAll('kill', null);
    this.moveAll(this.floorPool);
  }


  private addCoins(speed : number) {
    const coinsY = 60 + Math.random() + 90;

    this.forEach((tile : Sprite) => {
      const hasCoin = Math.random() <= 0.4;
      if (!hasCoin) return;

      const coin = this.coinsPool.get(tile.x, tile.y - coinsY);
      coin.body.velocity.x = speed;
      coin.body.allowGravity = false;
    }, this);
  }

}
