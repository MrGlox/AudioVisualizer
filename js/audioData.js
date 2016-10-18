/**
 * AJOUTER DES VARIABLES SUPPLÉMENTAIRES POUR LA GESTION DE LA FRÉQUENCE
 * CORRIGER LE RESTE DES FUNCTIONS ET LE CODE EN SÉPARANT L'AUDIO DU CANVAS
 * MODIFIER LA STRUCTURE DES MOUVEMENTS AVEC DES DÉPLACEMENTS D'AGENT AFIN DE PERMETTRE PLUS DE FUIDITÉ
 * CRÉER UN TRI DES FRÉQUENCES POUR AVOIR LES BASSES, LE BEAT ET LES OCTAVES
 */

/***
 * INIT BASES
***/
window.AudioContext = (function (){
	return window.AudioContext || window.mozAudioContext;
})();

var onError = function (e) {
	console.log(e);
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
	audioUrl;

/***
 * SOUND INIT FUNCTIONS
***/
var setupAudioNodes = function () {
	sourceNode = audioContext.createBufferSource();
	analyserNode = audioContext.createAnalyser();
	analyserNode.fftSize = fftSize;
	analyserNode.smoothingTimeConstant = smoothingTimeConstant;
	analyserNode.minDecibels = minDecibels;
	analyserNode.maxDecibels = maxDecibels;
	gainNode = audioContext.createGain();
	javascriptNode = audioContext.createScriptProcessor(sampleSize, 1, 1);
	amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount);
	sourceNode.connect(audioContext.destination);
	sourceNode.connect(analyserNode);
	analyserNode.connect(javascriptNode);
	javascriptNode.connect(audioContext.destination);
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
var getAmp = function (){
	var maxAmplitude = 0;
	var minAmplitude = 0;

	for (var i = 0; i < amplitudeArray.length; i++) {
		if(amplitudeArray[i] > maxAmplitude){
			maxAmplitude = amplitudeArray[i];
		} else if(amplitudeArray[i] < minAmplitude){
			minAmplitude = amplitudeArray[i];
		}
	}

	return { maxAmp : maxAmplitude, minAmp : minAmplitude };
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
