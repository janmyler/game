/* global Quintus:false */
Quintus.GameSprites = function(Q) {

	// Useful for paralax effect repeating only in the horizontal direction
	Q.Repeater.extend('StaticRepeater', {
		init: function(p) {
			this._super(Q._defaults(p, {
				speedY: 1,
				repeatX: true,
				repeatY: false
			}));
		},
		draw: function(ctx) {
			var p = this.p,
				asset = this.asset(),
				sheet = this.sheet(),
				scale = this.stage.viewport ? this.stage.viewport.scale : 1,
				viewX = this.stage.viewport ? this.stage.viewport.x : 0,
				viewY = this.stage.viewport ? this.stage.viewport.y : 0,
				offsetX = p.x + viewX * this.p.speedX,
				offsetY = p.y + viewY * this.p.speedY,
				curX, curY, startX;

			if(p.repeatX) {
				curX = Math.floor(-offsetX % p.repeatW);
				if(curX > 0) { curX -= p.repeatW; }
			} else {
				curX = Math.floor(-offsetX % p.repeatW);
			}
			if(p.repeatY) {
				curY = Math.floor(-offsetY % p.repeatH);
				if(curY > 0) { curY -= p.repeatH; }
			} else {
				curY = p.y - Math.floor(offsetY);
			}
			startX = curX;
			while(curY < Q.height / scale) {
				curX = startX;
				while(curX < Q.width / scale) {
					if(sheet) {
						sheet.draw(ctx,Math.floor(curX + viewX), Math.floor(curY + viewY),p.frame);
					} else {
						ctx.drawImage(asset,Math.floor(curX + viewX),Math.floor(curY + viewY));
					}
					curX += p.repeatW;
					if(!p.repeatX) { break; }
				}
				curY += p.repeatH;
				if(!p.repeatY) { break; }
			}
		}
	});

	// Cloud tween animation
	Q.Sprite.extend('Cloud', {
		firstTime: true,
		init: function(p) {
			var rand = Math.floor(Math.random() * 2) + 1;
			this._super(p, {
				asset: 'cloud' + rand + '.png',
				type: Q.SPRITE_NONE,
				startX: 0,
				speed: Math.ceil(Math.random() * 30) + 10,
				scale: Math.random() + 0.5
			});

			if (!this.p.endX) {
				this.p.endX = Q.width + this.p.w;
			}

			this.add('tween');
			this.move();
		},
		move: function() {
			if (!this.firstTime) {
				this.p.x = this.p.startX;
			} else {
				this.firstTime = false;
			}

			this.animate(
				{ x: this.p.endX },
				Math.abs(this.p.x - this.p.endX) / this.p.speed,
				Q.Easing.Linear,
				{ callback: this.move }
			);
		}
	});

	// Static spaceship sprite
	Q.Sprite.extend('Ship', {
		init: function(p) {
			this._super(p, {
				asset: 'mothership.png',
				type: Q.SPRITE_DEFAULT
			});
		}
	});

	// Static flames sprite
	Q.Sprite.extend('Flames', {
		init: function(p) {
			this._super(p, {
				asset: 'flames.png',
				type: Q.SPRITE_DEFAULT,
				points: [[-35,16],[33,16],[33,15],[-35,15]]
			});

			this.on('hit.sprite', function(col) {
				if (col.obj.isA('Character')) {
					col.obj.trigger('burning');
				}
			});
		}
	});

	// Ammo powerup animation & sprite
	Q.animations('ammo', {
		'bounce': { frames: [0, 1, 2, 1, 0, 3, 4, 3], rate: 1/4 }
	});
	Q.Sprite.extend('Ammo', {
		init: function(p) {
			this._super(p, {
				sprite: 'ammo',
				sheet: 'ammo',
				type: Q.SPRITE_POWERUP
			});

			this.add('animation');
			this.play('bounce');
		}
	});

	// Health powerup animation & sprite
	Q.animations('health', {
		'bounce': { frames: [0, 1, 2, 1, 0, 3, 4, 3], rate: 1/4 }
	});
	Q.Sprite.extend('Health', {
		init: function(p) {
			this._super(p, {
				sprite: 'health',
				sheet: 'health',
				type: Q.SPRITE_POWERUP
			});

			this.add('animation');
			this.play('bounce');
		}
	});

	// Health bar sprite
	Q.Sprite.extend('HealthBar', {
		init: function(p) {
			this._super(p, {
				color: '#9e0b0f',
				x: 60,
				y: 0,
				w: 100,
				h: 14,
				barWidth: 1,
				type: Q.SPRITE_UI
			});

			this.on('update.health', function(health) {
				this.p.barWidth = (health / 100 > 0) ? health / 100 : 0;
			});
		},
		draw: function(ctx) {
			// background first
			ctx.fillStyle = '#fff';
			ctx.fillRect(-this.p.cx, -this.p.cy, this.p.w, this.p.h);

			// now the healthbar itself
			ctx.fillStyle = this.p.color;
			ctx.fillRect(-this.p.cx, -this.p.cy, this.p.w * this.p.barWidth, this.p.h);
		}
	});

	// Character bullet sprite
	Q.Sprite.extend('GreenBullet', {
		init: function(p) {
			this._super(p, {
				color: '#a7de59',
				w: 10,
				h: 6,
				left: true,
				gravity: 0,
				type: Q.SPRITE_PARTICLE,
				collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_ENEMY
			});

			this.add('2d');

			// hit when collides with wall/static sprites
			this.on('hit', function() {
				this.destroy();
			});

			// do stuff when collides with enemies
			this.on('hit.sprite', function(col) {
				if (col.obj.isA('Enemy')) {
					col.obj.trigger('shot');
				}
			});
		},
		draw: function(ctx) {
			// destroy when out of viewport
			var boundary = Q.stage(0).viewport.centerX;
			boundary += this.p.left ? (-Q.width / 2) : (Q.width / 2);

			if (this.p.left && this.p.x < boundary || !this.p.left && this.p.x > boundary) {
				this.destroy();
			}

			ctx.fillStyle = this.p.color;
			this.p.x += this.p.left ? -5 : 5;
			ctx.fillRect(-this.p.cx, -this.p.cy, this.p.w, this.p.h);
		}
	});

	// Enemy bullet sprite
	Q.Sprite.extend('RedBullet', {
		init: function(p) {
			this._super(p, {
				color: '#f00',
				w: 8,
				h: 6,
				left: true,
				gravity: 0,
				type: Q.SPRITE_PARTICLE,
				collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_ACTIVE
			});

			this.add('2d');

			// hit when collides with wall/static sprites
			this.on('hit', function() {
				this.destroy();
			});

			// do stuff when collides with enemies
			this.on('hit.sprite', function(col) {
				if (col.obj.isA('Character')) {
					col.obj.trigger('shot');
				}
			});
		},
		draw: function(ctx) {
			// destroy when out of viewport
			var boundary = Q.stage(0).viewport.centerX;
			boundary += this.p.left ? (-Q.width / 2) : (Q.width / 2);

			if (this.p.left && this.p.x < boundary || !this.p.left && this.p.x > boundary) {
				this.destroy();
			}

			ctx.fillStyle = this.p.color;
			this.p.x += this.p.left ? -5 : 5;
			ctx.fillRect(-this.p.cx, -this.p.cy, this.p.w, this.p.h);
		}
	});
};
