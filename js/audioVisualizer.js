/**
 * AJOUTER DES VARIABLES SUPPLÉMENTAIRES POUR LA GESTION DE LA FRÉQUENCE
 * TRACER LE CENTRE DU BEAT
 * GÉRER LE LOADER EN ARRANGEANT LE requestAnimFrame
 * CORRIGER LE RESTE DES FUNCTIONS ET LE CODE EN SÉPARANT L'AUDIO DU CANVAS
 * MODIFIER LA STRUCTURE DES MOUVEMENTS AVEC DES DÉPLACEMENTS D'AGENT AFIN DE PERMETTRE PLUS DE FUIDITÉ
 * CRÉER UN TRI DES FRÉQUENCES POUR AVOIR LES BASSES, LE BEAT ET LES OCTAVES
 */

/***
 * INIT BASES
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

window.AudioContext = (function (){
	return window.AudioContext || window.mozAudioContext;
})();

var onError = function (e) {
	console.log(e);
};

/***
 * INIT UPLOADER
***/
var uploadedFile = document.getElementById('file-upload');
var initLoader = function () {
	uploadedFile.addEventListener('change', handleManualUploadedFiles);

	function handleManualUploadedFiles(ev){
		var file = ev.target.files[0];
		console.log(file);
		loadSound(file);
	}

	window.addEventListener('dragover', function(e){
		e.preventDefault();
	}, true);

	window.addEventListener('drop', function(e){
		var data = e.dataTransfer;
		e.preventDefault();
		loadSound(data.files[0]);
	});
};

/***
 * INIT SOUND VARIABLES
***/
var audioContext,
	sourceNode,
	analyserNode,
	gainNode,
	javascriptNode,
	audioData = null,
	audioPlaying = false,
	currentTime = 0,
	startTime = 0,
	sampleSize = 1024,
	smoothingTimeConstant = 0.0,
	fftSize = 128,
	amplitudeArray,
	soundLoaded = false,
	smoothingTimeConstant = 0.8,
	minDecibels = -100,
	maxDecibels = -30,
	audioUrl = "./sound/lettuce.mp3";

/***
 * SOUND INIT FUNCTIONS
***/
var setupAudioNodes = function () {
	sourceNode = audioContext.createBufferSource();
	analyserNode = audioContext.createAnalyser();
	analyserNode.fftSize = fftSize;
	analyser.smoothingTimeConstant = smoothingTimeConstant;
	analyser.minDecibels = minDecibels;
	analyser.maxDecibels = maxDecibels;
	gainNode = audioContext.createGain();
	javascriptNode = audioContext.createScriptProcessor(sampleSize, 1, 1);
	amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount);
	sourceNode.connect(audioContext.destination);
	sourceNode.connect(analyserNode);
	analyserNode.connect(javascriptNode);
	javascriptNode.connect(audioContext.destination);
};

var loadSound = function (url) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';
	request.onload = function () {
		audioContext.decodeAudioData(request.response, function (buffer) {
			audioData = buffer;
			soundLoaded = true;
		}, onError);
	};
	request.send();
};

/***
 * SOUND CONTROL FUNCTIONS
***/
var play = document.getElementsByClassName('play')[0];
play.addEventListener('click', function (e) {
	e.preventDefault();
	if(audioPlaying === false && soundLoaded === true){
		if(startTime === 0){ startTime = new Date(); }
		sourceNode.buffer = audioData;
		sourceNode.start(0, currentTime);
		sourceNode.loop = true;
		audioPlaying = true;
		console.log('Play audio !');
	} else {
		console.log('Sound not loaded !');
	}
});

var pause = document.getElementsByClassName('pause')[0];
pause.addEventListener('click', function (e) {
	e.preventDefault();
	if(audioPlaying === true){
		currentTime = (new Date() - startTime)/1000;
		sourceNode.stop(0, currentTime);
		audioPlaying = false;
		setupAudioNodes();
		console.log('Pause audio !');
	}
});

var stop = document.getElementsByClassName('stop')[0];
stop.addEventListener('click', function (e) {
	e.preventDefault();
	if(audioPlaying === true){
		sourceNode.stop(currentTime, 0);
	}
	audioPlaying = false;
	setupAudioNodes();
	currentTime = 0;
	startTime = 0;
	console.log('Stop audio !');
});

/***
 * SOUND REFERENCES FUNCTIONS
***/
var getMaxAmp = function (){
	var maxAmplitude = 0;

	for (var i = 0; i < amplitudeArray.length; i++) {
		if(amplitudeArray[i] > maxAmplitude){
			maxAmplitude = amplitudeArray[i];
		}
	}

	return maxAmplitude;
};

var getMinAmp = function (){
	var minAmplitude = 1000;

	for (var i = 0; i < amplitudeArray.length; i++) {
		if(amplitudeArray[i] < minAmplitude){
			minAmplitude = amplitudeArray[i];
		}
	}

	return minAmplitude;
};

var getOffset = function (minAmplitude){
	var offset;
	var min = getMin();

	for (var i = 0; i < amplitudeArray.length; i++) {
		if(amplitudeArray[i] === minAmplitude){
			offset = amplitudeArray[i] / amplitudeArray.length;
		}
	}

	return offset;
};

/***
 * INIT CANVAS VARS
***/
var canvas,
	ctx,
	cx,
	cy;

var resize = function () {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

var clearCanvas = function () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
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


/***
 * IIFE
***/
(function() {
	canvas = document.getElementById('audioVisualizer');
	ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	cx = canvas.width/2;
	cy = canvas.height/2;

	initLoader();
	loader();
	window.onresize = resize;

	try {
		audioContext = new AudioContext();
	} catch(e) {
		alert('Web Audio API is not supported in this browser');
	}

	setupAudioNodes();
	javascriptNode.onaudioprocess = function () {
		analyserNode.getByteTimeDomainData(amplitudeArray);
	};

	if(audioData === null) {
		loadSound(audioUrl);
	}

	requestAnimFrame(drawTimeDomain);
})();
