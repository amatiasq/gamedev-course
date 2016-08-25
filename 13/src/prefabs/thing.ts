import Sprite = Phaser.Sprite;
import GameState from "../states/game-state";
import Item from "./item";


export default class Thing extends Sprite {
  constructor(private state: GameState, public data: IThingData) {
    super(state.game, data.x, data.y, data.asset);
    this.anchor.setTo(0.5);
    this.inputEnabled = true;
    this.input.pixelPerfectClick = true;
    this.events.onInputDown.add(this.touch, this);
  }

  touch() {
    if (this.data.type === 'door' && this.data.isOpen) {
      const playerData = {
        room: this.data.destination,
        items: <IThingData[]>[],
      };

      this.state.items.forEachAlive((item: Item) => {
        playerData.items.push(item.data);
      }, this);

      this.game.state.start('Game', true, false, playerData);
      return;
    }

    this.state.panelLabel.text = this.data.text;

    if (this.data.type === 'collectable') {
      this.state.addItem(this.data);
      this.kill();
      return;
    }

    const item = this.state.selectedItem;

    if (item && this.data.interactions && this.data.interactions[item.data.id]) {
      const interaction = this.data.interactions[item.data.id];

      if (interaction.text)
        this.state.panelLabel.text = interaction.text;

      if (interaction.asset)
        this.loadTexture(interaction.asset);

      if (interaction.action === 'open-door') {
        this.data.isOpen = true;
        this.state.itemUsed();
      }
    }
  }
}


export interface IThingData {
  id: string,
  asset: string,
  type: string,
  text?: string,
  isOpen?: boolean,
  destination?: string,
  interactions?: IInteraction,
  x: number,
  y: number,
}

export interface IInteraction {
  [id: string]: IInteractionData
}

export interface IInteractionData {
  action?: string,
  asset?: string,
  text?: string,
}