import {IRoom, IRobot, Direction} from "./bot/bot";

// intermediate challenge
export const keyHandler = (key: string, robot: IRobot) => {
  var desiredDirection: Direction | null = null;
  switch (key) {
    case 'w': case 'ArrowUp'   : desiredDirection = 'N'; break;
    case 's': case 'ArrowDown' : desiredDirection = 'S'; break;
    case 'a': case 'ArrowLeft' : desiredDirection = 'W'; break;
    case 'd': case 'ArrowRight': desiredDirection = 'E'; break;
  }

  // Keyboard currently only controls movement.
  if (desiredDirection == null)
    return false;

  // Figure out which direction will get us closer to our desired direction in order to turn optimally.
  const TURN_AMOUNT_DEGREES = 90;
  let currentAngle = getAngle(robot.state.direction);
  let desiredAngle = getAngle(desiredDirection);
  let leftDiff  = Math.abs(currentAngle - TURN_AMOUNT_DEGREES - desiredAngle) % 360;
  let rightDiff = Math.abs(currentAngle + TURN_AMOUNT_DEGREES - desiredAngle) % 360;
  while (robot.state.direction !== desiredDirection) {
    if (leftDiff < rightDiff) {
      robot.turnLeft(true);
    } else {
      robot.turnRight(true);
    }
  }

  robot.move(true);
  return true;
};

function getAngle (direction: Direction) {
  switch (direction) {
    case "N": return 0;
    case "E": return 90;
    case "S": return 180;
    case "W": return 270;
  }
}

// advanced challenge
export const getMeToTheSmileyFace = (room: IRoom, robot: IRobot) => {
  // your implementation here
  alert('Please implement Solution.ts');
};
