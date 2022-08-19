/* eslint-disable react/style-prop-object */
import { Pattern, Point, Svg, SVG } from "@svgdotjs/svg.js";
import React, { ForwardedRef, useEffect, useRef } from "react";
import * as ReactDOMServer from "react-dom/server";
import { Direction, IRobot, IRobotState, IRoom, IRoomProps } from "./bot";
import Robot, { IRobotControl } from "./Robot";

import './Room.scss';
import { forwardRef } from 'react';
import { useImperativeHandle } from 'react';
import { turnLeftFrom, turnRightFrom } from './utils';
import { moveFrom } from './utils';

const BLOBS = [
  <g> <path d="M0 .5A.5.5 0 0 1 .5 0h15a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H14v2h1.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H14v2h1.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5H2v-2H.5a.5.5 0 0 1-.5-.5v-3A.5.5 0 0 1 .5 6H2V4H.5a.5.5 0 0 1-.5-.5v-3zM3 4v2h4.5V4H3zm5.5 0v2H13V4H8.5zM3 10v2h4.5v-2H3zm5.5 0v2H13v-2H8.5zM1 1v2h3.5V1H1zm4.5 0v2h5V1h-5zm6 0v2H15V1h-3.5zM1 7v2h3.5V7H1zm4.5 0v2h5V7h-5zm6 0v2H15V7h-3.5zM1 13v2h3.5v-2H1zm4.5 0v2h5v-2h-5zm6 0v2H15v-2h-3.5z" fill="blue"></path> </g>,
  <g> <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z" fill="red"></path> </g>,
  <g fill="#3483eb"> <path d="M6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/> <path d="M5.5.5a.5.5 0 0 0-1 0V2A2.5 2.5 0 0 0 2 4.5H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2A2.5 2.5 0 0 0 4.5 14v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14a2.5 2.5 0 0 0 2.5-2.5h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14A2.5 2.5 0 0 0 11.5 2V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5zm1 4.5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3A1.5 1.5 0 0 1 6.5 5z"/> </g>,
  <g fill="#f2166a"> <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM4.053 4.276a.5.5 0 0 1 .67-.223l2 1a.5.5 0 0 1 .166.76c.071.206.111.44.111.687C7 7.328 6.552 8 6 8s-1-.672-1-1.5c0-.408.109-.778.285-1.049l-1.009-.504a.5.5 0 0 1-.223-.67zm.232 8.157a.5.5 0 0 1-.183-.683A4.498 4.498 0 0 1 8 9.5a4.5 4.5 0 0 1 3.898 2.25.5.5 0 1 1-.866.5A3.498 3.498 0 0 0 8 10.5a3.498 3.498 0 0 0-3.032 1.75.5.5 0 0 1-.683.183zM10 8c-.552 0-1-.672-1-1.5 0-.247.04-.48.11-.686a.502.502 0 0 1 .166-.761l2-1a.5.5 0 1 1 .448.894l-1.009.504c.176.27.285.64.285 1.049 0 .828-.448 1.5-1 1.5z"/> </g>
];

const BLOBSTATIC = BLOBS.map(b => ReactDOMServer.renderToStaticMarkup(b));

const EXITICON = <g fill="#0f0fae"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm1.757-.437a.5.5 0 0 1 .68.194.934.934 0 0 0 .813.493c.339 0 .645-.19.813-.493a.5.5 0 1 1 .874.486A1.934 1.934 0 0 1 10.25 7.75c-.73 0-1.356-.412-1.687-1.007a.5.5 0 0 1 .194-.68z"/> </g>
const EXITICONSTATIC = ReactDOMServer.renderToStaticMarkup(EXITICON);

const DEFS = `
  <radialGradient id="radial">
    <stop stopColor="#0b0bc9" offset="0.1"/>
    <stop stopColor="#5353d77f" offset="0.8"/>
  </radialGradient>
  <filter id="softGlow" width="300%" height="300%" x="-100%" y="-100%">
    <feGaussianBlur in="thicken" stdDeviation="5" result="blurred" />
  </filter>
`;

const Room = forwardRef((props: IRoomProps, ref: ForwardedRef<IRoom>) => {
  const width = props.width;
  const height = props.height;
  const gridSize = props.gridSize;
  const colCount = Math.floor(width / gridSize);
  const rowCount = Math.floor(height / gridSize);
  const iconPercentage = 0.7;
  const obstacleFillMax = 0.3;
  const obstacleFillMin = 0.1;

  const obstacles: { [id: string]: boolean } = {};
  const exitPoint = new Point();

  const svgRef = useRef<SVGSVGElement>(null);
  const robot = useRef<IRobotControl>(null);
  const lastRecording: string[] = [];

  // this is the state which the room will manage
  // it is synced with the internal robot state once on reset only
  // when executing function, it is updated immediately
  // while the internal robot state is updated after animation
  const simulationState = {
    x: 0,
    y: 0,
    direction: 'N'
  };

  const reset = () => {
    if (!svgRef.current) {
      return;
    }

    const svg = SVG(svgRef.current)
    // clear the obstacles
    Object.keys(obstacles).forEach(key => delete obstacles[key]);
    // clear the recording
    lastRecording.splice(0, lastRecording.length);
    svg.clear();
    draw(svg)
  }

  const draw = (svg: Svg) => {
    initialDraw(svg);
    drawExitPoint(svg);
    generateRandomObstacles(svg);
    drawRobot(svg);
  };

  const initialDraw = (svg: Svg) => {
    //console.log('initial draw', svg);
    svg.viewbox(0, 0, width, height);
    svg.defs().node.innerHTML = DEFS;
    const pattern = svg.pattern(gridSize * 2, gridSize * 2, (pat: Pattern) => {
      pat.rect(gridSize * 2, gridSize * 2).fill('#eee');
      pat.rect(gridSize, gridSize).fill('#ddd');
      pat.rect(gridSize, gridSize).move(gridSize, gridSize).fill('#ddd');
    });

    svg.rect(width, height).fill(pattern);
  }

  const drawExitPoint = (svg: Svg) => {
    const minX = colCount - 5;
    const minY = rowCount - 5;
    const iconSize = gridSize * iconPercentage;
    const deltaPos = gridSize * (0.5 - iconPercentage / 2);
    exitPoint.x = Math.floor(Math.random() * (colCount - minX) + minX);
    exitPoint.y = Math.floor(Math.random() * (rowCount - minY) + minY);
    svg.nested()
      .svg(EXITICONSTATIC) // add a child svg
      .size(iconSize, iconSize)
      .viewbox('0 0 16 16')
      .move(exitPoint.x * gridSize + deltaPos, exitPoint.y * gridSize + deltaPos)
  }

  const generateRandomObstacles = (svg: Svg) => {
    const max = colCount * rowCount * obstacleFillMax;
    const min = colCount * rowCount * obstacleFillMin;
    const count = Math.floor(Math.random() * (max - min) + min);
    let i = 0;
    let tryCount = 0;
    while (i < count) {
      const randX = Math.floor(Math.random() * colCount);
      const randY = Math.floor(Math.random() * rowCount);

      if (!obstacles[`${randX}_${randY}`] && randX !== exitPoint.x && randY !== exitPoint.y) {
        obstacles[`${randX}_${randY}`] = true;
        i++;
      }

      tryCount++;
      if (tryCount > 100 * count) {
        throw 'Not enough spaces for all the obstacles';
      }
    }

    drawObstacles(svg);
  }

  const drawObstacles = (svg: Svg) => {
    const iconSize = gridSize * iconPercentage;
    const deltaPos = gridSize * (0.5 - iconPercentage / 2);
    for (let key in obstacles) {
      const splits = key.split('_');
      const x = parseInt(splits[0]) * gridSize;
      const y = parseInt(splits[1]) * gridSize;
      const randI = Math.floor(Math.random() * BLOBSTATIC.length);
      svg.nested()
        .svg(BLOBSTATIC[randI])
        .size(iconSize, iconSize)
        .viewbox('0 0 16 16').move(x + deltaPos, y + deltaPos);
    }
  }

  const drawRobot = (svg: Svg) => {
    if (!robot.current) {
      return;
    }
    robot.current.initialDraw(svg);
    const state = robot.current.getInternalState();
    simulationState.x = state.x;
    simulationState.y = state.y;
    simulationState.direction = state.direction;

    // console.log('simulation state', simulationState);
  }

  const addMark = (cx: number, cy: number) => {
    if (!svgRef.current) {
      return;
    }
    const svg = SVG(svgRef.current);
    svg.circle(gridSize / 5).cx(cx).cy(cy).attr({
      fill: 'url(#radial)',
      filter: 'url(#softGlow)'
    });
  };

  const isMovable = (x: number, y:number) => {
    if (x < 0 || x >= colCount || y < 0 || y >= rowCount) {
      return false;
    }

    return !obstacles[`${x}_${y}`];
  };

  const replay = () => {
    robot.current?.processMoves(lastRecording);
    lastRecording.splice(0, lastRecording.length);
  }

  // this is a simulation without animation :(
  // can't think of a better way for now :(
  const simulationBot: IRobot = {
    turnLeft: (animate: boolean = false) => {
      simulationState.direction = turnLeftFrom(simulationState.direction as Direction);
      if (animate) {
        robot.current?.turnLeft();
      } else {
        lastRecording.push('L');
      }
    },
    turnRight: (animate: boolean = false) => {
      simulationState.direction = turnRightFrom(simulationState.direction as Direction);
      if (animate) {
        robot.current?.turnRight();
      } else {
        lastRecording.push('R');
      }
    },
    move: (animate: boolean = false) => {
      const [nextX, nextY] = moveFrom(simulationState.x, simulationState.y, simulationState.direction as Direction);
      if (isMovable(nextX, nextY)) {
        if (animate) {
          robot.current?.move();
        } else {
          lastRecording.push('M');
        }
        simulationState.x = nextX;
        simulationState.y = nextY;
        return true;
      }
      return false;
    },
    state: simulationState as IRobotState
  };

  const childProps = {
    gridSize, colCount, rowCount, obstacles, exitPoint, addMark, isMovable
  };

  useEffect(() => {
    if (svgRef.current) {
      reset();
    }
  });

  useImperativeHandle(ref, () =>({
    robot: simulationBot,
    rowCount,
    colCount,
    exitPoint,
    reset,
    replay
  }));

  return (
    <div className="room">
      <svg xmlns="http://www.w3.org/2000/svg" ref={svgRef} role="room">
        <Robot {...childProps} ref={robot}/>
      </svg>
    </div>
  );
});

export default Room;