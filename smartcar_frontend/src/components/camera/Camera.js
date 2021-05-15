import React from "react";

const mqtt = require("mqtt");
const client = mqtt.connect("ws://localhost:8888");
const topic = "/smartcar/camera";
client.subscribe(topic);

const Camera = () => {
  const WIDTH = 640;
  const HEIGHT = 480;
  client.on("message", (topic, message) => {
    const ctx = document.getElementById("canvas").getContext("2d");
    const image = new Uint8ClampedArray(WIDTH * HEIGHT * 4);
    let offset = 0;
    for(let i = 0; i < image.length; i+=4){
      image[i] = message[i-offset];
      image[i + 1] = message[i-offset + 1];
      image[i + 2] = message[i-offset + 2];
      image[i + 3] = 255;
      offset++;
    }
    const imageData = new ImageData(image, WIDTH, HEIGHT);
    ctx.putImageData(imageData, 0, 0);
  });
  return <canvas id="canvas" height={HEIGHT} width={WIDTH}/>;
};

export default Camera;
