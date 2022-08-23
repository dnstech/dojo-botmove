import { IRoom, IRobot } from "./bot/bot";


const headings = ['N', 'E', 'S', 'W'];
const keyHeadings = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
// intermediate challenge
export const keyHandler = (key: string, robot: IRobot) => { 
  let currentDirection = headings.indexOf(robot.state.direction);
  let desiredDirection = keyHeadings.indexOf(key);
  let turns = currentDirection - desiredDirection;

  for (let i = 0; i < Math.abs(turns); i++) {
    if (turns < 0) {
      robot.turnRight(true);
    } else {
      robot.turnLeft(true);
    }
  }

  // AC: To only move when facing correct direction wrap with if (turns == 0) 
  robot.move(true);
};



// advanced challenge
export const getMeToTheSmileyFace = (room: IRoom, robot: IRobot) => {
  let xHeading = robot.state.x - room.exitPoint.x;
  let yHeading = robot.state.y - room.exitPoint.y;
  
  while (xHeading != 0 || yHeading != 0) {
    let currentDirection = headings.indexOf(robot.state.direction);

    // AC: Ran out of time but intent was to bias random walk with a direct path to exit point.
    let desiredDirection = Math.round(Math.random() * 3);
    let turns = currentDirection - desiredDirection;

    for (let i = 0; i < Math.abs(turns); i++) {
      if (turns < 0) {
        robot.turnRight();
      } else {
        robot.turnLeft();
      }
    }
  
    robot.move();

    xHeading = robot.state.x - room.exitPoint.x;
    yHeading = robot.state.y - room.exitPoint.y;
  }
};
