/// <reference path="../node_modules/phaser/typescript/phaser.comments.d.ts" />
import { Game, AUTO } from 'phaser';
import BootState from './states/boot-state';
import PreloadState from './states/preload-state';
import GameState from './states/game-state';


window.addEventListener('load', () => gameStart());


function gameStart() {
  const size = getLandsacapeDimensions(700, 350);
  const game = new Game(size.width, size.height, AUTO);
  game.state.add('Boot', new BootState());
  game.state.add('Preload', new PreloadState());
  game.state.add('Game', new GameState());
  game.state.start('Boot');
  (<any>window).game = game;
}


function getLandsacapeDimensions(maxWidth: number, maxHeight: number): ISize {
  const x = window.innerWidth * window.devicePixelRatio;
  const y = window.innerHeight * window.devicePixelRatio;
  let width = Math.max(x, y);
  let height = Math.min(x, y);
  let ratio = 1;

  if (width > maxWidth)
    ratio = maxWidth / width;

  if (height > maxHeight)
    ratio = maxHeight / height;

  width *= ratio;
  height *= ratio;

  return { width, height };
}


interface ISize {
  width: number;
  height: number;
}
