(function() {
  var bars = document.getElementsByClassName("bar");

  // show UI on mouse move
  var hidden = true;
  var hideTimeout = 0;
  window.addEventListener("mousemove", function() {
    if (hidden) {
      for (var i = 0; i < bars.length; i++)
        bars[i].classList.remove("hidden");

      hidden = false;
    }

    // hide UI after 5 seconds
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(function() {
      for (var i = 0; i < bars.length; i++)
        bars[i].classList.add("hidden");

      hidden = true;
    }, 5000);
  });

  
  var midibutton = document.getElementById("midi");
  var mididevselect = document.getElementById("mididevice");

  // no button means no midi needed
  if (midibutton == null) return;

  var midi;
  var midimode = 0;
  // 0 = not enabled
  // 1 = enabled
  // 2 = linking: choose slider
  // 3 = linking: choose midi input
  var mididev;

  var midimatrix = [];
  var lastslider = null;

  function midiHandle(e) {
    if (e.data[0] != 176) return;

    if (midimode == 1 || midimode == 2) { // normal
      var slider = midimatrix[e.data[1]];
      if (slider != null) {
        slider.value = Math.round(e.data[2] / 127.0 * (slider.max - slider.min)) + slider.min;
      }
    } else if (midimode == 3) { // assign
      midimatrix[e.data[1]] = lastslider;
    }
  }

  function sliderHandle(e) {
    if (midimode == 2) {
      lastslider = e.srcElement;
      midibutton.innerHTML = "move a MIDI control...";
      midimode = 3;
    } else if (e.srcElement != lastslider) {
      midimode = 1;
      midibutton.innerHTML = "link MIDI input"
    }
  }

  midibutton.addEventListener("click", function() {
    // enable midi
    if (midimode == 0) {
      midibutton.innerHTML = ". . .";
      navigator.requestMIDIAccess().then(
        function(access) {
          midibutton.disabled = true; // disable until device selected

          midi = access;

          // list input devices
          mididev = midi.inputs;
          mididev.forEach(function(input, i) {
            var opt = document.createElement("option");
            opt.value = i;
            opt.innerHTML = i + ": " + input.name;
            mididevselect.appendChild(opt);
            //input.onmidimessage = midiHandle;
          });
          mididevselect.disabled = false;

          // change input device
          mididevselect.addEventListener("change", function(e) {
            // unplug other devices
            mididev.forEach(function(input) {
              input.onmidimessage = function(e) {};
            });
            // plug in new device
            if (mididev.has(e.srcElement.value)) {
              mididev.get(e.srcElement.value).onmidimessage = midiHandle;
              midibutton.disabled = false;
            } else {
              midibutton.disabled = true;
            }
          });

          // search document for sliders
          var sliders = document.getElementsByClassName("slider");
          for (var i = 0; i < sliders.length; i++)
            sliders[i].addEventListener("input", sliderHandle);

          midibutton.innerHTML = "link MIDI input";
          midimode = 1;
        }, 
        function(err) {
          // TODO: handle nicely
          alert("failed to get MIDI access: " + err.message);
        }
      )
    } else if (midimode == 1) { // link
      midibutton.innerHTML = "move a slider..."
      lastslider = null;
      midimode = 2;
    } else if (midimode == 2 || midimode == 3) { // cancel link
      midibutton.innerHTML = "link MIDI input";
      midimode = 1;
    }
  });

})();

function showMidiHelp() {
  document.getElementById("midihelp").hidden = false;
}