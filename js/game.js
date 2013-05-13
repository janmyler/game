/* global Quintus:false */
(function() {
	'use strict';

	// fullscreen/mute toggle listener
	window.addEventListener('keydown', function(e) {
		if (e.keyCode === 70) { // f key
			var elem = document.getElementById('quintus');

			// request fullscreen if available
			if (elem.requestFullScreen) {
				elem.requestFullScreen();
			} else if (elem.mozRequestFullScreen) {
				elem.mozRequestFullScreen();
			} else if (elem.webkitRequestFullScreen) {
				elem.webkitRequestFullScreen();
			}
		} else if (e.keyCode === 77) { // m key
			Q.state.set('mute', !Q.state.get('mute'));
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
		'level1.json',
		'game_music.mp3',
		'menu_music.mp3'
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

		// implicitly enable sounds
		Q.state.set('mute', false);

		// show the entry scene
		Q.stageScene('bgScene', 0);
		Q.stageScene('mainMenu', 1);

		// sound muting callback
		Q.state.on('change.mute', Q.muting);
	}, {
		progressCallback: function(loaded, total) {
			var elem = document.getElementById('loading-progress');
			elem.style.width = Math.floor(loaded / total * 100) + '%';
		}
	});

	window.Q = Q;
	// Q.debug = true;
})();
