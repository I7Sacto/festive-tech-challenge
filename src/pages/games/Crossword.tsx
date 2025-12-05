import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Trophy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface CrosswordCell {
  letter: string;
  userLetter: string;
  number?: number;
  isBlack: boolean;
}

interface Clue {
  id: number;
  number: number;
  clue: string;
  answer: string;
  direction: "across" | "down";
  startRow: number;
  startCol: number;
}

// Кросворд 8x8 з ПРАВИЛЬНИМИ перетинами
const clues: Clue[] = [
  { id: 1, number: 1, clue: "Платформа контейнерів", answer: "DOCKER", direction: "across", startRow: 0, startCol: 0 },
  { id: 2, number: 4, clue: "Протокол веб", answer: "HTTP", direction: "across", startRow: 2, startCol: 2 },
  { id: 3, number: 6, clue: "Мова запитів", answer: "SQL", direction: "across", startRow: 4, startCol: 0 },
  { id: 4, number: 8, clue: "Інтерфейс", answer: "API", direction: "across", startRow: 6, startCol: 1 },
  
  { id: 5, number: 2, clue: "Мова Google", answer: "GO", direction: "down", startRow: 0, startCol: 2 },
  { id: 6, number: 3, clue: "Доменні імена", answer: "DNS", direction: "down", startRow: 0, startCol: 5 },
  { id: 7, number: 5, clue: "JSON ___", answer: "WEB", direction: "down", startRow: 2, startCol: 4 },
  { id: 8, number: 7, clue: "Continuous Int", answer: "CI", direction: "down", startRow: 4, startCol: 1 },
];

const Crossword = () => {
  const navigate = useNavigate();
  const [grid, setGrid] = useState<CrosswordCell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    initializeGrid();
  }, []);

  useEffect(() => {
    if (selectedCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedCell]);

  const initializeGrid = () => {
    const gridSize = 8;
    const newGrid: CrosswordCell[][] = Array(gridSize).fill(null).map(() =>
      Array(gridSize).fill(null).map(() => ({ letter: "", userLetter: "", isBlack: true }))
    );

    clues.forEach((clue) => {
      clue.answer.split("").forEach((letter, index) => {
        const row = clue.direction === "across" ? clue.startRow : clue.startRow + index;
        const col = clue.direction === "across" ? clue.startCol + index : clue.startCol;

        if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
          if (newGrid[row][col].isBlack) {
            newGrid[row][col] = { letter, userLetter: "", isBlack: false, number: index === 0 ? clue.number : undefined };
          } else {
            if (index === 0) newGrid[row][col].number = clue.number;
          }
        }
      });
    });

    setGrid(newGrid);
  };

  const handleCellClick = (row: number, col: number) => {
    if (!grid[row][col].isBlack) {
      setSelectedCell({ row, col });
      setInputValue("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (value.length > inputValue.length && selectedCell) {
      const newLetter = value.slice(-1);
      if (/[A-Z]/.test(newLetter)) {
        const newGrid = grid.map(row => row.map(cell => ({...cell})));
        newGrid[selectedCell.row][selectedCell.col].userLetter = newLetter;
        setGrid(newGrid);
        setInputValue(newLetter);
        setTimeout(() => { moveToNextCell(); setInputValue(""); }, 50);
      }
    } else if (value.length === 0 && selectedCell) {
      const newGrid = grid.map(row => row.map(cell => ({...cell})));
      newGrid[selectedCell.row][selectedCell.col].userLetter = "";
      setGrid(newGrid);
      setInputValue("");
    }
  };

  const moveToNextCell = () => {
    if (!selectedCell) return;
    let nextCol = selectedCell.col + 1;
    let nextRow = selectedCell.row;
    while (nextRow < grid.length) {
      while (nextCol < grid[0].length) {
        if (!grid[nextRow][nextCol].isBlack) {
          setSelectedCell({ row: nextRow, col: nextCol });
          return;
        }
        nextCol++;
      }
      nextCol = 0;
      nextRow++;
    }
  };

  const handleCheck = async () => {
    let correct = 0;
    let total = 0;
    grid.forEach(row => row.forEach(cell => {
      if (!cell.isBlack) {
        total++;
        if (cell.userLetter === cell.letter) correct++;
      }
    }));

    const percentage = Math.round((correct / total) * 100);
    setScore(percentage);
    setShowResults(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("game_progress").update({ completed: true, score: percentage, completed_at: new Date().toISOString() }).eq("user_id", user.id).eq("game_number", 2);
        if (percentage >= 80) {
          await supabase.from("game_progress").update({ unlocked: true }).eq("user_id", user.id).eq("game_number", 3);
          toast({ title: "🎉 Вітаємо!", description: `${percentage}%! Пазл розблоковано!` });
        } else {
          toast({ title: "Майже!", description: `${percentage}%. Потрібно 80%.`, variant: "destructive" });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <Snowflakes /><Garland /><Header />
        <main className="pt-36 pb-16 px-4 relative z-10">
          <div className="container mx-auto max-w-4xl">
            <div className="glass-card p-8 rounded-3xl text-center">
              <Trophy className="w-24 h-24 mx-auto mb-6 text-christmas-gold" />
              <h1 className="text-4xl font-bold mb-4">Завершено! 🎉</h1>
              <div className="text-6xl font-bold mb-6 bg-gradient-to-r from-christmas-red to-christmas-gold bg-clip-text text-transparent">{score}%</div>
              {score >= 80 ? <p className="text-lg text-green-500 mb-8">✅ Пазл розблоковано!</p> : <p className="text-lg text-yellow-500 mb-8">⚠️ Потрібно 80%</p>}
              <div className="flex gap-4 justify-center">
                <Button onClick={() => {initializeGrid(); setShowResults(false); setScore(0); setInputValue("");}} className="bg-christmas-red"><RefreshCw className="mr-2 h-4 w-4" />Знову</Button>
                <Button onClick={() => navigate("/games")} variant="outline">До ігор</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowflakes /><Garland /><Header />
      <input ref={inputRef} type="text" value={inputValue} onChange={handleInputChange} className="fixed -top-96 opacity-0 pointer-events-auto" autoComplete="off" autoCorrect="off" autoCapitalize="characters" />

      <main className="pt-36 pb-16 px-1 sm:px-2 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-3">
            <h1 className="text-2xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-christmas-red to-christmas-gold bg-clip-text text-transparent">📝 Кросворд</h1>
            <p className="text-xs text-muted-foreground">80%+</p>
          </div>

          <div className="grid lg:grid-cols-[1fr,280px] gap-2">
            <div className="glass-card p-2 md:p-3 rounded-2xl">
              <div className="overflow-auto">
                <div className="inline-block">
                  {grid.map((row, ri) => (
                    <div key={ri} className="flex">
                      {row.map((cell, ci) => (
                        <div
                          key={`${ri}-${ci}`}
                          onClick={() => handleCellClick(ri, ci)}
                          className={cn(
                            "w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 border relative flex items-center justify-center cursor-pointer",
                            cell.isBlack && "bg-gray-900 border-gray-800",
                            !cell.isBlack && "bg-white/10 border-white/40 hover:bg-white/20",
                            selectedCell?.row === ri && selectedCell?.col === ci && "bg-christmas-gold/60 ring-2 ring-christmas-gold"
                          )}
                        >
                          {cell.number && (
                            <span className="absolute top-0 left-0 bg-christmas-gold text-black font-black text-[9px] px-1 py-0.5 rounded-br z-50 leading-none shadow-lg">{cell.number}</span>
                          )}
                          {cell.userLetter && <span className="text-white text-base md:text-xl font-bold z-10">{cell.userLetter}</span>}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-2 flex gap-2 justify-center">
                <Button onClick={handleCheck} className="bg-gradient-to-r from-christmas-red to-christmas-gold" size="sm"><Check className="h-3 w-3 mr-1" />Перевірити</Button>
                <Button onClick={() => navigate("/games")} variant="outline" size="sm">До ігор</Button>
              </div>
            </div>

            <div className="glass-card p-3 rounded-2xl max-h-[480px] overflow-y-auto">
              <h2 className="text-base font-bold mb-2">Підказки</h2>
              <div className="space-y-2">
                <div>
                  <h3 className="text-xs font-semibold mb-1 text-christmas-red">→ Горизонталь:</h3>
                  <div className="space-y-1">
                    {clues.filter(c => c.direction === "across").map(c => (
                      <div key={c.id} className="text-[11px] flex gap-1">
                        <span className="bg-christmas-gold text-black font-black px-1.5 py-0.5 rounded text-[10px] leading-none">{c.number}</span>
                        <span>{c.clue} ({c.answer.length})</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold mb-1 text-christmas-green">↓ Вертикаль:</h3>
                  <div className="space-y-1">
                    {clues.filter(c => c.direction === "down").map(c => (
                      <div key={c.id} className="text-[11px] flex gap-1">
                        <span className="bg-christmas-gold text-black font-black px-1.5 py-0.5 rounded text-[10px] leading-none">{c.number}</span>
                        <span>{c.clue} ({c.answer.length})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Crossword;
