import React from "react";
import "./LeaderBoard.css";

const LeaderBoard = (props) => {
  let placement = 1;
  return (
    <div>
      <h2 className="leaderboard-heading">Leaderboard</h2>
      <ul>
        {props.users.map((user) => (
          <li className="leaderboard-row">
            <span className="leaderboard-entry">{placement++}</span>
            <span className="leaderboard-entry">{user.username}</span>
            <span className="leaderboard-entry">{user.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderBoard;
