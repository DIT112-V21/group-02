import { React, Component } from "react";
import Joystick from "./Joystick";
import "./Race.css";
import Camera from "../camera/Camera";
import Mapping from "../mapping/Mapping";
class Race extends Component {
  render() {
    return (
      <div className = "race-screen" >
        <Camera />
        <Mapping 
          className="mapping"
          title="mapping"
          width={600}
          height={600}
          options={{
            position: { top: "20%", left: "70%" },
          }}
        />
        <Joystick
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
