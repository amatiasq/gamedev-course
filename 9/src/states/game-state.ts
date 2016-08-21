import Tilemap = Phaser.Tilemap;
import TilemapLayer = Phaser.TilemapLayer;
import State = Phaser.State;
import CursorKeys = Phaser.CursorKeys;
import Player from "../prefabs/player";
import ScreenControls from "../plugins/screen-controls";
import Group = Phaser.Group;
import Item from "../prefabs/item";
import Text = Phaser.Text;
import Enemy from "../prefabs/enemy";
import Battle from "../prefabs/battle";
import Sprite = Phaser.Sprite;
import BitmapData = Phaser.BitmapData;

const PLAYER_SPEED = 90;


export default class GameState extends State {
  private level: string;
  private cursors: CursorKeys;
  private map: Tilemap;
  private backgroundLayer: TilemapLayer;
  private collisionLayer: TilemapLayer;
  private player: Player;
  private screenControls: ScreenControls;
  private items: Group;
  private goldLabel: Text;
  private attackLabel: Text;
  private defenseLabel: Text;
  private enemies: Group;
  private battle: Battle;
  private questsPanelGroup: Group;
  private questInfo: Text;
  private uiBlocked: boolean;

  init(level: string) {
    this.level = level || 'map1';
    this.game.physics.arcade.gravity.y = 0;
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.screenControls = this.game.plugins.add(ScreenControls);
  }

  create() {
    this.loadLevel();

    const playerData = this.findObjectsByType('player', this.map, 'objectsLayer')[0];
    this.player = new Player(this, playerData.x, playerData.y, {
      items: [],
      health: 25,
      attack: 20,
      defense: 8,
      gold: 100,
      quests: [
        {
          name: 'Find the Magic Scroll',
          code: 'magic-scroll',
          isCompleted: false,
        }, {
          name: 'Find the Helmet of the Gods',
          code: 'gods-helmet',
          isCompleted: false,
        }
      ]
    });

    this.add.existing(this.player);
    this.items = this.loadType('item', Item);
    this.enemies = this.loadType('enemy', Enemy);
    this.battle = new Battle(this.game);
    this.game.camera.follow(this.player);
    this.initGui();
  }

  loadType(type: string, Class: Function): Group {
    const group = this.add.group();

    this
      .findObjectsByType(type, this.map, 'objectsLayer')
      .forEach((element: any) => {
        group.add(new Class(this, element.x, element.y, element.properties.asset, Object.create(element.properties)));
      });

    return group;
  }

  update() {
    this.game.physics.arcade.collide(this.player, this.enemies, this.attack, null, this);
    this.game.physics.arcade.collide(this.player, this.collisionLayer);
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);

    this.player.body.velocity.setTo(0);

    if (this.uiBlocked) return;

    if (this.cursors.up.isDown || this.player.buttons.up)
      this.player.body.velocity.y = -PLAYER_SPEED;

    if (this.cursors.down.isDown || this.player.buttons.down)
      this.player.body.velocity.y = PLAYER_SPEED;

    if (this.cursors.left.isDown || this.player.buttons.left) {
      this.player.body.velocity.x = -PLAYER_SPEED;
      this.player.scale.setTo(1, 1);
    }

    if (this.cursors.right.isDown || this.player.buttons.right) {
      this.player.body.velocity.x = PLAYER_SPEED;
      this.player.scale.setTo(-1, 1);
    }

    if (this.game.input.activePointer.isUp)
      this.screenControls.stopMovement();

    if (this.player.body.velocity.isZero()) {
      this.player.animations.stop();
      this.player.frame = 0;
    }
    else {
      this.player.play('walk');
    }
  }

  private collect(player: Player, item: Item) {
    player.collectItem(item);
    item.kill();
    this.updateStats();

    if (player.isGameCompleted())
      this.game.state.start('Game', true, false, 'map2');
  }

  private attack(player: Player, enemy: Enemy) {
    this.battle.attack(player, enemy);
    this.battle.attack(enemy, player);

    if (player.params.health <= 0)
      this.gameOver();
  }

  private loadLevel() {
    this.map = this.add.tilemap(this.level);
    this.map.addTilesetImage('terrains', 'tilesheet');
    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    this.collisionLayer = this.map.createLayer('collisionLayer');
    this.game.world.sendToBack(this.backgroundLayer);
    this.map.setCollisionBetween(1, 16, true, 'collisionLayer');
    this.collisionLayer.resizeWorld();
  }

  private gameOver() {
    this.game.state.start('Game', true, false, this.level);
  }

  updateStats() {
    this.goldLabel.text = String(this.player.params.gold);
    this.attackLabel.text = String(this.player.params.attack);
    this.defenseLabel.text = String(this.player.params.defense);
  }

  private initGui() {
    this.goldLabel = this.addPlayerIcon('coin', 10, 30);
    this.attackLabel = this.addPlayerIcon('sword', 70, 90);
    this.defenseLabel = this.addPlayerIcon('shield', 130, 150);

    this.screenControls.setup(this.player, {
      up: true,
      down: true,
      left: true,
      right: true,
      upleft: true,
      upright: true,
      downleft: true,
      downright: true,
      action: true,
    });

    const questIcon = this.add.sprite(this.game.width - 30, 10, 'quest');
    questIcon.fixedToCamera = true;
    questIcon.inputEnabled = true;
    questIcon.events.onInputDown.add(this.showQuests, this);

    const overlay = this.add.bitmapData(this.game.width, this.game.height);
    overlay.ctx.fillStyle = '#000';
    overlay.ctx.fillRect(0, 0, this.game.width, this.game.height);

    const questsPanel = new Sprite(this.game, 0, 0, overlay);
    questsPanel.alpha = 0.8;
    questsPanel.fixedToCamera = true;
    questsPanel.inputEnabled = true;
    questsPanel.events.onInputDown.add(this.hideQuests, this);

    const style = { font: '14px Arial', fill: '#fff' }
    this.questInfo = new Text(this.game, 50, 50, '', style);
    this.questInfo.fixedToCamera = true;

    this.questsPanelGroup = this.add.group();
    this.questsPanelGroup.y = this.game.height;
    this.questsPanelGroup.add(questsPanel);
    this.questsPanelGroup.add(this.questInfo);
  }

  private showQuests() {
    this.uiBlocked = true;
    const tween = this.add.tween(this.questsPanelGroup);
    tween.to({ y: 0 }, 150);
    tween.start();

    let questText = 'QUESTS\n';
    this.player.params.quests.forEach(quest => {
      const isDone = quest.isCompleted ? ' - DONE' : '';
      questText += `${quest.name}${isDone}\n`;
    });
    this.questInfo.text = questText;
  }

  private hideQuests() {
    const tween = this.add.tween(this.questsPanelGroup);
    tween.to({ y: this.game.height }, 150);
    tween.start();
    tween.onComplete.add(() => this.uiBlocked = false);
  }

  private addPlayerIcon(asset: string, xIcon: number, xLabel: number): Text {
    const style = { font: '14px Arial', fill: '#fff' };
    const icon = this.add.sprite(xIcon, 10, asset);
    const label = this.add.text(xLabel, 10, '0', style);
    icon.fixedToCamera = true;
    label.fixedToCamera = true;
    return label;
  }

  private findObjectsByType(type: string, tilemap: Tilemap, layer: string) {
    return tilemap.objects[layer].filter((element: any) => {
      if (element.properties.type !== type)
        return false;

      element.y -= tilemap.tileHeight / 2;
      element.x += tilemap.tileWidth / 2;
      return true;
    });
  }
}
