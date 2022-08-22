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

class Decision {
  constructor(public x: number, public y: number, public leftCount: number) {
  }

  // There's no native dictionary/set library that allows comparing real objects
  // as far as I'm aware so we have to convert to strings.
  toString() {
    return `${this.x},${this.y},${this.leftCount}`;
  }
}

// advanced challenge
export const getMeToTheSmileyFace = (room: IRoom, robot: IRobot) => {
  // Keep trying different amounts of left turns from every position until we
  // reach our destination, We'll either find the solution, or run out of ram
  // memory.
  let visited = new Set<string>();
  while (robot.state.x !== room.exitPoint.x || robot.state.y !== room.exitPoint.y) {
    let current = new Decision(robot.state.x, robot.state.y, 0);
    while (visited.has(current.toString())) {
      current = new Decision(robot.state.x, robot.state.y, current.leftCount + 1);
    }

    visited.add(current.toString());
    for (let i = 0; i < current.leftCount; i++) {
      robot.turnLeft(false);
    }

    robot.move(false);
  }
};
