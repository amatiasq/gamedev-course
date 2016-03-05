var GameState = {

  create: function() {
    var background = this.add.sprite(0, 0, 'backyard');
    background.inputEnabled = true;
    background.events.onInputDown.add(this.placeItem, this);

    this.pet = this.add.sprite(100, 400, 'pet');
    this.pet.anchor.set(0.5);
    this.pet.props = { health: 100, fun: 100 };
    this.pet.inputEnabled = true;
    this.pet.input.enableDrag();

    this.pet.animations.add('funnyfaces', [1,2,3,2,1], 7, false);

    this.apple = this.add.sprite(72, 570, 'apple');
    this.apple.props = { health: 20 };
    this.candy = this.add.sprite(144, 570, 'candy');
    this.candy.props = { health: -10, fun: 10 };
    this.toy = this.add.sprite(216, 570, 'toy');
    this.toy.props = { fun: 20 };
    this.rotate = this.add.sprite(288, 570, 'rotate');

    this.buttons = [ this.apple, this.candy, this.toy, this.rotate ];
    this.buttons.forEach(function(button) {
      button.anchor.setTo(0.5);
      button.inputEnabled = true;
    }, this);

    this.apple.events.onInputDown.add(this.pickItem, this);
    this.candy.events.onInputDown.add(this.pickItem, this);
    this.toy.events.onInputDown.add(this.pickItem, this);
    this.rotate.events.onInputDown.add(this.rotatePet, this);

    var style = { font: '20px Arial', fill: '#fff' };
    this.add.text(10, 20, 'Health:', style);
    this.add.text(140, 20, 'Fun:', style);

    this.health = this.add.text(80, 20, '', style);
    this.fun = this.add.text(185, 20, '', style);
    this.updateStats();

    this.selectedItem = null;
    this.uiBlocked = false;
    this.isOver = false;

    this.statsDecreaser = this.time.events.loop(Phaser.Timer.SECOND * 5, this.reduceStats, this);
  },

  update: function() {
    var stats = this.pet.props;

    if (stats.health <= 0 || stats.fun <= 0) {
      this.pet.frame = 4;
      this.uiBlocked = true;
      this.gameOver();
    }
  },

  updateStats: function() {
    if (this.isOver) return;
    this.health.text = this.pet.props.health;
    this.fun.text = this.pet.props.fun;
  },

  reduceStats: function() {
    this.pet.props.health -= 10;
    this.pet.props.fun -= 15;
    this.updateStats();
  },

  gameOver: function() {
    this.isOver = true;
    this.time.events.add(2000, function() {
      this.state.start('HomeState', true, false, 'GAME OVER');
    }, this);
  },

  pickItem: function(sprite, event) {
    if (this.uiBlocked) return;
    this.clearSelection();
    sprite.alpha = 0.4;
    this.selectedItem = sprite;
  },

  rotatePet: function(sprite, event) {
    if (this.uiBlocked) return;
    this.uiBlocked = true;
    this.clearSelection();

    sprite.alpha = 0.4;
    var petRotation = this.add.tween(this.pet);
    petRotation.to({ angle: 720 }, 1000);
    petRotation.start();

    petRotation.onComplete.add(function() {
      sprite.alpha = 1;
      this.pet.props.fun += 10;
      this.updateStats();
      this.uiBlocked = false;
    }, this);
  },

  placeItem: function(sprite, event) {
    if (this.uiBlocked || !this.selectedItem) return;
    var x = event.position.x;
    var y = event.position.y;

    var newItem = this.add.sprite(x, y, this.selectedItem.key);
    newItem.anchor.setTo(0.5);
    newItem.props = this.selectedItem.props;

    this.uiBlocked = true;
    var petMovement = this.add.tween(this.pet);
    petMovement.to({ x: x, y: y }, 700);
    petMovement.start(),

    petMovement.onComplete.add(function() {
      if (this.isOver) return;

      newItem.destroy();
      Object.keys(newItem.props).forEach(function(stat) {
        this.pet.props[stat] += newItem.props[stat];
      }, this);

      this.pet.animations.play('funnyfaces');
      this.updateStats();
      this.uiBlocked = false;
    }, this);
  },

  clearSelection: function() {
    this.selectedItem = null;
    this.buttons.forEach(function(button) {
      button.alpha = 1;
    });
  },
};
