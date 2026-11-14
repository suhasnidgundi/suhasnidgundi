import React, { useState } from 'react';
import XPWindow from './XPWindow';

interface XPCalculatorProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onFocus?: () => void;
  zIndex?: number;
  isMaximized?: boolean;
  isActive?: boolean;
  onPositionChange?: (pos: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
}

const XPCalculator: React.FC<XPCalculatorProps> = ({
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  zIndex = 1,
  isMaximized,
  isActive,
  onPositionChange,
  onSizeChange,
}) => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [overwrite, setOverwrite] = useState(true);
  const [memory, setMemory] = useState<number>(0);

  const handleDigit = (digit: string) => {
    if (overwrite || display === '0') {
      setDisplay(digit);
      setOverwrite(false);
    } else {
      if (display.length < 16) {
        setDisplay(display + digit);
      }
    }
  };

  const handleDecimal = () => {
    if (overwrite) {
      setDisplay('0.');
      setOverwrite(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOp = (op: string) => {
    const current = parseFloat(display);
    if (prevValue !== null && operation && !overwrite) {
      const result = compute(prevValue, current, operation);
      setDisplay(String(result));
      setPrevValue(result);
    } else {
      setPrevValue(current);
    }
    setOperation(op);
    setOverwrite(true);
  };

  const compute = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? 0 : a / b;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (prevValue !== null && operation) {
      const current = parseFloat(display);
      const result = compute(prevValue, current, operation);
      setDisplay(String(result));
      setPrevValue(null);
      setOperation(null);
      setOverwrite(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setOverwrite(true);
  };

  const handleClearEntry = () => {
    setDisplay('0');
    setOverwrite(true);
  };

  const handleBackspace = () => {
    if (overwrite) return;
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setOverwrite(true);
    }
  };

  const handleNegate = () => {
    const val = parseFloat(display);
    setDisplay(String(-val));
  };

  const handleSqrt = () => {
    const val = parseFloat(display);
    if (val >= 0) {
      setDisplay(String(Math.sqrt(val)));
      setOverwrite(true);
    }
  };

  const handleReciprocal = () => {
    const val = parseFloat(display);
    if (val !== 0) {
      setDisplay(String(1 / val));
      setOverwrite(true);
    }
  };

  const handlePercent = () => {
    const val = parseFloat(display);
    if (prevValue !== null) {
      setDisplay(String((prevValue * val) / 100));
    } else {
      setDisplay('0');
    }
    setOverwrite(true);
  };

  const calcBtnClass = "h-[28px] bg-[#ece9d8] hover:bg-[#f5f4ed] active:bg-[#dfdbcb] border border-[#7f9db9] shadow-[inset_-1px_-1px_#00000040,inset_1px_1px_#ffffff] text-[12px] font-['MSSans',Tahoma,sans-serif] font-bold text-black rounded-[2px] cursor-pointer flex items-center justify-center select-none active:shadow-[inset_1px_1px_#00000040]";
  const opBtnClass = "h-[28px] bg-[#ece9d8] hover:bg-[#f5f4ed] active:bg-[#dfdbcb] border border-[#7f9db9] shadow-[inset_-1px_-1px_#00000040,inset_1px_1px_#ffffff] text-[12px] font-['MSSans',Tahoma,sans-serif] text-[#000080] font-bold rounded-[2px] cursor-pointer flex items-center justify-center select-none active:shadow-[inset_1px_1px_#00000040]";

  return (
    <XPWindow
      title="Calculator"
      icon={<img src="/icons/calculator_32.png" alt="Calc" className="w-4 h-4" />}
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onFocus={onFocus}
      zIndex={zIndex}
      isMaximized={isMaximized}
      isActive={isActive}
      onPositionChange={onPositionChange}
      onSizeChange={onSizeChange}
    >
      {/* Menu Bar */}
      <div className="flex items-center px-1 py-0.5 bg-[#ece9d8] border-b border-[#aca899] text-[11px] font-['MSSans',Tahoma,sans-serif] select-none text-black">
        <span className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer rounded-sm">Edit</span>
        <span className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer rounded-sm">View</span>
        <span className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer rounded-sm">Help</span>
      </div>

      {/* Calculator Body */}
      <div className="p-3 bg-[#ece9d8] select-none flex flex-col gap-2.5">
        {/* LCD Display */}
        <div className="bg-white border-2 border-[#7f9db9] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.4)] px-2 py-1 text-right font-mono text-[18px] font-bold text-black h-[34px] flex items-center justify-end overflow-hidden">
          {display}
        </div>

        {/* Backspace / CE / C */}
        <div className="grid grid-cols-3 gap-2">
          <button onClick={handleBackspace} className={`${opBtnClass} text-red-700`}>Backspace</button>
          <button onClick={handleClearEntry} className={`${opBtnClass} text-red-700`}>CE</button>
          <button onClick={handleClear} className={`${opBtnClass} text-red-700`}>C</button>
        </div>

        {/* Keypad Grid */}
        <div className="flex gap-2">
          {/* Memory Column */}
          <div className="grid grid-cols-1 gap-1.5 w-[42px]">
            <button onClick={() => setMemory(0)} className={`${opBtnClass} text-red-700`}>MC</button>
            <button onClick={() => { setDisplay(String(memory)); setOverwrite(true); }} className={`${opBtnClass} text-red-700`}>MR</button>
            <button onClick={() => setMemory(parseFloat(display))} className={`${opBtnClass} text-red-700`}>MS</button>
            <button onClick={() => setMemory(memory + parseFloat(display))} className={`${opBtnClass} text-red-700`}>M+</button>
          </div>

          {/* Main Keypad */}
          <div className="flex-1 grid grid-cols-5 gap-1.5">
            <button onClick={() => handleDigit('7')} className={calcBtnClass}>7</button>
            <button onClick={() => handleDigit('8')} className={calcBtnClass}>8</button>
            <button onClick={() => handleDigit('9')} className={calcBtnClass}>9</button>
            <button onClick={() => handleOp('/')} className={opBtnClass}>/</button>
            <button onClick={handleSqrt} className={opBtnClass}>sqrt</button>

            <button onClick={() => handleDigit('4')} className={calcBtnClass}>4</button>
            <button onClick={() => handleDigit('5')} className={calcBtnClass}>5</button>
            <button onClick={() => handleDigit('6')} className={calcBtnClass}>6</button>
            <button onClick={() => handleOp('*')} className={opBtnClass}>*</button>
            <button onClick={handlePercent} className={opBtnClass}>%</button>

            <button onClick={() => handleDigit('1')} className={calcBtnClass}>1</button>
            <button onClick={() => handleDigit('2')} className={calcBtnClass}>2</button>
            <button onClick={() => handleDigit('3')} className={calcBtnClass}>3</button>
            <button onClick={() => handleOp('-')} className={opBtnClass}>-</button>
            <button onClick={handleReciprocal} className={opBtnClass}>1/x</button>

            <button onClick={() => handleDigit('0')} className={calcBtnClass}>0</button>
            <button onClick={handleNegate} className={calcBtnClass}>+/-</button>
            <button onClick={handleDecimal} className={calcBtnClass}>.</button>
            <button onClick={() => handleOp('+')} className={opBtnClass}>+</button>
            <button onClick={handleEquals} className={`${opBtnClass} text-red-700`}>=</button>
          </div>
        </div>
      </div>
    </XPWindow>
  );
};

export default XPCalculator;
