import { Point, Runner, SVG, Svg, Timeline } from "@svgdotjs/svg.js";
import * as ReactDOMServer from "react-dom/server";
import { Direction, IRobot } from './bot.d';

export interface IRobotParent {
  gridSize: number;
  colCount: number;
  rowCount: number;
  svg: Svg;
  obstacles: { [id: string] : boolean };
  exitPoint: Point;
}

const robotSvg =
  <g>
    <rect width="256" height="256" fill="none"/>
    <rect x="32" y="56" width="192" height="160" rx="24" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/>
    <rect x="72" y="144" width="112" height="40" rx="20" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/>
    <line x1="148" y1="144" x2="148" y2="184" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/>
    <line x1="108" y1="144" x2="108" y2="184" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/>
    <line x1="128" y1="56" x2="128" y2="16" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/>
    <circle cx="84" cy="108" r="10"/>
    <circle cx="172" cy="108" r="10"/>
  </g>;

export class Robot implements IRobot {
  animationSpeed = 500;
  direction: Direction = 'N';

  x = 0;
  y = 0;

  private actionQueue: string[] = [];
  private timeline = new Timeline();
  private bot: Svg;

  constructor(public parent: IRobotParent) {
    this.bot = SVG().size(this.parent.gridSize, this.parent.gridSize).viewbox('0 0 256 256');
  }

  turnLeft() {
    let nextDirection: Direction;
    switch (this.direction) {
      case 'N':
        nextDirection = 'W';
        break;
      case 'E':
        nextDirection = 'N';
        break;
      case 'W':
        nextDirection = 'S';
        break;
      case 'S':
        nextDirection = 'E';
        break;
    }
    this.updateBot(nextDirection);
  }

  turnRight() {
    let nextDirection: Direction;
    switch (this.direction) {
      case 'N':
        nextDirection = 'E';
        break;
      case 'E':
        nextDirection = 'S';
        break;
      case 'W':
        nextDirection = 'N';
        break;
      case 'S':
        nextDirection = 'W';
        break;
    }
    this.updateBot(nextDirection);
  }

  move() {
    let x = this.x;
    let y = this.y;
    switch (this.direction) {
      case 'N':
        y--;
        break;
      case 'E':
        x++;
        break;
      case 'W':
        x--;
        break;
      case 'S':
        y++;
        break;
    }

    if (this.isMovable(x, y)) {
      this.addVisitedMark();
      this.updateBot(this.direction, x, y);
      return true;
    }

    return false;
  }

  placeRobotRandomly() {
    const staticElem = ReactDOMServer.renderToStaticMarkup(robotSvg);
    this.bot.svg(staticElem);
    this.bot.addTo(this.parent.svg);

    // set the timeline to coordinate animation
    this.parent.svg.timeline(this.timeline);
    this.bot.timeline(this.timeline);
    this.bot.first().timeline(this.timeline);

    // random location
    const maxX = this.parent.colCount / 2;
    const maxY = this.parent.rowCount / 2;
    let x:number, y:number;
    do {
      x = Math.floor(Math.random() * maxX);
      y = Math.floor(Math.random() * maxY);
    } while (!this.isMovable(x, y));

    // random location
    const rand = Math.random();
    const direction = rand < 0.25 ? 'N' : rand < 0.5 ? 'E' : rand < 0.75 ? 'S' : 'W';

    this.updateBot(direction, x, y, this.animationSpeed, true);

    //this.testRun();
    //this.solve();
  }

  reset() {
    this.timeline.finish();
    this.bot.clear();
    this.timeline = new Timeline();
  }

  private updateBot(direction = this.direction, nextX = this.x, nextY = this.y, nextDelay = this.animationSpeed, force = false) {
    this.actionQueue.push(`${direction},${nextX},${nextY},${nextDelay}`);
    this.startAnimation(force);
  }

  private startAnimation(force = false) {
    while (this.actionQueue.length) {
      const action = this.actionQueue.shift();
      console.log(action);
      const splits = (action as string).split(',');
      const direction = splits[0] as Direction;
      const x = parseInt(splits[1]);
      const y = parseInt(splits[2]);
      const delay = parseInt(splits[3]);

      this.animationSpeed = delay;

      if (force || this.x !== x || this.y !== y) {
        // move
        this.x = x;
        this.y = y;
        this.bot.animate(delay, 0, 'relative').move(x * this.parent.gridSize, y * this.parent.gridSize);
      }

      if (force || this.direction !== direction) {
        // rotate
        this.direction = direction;
        switch (this.direction) {
          case 'N':
            this.bot.first().animate(delay, 0, 'relative').transform({
              rotate: 0
            });
            break;
          case 'E':
            this.bot.first().animate(delay, 0, 'relative').transform({
              rotate: 90
            });
            break;
          case 'W':
            this.bot.first().animate(delay, 0, 'relative').transform({
              rotate: 270
            });
            break;
          case 'S':
            this.bot.first().animate(delay, 0, 'relative').transform({
              rotate: 180
            });
            break;
        }
      }
    }
  }

  private isMovable(x: number, y: number): boolean {
    if (x < 0 || x >= this.parent.colCount || y < 0 || y >= this.parent.rowCount) {
      return false;
    }

    return !this.parent.obstacles[`${x}_${y}`];
  }

  private addVisitedMark() {
    const cx = this.x * this.parent.gridSize + this.parent.gridSize / 2;
    const cy = this.y * this.parent.gridSize + this.parent.gridSize / 2;
    this.parent.svg.circle(10).cx(cx).cy(cy).attr({
      fill: 'url(#radial)',
      filter: 'url(#sofGlow)'
    });
  }

  private intervalCount = 30;
  private randInterval: NodeJS.Timer | undefined;
  private testRun() {
    const randMove = () => {
      this.intervalCount--;
      if (this.intervalCount < 0) {
        clearInterval(this.randInterval);
        return;
      }

      if (Math.random() > 0.9) {
        this.turnLeft();
      } else if (Math.random() > 0.8) {
        this.turnRight();
      } else {
        this.move();
      }
    };

    this.randInterval = setInterval(randMove, this.animationSpeed * 2);
  }
}