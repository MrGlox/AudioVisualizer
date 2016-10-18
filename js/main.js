(function() {
    var audioUrl = "./sound/lettuce.mp3";
    var canvas = new Canvas('audioVisualizer');
    var ctx = canvas.ctx;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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

    //requestAnimFrame(canvas.drawTimeDomain);
})();
