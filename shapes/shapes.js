
var param = [];
for (var i = 0; i <= 23; i++) {
	param[i] = 30. / 127.;
}

var audio = new AudioContext();
var bufsize = 1024;
steptime = (1000.0 / audio.sampleRate) * bufsize;
stepinv = 1.0 / steptime;
var stereo = false;
audio.suspend();


var res = 0.25;
var width = document.documentElement.clientWidth * res;
var height = document.documentElement.clientHeight * res;


var canv = document.getElementById("canv");
canv.width = width;
canv.height = height;
var gl = canv.getContext("experimental-webgl", {preserveDrawingBuffer: true});
gl.getExtension('OES_texture_float');
gl.getExtension('OES_texture_float_linear');
gl.viewport(0, 0, width, height);

var p_vox = new Program(gl, "vshader", "fshader");


var positionLoc = p_vox.a_("a_position");
p_vox.u_vox = p_vox.u_("u_vox");
p_vox.u_campos = p_vox.u_("u_campos");
p_vox.u_camrot = p_vox.u_("u_camrot");
p_vox.u_mode = p_vox.u_("u_mode");
p_vox.u_zoom = p_vox.u_("u_zoom");
p_vox.u_valcmp = p_vox.u_("u_valcmp");
p_vox.u_valcmpshake = p_vox.u_("u_valcmpshake");
p_vox.u_valcmp_freq = p_vox.u_("u_valcmp_freq");
p_vox.u_valcmp_phase = p_vox.u_("u_valcmp_phase");
p_vox.u_steps = p_vox.u_("u_steps");
p_vox.u_overjump = p_vox.u_("u_overjump");
p_vox.u_muljump = p_vox.u_("u_muljump");
p_vox.u_shake = p_vox.u_("u_shake");
p_vox.u_screen = p_vox.u_("u_screen");


var buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1.0,-1.0,1.0,-1.0,-1.0,1.0,-1.0,1.0,1.0,-1.0,1.0,1.0]),gl.STATIC_DRAW);
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

const vs = 32; // voxel size (original: 64)
const vh = vs / 2;
const vs2 = vs * vs;
const vs3 = vs * vs * vs;
const vsinv = 1.0 / vs;

var voxData = new Float32Array(vs3 * 4);
var conva = (vs / 1.0);
var convb = (1.0 / vs);

// TODO: distance table
var sqrtTable = new Float32Array(vs3);
for (var x = 0; x < vs; x++) {
	for (var y = 0; y < vs; y++) {
		for (var z = 0; z < vs; z++) {
			var i = (z + (x + y*vs)*vs);
			sqrtTable[i] = Math.hypot(x - vh, y - vh, z - vh) * convb;
		}
	}
}

function mod(m) {
  return ((m % vs) + vs) % vs;
}

function AddVoxel(px, py, pz, nx, ny, nz) {	
	for (var y = 0; y < vs; y++) {
		for (var x = 0; x < vs; x++) {
			for (var z = 0; z < vs; z++) {
				var i = (z + (x + y*vs)*vs);
				var d = sqrtTable[mod(z - pz) + (mod(x - px) + mod(y - py)*vs)*vs];
				if (voxData[i * 4 + 3] > d) {
					voxData[i * 4 + 0] = nx;
					voxData[i * 4 + 1] = ny;
					voxData[i * 4 + 2] = nz;
					voxData[i * 4 + 3] = d;
				}
			}
		}
	}//*/
	voxData[(z + (x + y*vs)*vs) * 4 + 0] = nx;
	voxData[(z + (x + y*vs)*vs) * 4 + 1] = ny;
	voxData[(z + (x + y*vs)*vs) * 4 + 2] = nz;
	voxData[(z + (x + y*vs)*vs) * 4 + 3] = 0;
}

// diagonal

for (var i = 0; i < vs3 * 4; i++) voxData[i] = 255;

var rgb = 0;
for (var i = 0; i < vs3; i+=47 * 1) {
	rgb = (rgb+1)%3;
	AddVoxel(i % vs, Math.floor(i * vsinv), Math.floor(i * vsinv * vsinv),
		rgb == 0 ? 1 : 0,  rgb == 1 ? 1 : 0, rgb == 2 ? 1 : 0);
}

var voxTex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, voxTex);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, vs*vs, vs, 0, gl.RGBA, gl.FLOAT, voxData);

// randomized

for (var i = 0; i < vs3 * 4; i++) voxData[i] = 255;

for (var i = 0; i < vs3; i+=50) {
	AddVoxel(Math.floor(i % vs + Math.random() * 45), Math.floor(i * vsinv), Math.floor(i * vsinv * vsinv), Math.random(), Math.random(), Math.random());
}

var voxTex2 = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, voxTex2);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, vs*vs, vs, 0, gl.RGBA, gl.FLOAT, voxData);

// empty

var empTex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, empTex);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.FLOAT,
new Float32Array([0.0, 0.0, 0.0, 0.0]));

var camx = 0.3, camy = 0.3, camz = 0.3;
var spdz = 0.0;
var time = 0;
var mode = 1;
var tex = 1;
var phase = 0.0;
var deltatime = 0.0;
var prevtime = performance.now();

var audioScale = 1; // how many lines it reads per buffer
var pixelArray = new Uint8Array(1024 * 4);
var scanPos = 0;
var scanDir = 0;
var scanDirY = 1;
var pswitch = false;

var paused = true;

(function loop() {
  requestAnimationFrame(loop);
  
  if (paused) return;
	
	time = performance.now();
	deltatime = time - prevtime;
	prevtime = time;
	
	//AddVoxel(Math.random() * vs, Math.random() * vs, Math.random() * vs, 0, 0, 0);
	var mx = 0.4;
	var my = 0.5;
	
	p_vox.use()
	gl.uniform1i(p_vox.u_vox, 0);
	gl.uniform2f(p_vox.u_screen, width, height);
	gl.uniform3f(p_vox.u_campos, camx, camy, camz);
	gl.uniform3f(p_vox.u_camrot, Math.sin(mx * 3) * Math.cos(my * 3), Math.sin(-my * 3), Math.cos(mx * 3) * Math.cos(my * 3));
	gl.uniform1f(p_vox.u_zoom, Math.pow(param[23], 2.0) * 7.0);
	gl.uniform1i(p_vox.u_mode, mode)
	gl.uniform1f(p_vox.u_valcmp, param[0] * 0.02);
	gl.uniform1f(p_vox.u_valcmpshake, param[20] * 1.0);
	gl.uniform3f(p_vox.u_valcmp_freq,
		param[2] * 40.0 * (Math.sin(time * 0.001) + 1.0),
		param[2] * 40.0 * (Math.sin(time * 0.0012 + 1.0) + 1.0),
		param[2] * 40.0 * (Math.sin(time * 0.0015 + 2.0) + 1.0));
	gl.uniform1f(p_vox.u_valcmp_phase, phase);
	gl.uniform1i(p_vox.u_steps, param[16] * 50);
	gl.uniform1f(p_vox.u_overjump, param[17] * 0.4);
	gl.uniform1f(p_vox.u_muljump, param[1] * 5.0 + 1.0);
	gl.uniform1f(p_vox.u_shake, 0.0);
	
	if (param[18]) phase += Math.pow(param[18], 2.0) * 0.01 * deltatime;
	
	gl.activeTexture(gl.TEXTURE0 + 0);
	switch(tex) {
		case 0:
			gl.bindTexture(gl.TEXTURE_2D, empTex);
			break;
		case 1:
			gl.bindTexture(gl.TEXTURE_2D, voxTex2);
			break;
		default:	
			gl.bindTexture(gl.TEXTURE_2D, voxTex);
	}
	
	gl.bindBuffer(gl.ARRAY_BUFFER, buf);
	gl.drawArrays(gl.TRIANGLES, 0, 6);
	gl.readPixels(0, scanPos, bufsize, audioScale, gl.RGBA, gl.UNSIGNED_BYTE, pixelArray);
	audiowait = false;

	if (param[7] != null) spdz = Math.pow(param[7], 2.0) * 0.003;
	
	camx += Math.sin(mx * 3) * Math.cos(my * 3) * spdz * deltatime;
	camy += Math.sin(-my * 3) * spdz * deltatime;
	camz += Math.cos(mx * 3) * Math.cos(my * 3) * spdz * deltatime;
	
})();


var aproc = audio.createScriptProcessor(1024, 0, 2);
var audiowait = true;
//var rp = 0.0, lp = 0.0;
aproc.onaudioprocess = function(e) {
	if (audiowait) return;

	var left = e.outputBuffer.getChannelData(stereo ? 1 : 0);
	var right = e.outputBuffer.getChannelData(stereo ? 0 : 1);

	for (var i = 0; i < 1024; i++) {
		left[scanDir==1 ? 1023 - i : i] = (pixelArray[i * 4] + pixelArray[i * 4 + 2]) / 256.0 / 2.0;
		right[scanDir==1 ? 1023 - i : i] = (pixelArray[i * 4 + 1] + pixelArray[i * 4 + 2]) / 256.0 / 2.0;
	}
	
	scanDir = 1 - scanDir;

	scanPos = (scanPos + audioScale * scanDirY);
	if (scanPos + audioScale >= height - 1) {
		scanPos --;
		scanDirY = -1;
	} else if (scanPos < 0) {
		scanPos = 0;
		scanDirY = 1;
	}
}

var filter = audio.createBiquadFilter();
filter.type = "highpass";
filter.frequency.value = 20;
var filter2 = audio.createBiquadFilter();
filter2.type = "lowpass";
filter2.frequency.value = 5000;
var volume = audio.createGain();
volume.gain.value = 0.5;

aproc.connect(filter);
filter.connect(filter2);
filter2.connect(volume);
volume.connect(audio.destination)

function recalcAudio() {
	audiowait = true;

	bufsize = Math.min(Math.pow(2, Math.floor(Math.log2(width))), 16384);

	if (bufsize < 1024) {
		audioScale = Math.ceil(Math.pow(2, Math.log2(1024) - Math.log2(bufsize)));
	} else {
		audioScale = 1;
	}
}