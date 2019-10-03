
function Program(gl, vid, fid) {
	this.gl = gl;
	this.vshader = gl.createShader(gl.VERTEX_SHADER);
	this.fshader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(this.vshader, document.getElementById(vid).text);
	gl.shaderSource(this.fshader, document.getElementById(fid).text);
		
	gl.compileShader(this.vshader);
	gl.compileShader(this.fshader);

	//console.log(gl.getShaderInfoLog(this.vshader));
	//console.log(gl.getShaderInfoLog(this.fshader));

	this.prog = gl.createProgram();
	gl.attachShader(this.prog, this.vshader);
	gl.attachShader(this.prog, this.fshader);
	gl.linkProgram(this.prog);
	gl.useProgram(this.prog);

	this.use = function() { this.gl.useProgram(this.prog); };
	this.a_ = function(name) { return this.gl.getAttribLocation(this.prog, name); };
	this.u_ = function(name) { return this.gl.getUniformLocation(this.prog, name); };
}

function Texture(gl, filter) {
	this.gl = gl;
	this.tex = gl.createTexture();
	
	gl.bindTexture(gl.TEXTURE_2D, this.tex);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([0,0,127]));

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);

	this.bind = function() {
		gl.bindTexture(gl.TEXTURE_2D, this.tex);
	}
	
	this.loadCanvas = function(canvas) {
		gl.bindTexture(gl.TEXTURE_2D, this.tex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, canvas);
	}

	this.loadBytes = function(array, size, format) {
		gl.bindTexture(gl.TEXTURE_2D, this.tex);
		gl.texImage2D(gl.TEXTURE_2D, 0, format, size, 1, 0, format, gl.UNSIGNED_BYTE, array);
	}
}


