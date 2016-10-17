var Curves = (function() {
	'use strict';
	var raf_ID = 0;

	function Shape(points, color) {
		this.points = points;
		this.color = color;
	}

	Shape.prototype.render = function(ctx, width, height) {
		var self = this;
		ctx.save();
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#fff';
		ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
		this.points.forEach(function(point, i) {
			ctx.beginPath();
			ctx.font = '14px Arial';
			ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();
		});
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(this.points[0].x, this.points[0].y);
		this.points.forEach(function(point, i) {
			point.y = point.oldY + Math.sin(point.angle) * 35;
			point.angle += point.speed;
			var nextPoint = self.points[i + 1];
			if (nextPoint) {
				var ctrlPoint = {
					x: (point.x + nextPoint.x) / 2,
					y: (point.y + nextPoint.y) / 2
				};
				ctx.quadraticCurveTo(point.x, point.y, ctrlPoint.x, ctrlPoint.y);
			}
		});
		ctx.lineTo(width, height);
		ctx.lineTo(0, height);
		ctx.fill();

		ctx.restore();
	};

	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');

	var width = window.innerWidth;
	var height = window.innerHeight;

	var colors = [
		'#e67e22', '#d35400', '#e74c3c', '#c0392b', '#f39c12', '#d35400'
	];
	var position = { x: 0, y: height / 2 };
	var shapes = generateShapes(6, height / 2, width / 20);

	function generateShapes(num, yCenter, spacing) {
		var shapes = [];
		for (var i = 0; i < num; i += 1) {
			var points = [];
			var offset = 0;
			for (var x = 0; x <= width + width / 4; x += spacing) {
				var angle = Math.random() * 360;
				if (i === 0) offset = 20 + Math.random() * 40 - 50;
				if (i === 1) offset = 80 + Math.random() * 60 - 50;
				if (i === 2) offset = 110 + Math.random() * 80 - 50;
				if (i === 3) offset = 150 + Math.random() * 100 - 50;
				if (i === 4) offset = 200 + Math.random() * 130 - 50;
				if (i === 5) offset = 250 + Math.random() * 170 - 50;
				offset -= x / 20;
				var point = {
					x: x,
					y: yCenter + offset + 10 + Math.random() * 20,
					oldY: yCenter + offset,
					angle: angle,
					speed: 0.025
				};
				points.push(point);
			}
			var shape = new Shape(points, colors[i]);
			shapes.push(shape);
		}
		console.log(shapes);
		return shapes;
	}

	function init(parent) {

		canvas.width = width;
		canvas.height = height;
		parent.appendChild(canvas);
		ctx.fillStyle = '#111';
		startRender();
		window.onresize = function() {
			resize();
		};
	}
	function render() {
		raf_ID = window.requestAnimationFrame(render);
		ctx.fillRect(0, 0, width, height);
		shapes.forEach(function(shape) {
			shape.render(ctx, width, height);
		});
	}
	function startRender() {
		render();
	}

	function stopRender() {
		window.cancelAnimationFrame(raf_ID);
	}

	function resize() {
		canvas.width = width = window.innerWidth;
		canvas.height = height = window.innerHeight;
	}

	return {
		init: init,
		startRender: startRender,
		stopRender: stopRender
	};

})();

window.onload = function() {
  Curves.init(document.body);
  Curves.startRender();
};
