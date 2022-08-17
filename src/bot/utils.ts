import { Direction } from "./bot";

export function turnLeftFrom(direction: Direction): Direction {
  switch (direction) {
    case 'N':
      return 'W';
    case 'E':
      return 'N';
    case 'W':
      return 'S';
    case 'S':
      return 'E';
  }
}

export function turnRightFrom(direction: Direction): Direction {
  switch (direction) {
    case 'N':
      return 'E';
    case 'E':
      return 'S';
    case 'W':
      return 'N';
    case 'S':
      return 'W';
  }
}

export function moveFrom(x: number, y: number, direction: Direction) {
  let nextX = x;
  let nextY = y;
  switch (direction) {
    case 'N':
      nextY--;
      break;
    case 'E':
      nextX++;
      break;
    case 'W':
      nextX--;
      break;
    case 'S':
      nextY++;
      break;
  }

  return [nextX, nextY];
}