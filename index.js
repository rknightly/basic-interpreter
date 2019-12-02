var editorTextArea = document.getElementById("editor");
var editorMirror = CodeMirror.fromTextArea(editorTextArea, {
  mode: 'javascript',
  lineNumbers: true,
  theme: 'cobalt',
});

let defaultCode = `10 PRINT "Hello, World!"
15 LET X = 5
16 PRINT X
20 END`
editorMirror.getDoc().setValue(defaultCode);

var consoleTextArea = document.getElementById("console");
consoleTextArea.value = 'Hello, World!';
var consoleMirror = CodeMirror.fromTextArea(consoleTextArea, {
  theme: 'cobalt'
});
consoleMirror.getDoc().setValue('Hello, World!');

var runButton = document.getElementById("run");
runButton.onclick = function() {
  var code = editorMirror.getDoc().getValue();
  var result = parseBasic(code);
  consoleMirror.getDoc().setValue(result);
}
