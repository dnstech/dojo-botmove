import React, { RefObject } from "react";
import "./App.css";
import { Room } from "./bot/Room";
import { IRobot, IRoom } from './bot/bot.d';

export class App extends React.Component {

  room: IRoom | undefined;

  findExit() {
    this.solve();
  }

  reset() {
    this.room?.reset();
  }

  move() {
    this.room?.robot.move();
  }

  turnLeft() {
    this.room?.robot.turnLeft();
  }

  turnRight() {
    this.room?.robot.turnRight();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Move the robot!</h1>
          <button onClick={this.findExit.bind(this)}>Exit!</button>
          <button onClick={this.reset.bind(this)}>Reset</button>
          <button onClick={this.move.bind(this)}>Move</button>
          <button onClick={this.turnLeft.bind(this)}>Turn left</button>
          <button onClick={this.turnRight.bind(this)}>Turn right</button>
        </header>
        <Room ref={instance => this.room = instance as IRoom}/>
      </div>
    );
  }

  private solve() {
    if (!this.room) {
      return;
    }

    const row = this.room.rowCount;
    const col = this.room.colCount;

    const visited:boolean[][] = [];
    for (let i = 0; i < row; i++) {
      const row = [];
      for (let j = 0; j < col; j++) {
        row.push(false);
      }
      visited.push(row);
    }

    this.dfs(this.room.robot, visited, this.room, 0);
  }

  private delta: {[id: string]: number[]} = {
    'N': [0, -1],
    'E': [1, 0],
    'S': [0, 1],
    'W': [-1, 0]
  };

  private dfs(robot: IRobot, visited: boolean[][], room: IRoom, depth: number): boolean {
    if (robot.x === room.exitPoint.x && robot.y === room.exitPoint.y) {
      return true;
    }

    for (let i = 0; i < 4; i++) {
      const nextX = robot.x + this.delta[robot.direction][0];
      const nextY = robot.y + this.delta[robot.direction][1];
      this.log(depth, 'next: ' + nextX + ', ' + nextY);
      if (this.isInBound(nextX, nextY, room) && !visited[nextX][nextY]) {
        visited[nextX][nextY] = true;
        this.log(depth, '  - in bound, direction ' + robot.direction);
        if (robot.move()) {
          //const curDir = robot.direction;
          this.log(depth, '  - moved, direction ' + robot.direction);
          if (this.dfs(robot, visited, room, depth + 1)) {
            return true;
          }

          robot.turnLeft();
          robot.turnLeft();
          robot.move();
          robot.turnRight();
          robot.turnRight();
          this.log(depth, '  - backtracked, direction ' + robot.direction);
        }
      }
      robot.turnRight();
    }

    return false;
  }

  private log(depth: number, message: string) {
    const spaces = [];
    while (depth > 0) {
      spaces.push('  ');
      depth--;
    }
    console.log(spaces.join('') + message);
  }

  private isInBound(x: number, y: number, room: IRoom): boolean {
    return 0 <= x && x < room.colCount && 0 <= y && y <= room.rowCount;
  }
}