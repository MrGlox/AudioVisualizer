var audioData,
  soundLoaded;

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
    console.log(data);
		loadSound(data.files[0]);
	});
};

var loadSound = function (url) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	request.onload = function (e) {
		audioContext.decodeAudioData(request.response, function (buffer) {
			audioData = buffer;
			soundLoaded = true;
		}, onError);
	};


	request.send();
};
