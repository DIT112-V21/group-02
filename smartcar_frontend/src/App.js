import React, { useState, useEffect } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import "./style/App.css";
import { Race } from "./components/race/Race";
import LeaderBoard from "./components/leaderboard/LeaderBoard";
import Home from "./pages/home/Home";
import Times from "./components/times/Times";
import Login from "./pages/login/Login";

const BACKEND_ROOT = "http://localhost:3002/";

function App() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = React.useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [user, setUser] = useState([]);
  const [login, setLogin] = useState(false);

  useEffect(() => {
    console.log("fetching users");
    fetch(BACKEND_ROOT)
      .then((response) => response.json(users))
      .then((users) => setUsers(users))
      .catch((err) => console.error(err));
    console.log("backend fetch complete");
  }, []);

  useEffect(() => {
    localStorage.setItem("username", username);
    setUser(users.filter((user) => user.username == username));
  }, [username]);

  const handleUser = (userInput) => {
    setUsername(userInput);
    localStorage.setItem("username", JSON.stringify({ username: userInput }));
  };

  console.log("username is now: " + username, "  user is : " + user.username);
  return (
    <div className="App">
      <Router>
        <Route
          exact
          path="/"
          component={
            login
              ? () => <Home username={username} />
              : () => (
                  <Login
                    onUserInput={handleUser}
                    onStateChange={() => setLogin(true)}
                  />
                )
          }
        />
        <Route exact path="/race" component={Race} />
        <Route exact path="/practice" component={Race} />
        <Route exact path="/monster-run" component={Race} />
        <Route
          exact
          path="/leaderboard"
          component={() => <LeaderBoard users={users} />}
        />
        <Route
          exact
          path="/race_times"
          component={() => <Times users={user} username={username} />}
        />
      </Router>
    </div>
  );
}

export default App;
