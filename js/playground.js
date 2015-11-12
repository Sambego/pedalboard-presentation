'use strict';

var START_SAMPLE = 'var oscillator = audioContext.createOscillator();\n    oscillator.type = \'sine\';\n    oscillator.frequency.value = 400;\n    oscillator.start();\n\nvar oscilloscope = new Oscilloscope(\'.audio-playground__oscilloscope\', audioContext);\n    oscillator.connect(oscilloscope.analyserNode);\n    oscilloscope.start();';

var AudioPlayground = AudioPlayground || function(target, content, language) {
    var audioContext = new AudioContext(),
        runEditorCode, initOsciloscope;

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

    runEditorCode = function(editor) {
        eval(editor.innerHTML.replace(/<\/?[^>]+(>|$)/g, ''));
    };

    initOsciloscope = function() {
        Prism.highlightAll()

        runEditorCode(this.editorCode);

        this.editor.addEventListener('blur', function() {
            Prism.highlightAll(this.editorCode);

            while (this.oscilloscope.firstChild) {
                this.oscilloscope.removeChild(this.oscilloscope.firstChild);
            }

            runEditorCode(this.editorCode);
        }.bind(this));
    }.bind(this);

    initOsciloscope();
};
