import React, { Component } from "react";

const mqtt = require("mqtt");
const client = mqtt.connect("ws://localhost:8888");
const TOPIC_DISTANCE = "/smartcar/direction";
const TOPIC_ANGLE = "/smartcar/heading";
client.subscribe(TOPIC_ANGLE);
client.subscribe(TOPIC_DISTANCE);
const WIDTH = 50;
const HEIGHT = 50;
var map = [];
let newY = 0;
let newX = 0;
const gridSize = 10
let angle = 0;
const Mapping = () => {
  //draw()


  // update car angle
  client.on("message", (TOPIC_ANGLE, message) => {
    angle = message;
    console.log(angle.payloadString)
  });

  //figure out car movements
  client.on("message", (TOPIC_DISTANCE, message) => {

    if(angle < 20 || angle > 340){
      newX = -1
    }else if((angle < 200 && angle > 160  )){
      newX = 1;
    } else 
    {
      newX = 0;
    }
    if( angle > 20 && angle < 160 )
    {
      newY = -WIDTH;
    }
    else if(angle > 200 && angle < 340)
    {
      newY = WIDTH;
    } 
      else
    {
      newY = 0;
    }
    let direction = 0
    let speed = message
    //console.log(speed)
    if(speed < 0)
    {
      direction = -1;
    }
    else if(speed > 0)
    {
      direction = 1;
    }
    //console.log(message);
    let newPosition = (newX+newY) * direction;
    // set car position to middle
    map[(HEIGHT * WIDTH) / 2] = 1;
    //Reposition previos positions depending on movements
    const context = document.getElementById("canvas").getContext("2d");
    for (let x = 0; x < WIDTH; x++) {
      for (let y = 0; y < HEIGHT; y++) {
        const i = y * WIDTH + x;
        if(i + newPosition > 0 && i + newPosition < (WIDTH * HEIGHT)){
          if(map[i] === 1 && i + newPosition <= WIDTH*(y + 1))
          {
            map[i + newPosition] = 1;
            map[i] = 0;
          }
    }
  }
  }
  //draw the canvas
  

  var j=0
  for(var a=0;a<=WIDTH * gridSize;a+=gridSize) {
    for(var b=0; b<=HEIGHT * gridSize; b+=gridSize) {
    j++;
      if(map[j] === 1){
        
        context.fillStyle = "#FF0000";
        context.beginPath();
        context.arc(a, b, 4, 0, 2 * Math.PI);
      }else{
        context.fillStyle = "#9FE2BF";  
        context.beginPath();
        context.arc(a, b, 5, 0, 2 * Math.PI);
      }
      
      context.fill();
    }
  }
  });
  return <canvas id="canvas" width={WIDTH * gridSize} height={HEIGHT * gridSize} />;
};
export default Mapping;
