import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Trophy, RefreshCw, HelpCircle, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CrosswordCell {
  letter: string;
  userLetter: string;
  number?: number;
  isBlack: boolean;
  wordId?: number[];
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
  { id: 1, number: 1, clue: "Система контролю версій", answer: "GIT", direction: "across", startRow: 0, startCol: 0 },
  { id: 2, number: 2, clue: "Continuous ___", answer: "DELIVERY", direction: "across", startRow: 0, startCol: 4 },
  { id: 3, number: 3, clue: "Контейнери", answer: "DOCKER", direction: "down", startRow: 0, startCol: 0 },
  { id: 4, number: 4, clue: "Протокол веб", answer: "HTTP", direction: "across", startRow: 2, startCol: 1 },
  { id: 5, number: 5, clue: "Domain Name ___", answer: "SYSTEM", direction: "down", startRow: 1, startCol: 5 },
  { id: 6, number: 6, clue: "SQL - Query ___", answer: "LANGUAGE", direction: "across", startRow: 4, startCol: 0 },
  { id: 7, number: 7, clue: "K8s повна назва", answer: "KUBERNETES", direction: "down", startRow: 2, startCol: 7 },
  { id: 8, number: 8, clue: "IaC від HashiCorp", answer: "TERRAFORM", direction: "across", startRow: 6, startCol: 2 },
  { id: 9, number: 9, clue: "Протокол файлів", answer: "FTP", direction: "across", startRow: 8, startCol: 0 },
  { id: 10, number: 10, clue: "API - Programming ___", answer: "INTERFACE", direction: "down", startRow: 4, startCol: 3 },
];

const Crossword = () => {
  const navigate = useNavigate();
  const [grid, setGrid] = useState<CrosswordCell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initializeGrid();
  }, []);

  // Автоматично фокусувати input при виборі клітинки
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
            wordId: [],
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
            wordId: [...(newGrid[row][col].wordId || []), clue.id],
          };
        }
      });
    });

    setGrid(newGrid);
  };

  const handleCellClick = (row: number, col: number) => {
    if (!grid[row][col].isBlack) {
      setSelectedCell({ row, col });
      setShowKeyboard(true);
    }
  };

  const handleLetterInput = (letter: string) => {
    if (!selectedCell) return;

    const upperLetter = letter.toUpperCase();
    if (/[A-ZА-ЯІЇЄ]/.test(upperLetter)) {
      const newGrid = [...grid];
      newGrid[selectedCell.row][selectedCell.col].userLetter = upperLetter;
      setGrid(newGrid);
      moveToNextCell();
    }
  };

  const handleBackspace = () => {
    if (!selectedCell) return;
    
    const newGrid = [...grid];
    newGrid[selectedCell.row][selectedCell.col].userLetter = "";
    setGrid(newGrid);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    const key = e.key.toUpperCase();
    
    if (key.length === 1 && /[A-ZА-ЯІЇЄ]/.test(key)) {
      handleLetterInput(key);
    } else if (key === "BACKSPACE") {
      handleBackspace();
    } else if (key === "ARROWUP" || key === "ARROWDOWN" || key === "ARROWLEFT" || key === "ARROWRIGHT") {
      moveSelection(key);
      e.preventDefault();
    }
  };

  const moveToNextCell = () => {
    if (!selectedCell) return;
    
    let nextCol = selectedCell.col + 1;
    let nextRow = selectedCell.row;

    while (nextRow < grid.length) {
      while (nextCol < grid[0].length) {
        if (!grid[nextRow][nextCol].isBlack && grid[nextRow][nextCol].userLetter === "") {
          setSelectedCell({ row: nextRow, col: nextCol });
          return;
        }
        nextCol++;
      }
      nextCol = 0;
      nextRow++;
    }
  };

  const moveSelection = (direction: string) => {
    if (!selectedCell) return;

    let newRow = selectedCell.row;
    let newCol = selectedCell.col;

    switch (direction) {
      case "ARROWUP":
        newRow = Math.max(0, newRow - 1);
        break;
      case "ARROWDOWN":
        newRow = Math.min(grid.length - 1, newRow + 1);
        break;
      case "ARROWLEFT":
        newCol = Math.max(0, newCol - 1);
        break;
      case "ARROWRIGHT":
        newCol = Math.min(grid[0].length - 1, newCol + 1);
        break;
    }

    if (!grid[newRow][newCol].isBlack) {
      setSelectedCell({ row: newRow, col: newCol });
    }
  };

  const handleCheck = () => {
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

    const gameProgress = JSON.parse(localStorage.getItem("gameProgress") || "{}");
    gameProgress[2] = {
      completed: true,
      score: percentage,
      unlocked: true,
    };

    if (percentage >= 80) {
      gameProgress[3] = {
        ...gameProgress[3],
        unlocked: true,
      };

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

    localStorage.setItem("gameProgress", JSON.stringify(gameProgress));
  };

  const handleRestart = () => {
    initializeGrid();
    setShowResults(false);
    setScore(0);
    setSelectedCell(null);
  };

  const handleShowHint = () => {
    if (!selectedCell) {
      toast({
        title: "Виберіть клітинку",
        description: "Натисніть на клітинку кросворду",
      });
      return;
    }

    const newGrid = [...grid];
    newGrid[selectedCell.row][selectedCell.col].userLetter =
      grid[selectedCell.row][selectedCell.col].letter;
    setGrid(newGrid);

    toast({
      title: "💡 Підказка",
      description: "Літера відкрита!",
    });
  };

  // Virtual keyboard letters
  const keyboardLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

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
                <p className="text-lg text-yellow-500 mb-8">
                  ⚠️ Потрібно мінімум 80%
                </p>
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
    <div className="min-h-screen bg-background relative overflow-hidden pb-32">
      <Snowflakes />
      <Garland />
      <Header />

      {/* Hidden input for mobile keyboard */}
      <input
        ref={inputRef}
        type="text"
        className="fixed opacity-0 pointer-events-none"
        onKeyDown={handleKeyPress}
        onChange={(e) => {
          if (e.target.value) {
            handleLetterInput(e.target.value.slice(-1));
            e.target.value = "";
          }
        }}
      />

      <main className="pt-36 pb-4 px-2 sm:px-4 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent">
              📝 Технічний кросворд
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Заповніть мінімум 80%
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr,350px] gap-4 lg:gap-6">
            {/* Crossword Grid */}
            <div className="glass-card p-3 md:p-6 rounded-3xl">
              <div className="mb-3 flex gap-2 justify-between items-center flex-wrap">
                <div className="text-xs md:text-sm text-muted-foreground">
                  {selectedCell ? "Обрано клітинку" : "Натисніть на клітинку"}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleShowHint}>
                    <HelpCircle className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                    <span className="hidden md:inline">Підказка</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowKeyboard(!showKeyboard)}
                    className="lg:hidden"
                  >
                    <Keyboard className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>
              </div>

              {/* Responsive grid wrapper */}
              <div className="overflow-x-auto overflow-y-auto max-h-[500px] md:max-h-[600px]">
                <div className="inline-block min-w-full">
                  {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex">
                      {row.map((cell, colIndex) => (
                        <div
                          key={colIndex}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                          className={cn(
                            "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border border-white/20 relative flex items-center justify-center cursor-pointer font-bold text-sm md:text-lg transition-all flex-shrink-0",
                            cell.isBlack && "bg-gray-800",
                            !cell.isBlack && "bg-white/5 hover:bg-white/10 active:bg-white/20",
                            selectedCell?.row === rowIndex &&
                              selectedCell?.col === colIndex &&
                              "bg-christmas-gold/30 ring-2 ring-christmas-gold scale-110"
                          )}
                        >
                          {cell.number && (
                            <span className="absolute top-0.5 left-0.5 text-[8px] md:text-[10px] text-christmas-gold font-normal">
                              {cell.number}
                            </span>
                          )}
                          {cell.userLetter && (
                            <span className="text-white">{cell.userLetter}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop action buttons */}
              <div className="mt-4 hidden lg:flex gap-4">
                <Button
                  onClick={handleCheck}
                  className="bg-gradient-to-r from-christmas-red to-christmas-gold hover:opacity-90"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Перевірити
                </Button>
                <Button onClick={() => navigate("/games")} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  До ігор
                </Button>
              </div>
            </div>

            {/* Clues - Desktop */}
            <div className="hidden lg:block glass-card p-6 rounded-3xl max-h-[600px] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Підказки</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold mb-2 text-christmas-red">
                    По горизонталі:
                  </h3>
                  <div className="space-y-1">
                    {clues
                      .filter((c) => c.direction === "across")
                      .map((clue) => (
                        <div key={clue.id} className="text-xs">
                          <span className="font-bold text-christmas-gold">{clue.number}.</span>{" "}
                          {clue.clue}
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold mb-2 text-christmas-green">
                    По вертикалі:
                  </h3>
                  <div className="space-y-1">
                    {clues
                      .filter((c) => c.direction === "down")
                      .map((clue) => (
                        <div key={clue.id} className="text-xs">
                          <span className="font-bold text-christmas-gold">{clue.number}.</span>{" "}
                          {clue.clue}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Clues */}
          <div className="lg:hidden mt-4 glass-card p-4 rounded-3xl max-h-[300px] overflow-y-auto">
            <h2 className="text-lg font-bold mb-3">Підказки</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-christmas-red">
                  По горизонталі:
                </h3>
                <div className="space-y-1">
                  {clues
                    .filter((c) => c.direction === "across")
                    .map((clue) => (
                      <div key={clue.id} className="text-xs">
                        <span className="font-bold text-christmas-gold">{clue.number}.</span>{" "}
                        {clue.clue}
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2 text-christmas-green">
                  По вертикалі:
                </h3>
                <div className="space-y-1">
                  {clues
                    .filter((c) => c.direction === "down")
                    .map((clue) => (
                      <div key={clue.id} className="text-xs">
                        <span className="font-bold text-christmas-gold">{clue.number}.</span>{" "}
                        {clue.clue}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile action buttons */}
          <div className="lg:hidden mt-4 flex gap-3 px-2">
            <Button
              onClick={handleCheck}
              className="flex-1 bg-gradient-to-r from-christmas-red to-christmas-gold hover:opacity-90"
            >
              <Check className="mr-2 h-4 w-4" />
              Перевірити
            </Button>
            <Button onClick={() => navigate("/games")} variant="outline">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Virtual Keyboard for Mobile */}
          {showKeyboard && (
            <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg p-4 border-t border-white/20 z-50 lg:hidden">
              <div className="container mx-auto max-w-2xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-muted-foreground">
                    {selectedCell && `Клітинка: ${selectedCell.row + 1}, ${selectedCell.col + 1}`}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowKeyboard(false)}
                  >
                    Закрити
                  </Button>
                </div>
                
                <div className="grid grid-cols-9 gap-1 mb-2">
                  {keyboardLetters.slice(0, 18).map((letter) => (
                    <button
                      key={letter}
                      onClick={() => handleLetterInput(letter)}
                      className="bg-white/10 hover:bg-white/20 active:bg-christmas-gold/50 p-3 rounded-lg text-sm font-semibold transition-colors"
                    >
                      {letter}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-9 gap-1 mb-2">
                  {keyboardLetters.slice(18).map((letter) => (
                    <button
                      key={letter}
                      onClick={() => handleLetterInput(letter)}
                      className="bg-white/10 hover:bg-white/20 active:bg-christmas-gold/50 p-3 rounded-lg text-sm font-semibold transition-colors"
                    >
                      {letter}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={handleBackspace}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/50 p-3 rounded-lg text-sm font-semibold transition-colors"
                  >
                    ⌫ Видалити
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Crossword;
