
var canv = document.getElementById('canv');
var gl = canv.getContext("experimental-webgl", {preserveDrawingBuffer: true});
gl.getExtension('OES_texture_float');
gl.getExtension('OES_texture_float_linear');
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

var prog = new Program(gl, "vshader", "fshader");
prog.u_wave = prog.u_("u_wave");
prog.u_invres = prog.u_("u_invres");
var positionLoc = prog.a_("a_position");
prog.use();

var buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1.0,-1.0,1.0,-1.0,-1.0,1.0,-1.0,1.0,1.0,-1.0,1.0,1.0]),gl.STATIC_DRAW);
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

var texture = new Texture(gl, gl.LINEAR);
texture.loadBytes(new Uint8Array([0, 255, 0, 255, 0, 0, 255, 255, 255, 255]), 8, gl.ALPHA);
var bytes = new Uint8Array(aframe);

var paused = true;
var invres = 1.0 / canv.width;

(function frame() {
  requestAnimationFrame(frame);

  if (paused) return;

  prog.use();

  gl.uniform1i(prog.u_wave, 0);
  gl.uniform1f(prog.u_invres, invres);

  gl.activeTexture(gl.TEXTURE0 + 0);
  texture.bind();

  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
})();