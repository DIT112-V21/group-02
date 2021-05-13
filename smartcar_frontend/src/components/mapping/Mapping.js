import React, { Component } from "react";

const mqtt = require("mqtt");
const client = mqtt.connect("ws://localhost:8888");
const TOPIC_DISTANCE = "/smartcar/distance";
const TOPIC_ANGLE = "/smartcar/heading";
client.subscribe(TOPIC_ANGLE);
client.subscribe(TOPIC_DISTANCE);
const WIDTH = 200;
const HEIGHT = 200;
const currentPointX = WIDTH / 2;
const currentPointY = HEIGHT / 2;
const THREE_SIXTY = 360;
let map = Create2DArray(WIDTH);
const cellColor = "#e74c3c";
const cellSide = 5;

const Mapping = () => {
  let angle = 0;

  // update car angle
  client.on("message", (TOPIC_ANGLE, message) => {
    angle = message;
  });

  //when car move update mapping array
  client.on("message", (TOPIC_DISTANCE, message) => {
    let newX =
      Math.round(cellSide *
      (Math.cos(((2 * Math.PI) / THREE_SIXTY) * angle) * parseInt(message))); // get x value

    let newY =
      Math.round(cellSide *
      (Math.sin(((2 * Math.PI) / THREE_SIXTY) * angle) * parseInt(message))); // get y value
    // reposition previos positions depending on movements
     const ctx = document.getElementById("canvas").getContext("2d");
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        // if (
        //   x + newX >= 0 &&
        //   y + newY >= 0 &&
        //   x + newX < WIDTH &&
        //   y + newY < HEIGHT
        // ) {

       //   map[x + newX][y + newY] = map[x][y];
        //}
      }
    }
    map[currentPointX][currentPointY] = 1;
    //draw the canvas
     for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        if(map[x][y] === 1){
          let j = x * cellSide;
          let i = y * cellSide;
          ctx.beginPath();
          ctx.fillStyle = cellColor;
          ctx.fillRect(j, i, cellSide, cellSide);
        }

      }
    }
  });

  return <canvas id="canvas" />;
};

function Create2DArray(rows) {
  var arr = [];

  for (var i = 0; i < rows; i++) {
    arr[i] = [0];
  }

  return arr;
}
export default Mapping;
