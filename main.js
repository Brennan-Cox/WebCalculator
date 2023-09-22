expressionBox = document.getElementById("expression");
resultBox = document.getElementById("result");

function calculate() {
    expression = expressionBox.value
    expression = evaluateExpression(expression);
    resultBox.innerHTML = expression;
}

function verifyParens(expression) {
    parens = [];
    for (i = 0; i < expression.length; i++) {
        if (expression[i] == '(') {
            parens.push('(');
        }
        else if (expression[i] == ')') {
            if (parens.length == 0) {
                return false;
            }
            else {
                parens.pop();
            }
        }
    }
    return parens.length == 0;
}

function verifyOperators(expression) {
    operators = ['+', '-', '*', '/', '^', '%'];
    for (i = 0; i < expression.length; i++) {
        if (operators.includes(expression[i])) {
            if ((i == 0 && expression[0] != '-') || i == expression.length - 1) {
                return false;
            }
            else if (operators.includes(expression[i - 1]) || operators.includes(expression[i + 1])) {
                return false;
            }
        }
    }
    return true;
}

function verifyExpression(expression) {
    return verifyParens(expression) && verifyOperators(expression);
}

function removeSpaces(expression) {
    //replace all spaces with nothing
    noSpaceExpression = ''
    for (i = 0; i < expression.length; i++) {
        if (expression[i] != ' ') {
            noSpaceExpression += expression[i]
        }
    }
    return noSpaceExpression;
}

function leftRight(expression, index) {
    left = index - 1;
    while (left >= 0 && (!isNaN(expression[left]) || (expression[left] == '-' && left == 0) || expression[left] == '.')) {
        left--;
    }
    left++;
    right = index + 1;
    while (right < expression.length && (!isNaN(expression[right]) || expression[right] == '.')) {
        right++;
    }
    right;
    return [left, right];
}

function evaluate(expression) {
    //evaluate all parenthetical expressions
    while (expression.includes('(')) {
        console.log(expression)
        const start = expression.lastIndexOf('(')
        const end = expression.indexOf(')', start);
        subExpression = expression.substring(start + 1, end);
        subExpression = evaluate(subExpression);
        expression = expression.substring(0, start) + subExpression + expression.substring(end + 1);
        console.log(expression)
    }
    //evaluate all exponential expressions
    while (expression.includes('^')) {
        console.log(expression)
        start = expression.lastIndexOf('^');
        lr = leftRight(expression, start);
        left = lr[0];
        right = lr[1];
        leftString = Number(expression.substring(left, start));
        rightString = Number(expression.substring(start + 1, right));
        subExpression = Math.pow(leftString, rightString);
        expression = expression.substring(0, left) + subExpression + expression.substring(right);
        console.log(expression)
    }
    //evaluate all multiplication and division expressions
    while (expression.includes('*') || expression.includes('/') || expression.includes('%')) {
        console.log(expression)
        firstMultiply = expression.indexOf('*');
        firstMultiply = firstMultiply == -1 ? Infinity : firstMultiply;
        firstDivide = expression.indexOf('/');
        firstDivide = firstDivide == -1 ? Infinity : firstDivide;
        firstMod = expression.indexOf('%');
        firstMod = firstMod == -1 ? Infinity : firstMod;
        start = Math.min(firstMultiply, Math.min(firstDivide, firstMod));
        lr = leftRight(expression, start);
        left = lr[0];
        right = lr[1];
        leftString = Number(expression.substring(left, start));
        rightString = Number(expression.substring(start + 1, right));
        console.log(leftString, rightString)
        subExpression = expression[start] == '*' ? leftString * rightString : 
                        expression[start] == '/' ? leftString / rightString : 
                        leftString % rightString;
        expression = expression.substring(0, left) + subExpression + expression.substring(right);
        console.log(expression)
    }
    //evaluate all addition and subtraction expressions
    while (expression.includes('+') || expression.includes('-')) {
        console.log(expression)
        //get firstAdd and firstSubtract where the previous character is not 'e'
        start = -1
        for (i = 0; i < expression.length; i++) {
            if (expression[i] == '+' || expression[i] == '-') {
                if (i == 0) {
                    continue
                }
                else if (expression[i - 1] != 'e') {
                    start = i;
                    break;
                }
            }
        }
        if (start == -1) {
            break;
        }
        lr = leftRight(expression, start);
        left = lr[0];
        right = lr[1];
        leftString = Number(expression.substring(left, start));
        rightString = Number(expression.substring(start + 1, right));
        subExpression = expression[start] == '+' ? leftString + rightString : leftString - rightString;
        expression = expression.substring(0, left) + subExpression + expression.substring(right);
        console.log(expression)
    }
    return expression;
}

function evaluateExpression(expression) {
    expression = removeSpaces(expression);
    // if number is an expression like pi or e then replace it with the number
    expression = expression.replace(/pi/g, `(${Math.PI})`);
    expression = expression.replace(/e/g, `(${Math.E})`);
    // if ')(' or number followed by '(' or ')' followed by number
    expression = expression.replace(/\)\(/g, ')*(');
    expression = expression.replace(/(\d)\(/g, '$1*(');
    expression = expression.replace(/\)(\d)/g, ')*$1');
    if (!verifyExpression(expression)) {
        return "Invalid expression";
    }
    else {
        return evaluate(expression);
    }
}

function clear() {
    resultBox.innerHTML = '';
}