
var canv = document.getElementById('canvas');
var gl = canv.getContext('experimental-webgl', {preserveDrawingBuffer: true});
gl.getExtension('OES_texture_float');
gl.getExtension('OES_texture_float_linear');
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

var positionLoc = 0;
var buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1.0,-1.0,1.0,-1.0,-1.0,1.0,-1.0,1.0,1.0,-1.0,1.0,1.0]),gl.STATIC_DRAW);
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

var qss = new QSquareShader(16, 512);
qss.reset();

alength = 512;
aprepare();

qss.resolution = gl.canvas.width;

//qss.gauss(0.5, 0.0, 0.3, 64);
var paused = true;

function draw() {
	requestAnimationFrame(draw);
	if (paused) return;
	
  UpdateTimeline();
  
	qss.use( time );
  
	gl.bindBuffer(gl.ARRAY_BUFFER, buf);
	gl.drawArrays(gl.TRIANGLES, 0, 6);
}
