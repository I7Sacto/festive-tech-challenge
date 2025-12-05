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
  numbers: number[];
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

// Кросворд 12x12 з довгими словами та перетинами
const clues: Clue[] = [
  // Горизонталь
  { id: 1, number: 1, clue: "Платформа контейнеризації", answer: "DOCKER", direction: "across", startRow: 0, startCol: 0 },
  { id: 2, number: 3, clue: "Система оркестрації контейнерів", answer: "KUBERNETES", direction: "across", startRow: 2, startCol: 0 },
  { id: 3, number: 7, clue: "Infrastructure as Code від HashiCorp", answer: "TERRAFORM", direction: "across", startRow: 6, startCol: 2 },
  { id: 4, number: 9, clue: "Continuous Integration/Deployment", answer: "CICD", direction: "across", startRow: 10, startCol: 0 },
  
  // Вертикаль (ПЕРЕТИНИ!)
  { id: 5, number: 2, clue: "Платформа для спільної роботи", answer: "GITHUB", direction: "down", startRow: 0, startCol: 3 },
  { id: 6, number: 4, clue: "Мова запитів до БД", answer: "SQL", direction: "down", startRow: 2, startCol: 5 },
  { id: 7, number: 5, clue: "JavaScript об'єкт", answer: "JSON", direction: "down", startRow: 2, startCol: 7 },
  { id: 8, number: 6, clue: "Протокол передачі гіпертексту", answer: "HTTP", direction: "down", startRow: 2, startCol: 9 },
  { id: 9, number: 8, clue: "Програмний інтерфейс", answer: "API", direction: "down", startRow: 6, startCol: 4 },
  { id: 10, number: 10, clue: "Мова програмування", answer: "PYTHON", direction: "down", startRow: 5, startCol: 10 },
];

const CellNumber = ({ numbers }: { numbers: number[] }) => {
  if (!numbers || numbers.length === 0) return null;
  
  return (
    <div className="absolute top-0 left-0 z-50 flex flex-wrap gap-0.5 p-0.5">
      {numbers.map((num) => (
        <span
          key={num}
          className="inline-block bg-white text-black font-black leading-none"
          style={{
            fontSize: num === 1 ? '13px' : '11px',
            padding: '2px 3px',
            borderRadius: '3px',
            boxShadow: num === 1 
              ? '0 0 0 2px #FFD700, 0 2px 4px rgba(0,0,0,0.8)' 
              : '0 1px 2px rgba(0,0,0,0.5)',
            border: num === 1 ? '2px solid #FFD700' : '1px solid #DC143C'
          }}
        >
          {num}
        </span>
      ))}
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
    const gridSize = 12;
    const newGrid: CrosswordCell[][] = Array(gridSize)
      .fill(null)
      .map(() =>
        Array(gridSize).fill(null).map(() => ({
          letter: "",
          userLetter: "",
          numbers: [],
          isBlack: true,
        }))
      );

    clues.forEach((clue) => {
      const letters = clue.answer.split("");
      letters.forEach((letter, index) => {
        const row = clue.direction === "across" ? clue.startRow : clue.startRow + index;
        const col = clue.direction === "across" ? clue.startCol + index : clue.startCol;

        if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
          const cell = newGrid[row][col];
          
          if (cell.isBlack) {
            // Порожня клітинка - створюємо
            newGrid[row][col] = {
              letter: letter,
              userLetter: "",
              numbers: index === 0 ? [clue.number] : [],
              isBlack: false,
            };
          } else {
            // Клітинка вже заповнена - перетин!
            if (cell.letter !== letter) {
              console.error(`❌ Помилка: літери не співпадають на (${row},${col})`);
            }
            // Додаємо номер якщо це початок слова
            if (index === 0 && !cell.numbers.includes(clue.number)) {
              cell.numbers.push(clue.number);
            }
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
        const newGrid = grid.map(row => row.map(cell => ({...cell, numbers: [...cell.numbers]})));
        newGrid[selectedCell.row][selectedCell.col].userLetter = newLetter;
        setGrid(newGrid);
        setInputValue(newLetter);
        
        setTimeout(() => {
          moveToNextCell();
          setInputValue("");
        }, 50);
      }
    } else if (value.length === 0 && selectedCell) {
      const newGrid = grid.map(row => row.map(cell => ({...cell, numbers: [...cell.numbers]})));
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
        await supabase.from("game_progress").update({
          completed: true,
          score: percentage,
          completed_at: new Date().toISOString()
        }).eq("user_id", user.id).eq("game_number", 2);

        if (percentage >= 80) {
          await supabase.from("game_progress").update({ unlocked: true }).eq("user_id", user.id).eq("game_number", 3);
          toast({ title: "🎉 Вітаємо!", description: `${percentage}%! DevOps пазл розблоковано!` });
        } else {
          toast({ title: "😔 Майже!", description: `${percentage}%. Потрібно 80%.`, variant: "destructive" });
        }
      }
    } catch (error) {
      console.error(error);
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
      toast({ title: "Виберіть клітинку" });
      return;
    }
    const newGrid = grid.map(row => row.map(cell => ({...cell, numbers: [...cell.numbers]})));
    newGrid[selectedCell.row][selectedCell.col].userLetter = grid[selectedCell.row][selectedCell.col].letter;
    setGrid(newGrid);
    toast({ title: "💡 Літера відкрита!" });
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
              <h1 className="text-4xl font-bold mb-4">Завершено! 🎉</h1>
              <div className="text-6xl font-bold mb-6 bg-gradient-to-r from-christmas-red to-christmas-gold bg-clip-text text-transparent">{score}%</div>
              {score >= 80 ? <p className="text-lg text-green-500 mb-8">✅ DevOps пазл розблоковано!</p> : <p className="text-lg text-yellow-500 mb-8">⚠️ Потрібно 80%</p>}
              <div className="flex gap-4 justify-center">
                <Button onClick={handleRestart} className="bg-christmas-red"><RefreshCw className="mr-2 h-4 w-4" />Знову</Button>
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
      <Snowflakes />
      <Garland />
      <Header />
      <input ref={inputRef} type="text" value={inputValue} onChange={handleInputChange} className="fixed -top-96 opacity-0 pointer-events-auto" autoComplete="off" autoCorrect="off" autoCapitalize="characters" />

      <main className="pt-36 pb-16 px-2 sm:px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-christmas-red to-christmas-gold bg-clip-text text-transparent">📝 Технічний кросворд</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Мінімум 80%</p>
          </div>

          <div className="grid lg:grid-cols-[1fr,320px] gap-3">
            <div className="glass-card p-3 md:p-4 rounded-3xl">
              <div className="mb-2 flex justify-end">
                <Button size="sm" variant="outline" onClick={handleShowHint}><HelpCircle className="h-3 w-3" /></Button>
              </div>

              <div className="overflow-auto max-h-[520px] pb-2">
                <div className="inline-block min-w-full flex justify-center">
                  <div style={{fontSize: 0}}>
                    {grid.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex" style={{fontSize: '1rem'}}>
                        {row.map((cell, colIndex) => (
                          <div
                            key={`${rowIndex}-${colIndex}`}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                            className={cn(
                              "w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 border relative flex items-center justify-center cursor-pointer transition-all",
                              cell.isBlack && "bg-gray-900 border-gray-800",
                              !cell.isBlack && "bg-white/10 border-white/40 hover:bg-white/20",
                              selectedCell?.row === rowIndex && selectedCell?.col === colIndex && "bg-christmas-gold/60 ring-2 ring-christmas-gold"
                            )}
                          >
                            {cell.numbers.length > 0 && <CellNumber numbers={cell.numbers} />}
                            {cell.userLetter && <span className="text-white text-sm sm:text-base md:text-lg font-bold z-10">{cell.userLetter}</span>}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-2 justify-center">
                <Button onClick={handleCheck} className="bg-gradient-to-r from-christmas-red to-christmas-gold" size="sm">
                  <Check className="mr-2 h-4 w-4" />Перевірити
                </Button>
                <Button onClick={() => navigate("/games")} variant="outline" size="sm">До ігор</Button>
              </div>
            </div>

            <div className="glass-card p-4 rounded-3xl max-h-[520px] overflow-y-auto">
              <h2 className="text-lg font-bold mb-3">Підказки</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-christmas-red">По горизонталі:</h3>
                  <div className="space-y-1.5">
                    {clues.filter(c => c.direction === "across").map(clue => (
                      <div key={clue.id} className="text-xs flex gap-2">
                        <span className="inline-block bg-white text-black font-black px-2 py-1 rounded text-center min-w-[24px]" style={{fontSize: clue.number === 1 ? '12px' : '11px'}}>
                          {clue.number}
                        </span>
                        <span className="flex-1">{clue.clue} ({clue.answer.length})</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-christmas-green">По вертикалі:</h3>
                  <div className="space-y-1.5">
                    {clues.filter(c => c.direction === "down").map(clue => (
                      <div key={clue.id} className="text-xs flex gap-2">
                        <span className="inline-block bg-white text-black font-black px-2 py-1 rounded text-center min-w-[24px]" style={{fontSize: '11px'}}>
                          {clue.number}
                        </span>
                        <span className="flex-1">{clue.clue} ({clue.answer.length})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 p-2 rounded bg-blue-500/10 border border-blue-500/30 text-[10px]">💡 Слова перетинаються!</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Crossword;
