import React from "react";
import "./LeaderBoard.css";

const LeaderBoard = (props) => {
  let placement = 1;
  return (
    <div>
      <h2 className="leaderboard-heading">Leaderboard</h2>
      <ul className="leaderboard-ul">
        <div className="leaderboard-columns">
          <div className="leaderboard-column-text"></div>
          <div className="leaderboard-column-text">Username</div>
          <div className="leaderboard-column-text">Time</div>
          <div className="leaderboard-column-text">Course</div>
        </div>
        {props.users.map((user) => (
          <li className="leaderboard-li">
            <span className="leaderboard-span">#{placement++}</span>
            <span className="leaderboard-span">{user.username}</span>
            <span className="leaderboard-span">{user.time}</span>
            <span className="leaderboard-span">{user.course}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderBoard;
