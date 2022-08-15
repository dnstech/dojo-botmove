import { Point } from "@svgdotjs/svg.js";

export type Direction = 'N' | 'E' | 'S' | 'W';

export interface IRobot {
  animationSpeed: number;
  readonly direction: Direction;
  readonly x: number;
  readonly y: number;
  move(): boolean;
  turnLeft();
  turnRight();
}

export interface IRoom {
  rowCount: number;
  colCount: number;
  exitPoint: Point;
  robot: IRobot;

  reset();
}