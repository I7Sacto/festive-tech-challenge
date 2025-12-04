import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";

const playlist = [
  {
    id: 1,
    title: "Jingle Bells",
    artist: "Frank Sinatra",
    emoji: "🔔",
    youtubeId: "Yf5R-z7JdBY",
  },
  {
    id: 2,
    title: "Last Christmas",
    artist: "Wham!",
    emoji: "🎄",
    youtubeId: "E8gmARGvPlI",
  },
  {
    id: 3,
    title: "All I Want for Christmas Is You",
    artist: "Mariah Carey",
    emoji: "❤️",
    youtubeId: "yXQViqx6GMY",
  },
  {
    id: 4,
    title: "Silent Night",
    artist: "Carrie Underwood",
    emoji: "🌙",
    youtubeId: "_vw--yxcDNM",
  },
  {
    id: 5,
    title: "We Wish You a Merry Christmas",
    artist: "Christmas Classics",
    emoji: "🎅",
    youtubeId: "g-OF7KGyDis",
  },
  {
    id: 6,
    title: "Carol of the Bells",
    artist: "Pentatonix",
    emoji: "🔔",
    youtubeId: "WSUFzC6_fp8",
  },
  {
    id: 7,
    title: "Let It Snow",
    artist: "Frank Sinatra",
    emoji: "❄️",
    youtubeId: "sE3uRRFVsmc",
  },
  {
    id: 8,
    title: "Winter Wonderland",
    artist: "Michael Bublé",
    emoji: "⛄",
    youtubeId: "94Ye-3C1FC8",
  },
];

const Music = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => setIsMuted(!isMuted);

  const selectTrack = (index: number) => {
    setCurrentTrack(index);
  };

  const current = playlist[currentTrack];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowflakes />
      <Garland />
      <Header />

      <main className="pt-36 pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent">
              🎵 Музика та Атмосфера
            </h1>
            <p className="text-lg text-muted-foreground">
              Насолоджуйтеся справжніми різдвяними хітами
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr,400px] gap-6">
            {/* YouTube Player */}
            <div className="glass-card p-6 rounded-3xl">
              {/* Current Track Info */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 animate-bounce">{current.emoji}</div>
                <h2 className="text-2xl font-bold mb-2">{current.title}</h2>
                <p className="text-muted-foreground">{current.artist}</p>
              </div>

              {/* YouTube Embed */}
              <div className="aspect-video rounded-xl overflow-hidden bg-black/30 mb-4">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${current.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0`}
                  title={current.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMute}
                  className="h-12 w-12 rounded-full"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-4">
                💡 Використовуйте кнопки YouTube плеєра для повного контролю
              </p>
            </div>

            {/* Playlist */}
            <div className="glass-card p-6 rounded-3xl max-h-[600px] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">🎼 Плейлист</h3>
              <div className="space-y-2">
                {playlist.map((track, index) => (
                  <button
                    key={track.id}
                    onClick={() => selectTrack(index)}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all hover:bg-white/10 hover:scale-105",
                      currentTrack === index &&
                        "bg-gradient-to-r from-christmas-red/30 to-christmas-gold/30 border-2 border-christmas-gold scale-105"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{track.emoji}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{track.title}</div>
                        <div className="text-xs text-muted-foreground">{track.artist}</div>
                      </div>
                      {currentTrack === index && (
                        <div className="flex gap-1">
                          <div className="w-1 h-4 bg-christmas-gold rounded-full animate-pulse"></div>
                          <div className="w-1 h-4 bg-christmas-gold rounded-full animate-pulse delay-75"></div>
                          <div className="w-1 h-4 bg-christmas-gold rounded-full animate-pulse delay-150"></div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-christmas-gold/10 border border-christmas-gold/30">
                <p className="text-xs text-center text-muted-foreground">
                  🎵 {playlist.length} різдвяних хітів для святкового настрою!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .delay-75 {
          animation-delay: 75ms;
        }
        .delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  );
};

export default Music;
