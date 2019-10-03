// precalculated systems for quick live performance
var system = [
  //qss.gauss2(0.5, 0.5, 0.333, 64, 0.7),
  qss.gauss(0.5, 0.5, 0.1, 64, 0.2),
  qss.gaussmove(0.5, 0.5, 0.1, 64, 0.0, -5.0, 0.2),
  qss.gaussmove(0.5, 0.5, 0.08, 64, 0.0, 10.0, 0.2), // 0.1
  qss.gaussmove(0.5, 0.5, 0.05, 64, 0.0, -15.0, 0.1), // 0.15
  qss.gaussmove(0.5, 0.5, 0.9, 64, 0.0, 0.0, 2.0),// slower
  qss.gaussmove(0.5, 0.5, 0.2, 64, 0.0, 20.0, 0.5),// color
  
  qss.gaussmove(0.5, 0.5, 0.25, 64, 30.0, 30.0, 1.0), 
  qss.gaussmove(0.1, 0.1, 0.2, 64, 10.0, 30.0, 1.0),
  qss.gaussmove(0.9, 0.1, 0.15, 64, -40.0, 10.0, 1.0),
  qss.gaussmove(0.9, 0.9, 0.1, 64, -40.0, -40.0, 0.7),
  
  qss.gaussmove(0.5, 0.5, 0.2, 64, 5.0, 0.0, 1.0),
];

var squares = [];
for (var i=0; i<16; i++) {
  for (var i2=i+1; i2<16; i2++) {
    squares.push(i*i+i2*i2);
  }
}
squares.sort(function(a,b){return a-b});

var timeline = [
  [80, 1.3, GridDown],
  [60, 1.2, GridUpRev],
  [10 - 0.5, 0.0, function() {
    clockspeed = 0.000025;
    qss.oscs = system[0];
    qss.changed = true; zero = clock - 500.0;
  }],
  [10, 0.0, function() {
    qss.oscs = system[1];
    qss.changed = true; zero = clock;
  }],
  [10, 0.0, function() {
    qss.oscs = system[2];
    qss.changed = true; zero = clock;
  }],
  [9, 0.0, function() {
    qss.oscs = system[3];
    qss.changed = true; zero = clock;
  }],
  [2, 0.0, function() { // slowdown
    var i = (clock - zero) * clockspeed;
    clockspeed = 0.0000125;
    zero = clock - i/clockspeed;
  }],
  [40, 0.0, function() {
    clockspeed = 0.000025;
    qss.oscs = system[5];
    qss.changed = true; zero = clock;
    qss.mode = 1;
  }],
  [16, 0.0, function() {
    clockspeed = 0.000005;
    zero = clock - 40000 * 5;
    qss.mode = 0;
  }],
  [25, 1.0, function(t) {
    for (var i = 0; i < qss.lvl*qss.lvl; i++) {
      if (i%qss.lvl != 0) qss.oscs[i*2] *= 0.995;
      else qss.oscs[i*2] += ((i/qss.lvl*0.02)-qss.oscs[i*2])*0.001;
    }
    qss.changed = true;
  }],
  [5, 1.0, function(t) {
    for (var i = 0; i < qss.lvl*qss.lvl; i++) {
      if (i != 15*16) qss.oscs[i*2] -= Math.min(qss.oscs[i*2], 0.001);
      else qss.oscs[i*2] += Math.min(0.4-qss.oscs[i*2], 0.001);
    }
    qss.changed = true;
  }],
  [0.1, 0.0, function() {
    qss.reset();
    qss.set(0,15,0.4,0.0);
    qss.changed = true;
    clockspeed = 0.0001;
  }],
  [60, 1.2, VertDown],
  [10, 2.0, VertDowner],
  [9, 0.0, function() {
    qss.oscs = system[6];
    qss.changed = true; zero = clock;
    clockspeed = 0.00005;
  }],
  [3.3, 0.0, function() {
    qss.mode = 1;
  }],
  [8, 0.0, function() {
    qss.mode = 0;
  }],
  [10, 0.0, function() {
    qss.oscs = system[7];
    qss.changed = true; zero = clock;
    qss.mode = 1;
    clockspeed = 0.00005;
  }],
  [10, 0.0, function() {
    qss.mode = 0;
    qss.oscs = system[8];
    qss.changed = true; zero = clock;
    clockspeed = 0.00005;
  }],
  [10, 1.5, function(t) {
    var i = (clock - zero) * clockspeed;
    clockspeed = 0.0001 * t + 0.00005;
    zero = clock - i/clockspeed;
  }],
  [3, 0.0, function() {
  }],
  [7, 1.0, function(t) {
    var i = Math.floor((0.99-t)*16)
    for (var x = 0; x<16; x++) {
      qss.set(x,i,0,0);
      //qss.set(i,x,0,0);
    }
  }],
  [0.5, 0.0, function() {
    clockspeed = 0.00015;
    qss.oscs = system[9];
    qss.changed = true; zero = clock;
  }],
  [6, 0.5, function(t) {
    var i = Math.floor((0.99-t)*16)
    for (var x = 0; x<16; x++) {
      //qss.set(x,i,0,0);
      qss.set(i,x,0,0);
    }
  }],
  [60, 1.5, function(t) {
    clockspeed = 0.001;
    
    t*=squares.length;
    s = squares[Math.floor(t)];
    for (var x = 0; x<16; x++) {
      for (var y = x; y<16; y++) {
        //qss.set(x,i,0,0);
        if (x*x + y*y == s) {
          qss.set(x,y,0.5,t*Math.PI);
          qss.set(y,x,0.5,0);
        } else {
          qss.set(x,y,0,0);
          qss.set(y,x,0,0);
        }
     }
    }
  }],
  [30, 1.8, function(t) {
    clockspeed = 0.000001;
    
    t=(1.0-t)*(squares.length-1);
    s = squares[Math.floor(t)];
    qss.mode=1;
    for (var x = 0; x<16; x++) {
      for (var y = x; y<16; y++) {
        //qss.set(x,i,0,0);
        if (x*x + y*y == s) {
          qss.set(x,y,0.7,Math.PI*1.0*t);
          qss.set(y,x,0.7,0);
        } else {
          qss.set(x,y,0,0);
          qss.set(y,x,0,0);
        }
     }
    }
  }],
  [20, 0.0, function() {
    clockspeed = 0.00005;
    qss.oscs = system[10];
    qss.mode=1;
    qss.changed = true; zero = clock;
  }],
  [10, 1.0, function(t) {
    var i = Math.floor((0.99-t)*16)
    for (var i = 1; i<16*16; i++) {
      qss.oscs[i*2] -= Math.min(qss.oscs[i*2], 0.001);
    }
    qss.changed = true;
  }],
  [1, 0.0, function() {
    cancel();
  }]
];

function cancel() {
  goto(100);
  qss.reset();
}

var clock = performance.now();
var zero = performance.now();
var clockspeed = 0.00005;//15;
var time = 0;

var keyframe = 0;
var keyclock = 0;

function goto(k) {
  keyframe = k;
  keyclock = clock;
  if (!timeline[keyframe]) return;
  if (timeline[keyframe][1] == 0.0) timeline[keyframe][2]();
}

function UpdateTimeline() {
	clock = performance.now();
  if (clockspeed <= 0.0) clockspeed = 0.00005;
  time = (clock-zero) * clockspeed;
  if (keyclock == 0) keyclock = clock;
  
  if (keyframe >= timeline.length) return;
  if ((clock-keyclock)*0.001 > timeline[keyframe][0]) {
    keyframe++;
    //console.log('kf: ' + keyframe);
    if (keyframe >= timeline.length) return;
    keyclock = clock;
    if (timeline[keyframe][1] == 0.0) timeline[keyframe][2]();
  }
  var kf = timeline[keyframe];
  
  if (kf[1] != 0.0)
    kf[2]( Math.pow(
      (clock-keyclock)*0.001/kf[0],
      kf[1]
    ) );
}
//
function GridDown(t) {
 for (var i = 0; i < 15; i++) {
    qss.set(i, i,
      (Math.min(1.0,Math.max(0.0, (t*15.0)+i-14 )))*0.4
    , 0.0);
  }
}

function GridUpRev(t) {
 for (var i = 0; i < 15; i++) {
    qss.set(i, i,
      (Math.min(1.0,Math.max(0.0, ((1.0-t)*14.0 + 1.0)-i )))*0.4
    , 0.0);
  }
}

function VertDown(t) {
  for (var i = 0; i < 16; i++) {
    qss.set(0, i,
      (Math.min(1.0,Math.max(0.0, (t*15.0)+i-14 )))*0.4
    , 0.0);
  }
}

function VertDowner(t) {
  for (var i = 0; i < 16; i++) {
    qss.set(0, i,
      (Math.min(1.0,Math.max(0.0, ((1.0-t)*14.0 + 1.0)-i )))*0.4
    , 0.0);
  }
}

draw();