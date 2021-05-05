import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../resources/logo.png";
import "./Home.css";
import SpringDemo from "../../components/animatedCar/SpringDemo";

const mqtt = require("mqtt");
const client = mqtt.connect("ws://localhost:8888");
const difficulty = "/smartcar/control/difficulty";

class HomeComponent extends React.Component {
  state = { difficulty: false, difficultyLevel: "Easy" };

  handleDifficulty = (event) => {
    let value = event.target.value;
    this.setState({ difficultyLevel: value });
    this.setState({ difficulty: false });
  };

  onClick = () => {
    if (!this.state.difficulty) {
      this.setState({ difficulty: true });
    } else this.setState({ difficulty: false });
  };

  render() {
    client.publish(difficulty, this.state.difficultyLevel);
    return (
      <div>
        <header className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <h1 className="Home-logo-text">SmartCar Shield</h1>
        </header>
        <NavLink className="active" to="/race">
          <div className="Home-link">
            <li className="Home-linkItem">Race</li>
          </div>
        </NavLink>
        <NavLink className="active" to="/LeaderBoard">
          <div className="Home-link">
            <li className="Home-linkItem">Leaderboard</li>
          </div>
        </NavLink>
        <NavLink className="active" to="/race_times">
          <div className="Home-link">
            <li className="Home-linkItem">Race times</li>
          </div>
        </NavLink>
        <select
          className="DifficultyList"
          name="Difficulty"
          id="difficulties"
          onChange={this.handleDifficulty}
        >
          <option className="difficult_options" value="Easy">
            Difficulty: Easy
          </option>
          <option className="difficult_options" value="Amateur">
            Difficulty: Amateur
          </option>
          <option className="difficult_options" value="Bossmode">
            Difficulty: Bossmode
          </option>
        </select>
        <SpringDemo />
      </div>
    );
  }
}

export default HomeComponent;
