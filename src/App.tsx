import React, { useRef } from "react";
import "./App.scss";
import Room from "./bot/Room";
import { IRoom } from './bot/bot.d';
import { getMeToTheSmileyFace } from "./Solution";

function App() {

  const roomRef = useRef<IRoom>(null);

  const findTheSmileyFace = () => {
    if (!roomRef.current) {
      return;
    }

    getMeToTheSmileyFace(roomRef.current, roomRef.current.robot);
    roomRef.current.replay();
  }

  const reset = () => {
    roomRef.current?.reset();
  }

  const move = () => {
    roomRef.current?.robot.move(true);
  }

  const turnLeft = () => {
    roomRef.current?.robot.turnLeft(true);
  }

  const turnRight = () => {
    roomRef.current?.robot.turnRight(true);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Move the robot!</h1>
        <div className="button-wrapper">
          <button className="reset" onClick={reset}>Reset</button>
          <button onClick={move}>Move</button>
          <button onClick={turnLeft}>Turn left</button>
          <button onClick={turnRight}>Turn right</button>
          <button className="action-button" onClick={findTheSmileyFace}>Find the smiley face!</button>
        </div>
      </header>
      <Room width={500} height={300} gridSize={50} ref={roomRef}/>
    </div>
  );
}

export default App;