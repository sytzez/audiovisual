var audio = new AudioContext();
var bufsize = 1024;
//console.log("audiorate: " + audio.sampleRate);
//console.log("buffer: " + bufsize);
var stereo = false;

var canv = document.getElementById("canv");
var gl = canv.getContext("experimental-webgl", {preserveDrawingBuffer: true});
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

var p_wave = new Program(gl, "vshader", "waveshader");
var p_twist = new Program(gl, "vshader", "twistshader");
var p_old = new Program(gl, "vshader", "fshader");
var p = p_twist;

var positionLoc = p_twist.a_("a_position");
p_wave.u_fb = p_wave.u_("u_fb");
p_wave.u_move = p_wave.u_("u_move");
p_wave.u_scale = p_wave.u_("u_scale");
p_wave.u_wave = p_wave.u_("u_wave");
p_wave.u_shift = p_wave.u_("u_shift");
p_wave.u_width = p_wave.u_("u_width");
p_wave.u_period = p_wave.u_("u_period");
p_wave.u_kill = p_wave.u_("u_kill");
p_wave.u_pick = p_wave.u_("u_pick");

p_twist.u_fb = p_twist.u_("u_fb");
p_twist.u_move = p_twist.u_("u_move");
p_twist.u_scale = p_twist.u_("u_scale");
p_twist.u_rot = p_twist.u_("u_rot");
p_twist.u_kill = p_twist.u_("u_kill");
p_twist.u_intense = p_twist.u_("u_intense");
p_twist.u_dense = p_twist.u_("u_dense");
p_twist.u_pick = p_twist.u_("u_pick");
p_twist.u_phase = p_twist.u_("u_phase");

p_old.u_fb = p_old.u_("u_fb");
p_old.u_scale = p_old.u_("u_scale");
p_old.u_move = p_old.u_("u_move");
p_old.u_osc = p_old.u_("u_osc");

var buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1.0,-1.0,1.0,-1.0,-1.0,1.0,-1.0,1.0,1.0,-1.0,1.0,1.0]),gl.STATIC_DRAW);
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);


var feedbackTex = new Texture(gl, gl.LINEAR);
var waveTex = new Texture(gl, gl.LINEAR);
waveTex.loadBytes(new Uint8Array([0,255]), 1, gl.ALPHA);


var cScaleX = new Controller(1024.0);
var cScaleY = new Controller(512.0);
var cMoveX = new Controller(1024.0);
var cMoveY = new Controller(512.0);
var cKill = new Controller(1.0);

var cShift = new Controller(0.0);
var cWidth = new Controller(0.1);
var cPeriod = new Controller(0.5);
var cPhase = new Controller(0.0);
var cPick1 = new Controller(1.0);

var cTwist = new Controller(0.02 * Math.PI);
cTwist.setMouseX(-0.05, 0.05);
var cIntense = new Controller(0.2);
//cIntense.setMouseY(0.0, 0.15);
var cDense = new Controller(5.0);
cDense.setMouseY(3.0, 7.0);
var cPick = new Controller(3);

var cOsc1 = new Controller(9.0);
var cOsc2 = new Controller(9.0);
var cOsc3 = new Controller(9.0);
var cOsc4 = new Controller(9.0);

var audioScale = 1; // change the pitch, how fast it goes through the image
var pixelArray = new Uint8Array(2048 * audioScale * 4);
var scanPos = 0;
var scanDir = 0;
var scanDirY = 1;
var pswitch = false;

var paused = true;

(function loop() {
	requestAnimationFrame(loop);

  if (paused) return;

	p.use();
	gl.uniform1i(p.u_fb, 0);
	gl.uniform1i(p.u_wave, 2);
	
	gl.uniform2f(p.u_scale, cScaleX.get(), cScaleY.get());
	gl.uniform2f(p.u_move, cMoveX.get(), cMoveY.get());
	gl.uniform1f(p.u_kill, cKill.get());

	if (p === p_wave) {
		gl.uniform1f(p.u_shift, cShift.get())
		gl.uniform1f(p.u_width, cWidth.get());
		gl.uniform1f(p.u_period, cPeriod.get());
		gl.uniform1f(p.u_phase, cPhase.get());
		gl.uniform1i(p.u_pick, cPick1.get());

		if (pswitch) p = p_twist;
	} else if (p === p_twist) {
		gl.uniform1f(p.u_rot, cTwist.get());
		gl.uniform1f(p.u_intense, cIntense.get());
		gl.uniform1f(p.u_dense, cDense.get());
		gl.uniform1i(p.u_pick, cPick.get());

		if (pswitch) p = p_wave;
	} else if (p == p_old) {
		gl.uniform4f(p.u_osc, cOsc1.get(), cOsc2.get(), cOsc3.get(), cOsc4.get());
	}
	
	gl.activeTexture(gl.TEXTURE0 + 0);
	feedbackTex.bind();
	feedbackTex.loadCanvas(canv);

	gl.activeTexture(gl.TEXTURE0 + 2);
	waveTex.bind();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  
	gl.readPixels(0, scanPos, 2048, audioScale, gl.RGBA, gl.UNSIGNED_BYTE, pixelArray);
})(); // framerate

var even = false;
var aproc = audio.createScriptProcessor(bufsize, 0, 2);
aproc.onaudioprocess = function(e) {
	var left = e.outputBuffer.getChannelData(stereo ? 1 : 0);
	var right = e.outputBuffer.getChannelData(stereo ? 0 : 1);

	for (var i = 0; i < bufsize; i++) {
		
		left[scanDir==1 ? bufsize - 1 - i : i] = pixelArray[i * 4 * audioScale] / 256.0;
		right[scanDir==1 ? bufsize - 1 - i : i] = pixelArray[i * 4 * audioScale + 1] / 256.0;
	}
	
	scanDir = 1 - scanDir;

	scanPos = (scanPos + audioScale * scanDirY);
	if (scanPos + audioScale >= 1023) {
		scanPos --;
		scanDirY = -1;
	} else if (scanPos < 0) {
		scanPos = 0;
		scanDirY = 1;
  }
  
  even = !even;

  if ((even && !paused)) {
	  stepfunc();
    step++;
  }
}

var filter = audio.createBiquadFilter();
filter.type = "highpass";
filter.frequency.value = 20;

var volume = audio.createGain();
volume.gain.value = 0.5;

aproc.connect(filter);
filter.connect(volume);
volume.connect(audio.destination);

audio.suspend();