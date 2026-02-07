
import React, { useEffect, useState, useRef } from 'react';
import { FlipDigitProps } from '../types';

/**
 * [가이드] 글자 노출 위치 조정 (Vertical Alignment Guide)
 * 
 * 1. VERTICAL_OFFSET: 글자를 위(+) 또는 아래(-)로 미세하게 밀어내는 값입니다. 
 *    폰트마다 베이스라인이 다르므로, 분할선에 숫자가 딱 맞지 않는 경우 이 값을 조절하세요.
 * 2. PanelContent의 h-[200%]: 타일 높이의 2배로 설정하여, 절반은 숨기고 절반만 보여주는 원리입니다.
 */
const VERTICAL_OFFSET = '0.07em'; // 이 값을 높이면 글자가 내려가고, 낮추면 올라갑니다.

const FlipDigit: React.FC<FlipDigitProps> = ({ value, size = 'xl', theme = 'dark', indicator }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [nextValue, setNextValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const valueRef = useRef(value);

  useEffect(() => {
    if (value !== valueRef.current) {
      setNextValue(value);
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        setCurrentValue(value);
        setIsAnimating(false);
        valueRef.current = value;
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [value]);

  const sizeClasses = {
    xs: 'w-[9vw] h-[14vw] text-[13vw]',
    sm: 'w-[11vw] h-[17vw] text-[16vw]',
    md: 'w-[13vw] h-[21vw] text-[20vw]',
    lg: 'w-[14.5vw] h-[24vw] text-[23vw]', 
    xl: 'w-[21vw] h-[34vw] text-[33vw]',   
  };

  const isDark = theme === 'dark';
  const panelBg = isDark ? 'bg-[#121212]' : 'bg-[#F5F5F7]';
  const textColor = isDark ? 'text-white' : 'text-[#1d1d1f]';
  const borderColor = isDark ? 'border-white/5' : 'border-black/5';
  
  const containerStyle = `relative ${sizeClasses[size]} font-bold select-none transition-colors duration-500`;
  
  const PanelContent = ({ val, position }: { val: string | number, position: 'top' | 'bottom' }) => (
    <div 
      className={`absolute w-full h-[200%] left-0 flex items-center justify-center`}
      style={{ 
        top: position === 'top' ? '0' : 'auto',
        bottom: position === 'bottom' ? '0' : 'auto',
        transform: 'translateZ(0)', 
        backfaceVisibility: 'hidden',
      }}
    >
       <span className={`${textColor} leading-[0]`} style={{ marginTop: VERTICAL_OFFSET }}>
         {val}
       </span>
    </div>
  );

  const panelBaseCommon = `${panelBg} w-full h-full relative overflow-hidden border-x ${borderColor} contain-paint`;
  const panelBaseTop = `${panelBaseCommon} rounded-t-xl border-t border-b-0`;
  const panelBaseBottom = `${panelBaseCommon} rounded-b-xl border-b border-t-0`;

  const duration = 10; 
  const delay = 1; 
  const opacityDuration = 9;
  const topTiming = "cubic-bezier(0.4, 0, 1, 1)"; 
  const bottomTiming = "cubic-bezier(0, 0, 0, 1)"; 

  return (
    <div className={containerStyle} style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
      {/* AM/PM Indicator */}
      {indicator && (
        <div className={`absolute top-[6%] left-[8%] z-[60] text-[14%] font-bold ${textColor} opacity-60 leading-none tracking-tight`}>
          {indicator}
        </div>
      )}

      {/* TOP HALF CONTAINER */}
      <div className={`absolute top-0 w-full h-[49.5%] overflow-hidden ${isAnimating ? 'z-30' : 'z-10'}`} style={{ contain: 'paint' }}>
        <div className={panelBaseTop}>
          <PanelContent val={nextValue} position="top" />
          <div 
            className={`absolute inset-0 bg-black transition-opacity ${isAnimating ? 'opacity-10' : 'opacity-0'}`}
            style={{ transitionDuration: `${opacityDuration}ms` }}
          ></div>
        </div>
        
        <div 
          className={`absolute inset-0 z-20 ${panelBaseTop} origin-bottom`}
          style={{ 
            transition: isAnimating ? `transform ${duration}ms ${topTiming}` : 'none',
            transform: isAnimating ? 'rotateX(-90deg)' : 'rotateX(0deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
        >
          <PanelContent val={currentValue} position="top" />
          <div 
            className={`absolute inset-0 bg-black transition-opacity ${isAnimating ? 'opacity-50' : 'opacity-0'}`}
            style={{ transitionDuration: `${opacityDuration}ms` }}
          ></div>
        </div>
      </div>

      {/* BOTTOM HALF CONTAINER */}
      <div className="absolute bottom-0 w-full h-[49.5%] overflow-hidden z-10" style={{ contain: 'paint' }}>
        <div className={panelBaseBottom}>
          <PanelContent val={currentValue} position="bottom" />
          <div 
            className={`absolute inset-0 bg-black transition-opacity ${isAnimating ? 'opacity-0' : 'opacity-20'}`}
            style={{ transitionDuration: `${opacityDuration}ms` }}
          ></div>
        </div>
        
        <div 
          className={`absolute inset-0 z-40 ${panelBaseBottom} origin-top`}
          style={{ 
            transition: isAnimating ? `transform ${duration}ms ${bottomTiming} ${delay}ms` : 'none',
            transform: isAnimating ? 'rotateX(0deg)' : 'rotateX(90deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
        >
          <PanelContent val={nextValue} position="bottom" />
          <div 
            className={`absolute inset-0 bg-black transition-opacity ${isAnimating ? 'opacity-0' : 'opacity-40'}`}
            style={{ transitionDuration: `${opacityDuration}ms`, transitionDelay: `${delay}ms` }}
          ></div>
        </div>
      </div>

      {/* Center Divider Line */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/40 z-50 pointer-events-none transform -translate-y-1/2"></div>
    </div>
  );
};

export default FlipDigit;
