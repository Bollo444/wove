import React, { useRef, useState, useEffect } from 'react';
// import { PlayIcon, PauseIcon, VolumeUpIcon, VolumeOffIcon } from '@heroicons/react/solid'; // Example icons

interface AudioDisplayProps {
  src: string;
  title?: string; // For accessibility and display
  artist?: string; // Or 'narrator'
  albumArtUrl?: string; // For a more rich player UI
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  showCustomControls?: boolean; // To toggle between browser default and custom
}

const AudioDisplay: React.FC<AudioDisplayProps> = ({
  src,
  title,
  artist,
  albumArtUrl,
  className,
  autoPlay = false,
  loop = false,
  showCustomControls = false, // Default to browser controls for simplicity
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      };
      const setAudioTime = () => setCurrentTime(audio.currentTime);

      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('pause', () => setIsPlaying(false));
      audio.addEventListener('ended', () => setIsPlaying(false)); // Or handle loop

      if (autoPlay) audio.play().catch(e => console.warn('Autoplay prevented:', e));

      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('play', () => setIsPlaying(true));
        audio.removeEventListener('pause', () => setIsPlaying(false));
        audio.removeEventListener('ended', () => setIsPlaying(false));
      };
    }
  }, [src, autoPlay]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error('Error playing audio:', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleTimeSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  if (!src) return null;

  if (!showCustomControls) {
    return (
      <div className={`my-4 ${className || ''}`} data-oid=".gcu9.n">
        {title && (
          <p className="text-sm font-medium text-gray-700 mb-1" data-oid="e-:w.xi">
            {title}
          </p>
        )}
        <audio
          controls
          src={src}
          ref={audioRef}
          loop={loop}
          className="w-full rounded-md shadow"
          data-oid="ggvp.ym"
        >
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  // Placeholder for Custom Controls UI
  return (
    <div
      className={`my-4 p-3 bg-gray-50 rounded-lg shadow-md ${className || ''}`}
      data-oid="1taqdzi"
    >
      <div className="flex items-center space-x-3" data-oid="u50weed">
        {albumArtUrl && (
          <img
            src={albumArtUrl}
            alt={title || 'Album art'}
            className="w-12 h-12 rounded object-cover"
            data-oid="7t8170s"
          />
        )}
        <div data-oid="krjxtwq">
          <p className="text-sm font-semibold text-gray-800" data-oid="5m:u4j:">
            {title || 'Audio Track'}
          </p>
          {artist && (
            <p className="text-xs text-gray-500" data-oid="r:3x3oi">
              {artist}
            </p>
          )}
        </div>
      </div>
      <audio
        ref={audioRef}
        src={src}
        loop={loop}
        preload="metadata"
        className="hidden"
        data-oid="6a1oy:9"
      />

      <div className="mt-2" data-oid="jzks6k:">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleTimeSeek}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          aria-label="Seek audio"
          data-oid="4ff_dh3"
        />

        <div className="flex justify-between text-xs text-gray-500 mt-1" data-oid="6v1b4y6">
          <span data-oid="ih-ix93">{formatTime(currentTime)}</span>
          <span data-oid="6trdi:_">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-3 mt-2" data-oid="6ii114j">
        <button
          onClick={togglePlayPause}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          data-oid="ahkm9q2"
        >
          {/* Placeholder for Play/Pause Icon */}
          {isPlaying ? '❚❚' : '►'}
        </button>
        <button
          onClick={toggleMute}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          data-oid="c-qy:_-"
        >
          {/* Placeholder for Volume Icon */}
          {isMuted ? '🔇' : '🔊'}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          aria-label="Volume"
          data-oid=".1bg3w7"
        />
      </div>
    </div>
  );
};

export default AudioDisplay;
