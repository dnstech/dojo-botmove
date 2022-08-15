/* eslint-disable react/style-prop-object */
import { Point, SVG } from "@svgdotjs/svg.js";
import React, { RefObject } from "react";
import * as ReactDOMServer from "react-dom/server";
import { IRobot, IRoom } from "./bot";
import { IRobotParent, Robot } from "./Robot";

import './Room.scss';

const BLOBS = [
  <g> <path d="M0 .5A.5.5 0 0 1 .5 0h15a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H14v2h1.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H14v2h1.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5H2v-2H.5a.5.5 0 0 1-.5-.5v-3A.5.5 0 0 1 .5 6H2V4H.5a.5.5 0 0 1-.5-.5v-3zM3 4v2h4.5V4H3zm5.5 0v2H13V4H8.5zM3 10v2h4.5v-2H3zm5.5 0v2H13v-2H8.5zM1 1v2h3.5V1H1zm4.5 0v2h5V1h-5zm6 0v2H15V1h-3.5zM1 7v2h3.5V7H1zm4.5 0v2h5V7h-5zm6 0v2H15V7h-3.5zM1 13v2h3.5v-2H1zm4.5 0v2h5v-2h-5zm6 0v2H15v-2h-3.5z" fill="blue"></path> </g>,
  <g> <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z" fill="red"></path> </g>,
  <g fill="#3483eb"> <path d="M6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/> <path d="M5.5.5a.5.5 0 0 0-1 0V2A2.5 2.5 0 0 0 2 4.5H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2A2.5 2.5 0 0 0 4.5 14v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14a2.5 2.5 0 0 0 2.5-2.5h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14A2.5 2.5 0 0 0 11.5 2V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5zm1 4.5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3A1.5 1.5 0 0 1 6.5 5z"/> </g>,
  <g fill="#f2166a"> <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM4.053 4.276a.5.5 0 0 1 .67-.223l2 1a.5.5 0 0 1 .166.76c.071.206.111.44.111.687C7 7.328 6.552 8 6 8s-1-.672-1-1.5c0-.408.109-.778.285-1.049l-1.009-.504a.5.5 0 0 1-.223-.67zm.232 8.157a.5.5 0 0 1-.183-.683A4.498 4.498 0 0 1 8 9.5a4.5 4.5 0 0 1 3.898 2.25.5.5 0 1 1-.866.5A3.498 3.498 0 0 0 8 10.5a3.498 3.498 0 0 0-3.032 1.75.5.5 0 0 1-.683.183zM10 8c-.552 0-1-.672-1-1.5 0-.247.04-.48.11-.686a.502.502 0 0 1 .166-.761l2-1a.5.5 0 1 1 .448.894l-1.009.504c.176.27.285.64.285 1.049 0 .828-.448 1.5-1 1.5z"/> </g>
];

const BLOBSTATIC = BLOBS.map(b => ReactDOMServer.renderToStaticMarkup(b));

const EXITICON = <g fill="#0f0fae"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm1.757-.437a.5.5 0 0 1 .68.194.934.934 0 0 0 .813.493c.339 0 .645-.19.813-.493a.5.5 0 1 1 .874.486A1.934 1.934 0 0 1 10.25 7.75c-.73 0-1.356-.412-1.687-1.007a.5.5 0 0 1 .194-.68z"/> </g>
const EXITICONSTATIC = ReactDOMServer.renderToStaticMarkup(EXITICON);

const RADIALGRADIENTDEF = ReactDOMServer.renderToStaticMarkup(
  <radialGradient id="radial">
    <stop stop-color="#00f" offset="0.1"/>
    <stop stop-color="rgba(0,0,255, 0.5)" offset="0.8"/>
  </radialGradient>);

const GLOWFILTER = ReactDOMServer.renderToStaticMarkup(
  <filter id="sofGlow" width="300%" height="300%" x="-100%" y="-100%">
    <feGaussianBlur in="thicken" stdDeviation="5" result="blurred" />
  </filter>);

export class Room extends React.Component implements IRobotParent, IRoom {
  gridSize = 50;
  colCount = 20;
  rowCount = 16;

  svg = SVG().viewbox(0, 0, 1000, 800);
  obstacles: { [id: string]: boolean } = {};
  exitPoint = new Point();
  robot: Robot;

  private roomWidth = 1;
  private roomHeight = 1;

  private svgWrapperRefElement: RefObject<HTMLDivElement>;

  private added = false;

  constructor(props: any) {
    super(props);
    this.svgWrapperRefElement = React.createRef();
    this.robot = new Robot(this);
  }

  componentDidMount() {
    if (this.svgWrapperRefElement.current && !this.added) {
      this.svg.addTo(this.svgWrapperRefElement.current);
      this.svg.defs().node.innerHTML = RADIALGRADIENTDEF + GLOWFILTER;
      this.draw();

      // this is to prevent double call in development mode
      this.added = true;
    }
  }

  reset() {
    this.robot.reset();
    this.svg.clear();
    this.draw();
  }

  render() {
    return (
      <div className="room" ref={this.svgWrapperRefElement}>
      </div>
    );
  }

  private draw() {
    console.log("draw");

    this.initialDraw();
    this.drawExitPoint();
    this.generateRandomObstacles();
    this.drawRobot();
  }

  private initialDraw() {
    const pattern = this.svg.pattern(this.gridSize * 2, this.gridSize * 2, pattern => {
      pattern.rect(this.gridSize * 2, this.gridSize * 2).fill('#eee');
      pattern.rect(this.gridSize, this.gridSize).fill('#ddd');
      pattern.rect(this.gridSize, this.gridSize).move(this.gridSize, this.gridSize).fill('#ddd');
    });

    const clientRect = this.svg.node.getBoundingClientRect();
    this.roomWidth = clientRect.width;
    this.roomHeight = clientRect.height;
    this.svg.rect(this.roomWidth, this.roomHeight).fill(pattern);
  }

  private drawExitPoint() {
    const minX = this.colCount - 5;
    const minY = this.rowCount - 5;
    this.exitPoint.x = Math.floor(Math.random() * (this.colCount - minX) + minX);
    this.exitPoint.y = Math.floor(Math.random() * (this.rowCount - minY) + minY);
    SVG()
      .size(this.gridSize - 20, this.gridSize - 20)
      .viewbox('0 0 16 16')
      .move(this.exitPoint.x * this.gridSize + 10, this.exitPoint.y * this.gridSize + 10)
      .svg(EXITICONSTATIC)
      .addTo(this.svg);
  }

  private generateRandomObstacles() {
    const max = this.colCount * this.rowCount * 0.2;
    const min = this.colCount * this.rowCount * 0.05;
    const count = Math.floor(Math.random() * (max - min) + min);
    let i = 0;
    this.obstacles = {};
    while (i < count) {
      const randX = Math.floor(Math.random() * this.colCount);
      const randY = Math.floor(Math.random() * this.rowCount);

      if (!this.obstacles[`${randX}_${randY}`] && randX !== this.exitPoint.x && randY !== this.exitPoint.y) {
        this.obstacles[`${randX}_${randY}`] = true;
        i++;
      }
    }

    this.drawObstacles();
  }

  private drawRobot() {
    this.robot.placeRobotRandomly();
  }

  private drawObstacles() {
    for (let key in this.obstacles) {
      const splits = key.split('_');
      const x = parseInt(splits[0]) * this.gridSize;
      const y = parseInt(splits[1]) * this.gridSize;
      const randI = Math.floor(Math.random() * BLOBSTATIC.length);
      SVG().size(this.gridSize - 20, this.gridSize - 20).viewbox('0 0 16 16').move(x + 10, y + 10).svg(BLOBSTATIC[randI]).addTo(this.svg);
    }
  }
}
