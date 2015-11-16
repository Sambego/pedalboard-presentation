'use strict';

var togglePlayground = !function() {
	var Playground = new AudioPlayground('.js-audio-playground'),
		playground = document.querySelector('.js-playground'),
		toggles = document.querySelectorAll('.js-toggle-playground'),
		i = 0;

	for (; i < toggles.length; i++) {
		toggles[i].addEventListener('click', function(e) {
			var content = this.dataset.content;

			e.preventDefault();

			playground.classList.toggle('active');

			Playground.setContent(content);
		});
	};

	Playground.addToConfig('gain', 'var oscillator = this.audioContext.createOscillator();\n    oscillator.type = \'sine\';\n    oscillator.frequency.value = 400;\n    oscillator.start();\n\nvar gainNode = this.audioContext.createGain();\n    gainNode.gain.value = 0.5;\n\nvar oscilloscope = new Oscilloscope(\'.audio-playground__oscilloscope\', this.audioContext);\n    oscillator.connect(gainNode);\n    gainNode.connect(oscilloscope.analyserNode);\n    oscilloscope.start();');
	Playground.addToConfig('waveShaper', 'var oscillator = this.audioContext.createOscillator();\n    oscillator.type = \'sine\';\n    oscillator.frequency.value = 400;\n    oscillator.start();\n\nvar waveShaperNode = this.audioContext.createWaveShaper();\n    waveShaperNode.oversample = \'4x\';\n    waveShaperNode.curve = function() {\n        var intensity = 50,\n            amount = 44100,\n            curve = new Float32Array(amount),\n            deg = Math.PI / 180,\n            i = 0,\n            x;\n\n        for (; i < amount; i++ ) {\n            x = i * 2 / amount - 1;\n            curve[i] = ( 3 + intensity ) * x * 20 * deg / ( Math.PI + intensity * Math.abs(x));\n        }\n\n        return curve;\n    };\n\nvar oscilloscope = new Oscilloscope(\'.audio-playground__oscilloscope\', this.audioContext);\n    oscillator.connect(waveShaperNode);\n    waveShaperNode.connect(oscilloscope.analyserNode);\n    oscilloscope.start();');
	Playground.addToConfig('oscillator', 'var oscillator = this.audioContext.createOscillator();\n    oscillator.type = \'sine\';\n    oscillator.frequency.value = 400;\n    oscillator.start();\n\nvar oscilloscope = new Oscilloscope(\'.audio-playground__oscilloscope\', this.audioContext);\n    oscillator.connect(oscilloscope.analyserNode);\n    oscilloscope.start();');
	Playground.addToConfig('delay', 'var oscillator = this.audioContext.createOscillator();\n    oscillator.type = \'sine\';\n    oscillator.frequency.value = 400;\n    oscillator.start();\n\nvar delayNode = this.audioContext.createDelay();\n    delayNode.delayTime.value = 2;\n\nvar oscilloscope = new Oscilloscope(\'.audio-playground__oscilloscope\', this.audioContext);\n    oscillator.connect(delayNode);\n    delayNode.connect(oscilloscope.analyserNode);\n    oscilloscope.start();');
}();
