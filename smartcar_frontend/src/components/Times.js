import React from "react";
import SpringDemo from "./animatedCar/SpringDemo";

//const TimeList = "";

const Times = (props) => {
  // useEffect(() => {
  //   fetch(TimeList)
  //     .then((response) => response.json())
  //     .then((users) => setUsers(users))
  //     .catch((err) => console.error(err));
  // }, []);

  return (
    <div>
      <h2 className="times-heading">Times</h2>
      <ul>
        <li>
          <text className="course">Course </text>
          <text className="times">00:00 </text>
        </li>
        <li>
          <text className="course">Course </text>
          <text className="times">00:00 </text>
        </li>
        <li>
          <text className="course">Course </text>
          <text className="times">00:00 </text>
        </li>
        <li>
          <text className="course">Course </text>
          <text className="times">00:00 </text>
        </li>
        <li>
          <text className="course">Course </text>
          <text className="times">00:00 </text>
        </li>
        <li>
          <text className="course">Course </text>
          <text className="times">00:00 </text>
        </li>
      </ul>
      <SpringDemo />
    </div>
  );
};

export default Times;
