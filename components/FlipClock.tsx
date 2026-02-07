
import React, { useState, useEffect } from 'react';
import FlipDigit from './FlipDigit';
import { AppSettings } from '../types';

interface FlipClockProps {
  settings: AppSettings;
}

const FlipClock: React.FC<FlipClockProps> = ({ settings }) => {
  const [time, setTime] = useState(new Date());
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [timeUpToggle, setTimeUpToggle] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let interval: any;
    if (settings.mode === 'clock') {
      setIsTimeUp(false);
      interval = setInterval(() => setTime(new Date()), 1000);
    } else if (settings.mode === 'timer' && isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
           if (prev <= 1) {
             setIsTimerRunning(false);
             setIsTimeUp(true);
             return 0;
           }
           return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [settings.mode, isTimerRunning]);

  useEffect(() => {
    let interval: any;
    if (isTimeUp) {
      interval = setInterval(() => {
        setTimeUpToggle(prev => !prev);
      }, 2000);
    } else {
      setTimeUpToggle(true);
    }
    return () => clearInterval(interval);
  }, [isTimeUp]);

  const format = (num: number) => num.toString().padStart(2, '0');

  let h: string, m: string, s: string;
  let amPm: string | undefined = undefined;

  if (settings.mode === 'clock') {
    let hours = time.getHours();
    if (!settings.is24Hour) {
      amPm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
    }
    h = format(hours);
    m = format(time.getMinutes());
    s = format(time.getSeconds());
  } else {
    h = format(Math.floor(timerSeconds / 3600));
    m = format(Math.floor((timerSeconds % 3600) / 60));
    s = format(timerSeconds % 60);
  }

  let displayChars = [h[0], h[1], m[0], m[1], s[0], s[1]];
  if (isTimeUp) {
    if (settings.showSeconds) {
      if (timeUpToggle) { displayChars = [' ', 'T', 'I', 'M', 'E', ' ']; } 
      else { displayChars = [' ', ' ', 'U', 'P', ' ', ' ']; }
    } else {
      if (timeUpToggle) { displayChars = ['T', 'I', 'M', 'E', ' ', ' ']; } 
      else { displayChars = [' ', 'U', 'P', ' ', ' ', ' ']; }
    }
  }

  const isDark = settings.theme === 'dark';
  const dotColor = isDark ? 'text-zinc-900' : 'text-zinc-200';
  
  // Decide if we should use portrait layout based on settings and screen dimensions
  const isPortraitLayout = settings.orientation === 'portrait' || (settings.orientation === 'auto' && windowSize.height > windowSize.width);

  // In portrait mode, digits should be larger to fill the vertical space
  const digitSize = isPortraitLayout ? 'xl' : (settings.showSeconds ? 'lg' : 'xl');

  return (
    <div className={`flex items-center justify-center w-full h-full relative ${isPortraitLayout ? 'flex-col gap-[2vh] px-[10vw]' : 'flex-row px-[4vw]'}`}>
      
      {/* Container for HH or Pair 1 */}
      <div className="flex gap-[1vw] items-center">
        <div className="flex gap-[0.4vw]">
          <FlipDigit value={displayChars[0]} theme={settings.theme} size={digitSize} indicator={amPm} />
          <FlipDigit value={displayChars[1]} theme={settings.theme} size={digitSize} />
        </div>
        
        {!isPortraitLayout && (
          <div className={`flex flex-col gap-[4vh] ${dotColor} transition-opacity duration-500 ${isTimeUp ? 'opacity-0' : 'opacity-100'}`}>
              <div className="w-[1.2vw] h-[1.2vw] rounded-full bg-current"></div>
              <div className="w-[1.2vw] h-[1.2vw] rounded-full bg-current"></div>
          </div>
        )}
      </div>

      {/* Container for MM or Pair 2 */}
      <div className="flex gap-[1vw] items-center">
        <div className="flex gap-[0.4vw]">
          <FlipDigit value={displayChars[2]} theme={settings.theme} size={digitSize} />
          <FlipDigit value={displayChars[3]} theme={settings.theme} size={digitSize} />
        </div>

        {!isPortraitLayout && settings.showSeconds && (
          <div className={`flex flex-col gap-[4vh] ${dotColor} transition-opacity duration-500 ${isTimeUp ? 'opacity-0' : 'opacity-100'}`}>
              <div className="w-[1.2vw] h-[1.2vw] rounded-full bg-current"></div>
              <div className="w-[1.2vw] h-[1.2vw] rounded-full bg-current"></div>
          </div>
        )}
      </div>

      {/* Container for SS or Pair 3 (if applicable) */}
      {settings.showSeconds && (
        <div className="flex gap-[1vw] items-center">
          <div className="flex gap-[0.4vw]">
            <FlipDigit value={displayChars[4]} theme={settings.theme} size={digitSize} />
            <FlipDigit value={displayChars[5]} theme={settings.theme} size={digitSize} />
          </div>
        </div>
      )}

      {/* Timer Controls */}
      {settings.mode === 'timer' && (
        <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-full flex justify-center px-4">
          <div className="flex items-center gap-4 max-w-full overflow-x-auto no-scrollbar animate-in fade-in slide-in-from-bottom-8 duration-700">
            {(!isTimerRunning && !isTimeUp) ? (
               <div className="flex flex-nowrap items-center gap-2 py-2">
                  {[
                    { label: '+10S', val: 10 },
                    { label: '+1M', val: 60 },
                    { label: '+5M', val: 300 },
                    { label: '+10M', val: 600 },
                    { label: '+1H', val: 3600 },
                  ].map(inc => (
                    <button 
                      key={inc.label}
                      onClick={() => setTimerSeconds(prev => prev + inc.val)}
                      className={`px-4 py-2 rounded-xl border ${isDark ? 'border-white/10 text-white/40 hover:text-white hover:bg-white/10' : 'border-black/10 text-black/40 hover:text-black hover:bg-black/5'} transition-all text-xs font-black whitespace-nowrap`}
                    >
                      {inc.label}
                    </button>
                  ))}
                  <div className="w-[1px] h-8 bg-zinc-500/20 mx-2"></div>
                  <button 
                    onClick={() => setIsTimerRunning(true)}
                    disabled={timerSeconds === 0}
                    className={`px-8 py-2 rounded-xl font-black transition-all ${timerSeconds > 0 ? 'bg-white text-black hover:scale-105 active:scale-95 shadow-lg' : 'bg-white/5 text-white/20 cursor-not-allowed'} text-sm uppercase`}
                  >
                    START
                  </button>
               </div>
            ) : isTimerRunning ? (
              <div className="py-2">
                <button 
                  onClick={() => setIsTimerRunning(false)}
                  className="px-10 py-2.5 rounded-xl bg-white text-black font-black hover:bg-zinc-200 transition-all shadow-lg hover:scale-105 active:scale-95 text-sm uppercase"
                >
                  PAUSE
                </button>
              </div>
            ) : (
              <div className="py-2">
                <button 
                  onClick={() => {
                    setIsTimeUp(false);
                    setTimerSeconds(0);
                  }}
                  className="px-12 py-3 rounded-2xl bg-white text-black font-black hover:bg-zinc-100 transition-all shadow-2xl hover:scale-110 active:scale-90 text-base uppercase"
                >
                  DISMISS
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlipClock;
