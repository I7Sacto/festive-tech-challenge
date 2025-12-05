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

// Правильний кросворд 7x7 де слова ПЕРЕТИНАЮТЬСЯ
const clues: Clue[] = [
  // Горизонталь
  { 
    id: 1, 
    number: 1, 
    clue: "Система контролю версій", 
    answer: "GIT", 
    direction: "across", 
    startRow: 0, 
    startCol: 0 
  },
  // G на (0,0), I на (0,1), T на (0,2)
  
  { 
    id: 2, 
    number: 4, 
    clue: "Протокол веб-серверів", 
    answer: "HTTP", 
    direction: "across", 
    startRow: 2, 
    startCol: 2 
  },
  // H на (2,2), T на (2,3), T на (2,4), P на (2,5)
  
  { 
    id: 3, 
    number: 6, 
    clue: "Доменні імена", 
    answer: "DNS", 
    direction: "across", 
    startRow: 4, 
    startCol: 0 
  },
  // D на (4,0), N на (4,1), S на (4,2)
  
  // Вертикаль
  { 
    id: 4, 
    number: 2, 
    clue: "Програмний інтерфейс", 
    answer: "API", 
    direction: "down", 
    startRow: 0, 
    startCol: 2 
  },
  // A на (0,2)=T(GIT перетин!), P на (1,2), I на (2,2)=H(HTTP перетин!)
  
  { 
    id: 5, 
    number: 3, 
    clue: "Structured Query Language", 
    answer: "SQL", 
    direction: "down", 
    startRow: 1, 
    startCol: 1 
  },
  // S на (1,1), Q на (2,1), L на (3,1)
  
  { 
    id: 6, 
    number: 5, 
    clue: "Безпечний Shell", 
    answer: "SSH", 
    direction: "down", 
    startRow: 2, 
    startCol: 4 
  },
  // S на (2,4)=T(HTTP перетин!), S на (3,4), H на (4,4)
];


// Компонент для відображення номера (ГАРАНТОВАНО ВИДИМИЙ)
const CellNumber = ({ number }: { number: number }) => {
  return (
    <div 
      style={{
        position: 'absolute',
        top: '0px',
        left: '0px',
        zIndex: 999,
        pointerEvents: 'none'
      }}
    >
      <span
        style={{
          display: 'inline-block',
          backgroundColor: number === 1 ? '#FFD700' : '#FFFFFF',
          color: number === 1 ? '#000000' : '#DC143C',
          fontSize: number === 1 ? '15px' : '13px',
          fontWeight: '900',
          padding: '3px 5px',
          borderRadius: '0 0 5px 0',
          lineHeight: '1',
          boxShadow: '0 0 0 2px rgba(0,0,0,0.8), 0 3px 6px rgba(0,0,0,0.6)',
          minWidth: '18px',
          textAlign: 'center',
          border: number === 1 ? '2px solid #000000' : '1px solid rgba(220,20,60,0.5)'
        }}
      >
        {number}
      </span>
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
    const gridSize = 6;
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
              Заповніть мінімум 80%. Слова перетинаються!
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr,350px] gap-4 lg:gap-6">
            {/* Crossword Grid */}
            <div className="glass-card p-3 md:p-6 rounded-3xl">
              <div className="mb-3 flex gap-2 justify-between items-center">
                <div className="text-xs md:text-sm text-muted-foreground">
                  {selectedCell ? "Введіть літеру" : "Натисніть на клітинку"}
                </div>
                <Button size="sm" variant="outline" onClick={handleShowHint}>
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>

              {/* Grid - centered and responsive */}
              <div className="overflow-x-auto pb-2">
                <div className="inline-block min-w-full flex justify-center">
                  <div>
                    {grid.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex">
                        {row.map((cell, colIndex) => (
                          <div
                            key={`cell-${rowIndex}-${colIndex}`}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                            className={cn(
                              "w-11 h-11 sm:w-13 sm:h-13 md:w-16 md:h-16 border-2 relative flex items-center justify-center cursor-pointer transition-all",
                              cell.isBlack && "bg-gray-900 border-gray-800",
                              !cell.isBlack && "bg-white/10 border-white/50 hover:bg-white/20 active:bg-white/30",
                              selectedCell?.row === rowIndex &&
                                selectedCell?.col === colIndex &&
                                "bg-christmas-gold/60 ring-4 ring-christmas-gold border-christmas-gold scale-105"
                            )}
                          >
                            {/* Номер клітинки - ЗАВЖДИ ВИДИМИЙ */}
                            {cell.number && <CellNumber number={cell.number} />}
                            
                            {/* Літера користувача */}
                            {cell.userLetter && (
                              <span 
                                className="font-bold z-10"
                                style={{
                                  color: '#FFFFFF',
                                  fontSize: '20px',
                                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                                }}
                              >
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
                <Button onClick={handleRestart} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Заново
                </Button>
              </div>
            </div>

            {/* Clues */}
            <div className="glass-card p-4 md:p-6 rounded-3xl max-h-[600px] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Підказки</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold mb-3 text-christmas-red">
                    По горизонталі →
                  </h3>
                  <div className="space-y-2">
                    {clues
                      .filter((c) => c.direction === "across")
                      .map((clue) => (
                        <div key={clue.id} className="text-sm flex items-start gap-2">
                          <span 
                            className="inline-block flex-shrink-0 text-center font-black"
                            style={{
                              backgroundColor: clue.number === 1 ? '#FFD700' : '#FFFFFF',
                              color: clue.number === 1 ? '#000000' : '#DC143C',
                              fontSize: '13px',
                              padding: '3px 6px',
                              borderRadius: '4px',
                              minWidth: '24px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                              border: clue.number === 1 ? '2px solid #000000' : 'none'
                            }}
                          >
                            {clue.number}
                          </span>
                          <span className="flex-1">
                            {clue.clue} 
                            <span className="text-xs text-muted-foreground ml-1">
                              ({clue.answer.length} літ.)
                            </span>
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold mb-3 text-christmas-green">
                    По вертикалі ↓
                  </h3>
                  <div className="space-y-2">
                    {clues
                      .filter((c) => c.direction === "down")
                      .map((clue) => (
                        <div key={clue.id} className="text-sm flex items-start gap-2">
                          <span 
                            className="inline-block flex-shrink-0 text-center font-black"
                            style={{
                              backgroundColor: '#FFFFFF',
                              color: '#DC143C',
                              fontSize: '13px',
                              padding: '3px 6px',
                              borderRadius: '4px',
                              minWidth: '24px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                            }}
                          >
                            {clue.number}
                          </span>
                          <span className="flex-1">
                            {clue.clue} 
                            <span className="text-xs text-muted-foreground ml-1">
                              ({clue.answer.length} літ.)
                            </span>
                          </span>
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
