'use strict'

var waveform = waveform || !function() {
    var audioContext = new window.AudioContext(),
        analyserNode = audioContext.createAnalyser(),
        processSound,
        error,
        plugPaths = '<path d="M321,18.1310387 L321,15.9970002 C321,13.7976585 319.210675,12 317.003431,12 L188.996569,12 C186.794406,12 185,13.789518 185,15.9970002 L185,41.0029998 C185,43.2023415 186.789325,45 188.996569,45 L317.003431,45 C318.910358,45 320.511531,43.6581468 320.906584,41.8650065 C324.166142,36.9489068 326.89638,40.2412463 331.596133,43.0337255 C336.538758,45.9705143 342.418796,43.2328698 342.418796,43.2328698 C342.418796,43.2328698 353.870095,37.2100798 358.038778,33.4718196 C362.207461,29.7335594 358.100766,24.6758194 358.100766,24.6758194 C358.100766,24.6758194 348.039794,19.6962589 341.529348,14.8251926 C335.018902,9.95412628 331.716712,16.3050944 330.39909,16.9274716 C328.210635,17.961186 324.687952,21.8308969 321,18.1310387 Z" id="Combined-Shape" fill="#BFB9B9"></path><rect id="Rectangle-23" fill="#D8D8D8" x="0" y="0" width="188" height="54" rx="4"></rect>';

    processSound = function(stream) {
        var bufferLength,
            dataArray,
            drawWave,
            toggleAudioSource,
            oscillatorNode,
            liveAudio = true,
            waveWidth = window.innerWidth - 600,
            svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
            wave = document.createElementNS("http://www.w3.org/2000/svg", 'path'),
            plug = document.createElementNS("http://www.w3.org/2000/svg", 'g'),
            audioSource = audioContext.createMediaStreamSource(stream);
            audioSource.connect(analyserNode);

            analyserNode.fftSize = 128;

            bufferLength = analyserNode.frequencyBinCount;

            dataArray = new Uint8Array(bufferLength);

            wave.setAttribute('class', 'waveform__path');

            svg.setAttribute('width', window.innerWidth);
            svg.setAttribute('height', 400);
            svg.setAttribute('class', 'waveform__svg');
            svg.appendChild(wave);

            svg.appendChild(plug);

            plug.innerHTML = plugPaths;

            document.querySelector('.js-waveform').appendChild(svg);

            drawWave = function() {
                var p = 'M';

                analyserNode.getByteTimeDomainData(dataArray);

                dataArray.forEach(function(point, i) {
                    p +=  (((waveWidth + (waveWidth / bufferLength))/ bufferLength) * i) + ' ' + (200 * (point / 128.0)) + ', ';

                    if (i === bufferLength - 1) {
                        var translate = 'translate(' + (((waveWidth + (waveWidth / bufferLength))/ bufferLength) * i) + ',' + ((200 * (point / 128.0)) - 30) + ')';

                        plug.setAttribute('transform', translate);

                        // console.log(plug.getAttribute('x'));
                    }
                });

                wave.setAttribute('d', p);

                window.requestAnimationFrame(drawWave);
            };

            toggleAudioSource = function() {
                if (liveAudio) {
                    audioSource.disconnect();

                    oscillatorNode = audioContext.createOscillator();
                    oscillatorNode.type = 'sine';
                    oscillatorNode.frequency.value = 800;
                    oscillatorNode.connect(analyserNode);
                    oscillatorNode.start();
                } else {
                    oscillatorNode.stop();
                    oscillatorNode.disconnect();

                    audioSource.connect(analyserNode);
                }

                liveAudio = !liveAudio;
            };

            window.addEventListener('keydown', function(e) {
                if (e.keyCode === 65) {
                    toggleAudioSource();
                }
            });

            window.requestAnimationFrame(drawWave);
    };

    error = function(e) {
        console.error('Something went wrong while accessing the userMedia', e);
    };

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    navigator.getUserMedia({
        audio: true
    }, processSound, error);
}();
