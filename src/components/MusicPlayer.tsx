import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Drift',
    artist: 'AI Synthwave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'Cybernetic Pulse',
    artist: 'Neural Network',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'Digital Horizon',
    artist: 'Algorithm Audio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.2)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-pulse">
            <Music className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="text-cyan-300 font-bold text-lg tracking-wide drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
              {currentTrack.title}
            </h3>
            <p className="text-fuchsia-400/80 text-sm font-mono">{currentTrack.artist}</p>
          </div>
        </div>
        <Volume2 className="w-5 h-5 text-gray-400" />
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-800 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(217,70,239,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-8">
        <button
          onClick={prevTrack}
          className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] hover:text-cyan-300 hover:drop-shadow-[0_0_15px_rgba(34,211,238,1)] transition-all"
        >
          <SkipBack className="w-8 h-8" />
        </button>
        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-transparent border-2 border-fuchsia-500 flex items-center justify-center text-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.6),inset_0_0_15px_rgba(217,70,239,0.4)] hover:bg-fuchsia-500/20 hover:shadow-[0_0_25px_rgba(217,70,239,1),inset_0_0_20px_rgba(217,70,239,0.6)] transition-all"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 fill-current drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
          ) : (
            <Play className="w-8 h-8 fill-current ml-1 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
          )}
        </button>
        <button
          onClick={nextTrack}
          className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] hover:text-cyan-300 hover:drop-shadow-[0_0_15px_rgba(34,211,238,1)] transition-all"
        >
          <SkipForward className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
