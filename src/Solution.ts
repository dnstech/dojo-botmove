import { stat } from "fs";
import { IRoom, IRobot, IRobotState, Direction } from "./bot/bot";

// intermediate challenge
export const keyHandler = (key: string, robot: IRobot) => {

  // your implementation here
  if (key === 'ArrowRight') {
    robot.turnRight(true);
  } else if (key === 'ArrowLeft') {
    robot.turnLeft(true);
  } else if (key === 'ArrowUp') {
    robot.move(true)
  } else if (key === 'ArrowDown') {
    robot.turnRight(true);
    robot.turnRight(true);
    robot.move(true);
  }
};

// advanced challenge
export const getMeToTheSmileyFace = (room: IRoom, robot: IRobot) => {
  // your implementation here
  alert('Please implement Solution.ts');
};

type TurnDirection = 'L' | 'R';

function getTurnState(state: IRobotState, turn: TurnDirection): IRobotState {
  const directions : Direction[] = ['N', 'E', 'S', 'W'];
  let nextDirection = directions[(directions.indexOf(state.direction) + turn === 'R' ? 1 : -1) % 4];
  let turnState = { ...state };
  turnState.direction = nextDirection;
  return turnState;
}