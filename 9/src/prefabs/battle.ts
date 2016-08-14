import Sprite = Phaser.Sprite;
import Game = Phaser.Game;


export default class Battle {

  constructor(public game: Game) {}

  attack(attacker: Sprite, attacked: Sprite) {
    const damage = Math.max(0, attacker.params.attack * Math.random() - attacked.params.defense * Math.random());
    const prev = attacked.params.health;
    attacked.params.health -= damage;
    console.log('DAMAGE', prev, damage, attacked.params.health);

    var tween = this.game.add.tween(attacked);
    tween.to({ tint: 0xFF0000 }, 200);
    tween.onComplete.add(() => attacked.tint = 0xFFFFFF);
    tween.start();

    if (attacked.params.health <= 0)
      attacked.kill();
  }

}