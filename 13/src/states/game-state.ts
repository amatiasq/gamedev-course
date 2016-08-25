import State = Phaser.State;
import Sprite = Phaser.Sprite;
import Group = Phaser.Group;
import Thing from "../prefabs/thing";
import { IThingData } from "../prefabs/thing";
import Text = Phaser.Text;
import Item from "../prefabs/item";


export default class GameState extends State {
  private playerData: IPlayerData;
  private roomData: IRoomData;
  private panel: Sprite;
  private things: Group;
  items: Group;
  selectedItem: Item;
  panelLabel: Text;

  init(playerData: IPlayerData) {
    const defaultRoom = 'livingroom';
    this.playerData = playerData || { room: defaultRoom };
    this.playerData.room = this.playerData.room || defaultRoom;
  }

  create() {
    const style = {
      font: '16px Prstart',
      fill: '#fff',
      align: 'left',
      wordWrap: true,
      wordWrapWidth: 400,
    };

    this.panel = this.add.sprite(0, 270, 'panel');
    this.panelLabel = this.add.text(10, 290, '', style);
    this.items = this.add.group();

    this.loadRoom();
    this.showItems();
  }

  update() {
    // TODO
  }

  addItem(itemData: IThingData) {
    const item = new Item(this, 420 + this.items.length * 80, 310, itemData);
    this.items.add(item);
    return item;
  }

  selectItem(item: Item) {
    const wasSelected = this.selectedItem === item;
    this.clearSelection();

    if (wasSelected)
      return;

    this.selectedItem = item;
    this.selectedItem.alpha = 0.5;
  }

  itemUsed() {
    this.selectedItem.kill();
    this.clearSelection();
  }

  private loadRoom() {
    this.roomData = JSON.parse(this.cache.getText(this.playerData.room));
    this.add.sprite(0, 0, this.roomData.background);

    this.things = this.add.group();
    this.roomData.things.forEach((entry: IThingData) => {
      this.things.add(new Thing(this, entry));
    })
  }

  private clearSelection() {
    if (!this.selectedItem) return;
    this.selectedItem.alpha = 1;
    this.selectedItem = null;
  }

  private showItems() {
    const items = this.playerData.items;
    if (items)
      items.forEach(this.addItem, this);
  }
}


interface IPlayerData {
  room: string,
  items?: IThingData[],
}

interface IRoomData {
  background: string,
  things: IThingData[],
}
