import { createContext } from 'react';

export interface TimerContextType {
  timer: number;
  timerActive: boolean;
  timerPaused: boolean;
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
  closeTimer: () => void;
}

export const TimerContext = createContext<TimerContextType | undefined>(undefined);
