import React, { RefObject, useRef } from "react";
import "./App.css";
import Room from "./bot/Room";
import { IRobot, IRoom } from './bot/bot.d';

function App() {

  const roomRef = useRef<IRoom>();

  const findExit = () => {
    solve();
  }

  const reset = () => {
    roomRef.current?.reset();
  }

  const move = () => {
    roomRef.current?.robot.move();
  }

  const turnLeft = () => {
    roomRef.current?.robot.turnLeft();
  }

  const turnRight = () => {
    roomRef.current?.robot.turnRight();
  }

  const solve = () => {
    // place your code here
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Move the robot!</h1>
        <button onClick={findExit}>Exit!</button>
        <button onClick={reset}>Reset</button>
        <button onClick={move}>Move</button>
        <button onClick={turnLeft}>Turn left</button>
        <button onClick={turnRight}>Turn right</button>
      </header>
      <Room ref={roomRef}/>
    </div>
  );
}

export default App;