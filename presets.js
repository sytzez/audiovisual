
var PresetParams = [];
var Presets = [];
var PresetSelector = document.getElementById("presets");

function InitPresets() {
  var controls = document.getElementsByClassName("inpreset");

  for (var i = 0; i < controls.length; i++)
    new PresetParam(controls[i]);
  
  PresetSelector.addEventListener("change", function() {
    Presets[PresetSelector.value].apply();
  } );
}

var PresetParam = function(el) {
  this.el = el;

  PresetParams.push(this);
};

var Preset = function(name, params) {
  this.params = params;

  var option = document.createElement("option");
  option.text = name;
  option.value = Presets.length;

  PresetSelector.add(option);

  Presets.push(this);
};

Preset.prototype.apply = function() {
  var el;
  for (var i = 0; i < this.params.length; i++) {
    el = PresetParams[i].el;
    
    el.value = this.params[i];

    if (el.nodeName == "INPUT") {
      FireEvent(el, "input");
    } else if (el.nodeName == "SELECT") {
      FireEvent(el, "change");
    }
  }
};

function getPreset() {
  var data = [];

  PresetParams.forEach( function(param) {
    data.push(param.el.value);
  } );

  console.log(data);
  console.log(JSON.stringify(data));
}

function FireEvent(el, type) {
  if ("createEvent" in document) {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent(type, false, true);
    el.dispatchEvent(evt);
  } else {
    el.fireEvent("on" + type);
  }
}