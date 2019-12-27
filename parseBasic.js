function parseBasic(code) {
  // Parse a string of BASIC code and return a string of the output
  output = "";

  var lineNumToIndex = {};
  var lines = [];
  code.split('\n').forEach((line, i) => {
    let lineNum = parseInt(line.split(' ', 1)[0]);
    lineNumToIndex[lineNum] = i;
    lines.push(line.split(' ').slice(1).join(' '));
  })

  var variables = {};
  var functions = {};
  var pointerStack = [];
  var loops = {
    // X: {
    //   value: 1
    //   max: 5
    //   step: 0.1
    //   startIndex: 5
    // }
  }
  for (let i = 0; i<lines.length; i++) {
    let line = lines[i];
    tokens = line.split(' ');
    // Execute line
    switch (tokens[0]) {
      case "LET":
        // Introduces the assignment statement, and is required
        let variableName = tokens[1]
        let variableValue = evalExpression(tokens.slice(3).join(' '), variables, functions)
        variables[variableName] = variableValue
        break;
      case "PRINT":
        // Provides free-form output
        output += evalPrintExpression(tokens.slice(1).join(' '), variables, functions);
        break;
      case "END":
        // End of the program (is required)
        return output;
      
      case "READ":
        // Assigns values to variables from internal data
        break;
      case "DATA":
        // Introduces internal data
        break;

      case "GOTO":
        // Does just that, transfers to another line-numbered statement
        i = lineNumToIndex[parseInt(tokens[1])];
        i--;
        break;
      case "IF":
        // Gives a conditional GOTO
        let comparison = tokens.slice(1, tokens.length-2).join(' ')
        if (evalBoolExpression(comparison, variables, functions)) {
          let lineNum = parseInt(tokens[tokens.length-1])
          i = lineNumToIndex[lineNum];
          i--;
        }
        break;
      case "FOR":
        // Introduces the looping construct
        // Ex: FOR X = -2 TO 2 STEP .1
        var varName = tokens[1];
        loops[varName] = {
          max: parseInt(evalExpression(tokens[5], variables, functions)),
          step: tokens.length > 6 ? parseFloat(evalExpression(tokens[7], variables, functions)) : 1,
          startIndex: i+1,
        }
        variables[varName] = parseInt(tokens[3])
        break;
      case "NEXT":
        // Terminates the looping construct
        // Ex: NEXT X
        var varName = tokens[1];
        variables[varName] += loops[varName].step;
        if (variables[varName] <= loops[varName].max) {
          i = loops[varName].startIndex;
          i--;
        } else {
          console.log("FALSE")
          delete variables[varName]
          delete loops[varName]
        }
        break;
      
      case "GOSUB":
        // Does a GOTO to a subroutine
        pointerStack.push(i);
        let newLine = lineNumToIndex[parseInt(tokens[1])];
        i = newLine;
        i--;
        break;
      case "RETURN":
        // Returns from the end of the subroutine
        i = pointerStack.pop();
        break;
      
      case "DEF":
        // Introduces programmer-defined functions
        // Ex: DEF FNN(X) = EXP(-(X^2/2))/SQR(2*3.14159265)
        // translate to (X) => EXP(-(X^2/2))/SQR(2*3.14159265)
        var name = tokens[1].slice(0, tokens[1].indexOf('('))
        var argument = tokens[1].slice(tokens[1].indexOf('('), 
                                       tokens[1].indexOf(')')+1);
        var expression = tokens.slice(3).join(' ')
        var lamda = argument + ' => ' + expression
        functions[name] = lamda
      case "DIM":
        // Allows dimensioning arrays
      case "REM":
        // Provides comments
        continue;
      case "STOP":
        // Same as reaching the END statement
        return output;
    }
  }

  return output;
}

// BASIC Built-In Math Functions
function ABS(x) {return Math.abs(x)}
function ATN(x) {return Math.atan(x)}
function COS(x) {return Math.cos(x)}
function EXP(x) {return Math.exp(x)}
function INT(x) {return parseInt(x)}
function LOG(x) {return Math.log(x)}
function RND(x) {return Math.random()}
function SIN(x) {return Math.sin(x)}
function SQR(x) {return Math.sqrt(x)}
function TAN(x) {return Math.tan(x)}

function evalExpression(expression, variables, functions) {
  // Define variables
  for ([name, value] of Object.entries(variables)) {
    let command = "var " + name + " = " + value + ";";
    eval(command);
  }
  // Define functions
  for ([name, value] of Object.entries(functions)) {
    value = value.replace("^", "**")
    let command = "var " + name + " = " + value + ";";
    eval(command);
  }
  expression = expression.replace("^", "**")
  return eval(expression)
}

function evalBoolExpression(expression, variables, functions) {
  expression = expression.replace("=", "==")
  console.log(expression)

  return evalExpression(expression, variables, functions)
}

function evalPrintExpression(expression, variables, functions) {
  let isOpenEnded = !(',;'.includes(expression.slice(-1)));
  if (!isOpenEnded) {
    expression = expression.slice(0, -1);
  }
  expression = expression.replace(',', '+ "\t\t" + ');
  expression = expression.replace(';', '+ "" +');
  let result = evalExpression(expression, variables, functions);
  if (isOpenEnded) {
    result += "\n";
  }
  return result
}