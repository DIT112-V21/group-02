import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Race.css";
import ReactNipple from "react-nipple";
import DebugView from "react-nipple/lib/DebugView";

const mqtt = require("mqtt");
const client = mqtt.connect("ws://localhost:8888");
let yInitial = 0;
let xInitial = 0;
let initialised = false;
let positionY = 0;
let positionX = 0;
const forward = "/smartcar/control/throttle/forward";
const reverse = "/smartcar/control/throttle/reverse";
const left = "/smartcar/control/steering/left";
const right = "/smartcar/control/steering/right";

export default class JoyStick extends Component {
  static propTypes = {
    title: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    options: PropTypes.object,
  };
  state = {
    data: undefined,
    velocity: "0",
    steering: "0",
  };

  delay = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  handleJoystickStart = (evt, data) => {
    this.setState({ data });
    if (!initialised) {
      yInitial = data.position.y.toString();
      xInitial = data.position.x.toString();
      positionX = xInitial;
      positionY = yInitial;
      initialised = true;
    }
  };

  handleJoystickEnd = (evt, data) => {
    this.setState({ data });
    this.delay(1000);
    client.publish(forward, "0");
    client.publish(right, "0");
  };

  handleJoystickMove = (evt, data) => {
    //console.log("move");
    this.setState({ data });
    let yChange = Math.abs(positionY - data.position.y);
    let xChange = Math.abs(positionX - data.position.x);
    if (yChange > 8) {
      positionY = data.position.y;
      let throttle = (yInitial - positionY) * 2;
      if (throttle > 87) {
        throttle = 100;
      }
      if (throttle > 0) {
        client.publish(forward, throttle.toString());
      } else client.publish(reverse, throttle.toString());
    }
    if (xChange > 8) {
      positionX = data.position.x;
      let steering = (xInitial - positionX) * -1;
      client.publish(right, steering.toString());
    }
  };
  handleJoystickDir = (evt, data) => {
    this.setState({ data });
  };
  handleJoystickPlain = (evt, data) => {
    this.setState({ data });
  };
  handleJoystickShown = (evt, data) => {
    this.setState({ data });
  };
  handleJoystickHidden = (evt, data) => {
    this.setState({ data });
  };
  handleJoystickPressure = (evt, data) => {
    this.setState({ data });
  };

  render() {
    return (
      <div className="NippleExample">
        <ReactNipple
          className="joystick"
          options={this.props.options}
          style={{
            width: this.props.width,
            height: this.props.height,
          }}
          onStart={this.handleJoystickStart}
          onEnd={this.handleJoystickEnd}
          onMove={this.handleJoystickMove}
          onDir={this.handleJoystickDir}
          onPlain={this.handleJoystickPlain}
          onShown={this.handleJoystickShown}
          onHidden={this.handleJoystickHidden}
          onPressure={this.handleJoystickPressure}
        />
      </div>
    );
  }
}
