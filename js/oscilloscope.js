'use strict';

var Oscilloscope = Oscilloscope || function(target, context) {
    this.target = document.querySelector(target);

    this.width = this.target.offsetWidth;
    this.height = this.target.offsetHeight;

    this.wave = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    this.wave.setAttribute('class', 'oscilloscope__wave');

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute('width', this.width);
    this.svg.setAttribute('height', this.height);
    this.svg.setAttribute('class', 'oscilloscope__svg');
    this.svg.appendChild(this.wave);

    this.target.appendChild(this.svg);

    this.audioContext = context || new window.AudioContext();
    this.playing = false;
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 128;
    this.bufferLength = this.analyserNode.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
    // this.analyserNode.connect(this.audioContext.destination);

    this.drawWave = function() {
        var path = 'M';

        this.analyserNode.getByteTimeDomainData(this.dataArray);

        this.dataArray.forEach(function(point, i) {
            path +=  (((this.width + (this.width / this.bufferLength))/ this.bufferLength) * i) + ' ' + ((this.height / 2) * (point / 128.0)) + ', ';
        }.bind(this));

        this.wave.setAttribute('d', path);

        if (this.playing) {
            window.requestAnimationFrame(this.drawWave);
        }
    }.bind(this);
};

Oscilloscope.prototype.start = function() {
    this.playing = true;

    window.requestAnimationFrame(this.drawWave);
}

Oscilloscope.prototype.stop = function() {
    this.playing = false;
};

Oscilloscope.prototype.connect = function(node) {
    this.analyserNode.connect(node);
};
