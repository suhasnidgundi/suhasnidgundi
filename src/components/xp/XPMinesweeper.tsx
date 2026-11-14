import React, { useState, useEffect, useCallback } from 'react';
import XPWindow from './XPWindow';

interface XPMinesweeperProps {
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

const ROWS = 9;
const COLS = 9;
const MINES = 10;

type CellState = {
  isMine: boolean;
  revealed: boolean;
  flagged: boolean;
  count: number;
};

const NUMBER_COLORS = [
  '',
  '#0000ff', // 1: Blue
  '#008000', // 2: Green
  '#ff0000', // 3: Red
  '#000080', // 4: Dark Blue
  '#800000', // 5: Maroon
  '#008080', // 6: Teal
  '#000000', // 7: Black
  '#808080', // 8: Gray
];

const XPMinesweeper: React.FC<XPMinesweeperProps> = ({
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
  const [grid, setGrid] = useState<CellState[][]>([]);
  const [status, setStatus] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [faceState, setFaceState] = useState<'smile' | 'scared' | 'won' | 'dead'>('smile');
  const [timer, setTimer] = useState(0);
  const [minesLeft, setMinesLeft] = useState(MINES);

  // Initialize board
  const initBoard = useCallback(() => {
    const newGrid: CellState[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: CellState[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push({ isMine: false, revealed: false, flagged: false, count: 0 });
      }
      newGrid.push(row);
    }

    // Place mines randomly
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        placed++;
      }
    }

    // Compute neighboring mine counts
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (newGrid[r][c].isMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newGrid[nr][nc].isMine) {
              count++;
            }
          }
        }
        newGrid[r][c].count = count;
      }
    }

    setGrid(newGrid);
    setStatus('idle');
    setFaceState('smile');
    setTimer(0);
    setMinesLeft(MINES);
  }, []);

  useEffect(() => {
    initBoard();
  }, [initBoard]);

  // Timer interval
  useEffect(() => {
    if (status !== 'playing') return;
    const interval = setInterval(() => {
      setTimer((t) => Math.min(999, t + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  // Reveal flood fill for empty cells
  const revealCell = (r: number, c: number) => {
    if (status === 'lost' || status === 'won') return;
    if (grid[r][c].revealed || grid[r][c].flagged) return;

    if (status === 'idle') {
      setStatus('playing');
    }

    const nextGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    if (nextGrid[r][c].isMine) {
      // Hit mine -> Game Over
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (nextGrid[row][col].isMine) {
            nextGrid[row][col].revealed = true;
          }
        }
      }
      setGrid(nextGrid);
      setStatus('lost');
      setFaceState('dead');
      return;
    }

    // Flood fill
    const queue: [number, number][] = [[r, c]];
    nextGrid[r][c].revealed = true;

    while (queue.length > 0) {
      const [currR, currC] = queue.shift()!;
      if (nextGrid[currR][currC].count === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = currR + dr;
            const nc = currC + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
              const neighbor = nextGrid[nr][nc];
              if (!neighbor.revealed && !neighbor.flagged && !neighbor.isMine) {
                neighbor.revealed = true;
                if (neighbor.count === 0) {
                  queue.push([nr, nc]);
                }
              }
            }
          }
        }
      }
    }

    // Check win condition
    let unrevealedSafeCells = 0;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (!nextGrid[row][col].isMine && !nextGrid[row][col].revealed) {
          unrevealedSafeCells++;
        }
      }
    }

    setGrid(nextGrid);

    if (unrevealedSafeCells === 0) {
      setStatus('won');
      setFaceState('won');
    }
  };

  // Right click flag
  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (status === 'lost' || status === 'won') return;
    if (grid[r][c].revealed) return;

    const nextGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
    const wasFlagged = nextGrid[r][c].flagged;
    nextGrid[r][c].flagged = !wasFlagged;
    setGrid(nextGrid);
    setMinesLeft((prev) => (wasFlagged ? prev + 1 : prev - 1));
  };

  const pad3 = (num: number) => {
    const clamped = Math.max(-99, Math.min(999, num));
    if (clamped < 0) {
      return `-${String(Math.abs(clamped)).padStart(2, '0')}`;
    }
    return String(clamped).padStart(3, '0');
  };

  return (
    <XPWindow
      title="Minesweeper"
      icon={<img src="/icons/minesweeper_32.png" alt="Minesweeper" className="w-4 h-4" />}
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
        <span 
          className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer rounded-sm"
          onClick={initBoard}
        >
          Game
        </span>
        <span className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer rounded-sm">Help</span>
      </div>

      {/* Main Container */}
      <div className="p-3 bg-[#c0c0c0] flex flex-col items-center select-none border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080]">
        {/* Header Bar */}
        <div className="w-[200px] mb-2 p-1.5 flex items-center justify-between bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white">
          {/* Mine counter */}
          <div className="bg-black text-[#ff0000] font-mono text-[20px] font-bold px-1 tracking-widest leading-none border border-[#808080]">
            {pad3(minesLeft)}
          </div>

          {/* Smiley Reset Button */}
          <button
            onClick={initBoard}
            className="w-[26px] h-[26px] bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white flex items-center justify-center text-[16px] cursor-pointer"
          >
            {faceState === 'won' ? '😎' : faceState === 'dead' ? '😵' : faceState === 'scared' ? '😮' : '🙂'}
          </button>

          {/* Timer */}
          <div className="bg-black text-[#ff0000] font-mono text-[20px] font-bold px-1 tracking-widest leading-none border border-[#808080]">
            {pad3(timer)}
          </div>
        </div>

        {/* Board Grid */}
        <div className="border-3 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-[#c0c0c0] p-0.5">
          {grid.map((row, r) => (
            <div key={r} className="flex">
              {row.map((cell, c) => (
                <div
                  key={c}
                  onClick={() => revealCell(r, c)}
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                  onMouseDown={() => {
                    if (status !== 'lost' && status !== 'won' && !cell.revealed) {
                      setFaceState('scared');
                    }
                  }}
                  onMouseUp={() => {
                    if (status !== 'lost' && status !== 'won') {
                      setFaceState('smile');
                    }
                  }}
                  className={`w-[20px] h-[20px] flex items-center justify-center text-[12px] font-bold font-mono cursor-pointer select-none ${
                    cell.revealed
                      ? 'bg-[#c0c0c0] border border-[#7f7f7f]'
                      : 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-[#7f7f7f]'
                  }`}
                >
                  {cell.revealed ? (
                    cell.isMine ? (
                      '💣'
                    ) : cell.count > 0 ? (
                      <span style={{ color: NUMBER_COLORS[cell.count] }}>{cell.count}</span>
                    ) : (
                      ''
                    )
                  ) : cell.flagged ? (
                    '🚩'
                  ) : (
                    ''
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </XPWindow>
  );
};

export default XPMinesweeper;
