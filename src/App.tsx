import React, { useRef } from "react";
import "./App.css";
import Room from "./bot/Room";
import { IRobot, IRoom } from './bot/bot.d';

function App() {

  const roomRef = useRef<IRoom>(null);

  const findExit = () => {
    if (!roomRef.current) {
      return;
    }

    solve(roomRef.current, roomRef.current.robot);
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

  let exitPath = '';
  const solve = (room: IRoom, robot: IRobot) => {
    console.log('solving', room.robot.state.x, room.robot.state.y, room.robot.state.direction);
    console.log('exit point', room.exitPoint.x, room.exitPoint.y);

    exitPath = '';
    const visited:boolean[][] = [];
    for (let i = 0; i < room.colCount; i++) {
      const col = [];
      for (let j = 0; j < room.rowCount; j++) {
        col.push(false);
      }
      visited.push(col);
    }

    dfs(room.robot, visited, room, 0, '');
    console.log('Exit path:', exitPath);

    room.processPath(exitPath);
  }

  const delta: {[id: string]: number[]} = {
    'N': [0, -1],
    'E': [1, 0],
    'S': [0, 1],
    'W': [-1, 0]
  };

  function dfs(robot: IRobot, visited: boolean[][], room: IRoom, depth: number, path: string): boolean {
    if (robot.state.x === room.exitPoint.x && robot.state.y === room.exitPoint.y) {
      exitPath = path;
      return true;
    }

    visited[robot.state.x][robot.state.y] = true;
    for (let i = 0; i < 4; i++) {
      const nextX = robot.state.x + delta[robot.state.direction][0];
      const nextY = robot.state.y + delta[robot.state.direction][1];
      // log(depth, 'direction ' + robot.state.direction);
      // log(depth, 'next: ' + nextX + ', ' + nextY);
      if (isInBound(nextX, nextY, room) && !visited[nextX][nextY] && robot.move()) {
        //const curDir = robot.state.direction;
        // log(depth, '  - moved, direction ' + robot.state.direction);
        // log(depth, '  - path: ' + path);
        if (dfs(robot, visited, room, depth + 1, path + 'M')) {
          return true;
        }

        robot.turnLeft();
        robot.turnLeft();
        robot.move();
        robot.turnRight();
        robot.turnRight();
        // log(depth, '  - backtracked, direction ' + robot.state.direction);
        // log(depth, '  - backtracked path: ' + path);
      }
      robot.turnRight();
      path += 'R';
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
    return 0 <= x && x < room.colCount && 0 <= y && y < room.rowCount;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Move the robot!</h1>
        <button onClick={reset}>Reset</button>
        <button onClick={move}>Move</button>
        <button onClick={turnLeft}>Turn left</button>
        <button onClick={turnRight}>Turn right</button>
        <button onClick={findExit}>Exit!</button>
      </header>
      <Room width={500} height={300} gridSize={50} ref={roomRef}/>
    </div>
  );
}

export default App;