import { Game, AUTO } from 'phaser';
import BootState from './states/boot-state';
import PreloadState from './states/preload-state';
import GameState from './states/game-state';


window.addEventListener('load', () => gameStart());


function gameStart() {
  const game = new Game(700, 350, AUTO);
  game.state.add('Boot', new BootState());
  game.state.add('Preload', new PreloadState());
  game.state.add('Game', new GameState());
  game.state.start('Boot');
  (<any>window).game = game;
}
