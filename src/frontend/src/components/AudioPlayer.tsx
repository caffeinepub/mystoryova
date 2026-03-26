import { Slider } from "@/components/ui/slider";
import { Download, Gauge, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  src: string;
  title: string;
  allowDownload?: boolean;
  audiobookId?: string;
}

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2, 0.5];

function formatTime(s: number): string {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({
  src,
  title,
  allowDownload = false,
  audiobookId,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1); // default 1x
  const [resumeBanner, setResumeBanner] = useState<number | null>(null);

  const speed = SPEED_OPTIONS[speedIdx];

  // biome-ignore lint/correctness/useExhaustiveDependencies: setters are stable React refs
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(0);
    setDuration(0);
    setPlaying(false);

    // Check for saved progress
    if (audiobookId) {
      const saved = localStorage.getItem(`mystoryova_progress_${audiobookId}`);
      if (saved) {
        const savedTime = Number(saved);
        if (savedTime > 30) {
          setResumeBanner(savedTime);
          // auto-dismiss after 8 seconds
          const timer = setTimeout(() => setResumeBanner(null), 8000);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [src, audiobookId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: setters are stable React refs
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);
    const onWaiting = () => setLoading(true);
    const onCanPlay = () => setLoading(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
    };
  }, [src]);

  // Apply playback speed when it changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.playbackRate = speed;
  }, [speed]);

  // Save progress every 5 seconds while playing
  useEffect(() => {
    if (!playing || !audiobookId) return;
    const interval = setInterval(() => {
      const audio = audioRef.current;
      if (audio) {
        localStorage.setItem(
          `mystoryova_progress_${audiobookId}`,
          String(audio.currentTime),
        );
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [playing, audiobookId]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolume = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const v = value[0];
    audio.volume = v;
    setVolume(v);
    setMuted(v === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    setMuted(next);
  };

  const cycleSpeed = () => {
    setSpeedIdx((prev) => (prev + 1) % SPEED_OPTIONS.length);
  };

  const handleResume = (savedTime: number) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = savedTime;
    setCurrentTime(savedTime);
    setResumeBanner(null);
  };

  return (
    <div
      data-ocid="store.editor"
      className="glass rounded-2xl p-5 border border-primary/20 space-y-4"
    >
      {/* biome-ignore lint/a11y/useMediaCaption: audio player for user-uploaded content */}
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center gap-2">
        <div className="w-1 h-8 bg-primary rounded-full" />
        <p className="text-sm font-medium text-foreground truncate flex-1">
          {title}
        </p>
        {allowDownload && src && (
          <a
            href={src}
            download
            data-ocid="store.upload_button"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Play + Seek */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          data-ocid="store.toggle"
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:brightness-110 transition-all shrink-0 shadow-lg"
          disabled={!src}
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
          ) : playing ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>

        <div className="flex-1 space-y-1">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.5}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Volume + Speed */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleMute}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          {muted || volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
        <Slider
          value={[muted ? 0 : volume]}
          min={0}
          max={1}
          step={0.05}
          onValueChange={handleVolume}
          className="w-24"
        />
        <div className="ml-auto flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
          <button
            type="button"
            onClick={cycleSpeed}
            className="text-xs font-mono px-2 py-0.5 rounded-full border border-white/20 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors min-w-[3rem] text-center"
            title="Playback speed"
          >
            {speed === 1 ? "1×" : `${speed}×`}
          </button>
        </div>
      </div>

      {/* Resume banner */}
      {resumeBanner !== null && (
        <div className="flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-xl px-4 py-2.5 text-sm">
          <span className="text-foreground flex-1">
            Resume from {formatTime(resumeBanner)}?
          </span>
          <button
            type="button"
            onClick={() => handleResume(resumeBanner)}
            className="text-primary font-medium hover:underline text-xs"
          >
            Resume
          </button>
          <button
            type="button"
            onClick={() => setResumeBanner(null)}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {!src && (
        <p className="text-xs text-muted-foreground text-center">
          Sample audio not available yet.
        </p>
      )}
    </div>
  );
}
