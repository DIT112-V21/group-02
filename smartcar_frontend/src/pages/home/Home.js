import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../resources/logo.png";
import "./Home.css";
import SpringDemo from "../../components/animatedCar/SpringDemo";

class HomeComponent extends React.Component {
  state = {
    difficulty: false,
    difficultyLevel: "Easy",
  };

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
    return (
      <div>
        <header className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <h1 className="Home-logo-text">SmartCar Shield</h1>
        </header>
        <h4 className="home-name-text">Welcome, {this.props.username}</h4>
        <NavLink
          className="active"
          to={{
            pathname: "/race",
            userProps: { username: this.props.username },
          }}
        >
          <div className="Home-link">
            <li className="Home-linkItem">Race</li>
          </div>
        </NavLink>
        <NavLink
          className="active"
          to={{
            pathname: "/practice",
            userProps: { username: this.props.username },
          }}
        >
          <div className="Home-link">
            <li className="Home-linkItem">Practice</li>
          </div>
        </NavLink>
        <NavLink
          className="active"
          to={{
            pathname: "/monster-run",
            userProps: { username: this.props.username },
          }}
        >
          <div className="Home-link">
            <li className="Home-linkItem">Monster Run</li>
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
          placeholder="Difficulty"
        >
          <option className="difficult_options" value="Easy">
            Difficulty: Easy
          </option>
          <option className="difficult_options" value="Medium">
            Difficulty: Medium
          </option>
          <option className="difficult_options" value="Hard">
            Difficulty: Hard
          </option>
          <option className="difficult_options" value="BossMode">
            Difficulty: BossMode
          </option>
          <option className="difficult_options" value="Extreme">
            Difficulty: Extreme
          </option>
        </select>
        <SpringDemo />
      </div>
    );
  }
}

export default HomeComponent;
