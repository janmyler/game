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
			maximize: 'touch',
			// maximize: true,
			width: 800,
			height: 600
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

	/*Q.Sprite.extend("Block", {
		init: function(p) {
			this._super(p, {
				color: "gray",
				w: 500,
				h: 20,
				x: 50,
				y: 400
			});
		},
		draw: function(ctx) {
			ctx.fillStyle = this.p.color;
			ctx.fillRect(-this.p.cx, -this.p.cy, this.p.w, this.p.h);
		}
	});*/

	// loading of assets and game launch
	Q.load([
		'alert_sign.png',
		'buildings.png',
		'character.png',
		'cloud1.png',
		'cloud2.png',
		'enemy.png',
		'flames.png',
		'moon.jpg',
		'mountains.png',
		'mothership.png',
		'stars.png',
		'tiles.png',
		'ui_icons.png',
		'underground.png',
		'waves.png',
		'character.json',
		'enemy.json',
		'icons.json',
		'level0.json',
		'level1.json'
		// 'music.mp3'
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
					['fire', 'F'],
					['action', 'J']
				]
			});
		} else {
			Q.input.keyboardControls();
		}

		// prepare the sheets
		Q.sheet('tiles', 'tiles.png', { tilew: 64, tileh: 32 });
		Q.compileSheets('character.png', 'character.json');
		Q.compileSheets('enemy.png', 'enemy.json');
		Q.compileSheets('ui_icons.png', 'icons.json');

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
