import { useState, useEffect } from "react";
const Timer = ({ text }) => {
  const [seconds, setSeconds] = useState(60);
  useEffect(() => {
    if (seconds > 0) {
      const id = setTimeout(() => {
        setSeconds((prevState) => prevState - 1);
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [seconds]);
  return <div>{text + " " + seconds}</div>;
};

export default Timer;
