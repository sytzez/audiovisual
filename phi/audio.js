
var acx = new AudioContext();
acx.suspend();
var aframe = 2048;
var aproc = acx.createScriptProcessor(aframe, 0, 2);
var lowpass = acx.createBiquadFilter();
lowpass.type = "lowpass";
lowpass.frequency.setValueAtTime(20000, acx.currentTime);
var time = 0;
var beat = 0.0053;
var slope = 6.0;
var volume = 0.2;
var slowvolume = 0.2;
var pitchmul = 1.0;

function startaudio() {
  time = 0;
  acx.resume();
}

var voices = [];
var Voice = function(pitch, saw, bool) {
  this.freq = 0;
  this.sawf = 0;
  this.boolf = 0;

  this.setPitch(pitch);
  this.setSaw(saw);
  this.setBool(bool);
  
  this.amp = 0;
  this.alt = null;
  this.active = false;

  this.visual = true;

  voices.push(this);
};

Voice.prototype.setPitch = function(p) {
  if (p < 2) this.active = false;
  this.freq = Math.pow(phi, p) / aframe;
};

Voice.prototype.setSaw = function(s) {
  this.sawf = Math.pow(phi, s) * beat;
};

Voice.prototype.setBool = function(b) {
  this.boolf = Math.pow(phi, b) * beat;
};

aproc.onaudioprocess = function(e) {
  var l = e.outputBuffer.getChannelData(0);
  var r = e.outputBuffer.getChannelData(1);

  for (var i = 0; i < aframe; i++) {
    var v = 0.0;
    var visual = 0.0;
    var t = time + i/aframe;
    slowvolume += Math.min(0.0005, Math.max(volume - slowvolume, -.0005))
    voices.forEach(function(voice, ind) {
      var amp = 0.0;
      var result = 0.0;
      if (!voice.active) {
        amp = 0.0;
      } else if (!PhiBool(t * voice.boolf)) {
        amp = Math.pow((1.0 - PhiTriangle(t * voice.sawf)), slope);
      } else if (voice.alt) {
        //voice.alt.amp = voice.amp;
        voice = voice.alt;
        amp = Math.pow((1.0 - PhiTriangle(t * voice.sawf)), slope);
      }
      voice.amp += Math.max(Math.min(amp - voice.amp, 0.001), -.001);
      //v += PhiSine((i) * voice.freq)*Math.pow((1.0 - PhiSine(t * voice.sawf))*0.5, 3.0);
      result = PhiSine((i) * voice.freq * pitchmul)*voice.amp;
      v += result;
      if (voice.visual) visual += result;
      //v += PhiSaw((i) * voice.freq)*Math.pow((1.0 - PhiTriangle(t * voice.sawf)), 3.0)*2.0 - 1.0;

    });
    l[i] = r[i] = v * slowvolume;
    bytes[i] = 128 + visual*0.15*128;
    //bytes[i] = 255*(v>0.0);
  }
  texture.loadBytes(bytes, aframe, gl.ALPHA);

  time++;
}

aproc.connect(lowpass);
lowpass.connect(acx.destination);