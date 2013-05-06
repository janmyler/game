/* global Quintus:false */
Quintus.GameFigures = function(Q) {
	// Character animations
	Q.animations('character', {
		'run_right': { frames: [2, 3], rate: 1/4 },
		'run_left': { frames: [0, 1], rate: 1/4 },
		'stand_right': { frames: [2], rate: 1/4 },
		'stand_left': { frames: [0], rate: 1/4 }
	});

	// Character class
	Q.Sprite.extend('Character', {
		init: function(p) {
			this._super(p, {
				sprite: 'character',
				sheet: 'character',
				gravity: 0.4,
				points: [[-15,-25],[15,-25],[15,35],[-15,35]]
			});

			this.add('2d, platformerControls, animation');

			this.on('hit.sprite', function(collision) {
				// TODO: code for collisions
			});
		},
		step: function(dt) {
			if (this.p.vx > 0) {
				this.play('run_right');
			} else if (this.p.vx < 0) {
				this.play('run_left');
			} else {
				this.play('stand_' + this.p.direction);
			}
		}
	});

	// Enemy animations
	Q.animations('enemy', {
		// TODO: animations...
	});

	// Enemy class
	Q.Sprite.extend('Enemy', {
		init: function(p) {
			this._super(p, {
				sprite: 'enemy',
				sheet: 'enemy',
				type: Q.SPRITE_ENEMY,
				collisionMask: Q.SPRITE_ACTIVE | Q.SPRITE_DEFAULT,
				vx: Math.floor(Math.random() * 201) + 100
			});

			this.add('2d, aiBounce');

			// TODO: events... collisions etc
		}
	});
};
