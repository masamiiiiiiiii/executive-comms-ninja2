import React, { useRef, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface VideoPlayerProps {
  url: string;
  onProgress: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void;
  onDuration: (duration: number) => void;
  onReady?: () => void;
  playing: boolean;
  seekTo?: number | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  onProgress,
  onDuration,
  onReady,
  playing,
  seekTo
}) => {
  const playerRef = useRef<ReactPlayer>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (seekTo !== null && seekTo !== undefined && playerRef.current) {
      playerRef.current.seekTo(seekTo, 'seconds');
    }
  }, [seekTo]);

  const handleReady = () => {
    setIsReady(true);
    if (onReady) onReady();
  };

  return (
    <Card className="overflow-hidden bg-black aspect-video relative group rounded-xl shadow-2xl">
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 text-white">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading Video Stream...</p>
          </div>
        </div>
      )}

      <div className="w-full h-full relative z-0">
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          playing={playing}
          controls={true}
          onProgress={onProgress}
          onDuration={onDuration}
          onReady={handleReady}
          config={{
            youtube: {
              playerVars: { showinfo: 1, modestbranding: 1 }
            }
          }}
        />
      </div>

      {/* Overlay gradient for premium feel when paused/hovered */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  );
};

export default VideoPlayer;
