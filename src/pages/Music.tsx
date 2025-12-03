import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";

const playlist = [
  {
    id: 1,
    title: "Jingle Bells (Lo-fi Remix)",
    artist: "Chill Beats",
    duration: "3:24",
    emoji: "🔔",
    // Безкоштовна різдвяна музика з FreeMusicArchive
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Christmas/Kevin_MacLeod_-_Jingle_Bells.mp3"
  },
  {
    id: 2,
    title: "Silent Night (Piano Version)",
    artist: "Christmas Classics",
    duration: "4:12",
    emoji: "🌙",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Seasonal/Scott_Holmes_-_02_-_Silent_Night.mp3"
  },
  {
    id: 3,
    title: "We Wish You a Merry Christmas",
    artist: "Holiday Orchestra",
    duration: "2:58",
    emoji: "🎄",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Christmas/Kevin_MacLeod_-_We_Wish_You_a_Merry_Christmas.mp3"
  },
  {
    id: 4,
    title: "Carol of the Bells",
    artist: "Techno Christmas",
    duration: "4:02",
    emoji: "🔔",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Christmas/Kevin_MacLeod_-_Carol_of_the_Bells.mp3"
  },
];

const Music = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Синхронізація audio елемента з состоянием
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log("Play error:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Зміна треку
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log("Play error:", err));
      }
    }
  }, [currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  
  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
  };
  
  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const selectTrack = (index: number) => {
    setCurrentTrack(index);
    setIsPlaying(true);
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const current = playlist[currentTrack];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowflakes />
      <Garland />
      <Header />

      {/* HTML5 Audio Element */}
      <audio
        ref={audioRef}
        onEnded={handleTrackEnd}
        preload="metadata"
      >
        <source src={current.url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <main className="pt-36 pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent">
              🎵 Музика та Атмосфера
            </h1>
            <p className="text-lg text-muted-foreground">
              Насолоджуйтеся святковим плейлістом
            </p>
          </div>

          {/* Music Player */}
          <div className="glass-card p-8 rounded-3xl mb-8">
            {/* Current Track Info */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{current.emoji}</div>
              <h2 className="text-2xl font-bold mb-2">{current.title}</h2>
              <p className="text-muted-foreground">{current.artist}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={prevTrack}
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                size="icon"
                className="h-16 w-16 rounded-full bg-gradient-to-r from-christmas-red to-christmas-gold hover:scale-110 transition-transform"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 ml-1" />
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={nextTrack}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-4 justify-center mb-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-32"
              />
            </div>
          </div>

          {/* Playlist */}
          <div className="glass-card p-6 rounded-3xl">
            <h3 className="text-xl font-bold mb-4">Плейлист</h3>
            <div className="space-y-2">
              {playlist.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => selectTrack(index)}
                  className={cn(
                    "w-full p-4 rounded-xl text-left transition-all hover:bg-white/10",
                    currentTrack === index && "bg-gradient-to-r from-christmas-red/20 to-christmas-gold/20 border-2 border-christmas-gold"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{track.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold">{track.title}</div>
                      <div className="text-sm text-muted-foreground">{track.artist}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{track.duration}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Music;
