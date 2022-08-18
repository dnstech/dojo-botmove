import { Point } from "@svgdotjs/svg.js";

export type Direction = 'N' | 'E' | 'S' | 'W';

export interface IRobotState {
  readonly direction: Direction;
  readonly x: number;
  readonly y: number;
}

export interface IRobot {
  state: IRobotState;
  move(animate?: boolean): boolean;
  turnLeft(animate?: boolean);
  turnRight(animate?: boolean);
}

export interface IRoom {
  rowCount: number;
  colCount: number;
  exitPoint: Point;
  robot: IRobot;

  reset();
  replay();
}

export interface IRoomProps {
  width: number;
  height: number;
  gridSize: number;
}