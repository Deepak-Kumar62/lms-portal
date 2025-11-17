import { useRef, useState, useEffect, useCallback } from "react";
import {
    Maximize,
    Minimize,
    Pause,
    Play,
    RotateCcw,
    RotateCw,
    Volume2,
    VolumeX,
} from "lucide-react";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";

const VideoPlayer = ({
    width = "100%",
    height = "100%",
    url,
    onProgressUpdate,
    progressData,
}) => {
    const videoRef = useRef(null);
    const playerContainerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);

    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [muted, setMuted] = useState(false);
    const [played, setPlayed] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showControls, setShowControls] = useState(true);

    // --- Handle metadata load (for duration) ---
    const handleLoadedMetadata = () => {
        setDuration(videoRef.current?.duration || 0);
    };

    // --- Update progress ---
    const handleTimeUpdate = () => {
        if (videoRef.current && duration) {
            setPlayed(videoRef.current.currentTime / duration);
        }
    };

    // --- Play/Pause ---
    const handlePlayPause = () => {
        if (playing) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setPlaying(!playing);
    };

    // --- Rewind / Forward ---
    const handleRewind = () => {
        if (videoRef.current) videoRef.current.currentTime -= 5;
    };

    const handleForward = () => {
        if (videoRef.current) videoRef.current.currentTime += 5;
    };

    // --- Seek ---
    const handleSeekChange = (value) => {
        const seekTo = (value[0] / 100) * duration;
        videoRef.current.currentTime = seekTo;
        setPlayed(value[0] / 100);
    };

    // --- Volume ---
    const handleVolumeChange = (value) => {
        const vol = value[0] / 100;
        setVolume(vol);
        videoRef.current.volume = vol;
        setMuted(vol === 0);
    };

    // --- Mute ---
    const handleToggleMute = () => {
        const newMuted = !muted;
        setMuted(newMuted);
        videoRef.current.muted = newMuted;
    };

    // --- Format Time ---
    const formatTime = (seconds) => {
        if (isNaN(seconds)) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    // --- Fullscreen ---
    const handleFullScreen = useCallback(() => {
        if (!isFullScreen) {
            playerContainerRef.current?.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    }, [isFullScreen]);

    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullScreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullScreenChange);
        };
    }, []);

    // --- Auto-hide Controls ---
    const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    // --- Update parent on complete ---
    useEffect(() => {
        if (played === 1) {
            onProgressUpdate?.({
                ...progressData,
                progressValue: played,
            });
        }
    }, [played]);

    return (
        <div
            ref={playerContainerRef}
            className={`relative bg-black rounded-lg overflow-hidden shadow-2xl transition-all duration-300
    ${isFullScreen ? "w-screen h-screen" : ""}
  `}
            style={{ width: "100%", height: "100%" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setShowControls(false)}
        >
            {/* --- Video Element --- */}
            <video
                ref={videoRef}
                src={url}
                className="w-full h-full object-contain sm:object-cover"
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                muted={muted}
            />

            {/* --- Controls --- */}
            {showControls && (
                <div
                    className="
        absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-70
        p-3 sm:p-4 
        space-y-3
        backdrop-blur-md
      "
                >
                    {/* Progress Slider */}
                    <Slider
                        value={[played * 100]}
                        max={100}
                        step={0.1}
                        onValueChange={handleSeekChange}
                        className="w-full"
                    />

                    <div
                        className="
          flex flex-col sm:flex-row
          items-center justify-between 
          gap-3 sm:gap-0
          text-white
        "
                    >
                        {/* Left Controls */}
                        <div
                            className="
            flex items-center 
            space-x-2 sm:space-x-3
          "
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePlayPause}
                                className="text-white scale-110 sm:scale-100"
                            >
                                {playing ? <Pause /> : <Play />}
                            </Button>

                            <Button variant="ghost" size="icon" onClick={handleRewind} className="text-white">
                                <RotateCcw />
                            </Button>

                            <Button variant="ghost" size="icon" onClick={handleForward} className="text-white">
                                <RotateCw />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleToggleMute}
                                className="text-white"
                            >
                                {muted ? <VolumeX /> : <Volume2 />}
                            </Button>

                            {/* Volume slider – hidden on very small screens */}
                            <div className="hidden sm:block">
                                <Slider
                                    value={[volume * 100]}
                                    max={100}
                                    step={1}
                                    onValueChange={handleVolumeChange}
                                    className="w-24"
                                />
                            </div>
                        </div>

                        {/* Right Controls */}
                        <div className="flex items-center space-x-3 sm:space-x-4 text-sm sm:text-base">
                            <span>
                                {formatTime(played * duration)} / {formatTime(duration)}
                            </span>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleFullScreen}
                                className="text-white"
                            >
                                {isFullScreen ? <Minimize /> : <Maximize />}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;

