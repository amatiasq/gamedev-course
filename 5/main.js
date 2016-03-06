var game = new Phaser.Game('100%', '100%', Phaser.AUTO);
game.state.add('GameState', GameState);
game.state.start('GameState');
