
var audio = new window.AudioContext();
var aframe = 1024;
var aproc = audio.createScriptProcessor(aframe, 0, 2);

var alength = 0;
var adata = new Float32Array(aframe);
var adatal = new Float32Array(aframe);
var adatar = new Float32Array(aframe);
var aprep, aprepl, aprepl;
var aphase = 0;
var atime = 0.0;
var adelta = aframe / audio.sampleRate;
var aclock = 0.0;

//var acanv = document.createElement('canvas');
//acanv.width = aframe;
//acanv.height = aframe;
//var a2d = acanv.getContext('2d');
//document.body.appendChild(acanv);

function aprepare() {
  aprep = qss.scanprep(0.5, 2.0, alength*2);
  aprepl = qss.scanprep(0.25, 2.0, alength*2);
  aprepr = qss.scanprep(0.75, 2.0, alength*2);
}

aproc.onaudioprocess = function(e) {
	if (!adata) return;
  //adelta = performance.now() - atime;
  //atime = performance.now();
  aclock = (performance.now() - zero) * clockspeed;
  //aclock -= Math.floor(aclock);
	
	var left = e.outputBuffer.getChannelData(0);
	var right = e.outputBuffer.getChannelData(1);
  
  var perf = performance.now();
  qss.scan(aprep, aclock, adelta * clockspeed, adata);
  qss.scan(aprepl, aclock, adelta * clockspeed, adatal);
  qss.scan(aprepr, aclock, adelta * clockspeed, adatar);
  //console.log("scans: " + (performance.now() - perf));
	
	for (var i = 0; i < aframe; i++) {
		var I = ((i + aphase) % alength);
		//left[i] = right[i] = adata[I];
    left[i] = Math.min(adata[I] + adatal[I], 1.0);
		right[i] = Math.min(adata[I] + adatar[I], 1.0);
	}
	
	aphase = (aphase + alength) % aframe;
  
  // wave
  if (0) {
    a2d.fillStyle = '#000000';
	  a2d.fillRect(0, 0, aframe, aframe);
	    
	  a2d.strokeStyle = '#ffffff';
	  a2d.beginPath();
	  a2d.moveTo(0,0);
	  for (var i = 0; i<aframe; i++) {
	  	a2d.lineTo(i, adata[i]*aframe);
	  } 
	  a2d.stroke();
  }
};

function mute() {
  master.gain.value = 0.0;
}

var highpass = audio.createBiquadFilter();
highpass.type = 'highpass';
highpass.frequency.value = 30;

var lowpass = audio.createBiquadFilter();
lowpass.type = 'lowpass';
lowpass.frequency.value = 20000;//13000;

var master = audio.createGain();
master.gain.value = 1.0;

aproc.connect(highpass);
highpass.connect(lowpass);
lowpass.connect(master);
master.connect(audio.destination);