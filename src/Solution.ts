import { IRoom, IRobot } from "./bot/bot";

// intermediate challenge
export const keyHandler = (key: string, robot: IRobot) => {
  // your implementation here

  switch (key) {
    case "ArrowUp":
      robot.move(true);
      break;

    case "ArrowLeft":
      robot.turnLeft(true);
      break;

    case "ArrowRight":
      robot.turnRight(true);
      break;
  }

};

// advanced challenge
export const getMeToTheSmileyFace = (room: IRoom, robot: IRobot) => {
  // your implementation here
  alert('Please implement Solution.ts');
};
