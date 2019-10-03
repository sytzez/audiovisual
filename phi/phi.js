
var phi = (1 + Math.sqrt(5)) * 0.5;
var lnphi = Math.log(phi);
var invlnphi = 1.0 / lnphi;
var limit = Math.pow(phi, 12);

function Phi(x) {
  x = x % limit;
  while (x > phi) {
    x -= Math.pow(phi, Math.floor(Math.log(x) * invlnphi));
  }
  return x;
}

function PhiSaw(x) {
  x = Phi(x);
  if (x > 1.0) x = (x - 1.0) * phi;
  return x;
}

function PhiTriangle(x) {
  x = Phi(x);
  if (x > 1.0) x = 1.0 - (x - 1.0) * phi;
  return x;
}

function PhiSine(x) {
  return Math.cos(PhiTriangle(x) * Math.PI * 2.0);
}

function PhiBool(x) {
  return Phi(x) > 1.0
}