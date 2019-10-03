
function start() {
  voices = [];
  new Voice(2,4,1);
  new Voice(3,5,2);
  new Voice(4,6,3);
  new Voice(5,7,4);
  new Voice(6,8,5);
  new Voice(7,9,6);
  new Voice(8,10,7);
  new Voice(9,11,8);
  new Voice(10,12,9);

  startaudio();
  updatevoices();
}

function stop() {
  voices = [];
}

var rhythmflip = false;
var leftbound = 2;
var rightbound = 6;
var rhythmspeed = 4;
var gaps = 3

function updatevoices() {
  if (voices.length == 0) return;
  
  for (var i = 0; i < 9; i++) {
    voices[i].active = (leftbound <= i && i <= rightbound);
    voices[i].setSaw(rhythmspeed + i * (rhythmflip ? -1 : 1));
    voices[i].setBool(rhythmspeed + i * (rhythmflip ? -1 : 1) - gaps);
  }
};
