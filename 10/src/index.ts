/// <reference path="../node_modules/phaser/typescript/phaser.comments.d.ts"/>
import { Game, AUTO } from 'phaser';
import BootState from './states/boot-state';
import PreloadState from './states/preload-state';
import GameState from './states/game-state';

window.addEventListener('load', () => gameStart());


function gameStart() {
  const game = new Game(1080, 640, Phaser.AUTO);
  game.state.add('Boot', new BootState());
  game.state.add('Preload', new PreloadState());
  game.state.add('Game', new GameState());
  game.state.start('Boot');
  (<any>window).game = game;
}
