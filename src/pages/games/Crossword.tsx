import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Trophy, RefreshCw, HelpCircle } from "lucide-react";
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

const Crossword = () => {
  const navigate = useNavigate();
  const [grid, setGrid] = useState<CrosswordCell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    initializeGrid();
  }, []);

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

    // Заповнити сітку відповідями
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
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!selectedCell) return;

    const key = e.key.toUpperCase();
    if (key.length === 1 && /[A-ZА-ЯІЇЄ]/.test(key)) {
      const newGrid = [...grid];
      newGrid[selectedCell.row][selectedCell.col].userLetter = key;
      setGrid(newGrid);

      // Перейти до наступної клітинки
      moveToNextCell();
    } else if (key === "BACKSPACE") {
      const newGrid = [...grid];
      newGrid[selectedCell.row][selectedCell.col].userLetter = "";
      setGrid(newGrid);
    } else if (key === "ARROWUP" || key === "ARROWDOWN" || key === "ARROWLEFT" || key === "ARROWRIGHT") {
      moveSelection(key);
    }
  };

  const moveToNextCell = () => {
    if (!selectedCell) return;
    
    let nextCol = selectedCell.col + 1;
    let nextRow = selectedCell.row;

    // Знайти наступну незаповнену клітинку
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

    // Зберегти прогрес
    const gameProgress = JSON.parse(localStorage.getItem("gameProgress") || "{}");
    gameProgress[2] = {
      completed: true,
      score: percentage,
      unlocked: true,
    };

    // Розблокувати наступну гру якщо score >= 80
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
        description: `Ви заповнили ${percentage}%. Потрібно мінімум 80% для розблокування наступної гри.`,
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
        description: "Натисніть на клітинку, щоб отримати підказку",
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
                  ⚠️ Потрібно мінімум 80% для розблокування наступної гри
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowflakes />
      <Garland />
      <Header />

      <main className="pt-36 pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent">
              📝 Технічний кросворд
            </h1>
            <p className="text-muted-foreground">
              Заповніть кросворд ІТ-термінами (мінімум 80% для розблокування наступної гри)
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            {/* Crossword Grid */}
            <div className="glass-card p-6 rounded-3xl">
              <div className="mb-4 flex gap-2 justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Використовуйте клавіатуру або натискайте на клітинки
                </div>
                <Button size="sm" variant="outline" onClick={handleShowHint}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Підказка
                </Button>
              </div>

              <div
                className="inline-block"
                tabIndex={0}
                onKeyDown={handleKeyPress}
                style={{ outline: "none" }}
              >
                {grid.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.map((cell, colIndex) => (
                      <div
                        key={colIndex}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        className={cn(
                          "w-12 h-12 border border-white/20 relative flex items-center justify-center cursor-pointer font-bold text-lg transition-all",
                          cell.isBlack && "bg-gray-800",
                          !cell.isBlack && "bg-white/5 hover:bg-white/10",
                          selectedCell?.row === rowIndex &&
                            selectedCell?.col === colIndex &&
                            "bg-christmas-gold/30 ring-2 ring-christmas-gold"
                        )}
                      >
                        {cell.number && (
                          <span className="absolute top-0.5 left-0.5 text-[10px] text-christmas-gold">
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

              <div className="mt-6 flex gap-4">
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

            {/* Clues */}
            <div className="glass-card p-6 rounded-3xl max-h-[600px] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Підказки</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-christmas-red">
                    По горизонталі:
                  </h3>
                  <div className="space-y-2">
                    {clues
                      .filter((c) => c.direction === "across")
                      .map((clue) => (
                        <div key={clue.id} className="text-sm">
                          <span className="font-bold text-christmas-gold">{clue.number}.</span>{" "}
                          {clue.clue}
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-christmas-green">
                    По вертикалі:
                  </h3>
                  <div className="space-y-2">
                    {clues
                      .filter((c) => c.direction === "down")
                      .map((clue) => (
                        <div key={clue.id} className="text-sm">
                          <span className="font-bold text-christmas-gold">{clue.number}.</span>{" "}
                          {clue.clue}
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
