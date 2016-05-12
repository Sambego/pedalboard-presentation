/* General
 * ---------------------------------- */
const audioContext = new AudioContext();

/* Gain
 * ---------------------------------- */
const createGainOscilloscope = () => {
    const gainOscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const gainOscilloscope = new Oscilloscope('.js-oscilloscope--gain', audioContext);

    gainOscillator.type = 'sine';
    gainOscillator.frequency.value = 400;
    gainOscillator.start();

    gainOscillator.connect(gain);
    gain.connect(gainOscilloscope.analyserNode);
    gainOscilloscope.start();


    [].forEach.call(document.querySelectorAll('.js-button--gain'), button => {
        button.addEventListener('mouseup', event => {
            gain.gain.value = event.target.dataset.gain;
        });
    });
};

const destroyGainOscilloscope = () => {
    document.querySelector('.js-oscilloscope--gain').innerHTML = '';
}

/* Oscillator
 * ---------------------------------- */
const createWaveshaperOscilloscope = () => {
    const waveshaperOscillator = audioContext.createOscillator();
    const waveshaperOscilloscope = new Oscilloscope('.js-oscilloscope--waveshaper', audioContext);
    const waveshaper = audioContext.createWaveShaper();
    const calculateDistortionCurve = function(intens) {
        const intensity = parseInt(intens) || 100,
            amount = 44100,
            deg = Math.PI / 180,
            curve = new Float32Array(amount);
        let i = 0,
            x;

        for (; i < amount; ++i ) {
            x = i * 2 / amount - 1;
            curve[i] = ( 3 + intensity ) * x * 20 * deg / ( Math.PI + intensity * Math.abs(x) );
        }

        return curve;
    };


    let toggleWaveshaper = false;

    waveshaperOscillator.type = 'sine';
    waveshaperOscillator.frequency.value = 400;
    waveshaperOscillator.start();

    waveshaper.curve = calculateDistortionCurve(150);

    waveshaperOscillator.connect(waveshaperOscilloscope.analyserNode);

    waveshaperOscilloscope.start();

    document.querySelector('.js-button--waveshaper').addEventListener('mouseup', () => {
        if (toggleWaveshaper) {
            waveshaperOscillator.disconnect();
            waveshaper.disconnect();

            waveshaperOscillator.connect(waveshaperOscilloscope.analyserNode);
        } else {
            waveshaperOscillator.disconnect();

            waveshaperOscillator.connect(waveshaper);
            waveshaper.connect(waveshaperOscilloscope.analyserNode)
        }

        toggleWaveshaper = !toggleWaveshaper;
    });
}

const destroyWaveshaperOscilloscope = () => {
    document.querySelector('.js-oscilloscope--waveshaper').innerHTML = '';
}

/* Oscillator
 * ---------------------------------- */
const createOscilloscope = () => {
    const oscillator = audioContext.createOscillator();
    const oscilloscope = new Oscilloscope('.js-oscilloscope--oscillator', audioContext);

    let sound = false;

    oscillator.type = 'sine';
    oscillator.frequency.value = 400;
    oscillator.start();

    oscillator.connect(oscilloscope.analyserNode);
    oscilloscope.start();


    [].forEach.call(document.querySelectorAll('.js-button--oscillator-type'), button => {
        button.addEventListener('mouseup', event => {
            oscillator.type = event.target.dataset.type;
        });
    });

    [].forEach.call(document.querySelectorAll('.js-button--oscillator-speed'), button => {
        button.addEventListener('mouseup', event => {
            oscillator.frequency.value = event.target.dataset.speed;
        });
    });

    document.querySelector('.js-button--oscillator-sound').addEventListener('mouseup', () => {
        if (sound) {
            oscilloscope.analyserNode.disconnect()
        } else {
            oscilloscope.analyserNode.connect(audioContext.destination);
        }

        sound = !sound;
    });
}

const destroyOscilloscope = () => {
    document.querySelector('.js-oscilloscope--oscillator').innerHTML = '';
}
