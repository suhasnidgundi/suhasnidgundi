import React, { useState } from 'react';
import XPWindow from './XPWindow';
import NotepadIcon from '@/assets/xp/icons/notepad_icon.png';

interface XPNotepadProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onFocus?: () => void;
  zIndex?: number;
  isMaximized?: boolean;
  isActive?: boolean;
  onPositionChange?: (pos: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
  initialText?: string;
}

const DEFAULT_README = `========================================================
  WELCOME TO SUHAS NIDGUNDI'S WINDOWS XP PORTFOLIO!
========================================================

Hi there! I am Suhas Nidgundi.
Full Stack Engineer & AI Specialist.

ABOUT THIS OS:
--------------------------------------------------------
This portfolio is a pixel-faithful recreation of Windows XP 
Professional Service Pack 2 (Luna Blue edition).

WHAT YOU CAN DO:
- Double click "Projects" or "Experience" in My Computer 
  to browse my work inside the same Explorer window!
- Open Internet Explorer to visit live websites and GitHub.
- Launch WordPad to read my About Me biography.
- Open PDF Viewer to inspect or download my resume.
- Talk to the built-in AI Assistant for instant questions.
- Play classic Minesweeper or crunch numbers in Calculator!

CONNECT:
- GitHub: https://github.com/suhasnidgundi
- LinkedIn: https://linkedin.com/in/suhasnidgundi
- Email: suhasnidgundi@gmail.com

Enjoy exploring!
`;

const XPNotepad: React.FC<XPNotepadProps> = ({
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  zIndex = 1,
  isMaximized,
  isActive,
  onPositionChange,
  onSizeChange,
  initialText = DEFAULT_README,
}) => {
  const [content, setContent] = useState(initialText);
  const [wordWrap, setWordWrap] = useState(true);

  // Line & Column calculation
  const lines = content.split('\n');
  const lineCount = lines.length;
  const colCount = lines[lineCount - 1]?.length || 0;

  return (
    <XPWindow
      title="README.txt - Notepad"
      icon={<img src={NotepadIcon} alt="Notepad" className="w-4 h-4" />}
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
      {/* Classic Menu Bar */}
      <div className="flex items-center px-1 py-0.5 bg-[#ece9d8] border-b border-[#aca899] text-[11px] font-['MSSans',Tahoma,sans-serif] select-none text-black">
        <span className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer rounded-sm">File</span>
        <span className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer rounded-sm">Edit</span>
        <span 
          className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer rounded-sm"
          onClick={() => setWordWrap(!wordWrap)}
        >
          Format {wordWrap ? '✓' : ''}
        </span>
        <span className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer rounded-sm">View</span>
        <span className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer rounded-sm">Help</span>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          wrap={wordWrap ? 'soft' : 'off'}
          className={`flex-1 p-2 outline-none resize-none font-mono text-[13px] leading-relaxed text-black bg-white ${
            wordWrap ? 'overflow-y-auto overflow-x-hidden' : 'overflow-auto whitespace-pre'
          }`}
          spellCheck={false}
          autoFocus
        />
      </div>

      {/* Status Bar */}
      <div className="h-[20px] bg-[#ece9d8] border-t border-[#aca899] flex items-center justify-between px-2 text-[11px] font-['MSSans',Tahoma,sans-serif] text-gray-700 select-none">
        <div className="flex-1 truncate">Windows (CRLF)</div>
        <div className="border-l border-[#aca899] px-4">Ln {lineCount}, Col {colCount + 1}</div>
      </div>
    </XPWindow>
  );
};

export default XPNotepad;
