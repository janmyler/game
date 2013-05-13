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
				fired: 1,
				dead: false,
				points: [[-15,-25],[15,-25],[15,35],[-15,35]],
				type: Q.SPRITE_ACTIVE,
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
					Q.sound('character_heal');
				} else if (col.obj.isA('Ammo')) {
					this.reload();
					col.obj.destroy();
					Q.sound('character_reload');
				} else if (col.obj.isA('Enemy')) {
					this.p.health -= 1;
					this.updateState();
				}
			});

			// ouch! it hurts
			this.on('shot', function() {
				this.p.health -= 20;
				this.updateState();
			});

			// stops the jumping mode
			this.on('bump.bottom', this, 'landed');

			// what to do when dead
			this.on('died', function() {
				Q.sound('character_death');
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
				Q.sound('character_jump');
			}

			// fire as mad! (just five bullets per second)
			this.p.fired += dt;
			if(Q.inputs['fire'] && this.p.fired >= 0.2) {
				this.fire();
				this.p.fired = 0;
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
			Q('HealthBar', 1).first().trigger('update.health', this.p.health);
			if (this.p.health <= 0) {
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
		'shoot_right': { frames: [1], loop: false },
		'shoot_left': { frames: [0], loop: false }
	});

	// Enemy class
	Q.Sprite.extend('Enemy', {
		init: function(p) {
			this._super(p, {
				vx: 80,
				health: 100,
				sprite: 'enemy',
				sheet: 'enemy',
				type: Q.SPRITE_ENEMY,
				fired: Math.random(),
				points: [[-18,-43],[18,-43],[18,48],[-18,48]],
				collisionMask: Q.SPRITE_ACTIVE | Q.SPRITE_DEFAULT
			});

			this.add('2d, aiBounce, animation');

			this.on('shot', function() {
				this.p.health -= 35;
				if (this.p.health <= 0) {
					Q.sound('robot_death_' + Math.ceil(Math.random() * 2));
					this.destroy();
				}
			});
			this.on('hit', function(col) {
				// prevents bouncing off the bullet or character
				if (col.obj.isA('GreenBullet') || col.obj.isA('Character')) {
					if (col.normalX > 0.3) {
						this.p.vx *= -1;
					}
					if (col.normalX < -0.3) {
						this.p.vx *= -1;
					}
				}
			});
		},
		step: function(dt) {
			// time to shoot?
			this.p.fired += dt;
			if (this.p.fired >= 2) {
				this.fire();
				this.p.fired = 0;
			}

			// moving animations
			if (this.p.fired >= 0.3) {
				if (this.p.vx > 0) {
					this.play('walk_right');
				} else if (this.p.vx < 0) {
					this.play('walk_left');
				}
			} else {
				this.p.x -= this.p.vx * dt;
			}
		},
		fire: function() {
			var left = this.p.vx < 0;

			// animation
			this.play('shoot_' + (left ? 'left' : 'right'));

			// sound
			if (this.visible()) {
				Q.sound('robot_laser_' + Math.ceil(Math.random() * 2));
			}

			Q.stage(0).insert(new Q.RedBullet({
				x: this.p.x,
				y: this.p.y,
				left: left
			}));
		},
		visible: function() {
			var min = Q.stage(0).viewport.centerX - Q.width / 2,
				max = Q.stage(0).viewport.centerX + Q.width / 2;

			return this.p.x >= min && this.p.x <= max;
		}
	});

	// Gun component
	Q.component('gun', {
		added: function() {
			this.entity.p.ammo = 12;
		},
		extend: {
			fire: function() {
				if (this.p.ammo > 0) {
					this.p.ammo -= 1;
					this.trigger('update.ammo');

					Q.stage(0).insert(new Q.GreenBullet({
						x: this.p.x,
						y: this.p.y,
						left: this.p.direction === 'left'
					}));

					Q.sound('character_shoot');
				}
			},
			reload: function() {
				this.p.ammo += 20;
				this.trigger('update.ammo');
			}
		}
	});
};
