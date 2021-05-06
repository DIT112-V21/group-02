import { React, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";
import Car from "../../resources/car.svg";
import Cloud from "../../resources/cloud.svg";

const SpringDemo = () => {
  const [flip, setFlip] = useState(0);
  const n = useRef(0);
  const styles = useSpring({
    from: {
      marginLeft: "-50vw",
      height: 100,
      width: 100,
      rotate: 0,
      marginTop: "3vw",
    },
    to: {
      marginLeft: "90vw",
      height: 100,
      width: 100,
      rotate: -20,
      marginTop: "3vw",
    },
    config: {
      duration: 9500,
    },
    loop: {
      reset: true,
    },
    onRest: () => {
      setFlip(180);
    },
  });

  const stylesCloud = useSpring({
    from: {
      rotate: 0,
      marginLeft: "-50vw",
      height: 50,
      width: 50,
      marginTop: "3vw",
    },
    to: {
      marginLeft: "90vw",
      height: 50,
      width: 50,
      marginTop: "3vw",
    },
    config: {
      duration: 9500,
    },
    loop: {
      reset: true,
    },
    onRest: () => {
      setFlip(180);
    },
  });

  return (
    <div className="carWrapper">
      <animated.img
        src={Cloud}
        width={20}
        height={20}
        style={{
          height: "20px",
          position: "fixed",
          display: "flex",
          paddingTop: "40px",
          opacity: "0.5",
          ...stylesCloud,
        }}
      />
      <animated.img
        src={Car}
        height={50}
        width={50}
        style={{
          rotate: 0,
          display: "flex",
          position: "fixed",
          paddingLeft: "27px",

          ...styles,
        }}
      />
    </div>
  );
};

export default SpringDemo;
