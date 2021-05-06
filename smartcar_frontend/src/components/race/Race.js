import { React, Component } from "react";
import Joystick from "./Joystick";
import "./Race.css";
import Camera from "../camera/Camera";

class Race extends Component {
  state = {
    level: this.props.location.state.level,
  };
  render() {
    return (
      <div>
        <div className="race-screen">
          <Camera />
        </div>
        <Joystick
          level={this.state.level}
          className="joystick"
          title="joystick"
          width={600}
          height={600}
          options={{
            mode: "static",
            color: "green",
            position: { top: "70%", left: "50%" },
          }}
        />
      </div>
    );
  }
}

export { Race };
