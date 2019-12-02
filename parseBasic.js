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

  let variables = {};
  for (var i = 0; i<lines.length; i++) {
    let line = lines[i];
    tokens = line.split(' ');
    // Execute line
    switch (tokens[0]) {
      case "LET":
        // Introduces the assignment statement, and is required
        let variableName = tokens[1]
        let variableValue = evalExpression(tokens.slice(3).join(' '), variables)
        variables[variableName] = variableValue
        break;
      case "PRINT":
        // Provides free-form output
        output += evalExpression(tokens.slice(1).join(' '), variables);
        output += '\n';
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
        let comparison = tokens.slice(1, tokens.length-1).join(' ')
        if (evalExpression(comparison, variables)) {
          let lineNum = parseInt(tokens[tokens.length-1])
          i = lineNumToIndex[lineNum];
          i--;
        }
        break;

      case "FOR":
        // Introduces the looping construct
        break;
      case "NEXT":
        // Terminates the looping construct
        break;
      
      case "GOSUB":
        // Does a GOTO to a subroutine
        break;
      case "RETURN":
        // Returns from the end of the subroutine
        break;
      
      case "DEF":
        // Introduces programmer-defined functions
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

function evalExpression(expression, variables) {
  // Define variables
  console.log(Object.entries(variables))
  for ([name, value] of Object.entries(variables)) {
    let command = "var " + name + " = " + value + ";";
    eval(command);
  }
  return eval(expression)
}