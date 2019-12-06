var editorTextArea = document.getElementById("editor");
var editorMirror = CodeMirror.fromTextArea(editorTextArea, {
  mode: 'javascript',
  lineNumbers: true,
  theme: 'cobalt',
});

// let defaultCode = `10 LET X = 1
// 20 PRINT "Hello, World!"
// 30 LET X = X + 1
// 40 IF X < 5 20
// 50 END`

// let defaultCode = `10 FOR X = -2 TO 2 STEP .1
// 20 PRINT X
// 30 NEXT X
// 40 END`

// let defaultCode = `10 DEF FNN(X) = EXP(-(X^2/2))/SQR(2*3.14159265)
// 20 PRINT FNN(10)
// 30 END`

let defaultCode = `100 REM PLOT A NORMAL DISTRIBUTION CURVE
110
120 DEF FNN(X) = EXP(-(X^2/2))/SQR(2*3.14159265)
130
140 FOR X = -2 TO 2 STEP .1
150 LET Y = FNN(X)
160 LET Y = INT(100*Y)
170 FOR Z = 1 TO Y
180 PRINT " ";
190 NEXT Z
200 PRINT "*"
210 NEXT X
220 END`
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
