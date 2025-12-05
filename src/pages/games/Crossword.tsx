import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Trophy, RefreshCw, HelpCircle } from "lucide-react";
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

const clues: Clue[] = [
  { id: 1, number: 1, clue: "Система контролю версій від Linus Torvalds", answer: "GIT", direction: "across", startRow: 0, startCol: 0 },
  { id: 2, number: 2, clue: "Continuous Integration and Continuous ___", answer: "DELIVERY", direction: "across", startRow: 0, startCol: 4 },
  { id: 3, number: 3, clue: "Платформа контейнеризації", answer: "DOCKER", direction: "down", startRow: 0, startCol: 0 },
  { id: 4, number: 4, clue: "Протокол передачі гіпертексту", answer: "HTTP", direction: "across", startRow: 2, startCol: 1 },
  { id: 5, number: 5, clue: "Domain Name ___", answer: "SYSTEM", direction: "down", startRow: 1, startCol: 5 },
  { id: 6, number: 6, clue: "Structured Query ___", answer: "LANGUAGE", direction: "across", startRow: 4, startCol: 0 },
  { id: 7, number: 7, clue: "Система оркестрації контейнерів", answer: "KUBERNETES", direction: "down", startRow: 2, startCol: 7 },
  { id: 8, number: 8, clue: "Інструмент автоматизації від HashiCorp", answer: "TERRAFORM", direction: "across", startRow: 6, startCol: 2 },
  { id: 9, number: 9, clue: "Відкритий протокол передачі файлів", answer: "FTP", direction: "across", startRow: 8, startCol: 0 },
  { id: 10, number: 10, clue: "Application Programming ___", answer: "INTERFACE", direction: "down", startRow: 4, startCol: 3 },
];

// Окремий компонент для номера клітинки
const CellNumber = ({ number }: { number: number }) => {
  return (
    <div 
      style={{
        position: 'absolute',
        top: '0px',
        left: '0px',
        zIndex: 100,
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          color: '#DC143C',
          fontSize: number === 1 ? '14px' : number === 2 ? '13px' : '12px',
          fontWeight: '900',
          padding: '2px 4px',
          borderRadius: '0 0 4px 0',
          lineHeight: '1.1',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.4)',
          minWidth: '16px',
          textAlign: 'center',
          display: 'inline-block',
          border: '1px solid rgba(220,20,60,0.3)'
        }}
      >
        {number}
      </div>
    </div>
  );
};

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
    const gridSize = 10;
    const newGrid: CrosswordCell[][] = Array(gridSize)
      .fill(null)
      .map(() =>
        Array(gridSize)
          .fill(null)
          .map(() => ({
            letter: "",
            userLetter: "",
            isBlack: true,
          }))
      );

    clues.forEach((clue) => {
      const letters = clue.answer.split("");
      letters.forEach((letter, index) => {
        const row = clue.direction === "across" ? clue.startRow : clue.startRow + index;
        const col = clue.direction === "across" ? clue.startCol + index : clue.startCol;

        if (row < gridSize && col < gridSize) {
          newGrid[row][col] = {
            letter: letter,
            userLetter: newGrid[row][col].userLetter || "",
            isBlack: false,
            number: index === 0 ? clue.number : newGrid[row][col].number,
          };
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
      if (/[A-ZА-ЯІЇЄ]/.test(newLetter)) {
        const newGrid = grid.map(row => row.map(cell => ({...cell})));
        newGrid[selectedCell.row][selectedCell.col].userLetter = newLetter;
        setGrid(newGrid);
        setInputValue(newLetter);
        
        setTimeout(() => {
          moveToNextCell();
          setInputValue("");
        }, 50);
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

    grid.forEach((row) => {
      row.forEach((cell) => {
        if (!cell.isBlack) {
          total++;
          if (cell.userLetter === cell.letter) {
            correct++;
          }
        }
      });
    });

    const percentage = Math.round((correct / total) * 100);
    setScore(percentage);
    setShowResults(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from("game_progress")
          .update({
            completed: true,
            score: percentage,
            completed_at: new Date().toISOString()
          })
          .eq("user_id", user.id)
          .eq("game_number", 2);

        if (percentage >= 80) {
          await supabase
            .from("game_progress")
            .update({ unlocked: true })
            .eq("user_id", user.id)
            .eq("game_number", 3);

          toast({
            title: "🎉 Вітаємо!",
            description: `Ви заповнили ${percentage}%! DevOps пазл розблоковано!`,
          });
        } else {
          toast({
            title: "😔 Майже!",
            description: `Ви заповнили ${percentage}%. Потрібно мінімум 80%.`,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleRestart = () => {
    initializeGrid();
    setShowResults(false);
    setScore(0);
    setSelectedCell(null);
    setInputValue("");
  };

  const handleShowHint = () => {
    if (!selectedCell) {
      toast({
        title: "Виберіть клітинку",
        description: "Натисніть на клітинку кросворду",
      });
      return;
    }

    const newGrid = grid.map(row => row.map(cell => ({...cell})));
    newGrid[selectedCell.row][selectedCell.col].userLetter =
      grid[selectedCell.row][selectedCell.col].letter;
    setGrid(newGrid);

    toast({
      title: "💡 Підказка",
      description: "Літера відкрита!",
    });
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
              <h1 className="text-4xl font-bold mb-4">Кросворд завершено! 🎉</h1>
              <div className="text-6xl font-bold mb-6 bg-gradient-to-r from-christmas-red to-christmas-gold bg-clip-text text-transparent">
                {score}%
              </div>
              {score >= 80 ? (
                <p className="text-lg text-green-500 mb-8">✅ DevOps пазл розблоковано!</p>
              ) : (
                <p className="text-lg text-yellow-500 mb-8">⚠️ Потрібно мінімум 80%</p>
              )}
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  onClick={handleRestart}
                  className="bg-christmas-red hover:bg-christmas-red/90"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Пройти знову
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

      {/* Прихований input для системної клавіатури */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="fixed -top-96 opacity-0 pointer-events-auto"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        inputMode="text"
      />

      <main className="pt-36 pb-16 px-2 sm:px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent">
              📝 Технічний кросворд
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mb-2">
              Заповніть мінімум 80%
            </p>
            {selectedCell && (
              <p className="text-sm text-christmas-gold">
                📍 Клітинка обрана - вводьте літеру
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-[1fr,350px] gap-4 lg:gap-6">
            {/* Crossword Grid */}
            <div className="glass-card p-3 md:p-6 rounded-3xl">
              <div className="mb-3 flex gap-2 justify-between items-center">
                <div className="text-xs md:text-sm text-muted-foreground">
                  Натисніть на клітинку
                </div>
                <Button size="sm" variant="outline" onClick={handleShowHint}>
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>

              {/* Grid wrapper - scrollable */}
              <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                <div className="inline-block min-w-full flex justify-center">
                  <div>
                    {grid.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex">
                        {row.map((cell, colIndex) => (
                          <div
                            key={`${rowIndex}-${colIndex}`}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                            className={cn(
                              "w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 border-2 relative flex items-center justify-center cursor-pointer transition-all",
                              cell.isBlack && "bg-gray-900 border-gray-800",
                              !cell.isBlack && "bg-white/10 border-white/40 hover:bg-white/20 active:bg-white/30",
                              selectedCell?.row === rowIndex &&
                                selectedCell?.col === colIndex &&
                                "bg-christmas-gold/50 ring-4 ring-christmas-gold border-christmas-gold"
                            )}
                          >
                            {cell.number && <CellNumber number={cell.number} />}
                            {cell.userLetter && (
                              <span className="text-white text-base sm:text-lg md:text-xl font-bold z-10">
                                {cell.userLetter}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex gap-3 justify-center flex-wrap">
                <Button
                  onClick={handleCheck}
                  className="bg-gradient-to-r from-christmas-red to-christmas-gold hover:opacity-90"
                  size="sm"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Перевірити
                </Button>
                <Button onClick={() => navigate("/games")} variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  До ігор
                </Button>
              </div>
            </div>

            {/* Clues */}
            <div className="glass-card p-4 md:p-6 rounded-3xl max-h-[500px] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Підказки</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold mb-2 text-christmas-red">
                    По горизонталі:
                  </h3>
                  <div className="space-y-2">
                    {clues
                      .filter((c) => c.direction === "across")
                      .map((clue) => (
                        <div key={clue.id} className="text-sm flex items-start gap-2">
                          <span 
                            className="inline-block flex-shrink-0 text-center font-black leading-tight"
                            style={{
                              backgroundColor: '#FFFFFF',
                              color: '#DC143C',
                              fontSize: '12px',
                              padding: '2px 4px',
                              borderRadius: '3px',
                              minWidth: '20px',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                            }}
                          >
                            {clue.number}
                          </span>
                          <span>{clue.clue} <span className="text-xs text-muted-foreground">({clue.answer.length} літ.)</span></span>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold mb-2 text-christmas-green">
                    По вертикалі:
                  </h3>
                  <div className="space-y-2">
                    {clues
                      .filter((c) => c.direction === "down")
                      .map((clue) => (
                        <div key={clue.id} className="text-sm flex items-start gap-2">
                          <span 
                            className="inline-block flex-shrink-0 text-center font-black leading-tight"
                            style={{
                              backgroundColor: '#FFFFFF',
                              color: '#DC143C',
                              fontSize: '12px',
                              padding: '2px 4px',
                              borderRadius: '3px',
                              minWidth: '20px',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                            }}
                          >
                            {clue.number}
                          </span>
                          <span>{clue.clue} <span className="text-xs text-muted-foreground">({clue.answer.length} літ.)</span></span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className="text-xs">
                  💡 Натисніть на клітинку → з'явиться системна клавіатура
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Crossword;
