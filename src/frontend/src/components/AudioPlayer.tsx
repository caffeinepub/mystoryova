import { Slider } from "@/components/ui/slider";
import { Download, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  src: string;
  title: string;
  allowDownload?: boolean;
}

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
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: setters are stable React refs
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(0);
    setDuration(0);
    setPlaying(false);
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

      {/* Volume */}
      <div className="flex items-center gap-2">
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
      </div>

      {!src && (
        <p className="text-xs text-muted-foreground text-center">
          Sample audio not available yet.
        </p>
      )}
    </div>
  );
}
