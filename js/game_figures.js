/* global Quintus:false */
Quintus.GameFigures = function(Q) {
	// Character animations
	Q.animations('character', {
		'run_right': { frames: [2, 3], rate: 1/4 },
		'run_left': { frames: [0, 1], rate: 1/4 },
		'stand_right': { frames: [2], loop: false },
		'stand_left': { frames: [0], loop: false },
		'run_right_fire': { frames: [6, 7], rate: 1/4 },
		'run_left_fire': { frames: [4, 5], rate: 1/4 },
		'stand_right_fire': { frames: [6], loop: false },
		'stand_left_fire': { frames: [4], loop: false },
		'die_left': { frames: [8, 9, 10, 11], rate: 1/6, loop: false, trigger: "died" },
		'die_right': { frames: [15, 14, 13, 12], rate: 1/6, loop: false, trigger: "died" }
	});

	// Character class
	Q.Sprite.extend('Character', {
		init: function(p) {
			this._super(p, {
				sprite: 'character',
				sheet: 'character',
				gravity: 0.4,
				health: 100,
				jumping: false,
				burning: false,
				dead: false,
				points: [[-15,-25],[15,-25],[15,35],[-15,35]],
				collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_ENEMY | Q.SPRITE_POWERUP
			});

			this.add('2d, platformerControls, animation, gun');

			// burning callback
			this.on('burning', function() {
				this.p.health -= 0.5;
				this.p.burning = true;
				this.updateState();
			});

			// update ammo state callback
			this.on('update.ammo', this.updateState);

			// collisions with other sprites
			this.on('hit.sprite', function(col) {
				if (col.obj.isA('Health')) {
					this.p.health = 100;
					this.updateState();
					col.obj.destroy();
				} else if (col.obj.isA('Ammo')) {
					this.reload();
					col.obj.destroy();
				}
			});

			// stops the jumping mode
			this.on('bump.bottom', this, 'landed');

			// what to do when dead
			this.on('died', function() {
				Q.stage().pause();
				Q.stageScene('gameOver', 2);
			});
		},
		step: function(dt) {
			// no more moves after death
			if (this.p.dead) {
				return;
			}

			// triggers the jumping mode
			if (Q.inputs['up'] && !this.p.jumping) {
				this.p.jumping = true;
			}

			// moving animations
			if (this.p.jumping) {
				this.play('stand_' + this.p.direction);
			} else if (this.p.vx > 0) {
				this.play('run_right' + (this.p.burning ? '_fire' : ''));
			} else if (this.p.vx < 0) {
				this.play('run_left' + (this.p.burning ? '_fire' : ''));
			} else {
				this.play('stand_' + this.p.direction + (this.p.burning ? '_fire' : ''));
			}

			// reset burning mode
			this.p.burning = false;

			// y axis check (when fallin' down as a rock)
			if (this.p.y >= 1800 && !this.p.dead) {
				this.p.dead = true;
				this.play('die_' + this.p.direction);
			}
		},
		landed: function() {
			this.p.jumping = false;
		},
		updateState: function() {
			// update health
			if (this.p.health > 0) {
				Q('HealthBar', 1).first().trigger('update.health', this.p.health);
			} else {
				// Zed's dead, baby... Zed's dead x___X
				if (!this.p.dead) {
					this.play('die_' + this.p.direction);
				}
				this.p.dead = true;
			}

			// update ammo
			Q('UI.Text', 1).first().p.label = this.p.ammo.toString();
		}
	});

	// Enemy animations
	Q.animations('enemy', {
		'walk_right': { frames: [12, 13, 14, 15, 16, 17], rate: 1/3 },
		'walk_left': { frames: [6, 7, 8, 9, 10, 11], rate: 1/3 },
		'right_fire': { frames: [1], loop: false },
		'left_fire': { frames: [0], loop: false }
	});

	// Enemy class
	Q.Sprite.extend('Enemy', {
		init: function(p) {
			this._super(p, {
				health: 100,
				sprite: 'enemy',
				sheet: 'enemy',
				type: Q.SPRITE_ENEMY,
				points: [[-18,-43],[18,-43],[18,48],[-18,48]],
				collisionMask: Q.SPRITE_ACTIVE | Q.SPRITE_DEFAULT,
				vx: Math.floor(Math.random() * 101) + 50
			});

			this.add('2d, aiBounce, animation');

			// TODO: events... collisions etc
		},
		step: function(dt) {
			// moving animations
			if (this.p.vx > 0) {
				this.play('walk_right');
			} else if (this.p.vx < 0) {
				this.play('walk_left');
			}
		}
	});

	// Gun component
	Q.component('gun', {
		added: function() {
			this.entity.p.ammo = 0;
		},
		extend: {
			fire: function() {
				if (this.p.ammo > 0) {
					this.p.ammo -= 1;
					this.trigger('update.ammo');
					console.log('fire!');
				}
			},
			reload: function() {
				this.p.ammo += 20;
				this.trigger('update.ammo');
			}
		}
	});
};
