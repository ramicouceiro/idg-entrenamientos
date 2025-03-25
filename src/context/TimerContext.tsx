import React, { useEffect, useState } from 'react';
import { TimerContext } from './TimerContextType';

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);

  const startTimer = (seconds: number) => {
    setTimer(seconds);
    setTimerActive(true);
    setTimerPaused(false);
  };

  const stopTimer = () => {
    setTimerPaused(!timerPaused);
  };

  const closeTimer = () => {
    setTimer(0);
    setTimerActive(false);
    setTimerPaused(false);
  };

  useEffect(() => {
    if (timerActive && !timerPaused) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerActive, timerPaused]);

  return (
    <TimerContext.Provider value={{ timer, timerActive, timerPaused, startTimer, stopTimer, closeTimer }}>
      {children}
    </TimerContext.Provider>
  );
}
