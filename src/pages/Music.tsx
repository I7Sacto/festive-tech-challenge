import { useState } from "react";
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
  },
  {
    id: 2,
    title: "Silent Night (Piano Version)",
    artist: "Christmas Classics",
    duration: "4:12",
    emoji: "🌙",
  },
  {
    id: 3,
    title: "We Wish You a Merry Christmas",
    artist: "Holiday Orchestra",
    duration: "2:58",
    emoji: "🎄",
  },
  {
    id: 4,
    title: "Let It Snow (Jazz Cover)",
    artist: "Winter Jazz Trio",
    duration: "3:45",
    emoji: "❄️",
  },
  {
    id: 5,
    title: "Carol of the Bells (Electronic)",
    artist: "Techno Christmas",
    duration: "4:02",
    emoji: "🔔",
  },
  {
    id: 6,
    title: "O Holy Night (Acoustic)",
    artist: "Acoustic Christmas",
    duration: "5:18",
    emoji: "⭐",
  },
  {
    id: 7,
    title: "Deck the Halls (8-bit Version)",
    artist: "Retro Christmas",
    duration: "2:34",
    emoji: "🎮",
  },
  {
    id: 8,
    title: "Winter Wonderland (Chill)",
    artist: "Ambient Christmas",
    duration: "3:56",
    emoji: "🏔️",
  },
];

const Music = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

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

  const current = playlist[currentTrack];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowflakes />
      <Garland />
      <Header />

      <main className="pt-36 pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              <span className="text-gradient-gold">🎵 Різдвяна музика</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Насолоджуйтесь святковою атмосферою
            </p>
          </div>

          {/* Now Playing */}
          <div className="glass-card rounded-3xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-christmas flex items-center justify-center animate-pulse-glow">
                <span className="text-6xl">{current.emoji}</span>
              </div>
              <h2 className="font-heading font-bold text-2xl text-foreground mb-2">
                {current.title}
              </h2>
              <p className="text-muted-foreground">{current.artist}</p>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full bg-gradient-gold rounded-full transition-all duration-300",
                    isPlaying && "animate-[progress-fill_30s_linear_forwards]"
                  )}
                  style={{ width: isPlaying ? "100%" : "0%" }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>0:00</span>
                <span>{current.duration}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevTrack}
                className="hover:text-christmas-gold"
              >
                <SkipBack className="w-6 h-6" />
              </Button>

              <Button
                variant="gold"
                size="icon"
                onClick={togglePlay}
                className="w-16 h-16 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextTrack}
                className="hover:text-christmas-gold"
              >
                <SkipForward className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="hover:text-christmas-gold ml-4"
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Playlist */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-heading font-bold text-lg text-foreground">
                🎄 Святковий плейлист
              </h3>
            </div>
            <div className="divide-y divide-border">
              {playlist.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => selectTrack(index)}
                  className={cn(
                    "w-full p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors text-left",
                    currentTrack === index && "bg-secondary/50"
                  )}
                >
                  <span className="text-2xl">{track.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium truncate",
                      currentTrack === index ? "text-christmas-gold" : "text-foreground"
                    )}>
                      {track.title}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {track.artist}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {track.duration}
                  </span>
                  {currentTrack === index && isPlaying && (
                    <div className="flex gap-0.5">
                      <div className="w-1 h-4 bg-christmas-gold rounded animate-pulse" />
                      <div className="w-1 h-4 bg-christmas-gold rounded animate-pulse" style={{ animationDelay: "0.1s" }} />
                      <div className="w-1 h-4 bg-christmas-gold rounded animate-pulse" style={{ animationDelay: "0.2s" }} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <p className="text-center text-muted-foreground text-sm mt-8">
            💡 Це демо-версія плеєра. Підключіть Spotify або YouTube Music для справжньої музики!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Music;
