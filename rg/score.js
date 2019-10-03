var lastperiod = 0;
var stepp = 0.0;

function period(time) {
	lastperiod += time;
	if (step < lastperiod) {
		stepp = ((step - lastperiod) / time) + 1.0;
		return true;
	}
	return false;
}

function go(a, b) {
	return a + (b-a)*stepp;
}

function goe(a, b, e) {
	return a + (b-a) * Math.pow(stepp, e);
}

function play() {
	paused = false;

	step = 0;
	scanPos = 0;
	stereo = false;
	
	cMoveX.set(1024.0);
	cScaleX.set(1024.0);

	cKill.setPulse(0.0, 1.0);
	cIntense.set(0.0);
	cTwist.set(0.125 * Math.PI);
	cDense.set(0.0);
	cPick.set(0);

	cWidth.set(0.0);
	cPeriod.set(0.0);
	cPick1.set(0);

	pswitch = false;

	p = p_twist;

	stepfunc = score;

	audio.resume();
}

function stop() {
	audio.suspend();
	paused = true;
}

function score() {
	lastperiod = 0;
	
	switch(true) { // (1000=0:45 ; 2000=1:30 ; 3000=2:15 ; 4000=3:00 ; 5000=3:45)
	case period(4000): // 4000 organ
		cDense.setSmooth(goe(3.0, 15.0, 0.5));
		cIntense.setSmooth(go(0.02, 0.15));
		cTwist.setSmooth(goe(0.0, 0.5 * Math.PI, 3.0));
		break;
	case period(100):
		cDense.setSmooth(15.0);
		cIntense.setSmooth(goe(0.15, 0.05, 1.5));
		cTwist.setSmooth(0.5 * Math.PI);
		break;
	case period(30):
		cDense.setSmooth(goe(15.0, 2.0, 3.0));
		break;
	case period(1500):
		stereo = true;
		cPick.set(2);
		cIntense.setSmooth(go(0.05, 0.2));
		cDense.set(goe(2.0, 5.0, 0.02));
		cTwist.set(go(0.02, 0.0));

		break;
	case period(250):
		pswitch = true;
		cWidth.setSmooth(goe(0.0, 0.05, 2.0));
		cPeriod.setSmooth(goe(0.0, 0.3, 4.0));

		cIntense.setSmooth(goe(0.2, 0.15, 3.0));
		cTwist.setSmooth(goe(0.00, 0.25 * Math.PI, 4.0));
		break;
	case period(20):
		cWidth.setSmooth(goe(0.05, 0.5, 3.5));
		cPeriod.setSmooth(0.3);

		cTwist.setSmooth(0.75 * Math.PI);

		break;
	case period(80):
		pswitch = false;
		p = p_wave;

		cWidth.setSmooth(goe(0.5, 0.01, 1.5));

		break;
	case period(400): // cool stereo
		cPeriod.setSmooth(goe(0.3, 6.0, 0.7));
		cWidth.setSmooth(0.01);

		break;
	case period(150):
		cWidth.setSmooth(go(0.01, 0.1, 0.1));
		cPeriod.setSmooth(goe(6.0, 0.0, 3.5));
		cMoveX.setSmooth(goe(1024.0, 1424.0, 2.0)); 

		break;
	case period(200):
		cPick1.set(2);
		cPeriod.setSmooth(0);
		cWidth.setSmooth(goe(0.1, 0.34, 3.0));

		cMoveX.setSmooth(goe(1424.0, 1024.0, 0.1))
		break;
	case period(200):
		cPeriod.setSmooth(goe(0.0, 1.2, 2.0));
		cWidth.setSmooth(go(0.34, 0.17));
		break;
	case period(400):
		cPeriod.setSmooth(goe(1.2, 2.5, 0.5));
		cWidth.setSmooth(goe(0.17, 0.5, 0.5));
		break;
	case period(400):
		//cPick1.set(3);
		cScaleX.setSmooth(goe(1024, 1.0, 2.5));
		cPeriod.setSmooth(goe(2.5, 0.0, 5.0));
		cWidth.setSmooth(goe(0.5, 1.0, 2.0));
		cKill.setSmooth(goe(1.0, 0.98, 2.5));
		break;
	case period(1):
		cPick1.set(1);
		cKill.set(1.0);
		cPeriod.setSmooth(0.0);
		break;
	case period(50): // 7800
		cScaleX.setSmooth(goe(1.0, 1024.0, 5.0));
		break;
	case period(1):
		p = p_twist;
		cScaleX.set(1024.0);
		cTwist.set(-0.125 * Math.PI);
		cIntense.set(0.2);
		cDense.set(0.0);
		cPick.set(1);
		stereo = false;
		break;
	case period(600):
		cDense.setSmooth(go(1.5, 30.0));
		cIntense.setSmooth(goe(0.2, 0.02, 0.5));
		break;
	case period(40):
		cTwist.setSmooth(goe(-0.125 * Math.PI, 0.0, 3.5));
		cKill.setSmooth(goe(1.0, 0.95, 2.0));
		cDense.setSmooth(goe(30.0, 0.0, 1.0));
		break;
	case period(1):
		stereo = true;
		p = p_twist;
		//cKill.twitch(0.0);
		cScaleX.set(1000.0);
		cPick.set(3);
		cDense.set(5.08);
		cTwist.set(0.03);
		cKill.set(1.0);
		break;
	case period(200):
		cIntense.setSmooth(goe(0.1, 0.25, 2.0));
		cDense.setSmooth(goe(5.08, 4.9, 3.0));
		cTwist.setSmooth(goe(0.03, 0.011, 3.0));
		break;
	case period(20):
		cIntense.setSmooth(goe(0.25, 0.5, 3.0));
		break;
	case period(100):
		p = p_old;
		cScaleX.set(2048 - 100);
		cScaleY.set(1024);
		cOsc1.set(12.45);
		cOsc2.set(11.45);
		cOsc3.set(11.95);
		cOsc4.set(11.95);
		break;
	case period(500):
		cOsc1.setSmooth(goe(12.45, 6.35, 2.0));
		cOsc2.setSmooth(goe(11.45, 5.85, 2.0));
		cOsc3.setSmooth(goe(11.95, 6.1, 2.0));
		cOsc4.setSmooth(goe(11.95, 6.1, 2.0));
		break;
	case period(70):
		break;
	case period(400):
		cOsc1.setSmooth(goe(6.35, 3.0, 2.0));
		cOsc2.setSmooth(goe(5.85, 9.2, 2.0));
		break;
	case period(100):
		cOsc3.setSmooth(goe(6.1, 50.0, 3.0));
		cOsc4.setSmooth(goe(6.1, 50.0, 3.0));
		break;
	case period(100):
		cOsc1.setSmooth(goe(3.0, 0.0, 3.0));
		cOsc2.setSmooth(goe(9.2, 0.0, 3.0));
		//cScaleX.setSmooth(goe(2048 - 100, 2048 - 2000, 3.0));
		break;
	case period(50):
		cOsc3.setSmooth(goe(50.0, 0.0, 2.0));
		cOsc4.setSmooth(goe(50.0, 0.0, 2.0));
		break;
	case period(10):
		break;
	case period(1200): // 9990
		if (step % 4 == 0) {
			cKill.twitch(0.5 + Math.random(0.5));
		}
		cScaleX.setSmooth(goe(1024, Math.random() * 2048.0, 4.0));
		cScaleY.setSmooth(goe(512, Math.random() * 1024.0, 4.0));
		cMoveX.setSmooth(1024);
		cMoveY.setSmooth(512);
		
		cShift.set(0.0);
		cPeriod.setSmooth(goe(0.0, -20.0 + Math.random() * 40.0, 4.0));
		cPhase.set(0.0);
					

		if (step % Math.floor(goe(20, 1, 0.7)) == 0) {
			if (Math.random() < 0.4) {
				p = p_wave;
				cPick1.set(Math.random() * 2.0);
				cWidth.setSmooth(Math.pow(Math.random(), 4.0) * 0.3);
			} else if (Math.random() < 0.7) {
				p = p_twist;
				cDense.setSmooth(Math.random() * 10.0);
				cIntense.setSmooth(goe(0.1, Math.random() * 0.2 + 0.1, 3.0));
				cTwist.setSmooth(goe(Math.random() * 14.0, 0.0, 3.0));
				cPick.set(Math.random() * 3.0);
			} else {
				p = p_old;
				var bla = Math.random() * 10.0;
				cOsc1.setSmooth(bla * 0.95);
				cOsc2.setSmooth(bla * 1.05);
				cOsc3.setSmooth(bla);
				cOsc4.setSmooth(bla);
			}
		}
		break;
	case period(200):
		p = p_twist;
		cScaleX.set(1024.0);
		cScaleY.set(512.0);
		cMoveX.set(1024.0);
		cMoveY.set(512.0);
		cPick.set(0);
		cPick1.set(1);
		cTwist.setSmooth(goe(1.0, 0.03, 0.2));
		cDense.setSmooth(go(10.0, 0.5));
		cIntense.setSmooth(goe(0.3, 0.1, 4.0));

		cWidth.set(2.0);
		cPeriod.set(0.0);
		//cKill.setSmooth(goe(1.0, 0.0, 5.0));
		break;
	case period(200):
		p = p_wave;
		cWidth.setSmooth(goe(0.3, 0.01, 0.5));
		cPeriod.setSmooth(goe(0.3, 9.0, 3.0));
		//if (step % Math.floor(go(10, 1)) == 0) cKill.twitch(0.0);
		break;
	case period(50):
		cPeriod.setSmooth(go(9.0, 512.0));
		cKill.setSmooth(goe(1.0, 0.0, 2.0));
		break;
	case period(1000):
		cKill.set(0);
		break;
	}
};

