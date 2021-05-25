import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../resources/logo.png";
import SpringDemo from "../../components/animatedCar/SpringDemo";
import "./Login.css";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: "" };
  }

  onSubmit = (event) => {
    console.log("event : " + this.state.username);
    this.props.onUserInput(this.state.username);
    this.props.onStateChange();
  };

  myChangeHandler = (event) => {
    this.setState({ username: event.target.value });
  };

  render() {
    return (
      <div>
        <header className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <h1 className="Home-logo-text">SmartCar Shield</h1>
        </header>
        <form onSubmit={this.onSubmit}>
          <input
            id=""
            placeholder="username"
            onChange={this.myChangeHandler}
          ></input>
          <div>
          <button type="submit">Submit</button>
          </div>
        </form>
        <SpringDemo />
      </div>
    );
  }
}

export default Login;
