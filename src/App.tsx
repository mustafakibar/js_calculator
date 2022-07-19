/* eslint-disable @typescript-eslint/no-empty-interface */
import React from 'react';
import './App.scss';

interface FormulaProps {
  text: string;
}

class Formula extends React.Component<FormulaProps> {
  render() {
    return <div className='formula'>{this.props.text}</div>;
  }
}

interface OutputProps {
  text: string;
}

class Output extends React.Component<OutputProps> {
  render() {
    return (
      <div className='output' id='display'>
        {this.props.text}
      </div>
    );
  }
}

enum CalcEventType {
  DecimalOp = 'DEC',
  Number = 'NMB',
  Addition = '+',
  Subtraction = '-',
  Multiplication = 'x',
  Division = '/',
  AllClear = 'ALC',
  Equals = 'EQL',
}

type Operator =
  | CalcEventType.Addition
  | CalcEventType.Division
  | CalcEventType.Multiplication
  | CalcEventType.Subtraction;

interface CalcEvent {
  type: CalcEventType;
  data?: string | number;
}

interface ButtonsProps {
  handleClick: (event: CalcEvent) => void;
}

class Buttons extends React.Component<ButtonsProps> {
  items: Array<{
    id: string;
    text: string;
    type: CalcEventType;
    className?: string;
  }> = [
    { id: 'clear', text: 'AC', type: CalcEventType.AllClear },
    { id: 'divide', text: '/', type: CalcEventType.Division },
    { id: 'multiply', text: 'x', type: CalcEventType.Multiplication },
    { id: 'seven', text: '7', type: CalcEventType.Number },
    { id: 'eight', text: '8', type: CalcEventType.Number },
    { id: 'nine', text: '9', type: CalcEventType.Number },
    { id: 'subtract', text: '-', type: CalcEventType.Subtraction },
    { id: 'four', text: '4', type: CalcEventType.Number },
    { id: 'five', text: '5', type: CalcEventType.Number },
    { id: 'six', text: '6', type: CalcEventType.Number },
    { id: 'add', text: '+', type: CalcEventType.Addition },
    { id: 'one', text: '1', type: CalcEventType.Number },
    { id: 'two', text: '2', type: CalcEventType.Number },
    { id: 'three', text: '3', type: CalcEventType.Number },
    { id: 'equals', text: '=', type: CalcEventType.Equals },
    { id: 'zero', text: '0', type: CalcEventType.Number },
    { id: 'decimal', text: '.', type: CalcEventType.DecimalOp },
  ];

  constructor(props: ButtonsProps) {
    super(props);

    const buttons: { [key: string]: HTMLButtonElement } = {};
    document.addEventListener('keydown', (e) => {
      let keyname = e.key.toLowerCase();
      if (keyname === 'escape') {
        keyname = 'AC';
      } else if (keyname === 'enter') {
        keyname = '=';
      } else if (keyname === '*') {
        keyname = 'x';
      }

      const button: HTMLButtonElement = buttons[keyname];
      if (button) {
        button.click();
      } else {
        const item = this.items.find((item) => item.text === keyname);
        if (!item) {
          return;
        }

        const findButton: HTMLElement | null = document.getElementById(item.id);
        if (findButton) {
          buttons[item.text] = findButton as HTMLButtonElement;
          findButton.click();
        }
      }
    });
  }

  render() {
    return (
      <div className='btn-container'>
        {this.items.map((item) => {
          const result = (
            <button
              id={item.id}
              key={item.id}
              value={item.text}
              className={
                item.type === CalcEventType.Number ||
                item.type === CalcEventType.DecimalOp
                  ? 'btn btn-number'
                  : 'btn btn-operator'
              }
              onClick={() =>
                this.props &&
                this.props.handleClick &&
                this.props.handleClick({
                  type: item.type,
                  data: item.text,
                })
              }
            >
              {item.text}
            </button>
          );

          return result;
        })}
      </div>
    );
  }
}

type StackType = (Operator | number)[];

interface AppState {
  output: string;
  formula: string;
  stack: StackType;
}

class App extends React.Component<{}, AppState> {
  constructor(props = {}) {
    super(props);
    this.state = { ...this.defState() };
  }

  defState(): AppState {
    return {
      output: '0',
      formula: '0',
      stack: [],
    };
  }

  isOperator(text: string | CalcEventType | Operator | number) {
    return /[+\-x/]/.test(text.toString());
  }

  handleOnAllClearClicked() {
    this.setState({ ...this.defState() });
  }

  handleOnNumberClicked(number: number) {
    let { output, formula } = this.state;
    if (output.length >= 13) {
      return;
    }

    if (output === '0' || formula.includes('=')) {
      output = '';
      formula = '';
    }

    if (this.isOperator(output)) {
      output = '';
    }

    this.setState({
      output: output + number,
      formula: formula + number,
    });
  }

  handleOnDecimalClicked() {
    const { output, formula } = this.state;
    if (output.indexOf('.') > -1) {
      return;
    }

    this.setState({
      output: output + '.',
      formula: formula + '.',
    });
  }

  handleOnOperatorClicked(selectedOp: Operator, selectedOpAsText: string) {
    const { output } = this.state;
    let { formula, stack } = this.state;

    const stackSize = stack.length;
    const lastInput = stackSize >= 1 ? stack[stackSize - 1] : null;

    const isLastInputAnOperator = lastInput
      ? this.isOperator(lastInput)
      : false;

    if (isLastInputAnOperator && lastInput && lastInput === selectedOp) {
      return;
    }

    if (output.endsWith('.')) {
      return;
    }

    const isOutputHasEqualSign = formula.includes('=');
    if (isOutputHasEqualSign) {
      formula = output + selectedOpAsText;
    } else if (isLastInputAnOperator && lastInput) {
      formula = formula + selectedOpAsText;
      // If 2 or more operators are entered, use the last 2
      const secondLastInput = stackSize >= 3 ? stack[stackSize - 2] : null;
      if (secondLastInput && this.isOperator(secondLastInput)) {
        stack.splice(stackSize - 2, 2);
        formula = formula.slice(0, formula.length - 3) + formula.slice(-1);
      }
    } else {
      formula = formula + selectedOpAsText;
    }

    const input = Number(output);
    if (input >= 0) {
      if (isOutputHasEqualSign) {
        stack = [];
      }

      stack.push(input);
    }

    stack.push(selectedOp);

    this.setState({
      output: selectedOpAsText,
      formula: formula,
      stack,
    });
  }

  handleOnEqualsClicked() {
    const { output, formula, stack } = this.state;
    if (formula.includes('=')) {
      return;
    }

    const isOutputAnOperator = output.length > 0 && this.isOperator(output);

    if (isOutputAnOperator) {
      stack.pop();
    } else {
      stack.push(parseFloat(output));
    }

    if (stack.length == 0) {
      return;
    }

    if (stack.length == 1) {
      this.showResult(stack[0] as string);
    } else {
      this.showResult(
        (Math.round(1000000000000 * eval(stack.join('').replace(/x/g, '*'))) /
          1000000000000) as unknown as string,
      );
    }
  }

  showResult(result: string) {
    let { formula } = this.state;

    if (this.isOperator(formula.charAt(formula.length - 1) as string)) {
      formula = formula.substring(0, formula.length - 1);
    }

    formula = formula + '=' + result.toString();
    if (formula.length >= 31) {
      formula = formula.substring(0, 31) + '...';
    }

    this.setState({
      ...this.defState(),
      formula: formula,
      output: result.toString(),
    });
  }

  handleOnButtonClick = (event: CalcEvent) => {
    if (event.type == CalcEventType.AllClear) {
      this.handleOnAllClearClicked();
    } else if (event.type == CalcEventType.Number) {
      this.handleOnNumberClicked(parseInt(event.data as string));
    } else if (event.type == CalcEventType.DecimalOp) {
      this.handleOnDecimalClicked();
    } else if (this.isOperator(event.type)) {
      this.handleOnOperatorClicked(
        event.type as Operator,
        event.data as string,
      );
    } else if (event.type == CalcEventType.Equals) {
      this.handleOnEqualsClicked();
    }
  };

  render() {
    const { output, formula } = this.state;

    return (
      <div className='calculator'>
        <Formula text={formula} />
        <Output text={output} />
        <Buttons handleClick={this.handleOnButtonClick.bind(this)} />
      </div>
    );
  }
}

export default App;
