/***
 * ANIMATIONS INIT BASES
***/
window.requestAnimFrame = (function (){
	return window.requestAnimationFrame        ||
		window.webkitRequestAnimationFrame     ||
		window.mozRequestAnimationFrame        ||
		function(callback, element){
			window.setTimeout(callback, 1000 / 60);
		};
})();

window.cancelAnimationFrame = (function () {
    return window.cancelAnimationFrame 	||
		window.webkitCancelAnimationFrame 	||
		window.mozCancelAnimationFrame 		||
		function (timPtr) {
        	window.clearTimeout(timPtr);
    	};
})();

/**
 * CANVAS INIT FUNCTIONS
**/
var canvas,
    ctx;

var initCanvas = function (){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    resize();
};

var resize = function () {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
    window.onresize = resize;
};

var clear = function () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
};

var drawTimeDomain = function () {
	clear();



	requestAnimFrame(drawTimeDomain);
};

/**
 * SHAPES INIT OBJECTS
**/

// Coords to point
var Point = function (x, y){
    this.x = x;
    this.y = y;

    console.log('New point ('+x+','+y+')');
};

var Ratio = function (percentX, percentY){
    this.percentX = percentX / 100;
    this.percentY = percentY / 100;

    console.log('New ratio ('+percentX+','+percentY+')');
};

// Mother class for all shapes objects
var Shape = function (ctx, points, center, origin){
    this.ctx = ctx;
    this.points = points;
    this.center = center;
    this.origin = origin;
    this.translateTo(center.x, center.y);
    this.editAnchor();
    this.centerCoords();
};

// Edit anchor position in percent with origin = {origin.x, origin.y}
Shape.prototype.editAnchor = function (origin){
    var cx = 0, cy = 0;
    var pointsTab = this.points;

    for(var i = 0; i < pointsTab.length; i++){
        cx += (pointsTab[i].x);
        cy += (pointsTab[i].y);
    }

    this.x = ((cx/pointsTab.length) * this.origin.x * 2);
    this.y = ((cy/pointsTab.length) * this.origin.y * 2);
};

// Translate to a particular point
Shape.prototype.translateTo = function (x, y){
    var pointsTab = this.points;

    for(var i = 0; i < pointsTab.length; i++){
        x += (pointsTab[i].x);
        y += (pointsTab[i].y);
    }

    this.x = (x/pointsTab.length) * this.origin.x/50;
    this.y = (y/pointsTab.length) * this.origin.y/50;
};

// Translate by addition
Shape.prototype.translate = function (x, y){
    this.x += x;
    this.y += y;
};

Shape.prototype.rotate = function (){

};

Shape.prototype.animate = function (x, y, time, ease){
    this.x;
    x;
    this.y;
    y;
};

Shape.prototype.draw = function (close){
    var pointsTab = this.points;

    ctx.beginPath();

    ctx.moveTo(pointsTab[0].x, pointsTab[0].y);
    for(var i = 1; i < pointsTab.length; i++){
        ctx.lineTo(pointsTab[i].x, pointsTab[i].y);
    }

    if(close && pointsTab.length >= 2){
        ctx.closePath();
    }
};

Shape.prototype.centerCoords = function (){
    console.log('Le centre est (' + this.x + ',' + this.y + ')');
};

Shape.prototype.stroke = function (lineWidth, strokeStyle = null){
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
};

Shape.prototype.gradient = function (type, steps){
    if(type === 'linear'){
        var gradiant = ctx.createLinearGradient(0, 0, this.width, this.height);
    } else {
        var gradiant = ctx.createRadialGradient(0, 0, this.width, this.height, 0, 360);
    }
    for (var i = 0; i < steps.length; i++){
        gradiant.addColorStop(i, steps[i]);
    }
    this.fill(ctx, gradiant);
};

Shape.prototype.fill = function (fillStyle){
    ctx.fillStyle = fillStyle;
    ctx.fill();
};



// Rectangle - classe fille
var Rectangle = function () {
    Shape.call(this);
};
// La classe fille surcharge la classe parente
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

(function (){
    initCanvas();

    var coordsTab = [
        new Point(0,0),
        new Point(20,0),
        new Point(20,20),
        new Point(0,20)
    ];

    var center = new Point(10,10);
    var origin = new Ratio(50,50);

    var forme = new Shape(ctx, coordsTab, center, origin);
    forme.fill('blue');
    forme.draw(true);

    //requestAnimFrame(drawTimeDomain);
})();
