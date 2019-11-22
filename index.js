var editorTextArea = document.getElementById("editor");
var editorMirror = CodeMirror.fromTextArea(editorTextArea, {
  mode: 'javascript',
  lineNumbers: true,
  theme: 'cobalt',
});
editorMirror.getDoc().setValue('10 PRINT "Hello, World!\n20 END');

var consoleTextArea = document.getElementById("console");
consoleTextArea.value = 'Hello, World!';
var consoleMirror = CodeMirror.fromTextArea(consoleTextArea, {
  theme: 'cobalt'
});
consoleMirror.getDoc().setValue('Hello, World!');

var runButton = document.getElementById("run");
runButton.onclick = function() {
  console.log("CLICKED!")
  consoleMirror.getDoc().setValue('OUTPUT');
}
