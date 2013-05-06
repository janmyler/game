/* global Quintus:false */
Quintus.GameLevels = function(Q) {
	// returns x position for specified tile
	Q.getX = function(tiles, col) {
		return 0.5 * tiles.p.tileW + tiles.p.tileW * col;
	};

	// returns y position for specified tile
	Q.getY = function(tiles, row) {
		return 0.5 * tiles.p.tileH + tiles.p.tileH * row;
	};

	// returns x and y positions for specified tile
	Q.getPos = function(tiles, row, col) {
		return {
			x: Q.getX(tiles, col),
			y: Q.getY(tiles, row)
		};
	};

	// adds a figure/character into the stage and enables the viewport following
	Q.addFigure = function(stage, figure) {
		stage.insert(figure);
		stage.on('destroyed', function() {
			figure.destroy();
		});
		stage.add('viewport').follow(figure);
	};

	// creates the collision layer for the specified level
	Q.createLevel = function(level) {
		var tiles = new Q.TileLayer({
			dataAsset: level + '.json',
			sheet: 'tiles',
			tileW: 64
		});

		tiles.collidableTile = function(tileNum) {
			var cTiles = [0, 1, 8, 9, 11, 15, 17, 19, 20, 21, 22, 23, 26, 27, 28];
			return cTiles.indexOf(tileNum) < 0;
		};

		return tiles;
	};

	// Background scene
	Q.scene('bgScene', function(stage) {
		var tiles = Q.createLevel('level0'),
			character = new Q.Character({ vx: 90, x: Q.getX(tiles, 2), y: Q.getY(tiles, 1) });

		// add a simple bounce for the character
		character.del('platformerControls');
		character.add('aiBounce');

		// complete the scene
		stage.insert(new Q.Repeater({ asset: "stars.png", speedX: 0.2, speedY: 1 }));
		stage.collisionLayer(tiles);
		Q.addFigure(stage, character);
	});

	// Main menu scene
	Q.scene('mainMenu', function(stage) {
		var cont = stage.insert(new Q.UI.Container({
			x: Q.width / 2,
			y: Q.height / 6,
			fill: 'rgba(0,0,0,.4)',
			border: 1
		}));

		var butStart = cont.insert(new Q.UI.Button({
			x: 0, y: 0,
			w: 160,
			fill: '#fff',
			label: 'Start Game',
			highlight: '#acd373'
		}));

		var butHelp = cont.insert(new Q.UI.Button({
			x: 0, y: 60,
			w: 160,
			fill: '#fff',
			label: 'Help',
			highlight: '#acd373'
		}));

		// add paddings
		cont.fit(20, 30);

		// button callbacks
		butStart.on('click', function() {
			Q.clearStages();
			Q.stageScene('level1');
			Q.stageScene('hud', 1);
		});

		butHelp.on('click', function() {
			Q.stageScene('helpMenu', 1);
		});

		// play audio
		Q.audio.play('music.mp3', { loop: true });
	});

	// Help scene
	Q.scene('helpMenu', function(stage) {
		var cont = stage.insert(new Q.UI.Container({
			x: Q.width / 2,
			y: Q.height / 6,
			fill: 'rgba(0,0,0,.4)',
			border: 1
		}));

		var helpKeyboard = 'Move: arrow keys\nFire: space\nFullscreen: F',
			helpTouch = 'Move: joypad\nFire: F\nJump: J';

		cont.insert(new Q.UI.Text({
			color: '#fff',
			label: (window.orientation !== undefined) ? helpTouch : helpKeyboard
		}));

		cont.insert(new Q.UI.Button({
			x: 0, y: 140,
			w: 160,
			fill: '#fff',
			label: 'Back',
			highlight: '#acd373'
		})).on('click', function() {
			Q.stageScene('mainMenu', 1);
		});

		// add paddings
		cont.fit(20, 30);
	});

	// HUD scene
	Q.scene('hud', function(stage) {
		// TODO: HUD scene code
	});

	Q.scene('level1', function(stage) {
		var tiles = Q.createLevel('level1'),
			character = new Q.Character({ x: Q.getX(tiles, 21), y: Q.getY(tiles, 22) });

		// background repeaters
		stage.insert(new Q.Repeater({ asset: "stars.png", speedX: 0.1, speedY: 1 }));
		stage.insert(new Q.StaticRepeater({ asset: "moon.jpg", speedX: 0.1, y: Q.getY(tiles, 11), repeatW: 9999 }));
		stage.insert(new Q.StaticRepeater({ asset: "waves.png", speedX: 0.2, repeatW: 3000, y: Q.getY(tiles, 6) }));
		stage.insert(new Q.StaticRepeater({ asset: "mountains.png", speedX: 0.4, y: Q.getY(tiles, 20) }));
		stage.insert(new Q.StaticRepeater({ asset: "buildings.png", speedX: 0.7, y: Q.getY(tiles, 18) + 24, repeatW: 1800 }));

		// collision layer
		stage.collisionLayer(tiles);

		// character
		Q.addFigure(stage, character);

		// enemies
		// TODO: add enemies

		// powerups'n'stuff
		stage.insert(new Q.Ship({ x: Q.getX(tiles, 19) + 0.5 * tiles.p.tileW, y: Q.getY(tiles, 19) + 0.5 * tiles.p.tileH }));
		// TODO: add stuff
	});

	// TODO: further levels
};
