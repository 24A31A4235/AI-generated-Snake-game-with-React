/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans overflow-hidden relative flex flex-col items-center justify-between py-8 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,rgba(0,0,0,0)_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(217,70,239,0.1)_0%,rgba(0,0,0,0)_50%)] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between z-10 mb-8">
        <div className="flex items-center space-x-3">
          <Gamepad2 className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          <h1 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)] uppercase">
            Neon Snake
          </h1>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-fuchsia-400/80 font-mono uppercase tracking-widest">Score</span>
          <span 
            className="text-6xl font-black text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] glitch-text"
            data-text={score.toString().padStart(4, '0')}
          >
            {score.toString().padStart(4, '0')}
          </span>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 w-full flex items-center justify-center z-10 mb-12">
        <SnakeGame onScoreUpdate={setScore} />
      </main>

      {/* Footer / Music Player */}
      <footer className="w-full z-10">
        <MusicPlayer />
      </footer>
    </div>
  );
}
