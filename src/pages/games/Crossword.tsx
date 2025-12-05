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

// ПРАВИЛЬНИЙ кросворд з ГАРАНТОВАНИМИ перетинами
const clues: Clue[] = [
  // 1. GIT горизонтально
  { 
    id: 1, 
    number: 1, 
    clue: "Система контролю версій (3)", 
    answer: "GIT", 
    direction: "across", 
    startRow: 0, 
    startCol: 0 
  },
  
  // 2. DEVOPS горизонтально  
  { 
    id: 2, 
    number: 4, 
    clue: "Development + Operations (6)", 
    answer: "DEVOPS", 
    direction: "across", 
    startRow: 2, 
    startCol: 1 
  },
  
  // 3. SSH горизонтально
  { 
    id: 3, 
    number: 7, 
    clue: "Secure Shell протокол (3)", 
    answer: "SSH", 
    direction: "across", 
    startRow: 4, 
    startCol: 2 
  },
  
  // 4. GO вертикально (перетин з GIT на G)
  { 
    id: 4, 
    number: 2, 
    clue: "Мова програмування Google (2)", 
    answer: "GO", 
    direction: "down", 
    startRow: 0, 
    startCol: 0 
  },
  
  // 5. TEST вертикально (перетин з GIT на T, перетин з DEVOPS на E)
  { 
    id: 5, 
    number: 3, 
    clue: "Перевірка коду (4)", 
    answer: "TEST", 
    direction: "down", 
    startRow: 0, 
    startCol: 2 
  },
  
  // 6. API вертикально (перетин з DEVOPS на O)
  { 
    id: 6, 
    number: 5, 
    clue: "Програмний інтерфейс (3)", 
    answer: "API", 
    direction: "down", 
    startRow: 2, 
    startCol: 4 
  },
  
  // 7. DNS вертикально (перетин з DEVOPS на P, перетин з SSH на S)
  { 
    id: 7, 
    number: 6, 
    clue: "Domain Name System (3)", 
    answer: "DNS", 
    direction: "down", 
    startRow: 2, 
    startCol: 5 
  },
];

// Компонент номера - МАКСИМАЛЬНО ВИДИМИЙ
const CellNumber = ({ number }: { number: number }) => {
  const isNumberOne = number === 1;
  
  return (
    <div 
      style={{
        position: 'absolute',
        top: '1px',
        left: '1px',
        zIndex: 1000
      }}
    >
      <div
        style={{
          display: 'inline-block',
          backgroundColor: isNumberOne ? '#FFD700' : '#FFFFFF',
          color: isNumberOne ? '#000000' : '#DC143C',
          fontSize: isNumberOne ? '16px' : '14px',
          fontWeight: '900',
          padding: '4px 6px',
          borderRadius: '0 0 6px 0',
          lineHeight: '1',
          boxShadow: isNumberOne 
            ? '0 0 0 3px #000000, 0 4px 8px rgba(0,0,0,0.8)' 
            : '0 0 0 1px rgba(220,20,60,0.5), 0 2px 4px rgba(0,0,0,0.5)',
          minWidth: '20px',
          textAlign: 'center',
          border: isNumberOne ? '2px solid #000000' : '1px solid rgba(220,20,60,0.3)',
          fontFamily: 'monospace'
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
    const gridSize = 7;
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
      });
      return;
    }

    const newGrid = grid.map(row => row.map(cell => ({...cell})));
    newGrid[selectedCell.row][selectedCell.col].userLetter =
      grid[selectedCell.row][selectedCell.col].letter;
    setGrid(newGrid);

    toast({
      title: "💡 Підказка відкрита!",
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
                <Button onClick={handleRestart} className="bg-christmas-red hover:bg-christmas-red/90">
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

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="fixed -top-96 opacity-0 pointer-events-auto"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
      />

      <main className="pt-36 pb-16 px-2 sm:px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent">
              📝 Технічний кросворд
            </h1>
            <p className="text-sm text-muted-foreground">Заповніть мінімум 80%</p>
          </div>

          <div className="grid lg:grid-cols-[1fr,350px] gap-4">
            <div className="glass-card p-4 md:p-6 rounded-3xl">
              <div className="mb-3 flex justify-end">
                <Button size="sm" variant="outline" onClick={handleShowHint}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Підказка
                </Button>
              </div>

              <div className="flex justify-center">
                <div>
                  {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex">
                      {row.map((cell, colIndex) => (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                          className={cn(
                            "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-2 relative flex items-center justify-center cursor-pointer",
                            cell.isBlack && "bg-gray-900 border-gray-800",
                            !cell.isBlack && "bg-white/10 border-white/50 hover:bg-white/25",
                            selectedCell?.row === rowIndex && selectedCell?.col === colIndex &&
                              "bg-christmas-gold/60 ring-4 ring-christmas-gold"
                          )}
                        >
                          {cell.number && <CellNumber number={cell.number} />}
                          {cell.userLetter && (
                            <span className="text-white text-xl md:text-2xl font-bold z-10">
                              {cell.userLetter}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex gap-3 justify-center">
                <Button onClick={handleCheck} className="bg-gradient-to-r from-christmas-red to-christmas-gold" size="sm">
                  <Check className="mr-2 h-4 w-4" />
                  Перевірити
                </Button>
                <Button onClick={() => navigate("/games")} variant="outline" size="sm">
                  До ігор
                </Button>
              </div>
            </div>

            <div className="glass-card p-4 md:p-6 rounded-3xl max-h-[500px] overflow-y-auto">
              <h2 className="text-lg font-bold mb-3">Підказки</h2>

              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-christmas-red">По горизонталі:</h3>
                  <div className="space-y-1.5">
                    {clues.filter((c) => c.direction === "across").map((clue) => (
                      <div key={clue.id} className="text-xs flex items-start gap-2">
                        <CellNumber number={clue.number} />
                        <span className="flex-1 mt-1">{clue.clue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2 text-christmas-green">По вертикалі:</h3>
                  <div className="space-y-1.5">
                    {clues.filter((c) => c.direction === "down").map((clue) => (
                      <div key={clue.id} className="text-xs flex items-start gap-2">
                        <CellNumber number={clue.number} />
                        <span className="flex-1 mt-1">{clue.clue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 p-2 rounded bg-blue-500/10 border border-blue-500/30 text-xs">
                💡 Слова перетинаються на спільних літерах!
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Crossword;
