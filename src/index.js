// 知识点：
// 1. 组件中数据管理：UI 展示的数据存放在 state 中，可通过 setState() 修改它，该函数会主动触发一次渲染函数 (注：setState() 是异步的)
//
// 2. 组件间数据管理：当多个组件需要数据交互时，把子组件的 state 数据提升至其共同的父组件当中保存，然后通过 props 传递
//    - props.attr: 父组件 -> 子组件
//    - props.func: 子组件 -> 父组件 （回调）
//                  e.g.: onClick = {(event) => this.func(xx)}   【如果 event 不需要，可以省略，如 onClick = {() => this.func(xx)}】
//                        (event)  是 onClick 触发的匿名函数
//                        func(xx) 是 用户自定义函数                【如果func没有参数，可简写为 {this.func}，前提是 func 申明方式必须是 func = () => {} 的形式】
//                                
// 3. 不可变性: 先copy，再修改
//    - const arr2 = arr1.slice(); const arr3 = arr2.concat([new_item])
//    - const map2 = {...map1, new_k: v}


import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClickCallback()}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {

  renderSquare = (i) => {
    return (<Square value={this.props.squares[i]} onClickCallback={() => this.props.onClickCallback(i)} />);
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}{this.renderSquare(1)}{this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}{this.renderSquare(4)}{this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}{this.renderSquare(7)}{this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      winner: null,
    };
  }

  current_squares() {
    return this.state.history[this.state.history.length - 1].squares
  }

  handleClick = (i) => {
    if (this.state.winner || this.current_squares()[i]) {
      return;
    }

    const squares = this.current_squares().slice(); // dict e.g.: const d = {...s, {'xx':'xx'}}
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    const winner = this.calculateWinner(squares);
    if (winner) {
      this.setState({
        history: this.state.history.concat([{ squares }]),
        winner
      });
    } else {
      this.setState({
        history: this.state.history.concat([{ squares }]),
        xIsNext: !this.state.xIsNext
      });
    }
  }

  calculateWinner = (squares) => {
    const all_winner_lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (let i = 0; i < all_winner_lines.length; i++) {
      const [a, b, c] = all_winner_lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  jumpTo = (step) => {
    const history = this.state.history.slice(0, step + 1);
    const xIsNext = (step % 2 === 0);
    const winner = this.state.winner === null ? this.state.winner : this.calculateWinner(history[step])
    this.setState({ history, xIsNext, winner })
  }

  render() {
    const current_squares = this.current_squares();
    const status = this.state.winner === null ? ('Next player: ' + (this.state.xIsNext ? 'X' : 'O')) : 'Winner: ' + this.state.winner;
    const moves = this.state.history.map((squares, index) => {
      const desc = index === 0 ? 'Go to game start' : 'Go to step #' + index
      return (
        <li key={index}>
          <button onClick={() => this.jumpTo(index)}>{desc}</button>
        </li>
      )
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current_squares} onClickCallback={this.handleClick} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);