const TILE_SIZE = 40;


export default class Platform extends Phaser.Group {

  private floorPool: Phaser.Group;
  private coinsPool: Phaser.Group;


  constructor(game : Phaser.Game, floorPool : Phaser.Group, coinsPool : Phaser.Group) {
    super(game);
    this.floorPool = floorPool;
    this.coinsPool = coinsPool;
    this.enableBody = true;
  }


  prepare(numTiles : number, x : number, y : number, speed : number) {
    this.alive = true;

    for (var i = 0; i < numTiles; i++)
      this.add(this.getFloor(x + i * TILE_SIZE, y));

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

    this.forEach((tile : Phaser.Sprite) => {
      const hasCoin = Math.random() <= 0.4;
      if (!hasCoin) return;

      let coin = this.coinsPool.getFirstExists(false);

      if (!coin) {
        coin = new Phaser.Sprite(this.game, 0, 0, 'coin');
        this.coinsPool.add(coin);
      }

      coin.reset(tile.x, tile.y - coinsY);
      coin.body.velocity.x = speed;
      coin.body.allowGravity = false;
    }, this);
  }


  private getFloor(x : number, y : number) : Phaser.Sprite {
    let floor = this.floorPool.getFirstExists(false);

    if (floor)
      floor.reset(x, y);
    else
      floor = new Phaser.Sprite(this.game, x, y, 'floor')

    return floor;
  }

}
