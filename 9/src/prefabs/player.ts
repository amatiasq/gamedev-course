import Sprite = Phaser.Sprite;
import GameState from "../states/game-state";
import Item from "./item";


export default class Player extends Sprite {
  private healthBar: Sprite;
  buttons: {
    up?: boolean;
    down?: boolean;
    left?: boolean;
    right?: boolean;
    [key: string] : boolean;
  };

  constructor(
    private state: GameState,
    x: number,
    y: number,
    public params: PlayerData
  ) {
    super(state.game, x, y, 'player');
    this.anchor.setTo(0.5);
    this.animations.add('walk', [ 0, 1, 0 ], 6, false);
    this.game.physics.arcade.enable(this);

    this.healthBar = new Sprite(this.game, this.x, this.y, 'bar');
    this.healthBar.anchor.setTo(0.5);
    this.game.add.existing(this.healthBar);
  }

  collectItem(item: Item) {
    if (item.params.isQuest) {
      this.params.items.push(item);
      this.checkQuestCompletion(item);
      return;
    }

    this.params.health += item.params.health ? item.params.health : 0;
    this.params.attack += item.params.attack ? item.params.attack : 0;
    this.params.defense += item.params.defense ? item.params.defense : 0;
    this.params.gold += item.params.gold ? item.params.gold : 0;
  }

  isGameCompleted() {
    return this.params.quests.every(quest => quest.isCompleted);
  }

  update() {
    super.update();
    this.refreshHealthBar();
  }

  kill(): Sprite {
    this.healthBar.kill();
    return super.kill();
  }

  private checkQuestCompletion(item: Item) {
    this.params.quests.some(quest => {
      if (quest.code === item.params.questCode) {
        quest.isCompleted = true;
        console.log(quest.name + ' is completed!');
        return true;
      }
    });
  }

  private refreshHealthBar() {
    this.healthBar.x = this.x;
    this.healthBar.y = this.y - 25;
    this.healthBar.scale.setTo(this.params.health, 0.5);
  }
}


export interface PlayerData {
  items: any[],
  quests: QuestData[],
  health: number,
  attack: number,
  defense: number,
  gold: number,
}

interface QuestData {
  name: string,
  code: string,
  isCompleted: boolean,
}