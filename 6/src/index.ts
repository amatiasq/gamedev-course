/// <reference path="../node_modules/phaser/typescript/phaser.comments.d.ts" />
import { Game } from 'phaser';
import BootState from './states/boot-state';
import PreloadState from './states/preload-state';
import GameState from './states/game-state';


class MrHop {
  private game: Game;

  constructor() {
    const game = this.game = new Game();
    game.state.add('BootState', BootState);
    game.state.add('PreloadState', PreloadState);
    game.state.add('GameState', GameState);
    game.state.start('BootState');

  }
}

window.addEventListener('load', () => new MrHop());
