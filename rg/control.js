var mx = 0.0, my = 0.0;
var step = 0;
var steptime = 1.0;
var stepinv = 1.0;
var stepfunc = function() {};

function Controller(val) {
	this.value = val;
	this.value2 = val;
	this.freq = 0.0;
	this.from = performance.now();
	
	this.get = getFlat;
	
	this.set = function(v) {
		this.value = v;
		this.get = getFlat;
	};
	this.setLinear = function(v1, v2) {
		this.value = v1;
		this.value2 = v2
		this.from = performance.now();
		this.get = getLinear;
	};
	this.setSmooth = function(v) {
		this.value = this.get();
		this.value2 = v;
		this.from = performance.now();
		this.get = getLinear;
	};
	this.setSine = function(off, amp, freq) {
		this.value = off;
		this.value2 = amp;
		this.freq = freq;
		this.get = getSine;
	};
	this.setPulse = function(v1, v2) {
		this.value2 = v1;
		this.value = v2;
		this.get = getPulse;
	}
	this.twitch = function(v) {
		this.value2 = v;
		this.get = getPulse;
	}
	this.setMouseX = function(v1, v2) {
		this.value = v1;
		this.value2 = v2;
		this.get = getMouseX;
	}
	this.setMouseY = function(v1, v2) {
		this.value = v1;
		this.value2 = v2;
		this.get = getMouseY;
	}
}


function getFlat() {
	return this.value;
}

function getLinear() {
	var now = performance.now();
	if (now >= this.from + steptime) {
		this.value = this.value2;
		this.get = getFlat;
		return this.value;
	}
	return this.value + (this.value2 - this.value) * (now - this.from) * stepinv;
}

function getSine() {
	return this.value + this.value2 * Math.sin((performance.now() - this.from) * this.freq);
}

function getPulse() {
	this.get = getFlat;
	return this.value2;
}

function getMouseX() {
	return this.value + (this.value2 - this.value) * mx;
}

function getMouseY() {
	return this.value + (this.value2 - this.value) * my;
}

/*
document.onmousemove = function(event) {
	mx = event.pageX * 1.0 / window.innerWidth;
	my = event.pageY * 1.0 / window.innerHeight;
};
*/

var keys = [];
document.addEventListener('keyup', function(e) {
	keys[e.keyCode] = false;
}, false);

document.addEventListener('keydown', function(e) {
	keys[e.keyCode] = true;
}, false);
