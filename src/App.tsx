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
    if (!roomRef.current) {
      return;
    }

    const room = roomRef.current;
    const row = room.rowCount;
    const col = room.colCount;

    console.log('solving', room);

    const visited:boolean[][] = [];
    for (let i = 0; i < row; i++) {
      const row = [];
      for (let j = 0; j < col; j++) {
        row.push(false);
      }
      visited.push(row);
    }

    dfs(room.robot, visited, room, 0);
  }

  const delta: {[id: string]: number[]} = {
    'N': [0, -1],
    'E': [1, 0],
    'S': [0, 1],
    'W': [-1, 0]
  };

  function dfs(robot: IRobot, visited: boolean[][], room: IRoom, depth: number): boolean {
    if (robot.state.x === room.exitPoint.x && robot.state.y === room.exitPoint.y) {
      return true;
    }

    for (let i = 0; i < 4; i++) {
      const nextX = robot.state.x + delta[robot.state.direction][0];
      const nextY = robot.state.y + delta[robot.state.direction][1];
      log(depth, 'next: ' + nextX + ', ' + nextY);
      if (isInBound(nextX, nextY, room) && !visited[nextX][nextY]) {
        visited[nextX][nextY] = true;
        log(depth, '  - in bound, direction ' + robot.state.direction);
        if (robot.move()) {
          //const curDir = robot.state.direction;
          log(depth, '  - moved, direction ' + robot.state.direction);
          if (dfs(robot, visited, room, depth + 1)) {
            return true;
          }

          robot.turnLeft();
          robot.turnLeft();
          robot.move();
          robot.turnRight();
          robot.turnRight();
          log(depth, '  - backtracked, direction ' + robot.state.direction);
        }
      }
      robot.turnRight();
    }

    return false;
  }

  function log(depth: number, message: string) {
    const spaces = [];
    while (depth > 0) {
      spaces.push('  ');
      depth--;
    }
    console.log(spaces.join('') + message);
  }

  function isInBound(x: number, y: number, room: IRoom): boolean {
    return 0 <= x && x < room.rowCount && 0 <= y && y < room.colCount;
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