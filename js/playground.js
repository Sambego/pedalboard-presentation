'use strict';

var START_SAMPLE = 'var oscillator = this.audioContext.createOscillator();\n    oscillator.type = \'sine\';\n    oscillator.frequency.value = 400;\n    oscillator.start();\n\nvar oscilloscope = new Oscilloscope(\'.audio-playground__oscilloscope\', this.audioContext);\n    oscillator.connect(oscilloscope.analyserNode);\n    oscilloscope.start();';

var AudioPlayground = AudioPlayground || function(target, content, language) {
    var runEditorCode, initOsciloscope;

    this.audioContext = new AudioContext();

    this.config = {};

    this.container = document.querySelector(target);

    this.editor = document.createElement('div');
    this.editor.setAttribute('class', 'audio-playground__editor');
    this.editor.contentEditable = true;
    this.editorInner = document.createElement('pre');
    this.editorCode = document.createElement('code');
    this.editorCode.setAttribute('class', 'language-' + (language || 'javascript'));
    this.editorCode.innerHTML = content || START_SAMPLE;

    this.oscilloscope = document.createElement('div');
    this.oscilloscope.setAttribute('class', 'audio-playground__oscilloscope');

    this.editorInner.appendChild(this.editorCode);
    this.editor.appendChild(this.editorInner);
    this.container.appendChild(this.editor);
    this.container.appendChild(this.oscilloscope);
};

AudioPlayground.prototype.clearOscilloscope = function() {
    while (this.oscilloscope.firstChild) {
        this.oscilloscope.removeChild(this.oscilloscope.firstChild);
    }
};

AudioPlayground.prototype.runEditorCode = function(editor) {
    this.clearOscilloscope();

    eval(this.editor.innerHTML.replace(/<\/?[^>]+(>|$)/g, '').replace('&lt;', '<'));
};

AudioPlayground.prototype.initOsciloscope = function() {
    Prism.highlightAll()

    this.runEditorCode(this.editorCode);

    this.editor.addEventListener('blur', function() {
        Prism.highlightAll(this.editorCode);

        this.runEditorCode(this.editorCode);
    }.bind(this));
};

AudioPlayground.prototype.setContent = function(key) {
    this.content = this.config[key];
    this.editorCode.innerHTML = this.content;

    this.initOsciloscope(); 
};

AudioPlayground.prototype.addToConfig = function(key, value) {
    this.config[key] = value;
}