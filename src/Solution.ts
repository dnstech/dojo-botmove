import { IRoom, IRobot } from "./bot/bot";

// intermediate challenge
const leftTurns = ['NE', 'ES', 'WN', 'SW'];
export const keyHandler = (key: string, robot: IRobot) => {
  // your implementation here
  let direction = '';
  switch (key) {
    case 'ArrowUp':
      direction = 'N';
      break;
    case 'ArrowLeft':
      direction = 'W';
      break;
    case 'ArrowDown':
      direction = 'S';
      break;
    case 'ArrowRight':
      direction = 'E';
      break;
  }

  if (!direction) {
    return false;
  }

  if (robot.state.direction === direction) {
    robot.move(true);
  } else if (leftTurns.indexOf(`${direction}${robot.state.direction}`) >= 0) {
    robot.turnLeft(true);
  } else {
    robot.turnRight(true);
  }

  return true;
};

// advanced challenge
export const getMeToTheSmileyFace = (room: IRoom, robot: IRobot) => {
  // your implementation here

  const visited: boolean[][] = [];
  for (let i = 0; i < room.colCount; i++) {
    const col = [];
    for (let j = 0; j < room.rowCount; j++) {
      col.push(false);
    }
    visited.push(col);
  }

  depthFirstSearch(robot, visited, room);
};

const delta: { [id: string]: number[] } = {
  N: [0, -1],
  E: [1, 0],
  S: [0, 1],
  W: [-1, 0],
};

function depthFirstSearch(robot: IRobot, visited: boolean[][], room: IRoom): boolean {
  if (robot.state.x === room.exitPoint.x && robot.state.y === room.exitPoint.y) {
    return true;
  }

  visited[robot.state.x][robot.state.y] = true;
  for (let i = 0; i < 4; i++) {
    const nextX = robot.state.x + delta[robot.state.direction][0];
    const nextY = robot.state.y + delta[robot.state.direction][1];
    // log(depth, 'direction ' + robot.state.direction);
    // log(depth, 'next: ' + nextX + ', ' + nextY);
    if (isInBound(nextX, nextY, room) && !visited[nextX][nextY] && robot.move()) {
      // log(depth, '  - moved, direction ' + robot.state.direction);
      if (depthFirstSearch(robot, visited, room)) {
        //short circuit
        return true;
      }

      robot.turnRight();
      robot.turnRight();
      robot.move();
      robot.turnRight();
      robot.turnRight();
      // log(depth, '  - backtracked, direction ' + robot.state.direction);
    }
    robot.turnRight();
  }

  return false;
}

function isInBound(x: number, y: number, room: IRoom): boolean {
  return 0 <= x && x < room.colCount && 0 <= y && y < room.rowCount;
}

function log(depth: number, message: string) {
  const spaces = [];
  while (depth > 0) {
    spaces.push("  ");
    depth--;
  }
  console.log(spaces.join("") + message);
}