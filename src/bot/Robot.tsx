import { Point, SVG, Svg, Timeline } from "@svgdotjs/svg.js";
import { ForwardedRef, forwardRef, RefObject, useImperativeHandle, useRef } from "react";
import * as ReactDOMServer from "react-dom/server";
import { Direction, IRobotState } from './bot.d';
import { moveFrom, turnLeftFrom, turnRightFrom } from './utils';

export interface IRobotParent {
  gridSize: number;
  colCount: number;
  rowCount: number;
  obstacles: { [id: string] : boolean };
  exitPoint: Point;
  addMark(cx: number, cy: number): void;
  isMovable(x: number, y: number): boolean;
}

export interface IRobotControl {
  initialDraw(room: Svg): void;
  move(): void;
  turnLeft(): void;
  turnRight(): void;
  getInternalState(): IRobotState;
  processMoves(moves: string[]): void;
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

const Robot = forwardRef((props: IRobotParent, stateRef: ForwardedRef<IRobotControl>) => {
  const animationDelay = 200;
  let currentTimeline = 0;
  let direction: Direction = 'N';
  let x: number = 0;
  let y: number = 0;
  const svgRef: RefObject<SVGSVGElement> = useRef(null);

  const stateQueue: string[] = [];
  const timeline = new Timeline();

  const getInternalState = () => ({
    x, y, direction
  });

  const turnLeft = () => {
    updateBot(turnLeftFrom(direction), x, y);
  }

  const turnRight = () => {
    updateBot(turnRightFrom(direction), x, y);
  }

  const move = () => {
    const [nextX, nextY] = moveFrom(x, y, direction);
    if (props.isMovable(nextX, nextY)) {
      addVisitedMark();
      updateBot(direction, nextX, nextY);
      return true;
    }

    return false;
  }

  const initialDraw = (svg: Svg) => {
    if (!svgRef.current) {
      return;
    }

    const bot = SVG(svgRef.current);
    bot.clear();
    timeline.finish();
    timeline.seek(0);
    currentTimeline = 0;
    stateQueue.splice(0, stateQueue.length);

    const staticElem = ReactDOMServer.renderToStaticMarkup(robotSvg);
    bot
      .size(props.gridSize, props.gridSize).viewbox('0 0 256 256')
      .svg(staticElem);

      // set the timeline to coordinate animation
    bot.timeline(timeline)
      // select the group
      .first()
      .timeline(timeline);

    bot.addTo(svg);
    svg.timeline(timeline);

    // random location
    const maxX = props.colCount / 2;
    const maxY = props.rowCount / 2;
    let initialX:number, initialY:number;
    do {
      initialX = Math.floor(Math.random() * maxX);
      initialY = Math.floor(Math.random() * maxY);
    } while (!props.isMovable(initialX, initialY));

    // random location
    const rand = Math.random();
    const initialDirection = rand < 0.25 ? 'N' : rand < 0.5 ? 'E' : rand < 0.75 ? 'S' : 'W';

    updateBot(initialDirection, initialX, initialY, true);

    //testRun();
  }

  const updateBot = (nextDirection: Direction, nextX: number, nextY: number, initalDraw = false) => {
    stateQueue.push(`${nextDirection},${nextX},${nextY}`);
    startAnimation(initalDraw);
  }

  const startAnimation = (initalDraw = false) => {
    if (!svgRef.current) {
      return;
    }

    const bot = SVG(svgRef.current);

    // console.log(stateQueue);
    // console.log(currentTimeline);

    while (stateQueue.length) {
      const action = stateQueue.shift();
      //console.log(action);
      const splits = (action as string).split(',');
      const nextDirection = splits[0] as Direction;
      const nextX = parseInt(splits[1]);
      const nextY = parseInt(splits[2]);

      if (nextX !== x || nextY !== y) {
        // move
        if (!initalDraw) {
          addVisitedMark();
        }
        x = nextX;
        y = nextY;
        bot.animate(animationDelay, currentTimeline, 'absolute').move(x * props.gridSize, y * props.gridSize);
        currentTimeline += animationDelay;
      }

      if (nextDirection !== direction) {
        // rotate
        direction = nextDirection;
        switch (nextDirection) {
          case 'N':
            bot.first().animate(animationDelay, currentTimeline, 'absolute').transform({
              rotate: 0
            });
            break;
          case 'E':
            bot.first().animate(animationDelay, currentTimeline, 'absolute').transform({
              rotate: 90
            });
            break;
          case 'W':
            bot.first().animate(animationDelay, currentTimeline, 'absolute').transform({
              rotate: 270
            });
            break;
          case 'S':
            bot.first().animate(animationDelay, currentTimeline, 'absolute').transform({
              rotate: 180
            });
            break;
        }
        currentTimeline += animationDelay;
      }
    }
  };

  const addVisitedMark = () => {
    const cx = x * props.gridSize + props.gridSize / 2;
    const cy = y * props.gridSize + props.gridSize / 2;
    props.addMark(cx, cy);
  };

  const processMoves = (moves: string[]) => {
    const state = {
      x: x,
      y: y,
      direction: direction
    };

    // console.log('process path', state);

    stateQueue.splice(0, stateQueue.length);
    for (let i = 0; i < moves.length; i++) {
      switch (moves[i]) {
        case 'L':
          state.direction = turnLeftFrom(state.direction);
          break;
        case 'R':
          state.direction = turnRightFrom(state.direction);
          break;
        case 'M':
          const [nextX, nextY] = moveFrom(state.x, state.y, state.direction);
          state.x = nextX;
          state.y = nextY;
          break;
      }
      stateQueue.push(`${state.direction},${state.x},${state.y}`);
    }

    startAnimation();
  };

  let intervalCount = 30;
  let randInterval: NodeJS.Timer | undefined;
  const testRun = () => {
    const randMove = () => {
      intervalCount--;
      if (intervalCount < 0) {
        clearInterval(randInterval);
        return;
      }

      if (Math.random() > 0.9) {
        turnLeft();
      } else if (Math.random() > 0.8) {
        turnRight();
      } else {
        move();
      }
    };

    randInterval = setInterval(randMove, animationDelay * 2);
  }

  useImperativeHandle(stateRef, () => ({
    turnLeft,
    turnRight,
    move,
    initialDraw,
    getInternalState,
    processMoves
  }));


  return <svg xmlns="http://www.w3.org/2000/svg" ref={svgRef}/>;
});

export default Robot;