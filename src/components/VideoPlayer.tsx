"use client";

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ChevronLeft,
  Settings,
  SkipForward,
  SkipBack,
  Subtitles
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SubtitleTrack {
  label: string;
  src: string;
  lang: string;
  default?: boolean;
}

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  subtitles?: SubtitleTrack[];
  onProgress?: (progress: { playedSeconds: number; played: number }) => void;
  initialTime?: number;
}

export default function VideoPlayer({ src, poster, title, subtitles, onProgress, initialTime = 0 }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported() && src.includes('.m3u8')) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (initialTime > 0) {
          video.currentTime = initialTime;
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        if (initialTime > 0) {
          video.currentTime = initialTime;
        }
      });
    } else {
      video.src = src;
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (onProgress) {
        onProgress({
          playedSeconds: video.currentTime,
          played: video.currentTime / (video.duration || 1)
        });
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, initialTime, onProgress]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleFullScreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShowControls(false);
    }, 3000);
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black group cursor-none flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{ cursor: showControls ? 'default' : 'none' }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        onClick={togglePlay}
        playsInline
      >
        {subtitles?.map((track) => (
          <track
            key={track.src}
            kind="subtitles"
            label={track.label}
            src={track.src}
            srcLang={track.lang}
            default={track.default}
          />
        ))}
      </video>

      <div className={cn(
        "absolute top-0 left-0 w-full p-8 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300 z-50",
        showControls ? "opacity-100" : "opacity-0"
      )}>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-4 text-white hover:text-gray-300 transition-colors"
        >
          <ChevronLeft className="h-8 w-8" />
          <h1 className="text-2xl font-bold">{title}</h1>
        </button>
      </div>

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
          !isPlaying && "bg-black/20"
        )}
        onClick={togglePlay}
      >
        {!isPlaying && (
          <div className="h-24 w-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 animate-in zoom-in duration-300">
            <Play className="h-12 w-12 text-white fill-current ml-2" />
          </div>
        )}
      </div>

      <div className={cn(
        "absolute bottom-0 left-0 w-full p-4 md:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 flex flex-col gap-4 z-50",
        showControls ? "opacity-100" : "opacity-0"
      )}>
        <div className="relative w-full group/progress">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#7c3aed] group-hover/progress:h-2 transition-all"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform">
              {isPlaying ? <Pause className="h-8 w-8 fill-current" /> : <Play className="h-8 w-8 fill-current" />}
            </button>
            <div className="flex items-center gap-4">
              <button onClick={() => skip(-10)} className="text-white hover:text-gray-300">
                <SkipBack className="h-6 w-6" />
              </button>
              <button onClick={() => skip(10)} className="text-white hover:text-gray-300">
                <SkipForward className="h-6 w-6" />
              </button>
            </div>
            <div className="flex items-center gap-2 group/volume">
              <button onClick={toggleMute} className="text-white">
                {isMuted || volume === 0 ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-24 transition-all overflow-hidden appearance-none h-1 bg-white/20 accent-white rounded-full"
              />
            </div>
            <div className="text-white text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-white hover:text-gray-300">
              <Subtitles className="h-6 w-6" />
            </button>
            <button className="text-white hover:text-gray-300">
              <Settings className="h-6 w-6" />
            </button>
            <button onClick={toggleFullScreen} className="text-white hover:scale-110 transition-transform">
              <Maximize className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
