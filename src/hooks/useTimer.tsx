import { useEffect, useState } from "react";

export function useTimer() {
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const startTimer = (seconds: number) => {
    setTimer(seconds);
    setTimerActive(true);
  };
  const stopTimer = () => {
    setTimerPaused(!timerPaused);
  };
  const closeTimer = () => {
    setTimer(0);
    setTimerActive(false);
  };
  useEffect(() => {
    if (timerActive && !timerPaused) {
      const interval = setInterval(() => {
        if (timer !== 0) {
          setTimer((prev) => prev - 1);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerActive, timer, timerPaused]);
  return { timer, timerActive, setTimerActive, timerPaused, setTimerPaused, startTimer, stopTimer, closeTimer };
}
