import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "reactstrap";
import FacebookLogin from "react-facebook-login";

const styleNode = {
  fontSize: "80px",
  color: "#107532"
};

let x = <i className="fas fa-skull" style={styleNode} />;
let y = <i className="fas fa-poop" style={styleNode} />;

const styleSquare = {
  width: 150,
  height: 150
};

const Square = ({ onClick, value }) => (
  <Button
    className="square m-1 p-2"
    color="danger"
    style={styleSquare}
    onClick={() => onClick()}
  >
    {value}
  </Button>
);
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div className="m-5 p-2">
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      name: "",
      userImg: "",
      highScoreBoard: []
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const currentTime = !this.state.stepNumber ? Date.now() : 0;

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? x : y;
    this.setState(
      {
        history: history.concat([
          {
            squares: squares
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        timeStart: !this.state.stepNumber ? currentTime : this.state.timeStart
      },
      () => this.getHighScore()
    );
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  async responseFacebook(resp) {
    const name = resp.name;
    const imgUrl = resp.picture.data.url;
    this.setState({
      name: name,
      userImg: imgUrl
    });
  }

  async handleGetHighScoreFromSever() {
    const url = `http://ftw-highscores.herokuapp.com/tictactoe-dev`;
    const response = await fetch(url, {
      method: "GET"
    });
    const report = await response.json();
    this.setState({
      highScoreBoard: report.items
    });
  }

  getHighScore() {
    const timeStart = this.state.timeStart;
    const endTime = Date.now();
    const timeLapse = Math.floor((endTime - timeStart) / 1000);

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);
    this.setState({
      score: winner ? timeLapse : 0
    });
  }

  componentDidMount() {
    this.handleGetHighScoreFromSever();
  }

  async handlePostHighScore() {
    let data = new URLSearchParams();
    const name = this.state.name;
    const highScore = this.state.score;
    data.append("player", name);
    data.append("score", highScore);
    const url = `http://ftw-highscores.herokuapp.com/tictactoe-dev`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data.toString(),
      json: true
    });
    console.log("results: ", response);
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const stepNumber = this.state.stepNumber;
    const score = this.state.score;
    const highScoreBoard = this.state.highScoreBoard;

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game-start";
      return (
        <li key={move}>
          <Button onClick={() => this.jumpTo(move)}>{desc}</Button>
        </li>
      );
    });
    let status;

    if (winner && stepNumber !== 9) {
      status =
        "Winner: " +
        (this.state.xIsNext ? "Sh*t" : "Skull") +
        ", Score: " +
        score +
        "s";
    } else if (!winner && stepNumber !== 9) {
      status = "Next player: " + (this.state.xIsNext ? "Skull" : "Sh*t");
    } else if (stepNumber === 9) {
      status = "Muahahahaha";
    }
    const scoreBoard = highScoreBoard.map(x => {
      return (
        <Table bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>id</th>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>{items.id}</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>{items.name}</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>{items.score}</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </Table>
      );
    });

    return (
      <div>
        <div className="game d-flex justify-content-center">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="col-1" />
          <div className="game-info justify-content-end my-5 pt-5 px-4 bg-warning border">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
        <div className="App d-flex justify-content-end">
          <FacebookLogin
            appId="1191646981013537"
            autoLoad={true}
            fields="name,email,picture"
            callback={resp => this.responseFacebook(resp)}
            textButton={this.state.name ? " Logged in" : " Login with facebook"}
            isDisabled={this.state.name}
          />
          <div className="col-2" />
          <div className="">
            <Button
              color="info"
              className="mr-3"
              onClick={() => this.handlePostHighScore()}
            >
              Send your high-scores
            </Button>
            <Table>{scoreBoard}</Table>
          </div>
          <div className="col-2" />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const winnerLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
  ];
  for (let i = 0; i < winnerLines.length; i++) {
    const [a, b, c] = winnerLines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
