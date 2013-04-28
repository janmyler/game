/**
 * Main file...
 */
/* global Kinetic: false */
(function() {
	"use strict";

	var stage = new Kinetic.Stage({
			container: 'container',
			width: 800,
			height: 600
		}),
		layer1 = new Kinetic.Layer(),
		layer2 = new Kinetic.Layer(),
		rect1 = new Kinetic.Rect({
			x: 200,
			y: 100,
			width: 200,
			height: 100,
			fill: 'gray',
			stroke: 'black',
			strokeWidth: 2
		}),
		rect2 = new Kinetic.Rect({
			x: 230,
			y: 120,
			width: 200,
			height: 100,
			fill: 'red',
			stroke: 'black',
			strokeWidth: 2
		}),
		rect3 = new Kinetic.Rect({
			x: 260,
			y: 140,
			width: 200,
			height: 100,
			fill: 'green',
			stroke: 'black',
			strokeWidth: 2
		}),
		rect2_1 = new Kinetic.Rect({
			x: 240,
			y: 160,
			width: 300,
			height: 100,
			fill: 'purple',
			stroke: 'brown'
		}),
		rect2_2 = new Kinetic.Rect({
			x: 260,
			y: 180,
			width: 300,
			height: 100,
			fill: 'cyan',
			stroke: 'brown'
		}),
		rect2_3 =new Kinetic.Rect({
			x: 280,
			y: 200,
			width: 300,
			height: 100,
			fill: 'lime',
			stroke: 'brown'
		});


		layer1.add(rect1);
		layer1.add(rect2);
		layer1.add(rect3);
		layer2.add(rect2_3);
		layer2.add(rect2_2);
		layer2.add(rect2_1);
		stage.add(layer2);
		stage.add(layer1);
})();
