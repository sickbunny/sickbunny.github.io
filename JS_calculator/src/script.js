//global Variables these don't really change
results = document.getElementById('display'),
  postFixBtn = document.getElementById('postfix'), //order of operations
    inFixBtn = document.getElementById('infix'), 
      previousOp = '', 
        currentArr = [];

document.querySelectorAll(".btn").forEach(el =>{
  el.addEventListener('click', () =>{
    handleEverything(el.textContent, el.dataset, el.id, el.value, el);
  });
});
document.querySelectorAll('.inFix-postfix').forEach(el => {
  el.addEventListener('click', () => {
      el.id == 'postfix' ? document.getElementById('equals').setAttribute('value', '=')
      :document.getElementById('equals').removeAttribute('value', '=');
  });
});

//which function to run based on which button was pressed.
function handleEverything(el, data, id, value, ele) {
  
          data.hasOwnProperty('operator') ? handleOperator(el)
        : data.hasOwnProperty('number') ? handleNumbers(el)
        : data.hasOwnProperty('allClear') ?  handleAllClear(el)
        : data.hasOwnProperty('clear') ? handleClearOne(el)
        : data.hasOwnProperty('decimal') ? handleDecimal(el)
        : data.hasOwnProperty('equals') ? ele.hasAttribute('value') ? handleCalculate(el) :handleInfix(el)
        :false;
}
// begin functions that do something based on whether its a #, Op, or equal sign
function handleAllClear() {
 let results = document.getElementById('display');
  results.innerHTML = '0';
}

function handleClearOne() {
  text = results.textContent;
    removeOne = text.slice(0, -1);
      removeThree = text.slice(0, -3);
  
  text.endsWith(' ')? results.innerText = removeThree
  :results.innerText = removeOne;

};

function handleDecimal() {
  currentArr = results.textContent.split(' ');
    lastIndex = currentArr.length - 1;
  if (currentArr == '') {
      results.innerHTML += '0.'
  } else if (currentArr[lastIndex] == ''){
      results.innerHTML += '0.'
  } else if (!currentArr[lastIndex].includes('.') ){
      results.innerHTML += '.';
  }
};

function handleNumbers(el) {
  checkText = results.textContent,
    currArr = checkText.split(' '),
      caLength = currArr.length;
   if (currArr[caLength - 1] == "0") {
    currArr.pop();
      currArr.push(el);
        results.innerText = currArr.join(' ');
   }else {
      results.innerHTML += el;
   }
}

function handleOperator(el) {
  currentOp = el;
    currArr = results.textContent.split(' ');
      curLen = currArr.length;
  
   if (currArr == '') {
       results.innerText = '0';
   } else if (previousOp == '' && currArr[curLen - 1] != '0') { 
       results.innerText += " " + currentOp + " ";
       previousOp = currentOp;
   } else if (!isNaN(parseFloat(currArr[curLen-1])) && currArr[curLen-1] !== '0' ) {
              results.innerText += " " + currentOp + " ";
              previousOp = currentOp; 
   } else if (currArr[curLen-1] == '0') {
              results.innerText += '';
   } else if (currentOp == '-' && currArr[curLen -2] == previousOp && !currArr[curLen -1 ].includes('-') ) {
             results.innerText += " " + currentOp;
   } else if (currArr[curLen - 2] == previousOp) {
                currArr.pop();
                currArr.pop();
                currArr.push(currentOp, "");
                previousOp = currentOp
                results.innerText = currArr.join(' ');
   } 
}; 

function handleInfix(el) {
  display = results.textContent.split(' ');
 
    for (let i = 0; i < display.length; i++) {
      if (display[i]  == '+' || display[i] =='-' || display[i] == 'x' || display[i] == '/') {
        //do nothing
      } else {
        display.splice(i, 1, parseFloat(display[i], 10));
      }
    }
        sum = display[0];
  
      for (let j = 0; j < display.length; j++) {
        if (display[j]  == "+" ){
          sum += display[j + 1];
          console.log('sum+:  ' + sum)
        } else if ( display[j] == '-' ) {
          sum -= display[j + 1];
        } else if ( display[j] == 'x' ) {
          sum *= display[j + 1];
          sum = parseFloat(sum);
          console.log('sum*:  ' + sum)
        } else if ( display[j] == '/' ) {
          sum /= display[j + 1];
          sum = parseFloat(sum);
        } 
      }
  console.log('sum:  ' + sum)
    results.innerHTML =  Math.round(sum * 10000) / 10000;
};

function handleCalculate(el) {
  display = results.innerText,
    shunting = shuntingYard(display),
      stack = [];
  for (let i = 0; i <shunting.length; i++) {
      if(!isNaN(shunting[i])) {
         stack.push(parseFloat(shunting[i]));
      }else if(shunting[i] == 'x') {
          second = stack.pop();
          first = stack.pop();
          total = parseFloat(first) * parseFloat(second);
          stack.push(total);
      }else if (shunting[i] == '/') {
          second = stack.pop();
          first = stack.pop();
          total = parseFloat(first) / parseFloat(second);
          stack.push(total);
      }else if (shunting[i] == '+') {
          second = stack.pop();
          first = stack.pop();
          total = parseFloat(first) + parseFloat(second);
          stack.push(total);
      }else if (shunting[i] == '-') {
          second = stack.pop();
          first = stack.pop();
          total = parseFloat(first) - parseFloat(second);
          stack.push(total);
      }else if (shunting[i] == '^') {
          second = stack.pop();
          first = stack.pop();
          total = Math.pow(parseFloat(first), parseFloat(second));
          stack.push(total);
      }
  }
   results.innerHTML =  Math.round(total * 10000) / 10000;
};

function shuntingYard(expression) {
  stack = [],
    output = [],
      tokens = expression.split(" "),
        operators = {
          "^": { precedence: 4, associativity: "right"},
          "/": { precedence: 3, associativity: "left" },
          "x": { precedence: 3, associativity: "left" },
          "+": { precedence: 2, associativity: "left" },
          "-": { precedence: 2, associativity: "left" }
        };
  for (const token of tokens) {
    if (!isNaN(token)) {
      output.push(token);
    }else if (operators.hasOwnProperty(token)) {
      while (
        stack.length &&
        operators.hasOwnProperty(stack[stack.length - 1]) &&
        (operators[token].associativity === "left"
          ? operators[token].precedence <= operators[stack[stack.length - 1]].precedence
          : operators[token].precedence < operators[stack[stack.length - 1]].precedence)
      ) {
        output.push(stack.pop());
      }
      stack.push(token);
    } else if (token === "(") {
      stack.push(token);
    } else if (token === ")") {
      while (stack[stack.length - 1] !== "(") {
        output.push(stack.pop());
      }
      stack.pop();
    }
  }
  while (stack.length) {
    output.push(stack.pop());
  }
  return output;
};