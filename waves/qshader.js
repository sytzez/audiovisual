
var QSquareShader = function(lvl, res) {
	this.prog = new Program(gl, 'vertex', 'fragment');
	
	this.lvl = lvl;
  this.mode = 0;
  this.resolution = res;
	
	this.oscs = new Float32Array(lvl*lvl*2);
	this.tex = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.tex);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	
	this.prog.u_time = this.prog.u_('u_time');
	this.prog.u_lvl = this.prog.u_('u_lvl');
	this.prog.u_mode = this.prog.u_('u_mode');
  this.prog.u_data = this.prog.u_('u_data');
  this.prog.u_resolution = this.prog.u_('u_resolution');
	
	this.changed = true;
  
  this.SIN = new Array(64);
  this.SIND = new Array(64);
  this.COS = new Array(64);
  this.COSD = new Array(64);
  for (var i = 0; i < 64; i++) this.SIN[i] = Math.sin(i / 32.0 * Math.PI);
  for (var i = 0; i < 63; i++) this.SIND[i] = this.SIN[i+1] - this.SIN[i];
  this.SIND[63] = this.SIN[0] - this.SIN[63];
  for (var i = 0; i < 64; i++) this.COS[i] = Math.cos(i / 32.0 * Math.PI);
  for (var i = 0; i < 63; i++) this.COSD[i] = this.COS[i+1] - this.COS[i];
  this.COSD[63] = this.COS[0] - this.COS[63];
};
//
var BITC = 0.0;
QSquareShader.prototype.sin = function(i, v) {
  //v *= 32.0; // optimized in scan()
  return this.SIN[i]// + this.SIND[i] * v;
};

QSquareShader.prototype.cos = function(i, v) {
  //v *= 32.0;
  //i = (i+16)%64;
  return this.COS[i]// + this.COSD[i] * v;
};
//
QSquareShader.prototype.use = function(t) {
	this.prog.use();
	
	gl.bindTexture(gl.TEXTURE_2D, this.tex);
	
	if (this.changed)
		gl.texImage2D(gl.TEXTURE_2D,0, gl.ALPHA, this.lvl*this.lvl*2,1, 0, gl.ALPHA,
			gl.FLOAT, this.oscs);
	
	gl.uniform1f(this.prog.u_time, t);
	gl.uniform1i(this.prog.u_lvl, this.lvl);
  gl.uniform1i(this.prog.u_mode, this.mode);
  gl.uniform1f(this.prog.u_resolution, this.resolution);
	gl.uniform1i(this.prog.u_oscs, 0);
	gl.activeTexture(gl.TEXTURE0 + 0);
	gl.bindTexture(gl.TEXTURE_2D, this.tex);
	
	this.changed = false;
};
//
QSquareShader.prototype.set = function(x, y, amp, ph) {
	this.oscs[(x + y*this.lvl)*2] = amp;
	this.oscs[(x + y*this.lvl)*2 + 1] = ph;
	this.changed = true;
};
//
QSquareShader.prototype.scanprep = function(x, h, size) {
  var prep = {size: size, vert: [], hori: [], buf: new Float32Array(size)};
  
  var step = h / size;
  var y = 0.0;
  
  for (var nx = 0; nx < this.lvl; nx++) {
     prep.hori.push(
       Math.sin(Math.PI*(nx+1)*x)
     );
  }
  
  for (var i = 0; i < size; i++) {
    var vert = [];
    if (y>1.0) y-=1.0;
    
    for (var ny = 0; ny < this.lvl; ny++) {
      vert.push(
        Math.sin(Math.PI*(ny+1)*y)
      );
    }
    
    prep.vert.push(vert);
    
    y += step;
  }
  
  //this.prog = new Program('vertex', 'audiofrag');
  
  return prep;
};

QSquareShader.prototype.scan = function(prep, tim, t, buf) {
  var size = prep.size;
  var tim = time;
  var tstep = t / buf;
  
  var img = 0.0, r = 0.0;
  var i = 0; nx = 0; ny = 0;
  var mag = 0.0;
  var phase = 0.0, bigphase = 0.0;
  var index = 0;
  
  var lvl = this.lvl;
  var lvl2 = lvl*2;
  var pi = 1.0 / Math.PI;
  
  var oscs = this.oscs;
  
  for (i = 0; i < size; i++) {
    buf[i] = 0;
    prep.buf[i] = 0;
  }
 
  for (nx = 0; nx < lvl; nx++) {
    if (prep.hori[nx] == 0.0) continue;
    //index = nx * 2;
    
    for (ny = 0; ny < lvl; ny++) {
      //if (prep.vert[i][ny] == 0.0) continue;
      
      index = (nx + ny*lvl)*2;
      
      mag = oscs[index];
      if (mag == 0.0) continue;
      mag *= prep.hori[nx];
      
      phase = oscs[index + 1] * pi +
        ((nx+1)*(nx+1) + (ny+1)*(ny+1))*tim;
      phase *= 32.0;
      
      bigphase = Math.floor(phase);
      phase -= bigphase;
      bigphase = bigphase % 64;
      
      for (i = 0; i < size; i++) {
        buf[i] += this.cos(bigphase, phase) * mag * prep.vert[i][ny];
        prep.buf[i] += this.sin(bigphase, phase) * mag * prep.vert[i][ny];
      }
      
      //index += lvl2;
    }
  }
    
  for (i = 0; i < size; i++) {
    buf[i] = (buf[i]*buf[i] + prep.buf[i]*prep.buf[i]) * 0.1;
    //if (buf[i] > 1.0) buf[i] = 1.0;
  }
};

// f(x) = cn*sin(pi*n*x)
// cn = 2*integral(0,1, f(x)*sin(pi*n*x))
QSquareShader.prototype.fourier = function(f, res) {
  var oscs = new Float32Array(this.lvl*this.lvl*2);
	
	var step = 1.0 / res;
	for (var x = 0.0; x < 1.0; x+=step) {
		for (var y = 0.0; y < 1.0; y+=step) {
			var val = f(x, y) * step * step * 2.0;
			
			for (var nx = 0; nx < this.lvl; nx++) {
        var fac = Math.sin(Math.PI*(nx+1)*x);
				for (var ny = 0; ny < this.lvl; ny++) {
					oscs[(nx + ny*this.lvl)*2] +=
						val * fac * Math.sin(Math.PI*(ny+1)*y);
				}
			}
		}
	}
  
  return oscs;
};
//
QSquareShader.prototype.fourier2 = function(f, res) { // fourier with imaginary (momentum)
  var imag = new Float32Array(this.lvl*this.lvl);
  var real = new Float32Array(this.lvl*this.lvl);
  var oscs = new Float32Array(this.lvl*this.lvl*2);
  
  var step = 1.0 / res;
  var fac0 = step * step * 2.0;
	for (var x = 0.0; x < 1.0; x+=step) {
		for (var y = 0.0; y < 1.0; y+=step) {
			var val = f(x, y);
			
			for (var nx = 0; nx < this.lvl; nx++) {
        var fac1 = Math.sin(Math.PI*(nx+1)*x) * fac0;
				for (var ny = 0; ny < this.lvl; ny++) {
          var fac2 = Math.sin(Math.PI*(ny+1)*y);
					real[nx + ny*this.lvl] += fac1*fac2* val[0];
					imag[nx + ny*this.lvl] += fac1*fac2* val[1];
				}
			}
		}
	}
  
  for (var i = 0; i < this.lvl*this.lvl; i++) {
    oscs[i*2] = Math.sqrt(real[i]*real[i] + imag[i]*imag[i]);
    oscs[i*2 + 1] = Math.atan2(real[i], imag[i]) + Math.PI * 2.0;
  }
  
  return oscs;
}
//
QSquareShader.prototype.gauss = function(mx, my, sigma, res, mag) {
  mag = mag || 1.0;
	return this.fourier(function(x, y) {
		return mag/(sigma*sigma*2.0*Math.PI) *
			Math.exp( -((x-mx)*(x-mx) + (y-my)*(y-my)) /
												(sigma*sigma));
	}, res);
};
//
QSquareShader.prototype.gaussmove = function(mx, my, sigma, res, vx, vy, mag) {
  mag = mag || 1.0;
	return this.fourier2(function(x, y) {
    var r = mag/(sigma*sigma*2.0*Math.PI) *
			Math.exp( -((x-mx)*(x-mx) + (y-my)*(y-my)) /
												(sigma*sigma));
    var angle = vx * x + vy * y;
		return [r * Math.cos(angle), r * Math.sin(angle)];
	}, res);
};
//
QSquareShader.prototype.random = function(mag) {
  mag = mag || 0.1;
	for (var i = 0; i < this.lvl*this.lvl*2; i+=2) {
		this.oscs[i] = Math.random()*mag;
		this.oscs[i+1] = Math.random() * Math.PI * 2.0;
	}
	this.changed = true;
};
//
QSquareShader.prototype.reset = function() {
	for (var i = 0; i < this.lvl*this.lvl*2; i++)
		this.oscs[i] = 0;
	this.changed = true;
};
