/* global Quintus:false */
(function() {
	'use strict';

	// fullscreen toggle listener
	window.addEventListener('keydown', function(e) {
		if (e.keyCode !== 70) {	// f key
			return;
		}

		var elem = document.getElementById('quintus');

		// request fullscreen if available
		if (elem.requestFullScreen) {
			elem.requestFullScreen();
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullScreen) {
			elem.webkitRequestFullScreen();
		}
	}, false);

	// game definition
	var Q = Quintus({
			imagePath: 'assets/img/',
			audioPath: 'assets/sound/',
			dataPath: 'assets/data/'
		})
		.setup({
			maximize: true
		})
		.include([
			'Sprites',
			'Anim',
			'Audio',
			'Scenes',
			'2D',
			'Input',
			'UI',
			'Touch',
			'GameSprites',
			'GameFigures',
			'GameLevels'
		])
		.enableSound()
		.touch();

	// Q.Sprite.extend('Player', {
	// 	init: function(p) {
	// 		this._super(p, {
	// 			color: 'green',
	// 			x: 20,
	// 			y: 20,
	// 			w: 50,
	// 			h: 50,
	// 			z: 30,
	// 			points: [
	// 				[0, 25],
	// 				[17, 17],
	// 				[25, 0],
	// 				[17, -17],
	// 				[0, -25],
	// 				[-17, -17],
	// 				[-25, 0],
	// 				[-17, 17]
	// 			]
	// 		});
	// 	},
	// 	draw: function(ctx) {
	// 		ctx.fillStyle = this.p.color;
	// 		ctx.beginPath();
	// 		ctx.arc(0, 0, this.p.w/2 , 0, 2 * Math.PI, false);
	// 		ctx.fill();
	// 	}
	// });
	// Q.Sprite.extend("Block", {
	// 	init: function(p) {
	// 		this._super(p, {
	// 			color: "gray",
	// 			w: 500,
	// 			h: 20,
	// 			x: 50,
	// 			y: 400
	// 		});
	// 	},
	// 	draw: function(ctx) {
	// 		ctx.fillStyle = this.p.color;
	// 		ctx.fillRect(-this.p.cx, -this.p.cy, this.p.w, this.p.h);
	// 	}
	// });
	// Q.component("pistol", {
	// 	added: function() {
	// 		console.log("Pistol added");
	// 		console.log(this);

	// 	},
	// 	refillAmmo: function() {
	// 		this.entity.p.ammo = 60;
	// 		console.log(this);
	// 	},
	// 	extend: {
	// 		fire: function() {
	// 			if (this.p.ammo > 0) {
	// 				this.p.ammo -= 1;
	// 				console.log("FIREEEEE!");
	// 				console.log(this.p);
	// 				console.log(this);
	// 				player.trigger("fired");
	// 			}
	// 		},
	// 		reload: function() {
	// 			this.p.ammo = 10;
	// 		}
	// 	}
	// });


	// Q.UI.Text.extend("Score", {
	// 	init: function(p) {
	// 		this._super({
	// 			label: "score: 0",
	// 			x: 0,
	// 			y: 0
	// 		});

	// 		Q.state.on("change.score", this, "score");
	// 	},
	// 	score: function(score) {
	// 		this.p.label = "score: " + score;
	// 	}
	// });

	Q.scene("scene1",function(stage) {
		var player = new Q.Player();
		player.add("pistol");
		player.add('2d, platformerControls');
		player.on("fired", function() {
			console.log('Player fired like a maniac!');
		});
		window.player = player;
		stage.insert(new Q.Cloud({x: 100, y: 100, speed: 20, startX: 500, endX: -500}));
		stage.insert(new Q.Cloud({x: 600, y: 50, speed: 10, startX: 500, endX: -500}));
		stage.insert(new Q.Repeater({ asset: "waves.png", repeatY: false, speedX: 0.5, speedY: 0.5 }));
		stage.insert(new Q.Block());
		stage.insert(new Q.Block({y: 380, x: 400}));
		stage.insert(new Q.Block({y: 300, x: 200, w: 200}));
		stage.insert(new Q.Player({
			color: 'gray',
			y: 420,
			x: 500,
			w: 200,
			points: [
				[0, 100],
				[70, 70],
				[100, 0],
				[70, -70],
				[0, -100],
				[-70, -70],
				[-100, 0],
				[-70, 70]
			]
		}));
		stage.insert(player);
	});

	Q.scene("end", function(stage) {
		var label = new Q.UI.Text({
			x: Q.width / 2,
			y: Q.height / 2,
			label: stage.options.text
		});

		stage.insert(label);
	});


	// asset loading and game launch
	Q.load([
		'buildings.png',
		'character.png',
		'cloud1.png',
		'cloud2.png',
		'moon.jpg',
		'mountains.png',
		'stars.png',
		'tiles.png',
		'waves.png',
		'character.json',
		'level0.json',
		'level1.json',
		'music.mp3'
	], function() {
		document.getElementById('loading').style.display = 'none';
		// config controls
		if (window.orientation !== undefined) {
			Q.input.joypadControls({
			  inputs: ['', 'right', '', 'left']
			});

			Q.input.touchControls({
			  controls: [
			    [],
			    [],
			    [],
			    ['fire', 'F'],
			    ['action', 'J'],
			  ]
			});
		} else {
			Q.input.keyboardControls();
		}

		// prepare the sheets
		Q.sheet('tiles', 'tiles.png', { tilew: 64, tileh: 32 });
		Q.compileSheets('character.png', 'character.json');

		// show the entry scene
		Q.stageScene('bgScene', 0);
		Q.stageScene('mainMenu', 1);
	}, {
		progressCallback: function(loaded, total) {
			var elem = document.getElementById('loading-progress');
			elem.style.width = Math.floor(loaded/total*100) + '%';
		}
	});

	window.Q = Q;
	// Q.debug = true;
})();
