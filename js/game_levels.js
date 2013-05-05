/* global Quintus:false */
Quintus.GameLevels = function(Q) {
	Q.getX = function(tiles, col) {
		return 0.5 * tiles.p.tileW + tiles.p.tileW * col;
	};

	Q.getY = function(tiles, row) {
		return 0.5 * tiles.p.tileH + tiles.p.tileH * row;
	};

	Q.getPos = function(tiles, row, col) {
		return {
			x: Q.getX(tiles, col),
			y: Q.getY(tiles, row)
		};
	};

	Q.addFigure = function(stage, figure) {
		stage.insert(figure);
		stage.on('destroyed', function() {
			figure.destroy();
		});
		stage.add('viewport').follow(figure);
	};

	Q.createLevel = function(level) {
		return new Q.TileLayer({
			dataAsset: level + '.json',
			sheet: 'tiles',
			tileW: 64
		});
	};

	// TODO: scene definitions
	Q.scene('level1', function(stage) {

	});
};
