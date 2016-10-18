/**
 * TRACER LE CENTRE DU BEAT
 * GÉRER LE LOADER EN ARRANGEANT LE requestAnimFrame
 */

window.requestAnimFrame = (function (){
	return window.requestAnimationFrame      ||
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

var onError = function (e) {
	console.log(e);
};

/***
 * INIT CANVAS VARS
***/
var Canvas = function(id){
  var canvas = document.getElementById(id),
    ctx = canvas.getContext("2d"),
    cx = canvas.width/2,
    cy = canvas.height/2;

  window.onresize = function () {
  	canvas.width = window.innerWidth;
  	canvas.height = window.innerHeight;
  };

  var clearCanvas = function () {
  	if(ctx != null){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  var drawTimeDomain = function () {
  	clearCanvas();

  	loader();

  	requestAnimFrame(drawTimeDomain);
  };

  /***
   * CANVAS PATTERNS
  ***/
  var loader = function (){
  	var roundLoader = roundDash(cx, cy, cy/2, 5, 160);
  	requestAnimFrame(drawTimeDomain);
  };

  /***
   * CANVAS PATHS
  ***/
  var roundDash = function (cx, cy, r, height, number){
  	var lines = [];
  	var a = (Math.PI*2)/number;

  	for(var i = 0; i<number; i++){
  		var x1 = cx + (r * Math.cos(a*i));
  		var y1 = cy + (r * Math.sin(a*i));

  		var x2 = cx + ((r + 5) * Math.cos(a*i));
  		var y2 = cy + ((r + 5) * Math.sin(a*i));

  		lines.push({x1: x1, y1: y1, x2: x2, y2: y2});

  		ctx.beginPath();

  		ctx.lineWidth = 1;
  		ctx.strokeStyle = 'rgb(0, 0, 0)';

  		ctx.moveTo(x1,y1);
  		ctx.lineTo(x2,y2);

  		ctx.stroke();
  	}
  	return lines;
  };

  var roundPulse = function (cx, cy, r, lineWidth){
  	ctx.save();
  	ctx.beginPath();
  	ctx.arc(cx, cy, r * amplitudeArray/100, 0, 2 * Math.PI, false);
  	ctx.lineWidth = lineWidth;
  	ctx.strokeStyle = 'rgb(0, 0, 0)';
  	ctx.stroke();
  	ctx.restore();
  };

  var roundFrequency = function (cx, cy, r){
  	ctx.save();

  	var a = (Math.PI*2)/amplitudeArray.length;
  	var x = cx + (r * Math.cos(a));
  	var y = cy + (r * Math.sin(a));

  	ctx.beginPath();
  	ctx.lineJoin="round";

  	ctx.lineWidth = 5;
  	ctx.strokeStyle = 'rgb(0, 0, 0)';

  	getMax();
  	getMin();

  	for (var i = 0; i < amplitudeArray.length; i++) {
  		if(amplitudeArray[i]){

  		}
  	}

  	ctx.closePath();
  	ctx.stroke();
  	ctx.restore();
  };

  var roundDistort = function (cx, cy, r, minAmplitude, maxAmplitude){
  	ctx.save();

  	var a = (Math.PI*2)/4;
  	var x = cx + (r * Math.cos(a));
  	var y = cy + (r * Math.sin(a));

  	ctx.beginPath();
  	ctx.lineJoin="round";

  	ctx.lineWidth = 5;
  	ctx.strokeStyle = 'rgb(0, 0, 0)';

  	for (var i = 0; i < amplitudeArray.length; i++) {
  		var v = amplitudeArray[i] / 2;

  		x = cx + ((r+v) * Math.cos(a*i));
  		y = cy + ((r+v) * Math.sin(a*i));

  		ctx.lineTo(x, y);
  	}

  	ctx.closePath();
  	ctx.stroke();
  	ctx.restore();
  };


  console.log('Canvas object loaded');
  return {ctx};
}
