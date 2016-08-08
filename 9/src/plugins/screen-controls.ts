import Plugin = Phaser.Plugin;
import Game = Phaser.Game;
import PluginManager = Phaser.PluginManager;
import Player from "../prefabs/player";
import BitmapData = Phaser.BitmapData;
import Button = Phaser.Button;


export default class ScreenControls extends Plugin {
  private player: Player;
  private buttonBitmap: BitmapData;
  private actionBitmap: BitmapData;

  constructor(game: Game, parent: PluginManager) {
    super(game, parent);
  }

  private square(width: number, height: number, color: string): BitmapData {
    const square = this.game.add.bitmapData(width, height);
    square.ctx.fillStyle = color;
    square.ctx.fillRect(0, 0, width, height);
    return square;
  }

  stopMovement() {
    this.player.buttons = {};
  }

  setup(player: Player, buttons: ButtonsConfig) {
    this.player = player;
    this.player.buttons = this.player.buttons || {};

    const size = 0.08 * this.game.width;
    const margin = 0.25 * size;
    const sizeActionBtn = 1.5 * size;

    this.buttonBitmap = this.square(size, size, '#4BAFE3');
    this.actionBitmap = this.square(size, size, '#C14BE3');

    const upX = margin + size;
    const upY = this.game.height - margin - size * 3;
    const downX = margin + size;
    const downY = this.game.height - margin - size;
    const leftX = margin;
    const leftY = this.game.height - margin - size * 2;
    const rightX = margin + size * 2;
    const rightY = this.game.height - margin - size * 2;

    if (buttons.up)
      this.addButton(upX, upY, 0.5, [ 'up' ]);

    if (buttons.down)
      this.addButton(downX, downY, 0.5, [ 'down' ]);

    if (buttons.left)
      this.addButton(leftX, leftY, 0.5, [ 'left' ]);

    if (buttons.right)
      this.addButton(rightX, rightY, 0.5, [ 'right' ]);

    if (buttons.upleft)
      this.addButton(leftX, upY, 0.3, [ 'up', 'left' ]);

    if (buttons.upright)
      this.addButton(rightX, upY, 0.3, [ 'up', 'right' ]);

    if (buttons.downleft)
      this.addButton(leftX, downY, 0.3, [ 'down', 'left' ]);

    if (buttons.downright)
      this.addButton(rightX, downY, 0.3, [ 'down', 'right' ]);

    if (buttons.action) {
      this.addButton(
        this.game.width - margin - sizeActionBtn,
        this.game.height - margin - size * 2,
        0.5,
        [ 'action' ],
        this.actionBitmap
      )
    }
  }

  private addButton(
    x: number,
    y: number,
    opacity: number,
    properties: string[],
    asset: BitmapData = this.buttonBitmap
  ) {
    //noinspection TypeScriptValidateTypes
    const button = this.game.add.button(x, y, asset);
    button.alpha = opacity;
    button.fixedToCamera = true;
    properties.forEach(property => this.toggleOnClick(button, property));
    return button;
  }

  private toggleOnClick(button: Button, property: string) {
    button.events.onInputDown.add(() => this.player.buttons[property] = true);
    button.events.onInputUp.add(() => this.player.buttons[property] = false);
  }
}


interface ButtonsConfig {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  upleft: boolean;
  upright: boolean
  downleft: boolean;
  downright: boolean;
  action: boolean;
}