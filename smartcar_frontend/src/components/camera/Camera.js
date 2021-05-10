import React from "react";

const mqtt = require("mqtt");
const client = mqtt.connect("ws://localhost:8888");
const topic = "/smartcar/camera";
client.subscribe(topic);

const Camera = () => {
  const WIDTH = 320;
  const HEIGHT = 240;
  client.on("message", (topic, message) => {
    console.console.log(message);
    const ctx = document.getElementById("canvas").getContext("2d");
    const canvas = document.getElementById("canvas")
    const arrayBuffer = new ArrayBuffer(WIDTH * HEIGHT * 4);
    const pixels = new Uint8ClampedArray(arrayBuffer);
    for (let y = 0; y < HEIGHT; y += 4) {
      for (let x = 0; x < WIDTH; x += 4) {
        const i = y * WIDTH + x;
        pixels[i] = message[3 * i];         // red
        pixels[i + 1] = message[3 * i + 1]; // green
        pixels[i + 2] = message[3 * i + 2]; // blue
        pixels[i + 3] = 255;                // alpha
      }
    }
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    const imageData = new ImageData(pixels, WIDTH, HEIGHT);
    ctx.putImageData(imageData, 0, 0);
    ctx.globalCompositeOperation = 'copy';
    ctx.drawImage(canvas, 0,0, imageData.width, imageData.height, 0,0, WIDTH*6, HEIGHT*6);
  });
  return <canvas id="canvas" height={HEIGHT * 6} width={WIDTH*6 }/>;
};

export default Camera;
