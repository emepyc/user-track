import React, {useEffect, useState} from 'react';
import * as d3 from 'd3';
import {v4 as uuid} from 'uuid';

import useMousePosition from '../MouseTracker';
import './Plot.css';

const axisTicks = 20;

function Plot({width, height}) {
  const {position, clicked} = useMousePosition();
  const {time, x, y} = position;
  const [track, setTrack] = useState([]);
  const hasMovedCursor = typeof x === "number" && typeof y === "number";
  const id = uuid();

  const xScale = d3.scaleLinear()
    .domain([0, width])
    .range([-axisTicks / 2, axisTicks / 2]);

  const yScale = d3.scaleLinear()
    .domain([0, height])
    .range([axisTicks / 2, -axisTicks / 2]);

  const xs = xScale(x || 0).toFixed(2);
  const ys = yScale(y || 0).toFixed(2);

  const sendTrack = () => {
    console.log(track);
    fetch('http://localhost:8000', {
      headers: {"Content-Type": "application/json"},
      method: "POST",
      body: JSON.stringify({
        'id': `${track[0].time}-${id}`,
        'tracks': track,
      }),
    });
  }

  useEffect(() => {
    if (clicked) {
      sendTrack()
      setTrack([]);
    } else {
      const newPoint = {
        time,
        x: xs,
        y: ys,
      }
      if (hasMovedCursor) {
        setTrack(t => [...t, newPoint])
      }
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [clicked, time, xs, ys]);


  const outerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const innerStyle = {
    backgroundColor: 'cyan',
    position: 'relative',
  }

  return (
    <React.Fragment>
      <div style={outerStyle}>
        <div style={innerStyle}>
          <div className='msg'>
            {hasMovedCursor
              ? `Your cursor is at (${xs}, ${ys}))`
              : "Move your mouse around."}
          </div>
          <P
            width={width}
            height={height}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Plot;

function P({width, height}) {

  return (
    <svg width={width} height={height}>
      <line
        x1={0}
        y1={~~(height / 2)}
        x2={width}
        y2={~~(height / 2)}
        stroke={'black'}
        strokeWidth={2}
      />
      {[Array.from({length: axisTicks}, (_, idx) => idx).map(n => (
        <line
          key={`y-tick-${n}`}
          x1={n * (width / axisTicks)}
          y1={~~(height / 2)}
          x2={n * (width / axisTicks)}
          y2={~~(height / 2) + 10}
          stroke={'black'}
          strokeWidth={1}
        />
      ))]}
      <line
        x1={~~(width / 2)}
        y1={0}
        x2={~~(width / 2)}
        y2={height}
        stroke={'black'}
        strokeWidth={2}
      />
      {[Array.from({length: axisTicks}, (_, idx) => idx).map(n => (
        <line
          key={`x-tick-${n}`}
          x1={~~(width / 2)}
          y1={n * (height / axisTicks)}
          x2={~~(width / 2) + 10}
          y2={n * (height / axisTicks)}
          stroke={'black'}
          strokeWidth={1}
        />
      ))]}
    </svg>
  );
}
