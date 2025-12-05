import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, RefreshCw, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface PuzzlePiece {
  id: number;
  currentPosition: number;
  correctPosition: number;
}

const Puzzle = () => {
  const navigate = useNavigate();
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [moves, setMoves] = useState(0);

  const gridSize = 4;

  useEffect(() => {
    initializePuzzle();
  }, []);

  const initializePuzzle = () => {
    const newPieces: PuzzlePiece[] = Array.from({ length: gridSize * gridSize }, (_, i) => ({
      id: i,
      currentPosition: i,
      correctPosition: i,
    }));

    const shuffled = [...newPieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i].currentPosition;
      shuffled[i].currentPosition = shuffled[j].currentPosition;
      shuffled[j].currentPosition = temp;
    }

    setPieces(shuffled);
    setMoves(0);
    setShowResults(false);
  };

  const handlePieceClick = (pieceId: number) => {
    if (selectedPiece === null) {
      setSelectedPiece(pieceId);
    } else {
      const newPieces = [...pieces];
      const piece1 = newPieces.find((p) => p.id === selectedPiece)!;
      const piece2 = newPieces.find((p) => p.id === pieceId)!;

      const tempPosition = piece1.currentPosition;
      piece1.currentPosition = piece2.currentPosition;
      piece2.currentPosition = tempPosition;

      setPieces(newPieces);
      setSelectedPiece(null);
      setMoves(moves + 1);

      checkCompletion(newPieces);
    }
  };

  const checkCompletion = async (currentPieces: PuzzlePiece[]) => {
    const isComplete = currentPieces.every((p) => p.currentPosition === p.correctPosition);

    if (isComplete) {
      setShowResults(true);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          await supabase
            .from("game_progress")
            .update({
              completed: true,
              score: 100,
              completed_at: new Date().toISOString()
            })
            .eq("user_id", user.id)
            .eq("game_number", 3);

          await supabase
            .from("game_progress")
            .update({ unlocked: true })
            .eq("user_id", user.id)
            .eq("game_number", 4);

          toast({
            title: "🎉 Вітаємо!",
            description: `Пазл зібрано за ${moves + 1} ходів! Coding Challenge розблоковано!`,
          });
        }
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    }
  };

  const getPieceAtPosition = (position: number) => {
    return pieces.find((p) => p.currentPosition === position);
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <Snowflakes />
        <Garland />
        <Header />

        <main className="pt-36 pb-16 px-4 relative z-10">
          <div className="container mx-auto max-w-4xl">
            <div className="glass-card p-8 rounded-3xl text-center">
              <Trophy className="w-24 h-24 mx-auto mb-6 text-christmas-gold" />
              <h1 className="text-4xl font-bold mb-4">Пазл зібрано! 🎉</h1>
              <div className="text-6xl font-bold mb-6 bg-gradient-to-r from-christmas-red to-christmas-gold bg-clip-text text-transparent">
                {moves} ходів
              </div>
              <p className="text-lg text-green-500 mb-8">✅ Coding Challenge розблоковано!</p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  onClick={initializePuzzle}
                  className="bg-christmas-red hover:bg-christmas-red/90"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Грати знову
                </Button>
                <Button onClick={() => navigate("/games")} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  До ігор
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowflakes />
      <Garland />
      <Header />

      <main className="pt-36 pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent">
              🧩 DevOps Пазл
            </h1>
            <p className="text-muted-foreground mb-4">
              Зберіть різдвяну DevOps інфографіку
            </p>
            <div className="text-2xl font-bold text-christmas-gold">Ходів: {moves}</div>
          </div>

          <div className="glass-card p-4 md:p-8 rounded-3xl mb-6">
            <div className="grid grid-cols-4 gap-1 md:gap-2 max-w-2xl mx-auto">
              {Array.from({ length: gridSize * gridSize }).map((_, position) => {
                const piece = getPieceAtPosition(position);
                if (!piece) return null;

                const isSelected = selectedPiece === piece.id;
                const isCorrect = piece.currentPosition === piece.correctPosition;

                return (
                  <div
                    key={position}
                    onClick={() => handlePieceClick(piece.id)}
                    className={cn(
                      "aspect-square rounded-lg md:rounded-xl cursor-pointer transition-all border-2 md:border-4 flex items-center justify-center text-4xl md:text-6xl",
                      isSelected && "ring-2 md:ring-4 ring-christmas-gold scale-95",
                      isCorrect ? "border-green-500" : "border-white/20",
                      "hover:scale-105 hover:border-christmas-gold active:scale-95"
                    )}
                    style={{
                      background: `linear-gradient(135deg, 
                        ${piece.id % 3 === 0 ? "#C41E3A" : piece.id % 3 === 1 ? "#FFD700" : "#0F8A5F"} 0%, 
                        ${piece.id % 3 === 0 ? "#8B1429" : piece.id % 3 === 1 ? "#DAA520" : "#0A5C3F"} 100%)`,
                    }}
                  >
                    {piece.id === 0 && "🐳"}
                    {piece.id === 1 && "☸️"}
                    {piece.id === 2 && "🔧"}
                    {piece.id === 3 && "⚙️"}
                    {piece.id === 4 && "📦"}
                    {piece.id === 5 && "🚀"}
                    {piece.id === 6 && "🔄"}
                    {piece.id === 7 && "📊"}
                    {piece.id === 8 && "🔐"}
                    {piece.id === 9 && "🌐"}
                    {piece.id === 10 && "💾"}
                    {piece.id === 11 && "🔌"}
                    {piece.id === 12 && "📡"}
                    {piece.id === 13 && "🛠️"}
                    {piece.id === 14 && "⚡"}
                    {piece.id === 15 && "🎄"}
                  </div>
                );
              })}
            </div>

            {selectedPiece !== null && (
              <div className="text-center mt-6 text-christmas-gold text-sm md:text-base">
                Плитка вибрана! Натисніть на іншу.
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={initializePuzzle}
              variant="outline"
              className="border-christmas-gold text-christmas-gold hover:bg-christmas-gold/20"
            >
              <Shuffle className="mr-2 h-4 w-4" />
              Перемішати
            </Button>
            <Button onClick={() => navigate("/games")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              До ігор
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Puzzle;
