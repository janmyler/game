/* global Quintus:false */
Quintus.GameSprites = function(Q) {
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
};
