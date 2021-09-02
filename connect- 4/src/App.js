import React, { Component } from 'react';
import './App.css';



function Hole(props){
  return <div className="Hole"><div className={props.value}></div></div>
}

function Slat(props){
    return <div className="Slat" onClick={() => props.handleClick()}>
      {[...Array(props.holes.length)].map((x, j) => 
        <Hole key={j} value={props.holes[j]}></Hole>)}
      </div>
 }

class Board extends Component {

  constructor(props) {
    super(props);
    this.state = {
      boardState: new Array(7).fill(new Array(6).fill(null)),
      playerTurn: 'player1',
      gameMode: '',
      gameSelected: false,
      winner: '',
      name1:'',
      name2:''

    }
  }

  selectedGame(mode){
    this.setState({
       gameMode: mode,
       gameSelected: true, 
       boardState: new Array(7).fill(new Array(6).fill(null))
    })
  }

  makeMove(slatID){
    const boardCopy = this.state.boardState.map(function(arr) {
      return arr.slice();
    });
    if( boardCopy[slatID].indexOf(null) !== -1 ){
      let newSlat = boardCopy[slatID].reverse()
      newSlat[newSlat.indexOf(null)] = this.state.playerTurn
      newSlat.reverse()
      this.setState({
        playerTurn: (this.state.playerTurn === 'player1') ? 'player2' : 'player1',
        boardState: boardCopy
      })
    }
  }

  /*Only make moves if winner doesn't exist*/
  handleClick(slatID) {
    if(this.state.winner === ''){
      this.makeMove(slatID)
    }
  }
  
  /*check the winner */
  componentDidUpdate(){
    let winner = checkWinner(this.state.boardState)
    if(this.state.winner !== winner){
      this.setState({winner: winner})
    } else {
       if(this.state.gameMode === 'player1' && this.state.playerTurn === 'player2'){
        let validMove = -1;
        while(validMove === -1){
          let slat = Math.floor((Math.random() * 7))
          if(this.state.boardState[slat].indexOf(null) !== -1){
            validMove = slat
          }else{
            validMove = -1
          }
        }
        this.makeMove(validMove)
       }
    }
  }
  updateResponse1=(event)=>{
    this.setState({
      name1: event.target.value
    })
  }

  updateResponse2=(event)=>{
    this.setState({
      name2: event.target.value
    })
  }





  render(){

    /*If a winner exists display the name*/
    let winnerMessageStyle
    if(this.state.winner !== ""){
      winnerMessageStyle = "winnerMessage appear"
    }else {
      winnerMessageStyle = "winnerMessage"
    }

    /*Contruct Grid allocating column from board*/
    let Grid = [...Array(this.state.boardState.length)].map((x, i) => 
      <Slat 
          key={i}
          holes={this.state.boardState[i]}
          handleClick={() => this.handleClick(i)}
      ></Slat>
    )

    return (
      <div>
      <label>Enter the First player Name:</label>
          <input type='text/babel' id='first' onChange={this.updateResponse1} value={this.state.name1}/><br /><br />
          <label>Enter the Second player Name:</label>
          <input type='text/babel' id='first' onChange={this.updateResponse2} value={this.state.name2}/><br /><br />

        {this.state.gameSelected &&
          <div className="Board">
            {Grid}
          </div>
        }
        <div className={winnerMessageStyle}>{this.state.winner}</div>
        {(!this.state.gameSelected || this.state.winner !== '') &&
          <div>
            <button onClick={() => this.selectedGame('game1')}>Play Connect4</button>
            
          </div>
        }
      </div>
    )
  }
}


class App extends Component {
  render() {
    return (
      <div className="App">
      
        <div className="App-header">
          <h2>Connect 4 Game</h2>
          <p>  The objective is to make a straight line (vertical, horizontal or diagonal) with 5 pieces of the own colour.The player who uses the black pieces starts the game; both players will make one move by turn.
                One move entails in placing one piece in an empty square of the board. The pieces inside the board cannot be moved again. </p>
        </div>
        <div className="Game">
          <Board></Board>
        </div>
      </div>
    );
  }
}

function checkLine(a,b,c,d) {
    return ((a !== null) && (a === b) && (a === c) && (a === d));
}

function checkWinner(bs) {
    for (let c = 0; c < 7; c++)
        for (let r = 0; r < 4; r++)
            if (checkLine(bs[c][r], bs[c][r+1], bs[c][r+2], bs[c][r+3]))
                return bs[c][r] + ' wins!'

    for (let r = 0; r < 6; r++)
         for (let c = 0; c < 4; c++)
             if (checkLine(bs[c][r], bs[c+1][r], bs[c+2][r], bs[c+3][r]))
                 return bs[c][r] + ' wins!'

    for (let r = 0; r < 3; r++)
         for (let c = 0; c < 4; c++)
             if (checkLine(bs[c][r], bs[c+1][r+1], bs[c+2][r+2], bs[c+3][r+3]))
                 return bs[c][r] + ' wins!'

    for (let r = 0; r < 4; r++)
         for (let c = 3; c < 6; c++)
             if (checkLine(bs[c][r], bs[c-1][r+1], bs[c-2][r+2], bs[c-3][r+3]))
                 return bs[c][r] + ' wins!'

    return "";
}

export default App;
