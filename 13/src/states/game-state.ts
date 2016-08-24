import State = Phaser.State;
import Sprite = Phaser.Sprite;


export default class GameState extends State {
  private playerData: IPlayerData;
  private roomData: IRoomData;
  private panel: Sprite;

  init(playerData: IPlayerData) {
    const defaultRoom = 'livingroom';
    this.playerData = playerData || { room: defaultRoom };
    this.playerData.room = this.playerData.room || defaultRoom;
  }

  create() {
    this.panel = this.add.sprite(0, 270, 'panel');
    this.loadRoom();
  }

  update() {
    // TODO
  }

  private loadRoom() {
    this.roomData = JSON.parse(this.cache.getText(this.playerData.room));
    this.add.sprite(0, 0, this.roomData.background);
  }

}


interface IPlayerData {
  room: string,
}

interface IRoomData {
  background: string,
}