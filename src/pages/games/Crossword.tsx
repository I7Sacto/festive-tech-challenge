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

interface Word {
  id: number;
  number: number;
  word: string;
  clue: string;
  direction: "across" | "down";
  row: number;
  col: number;
}

// ПРОСТИЙ кросворд - слова вручну розміщені з перетинами
const CROSSWORD_WORDS: Word[] = [
  { id: 1, number: 1, word: "GIT", clue: "Система версій", direction: "across", row: 0, col: 0 },
  { id: 2, number: 2, word: "CODE", clue: "Програмний ___", direction: "down", row: 0, col: 0 },
  { id: 3, number: 3, word: "TEST", clue: "Перевірка", direction: "down", row: 0, col: 2 },
  { id: 4, number: 4, word: "API", clue: "Інтерфейс", direction: "across", row: 2, col: 1 },
  { id: 5, number: 5, word: "SQL", clue: "Мова запитів", direction: "down", row: 2, col: 3 },
];

const Crossword = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleLetterInput = (wordId: number, letterIndex: number, letter: string) => {
    const word = CROSSWORD_WORDS.find(w => w.id === wordId);
    if (!word) return;

    const currentAnswer = answers[wordId] || "";
    const newAnswer = currentAnswer.substring(0, letterIndex) + letter.toUpperCase() + currentAnswer.substring(letterIndex + 1);
    
    setAnswers({
      ...answers,
      [wordId]: newAnswer.padEnd(word.word.length, " ")
    });
  };

  const handleCheck = async () => {
    let correct = 0;
    let total = 0;

    CROSSWORD_WORDS.forEach(word => {
      const userAnswer = (answers[word.id] || "").trim();
      total += word.word.length;
      
      for (let i = 0; i < word.word.length; i++) {
        if (userAnswer[i] === word.word[i]) {
          correct++;
        }
      }
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
            description: `${percentage}%! DevOps пазл розблоковано!`,
          });
        } else {
          toast({
            title: "Майже!",
            description: `${percentage}%. Потрібно 80%.`,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
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
              <div className="text-6xl font-bold mb-6 bg-gradient-to-r from-christmas-red to-christmas-gold bg-clip-text text-transparent">
                {score}%
              </div>
              {score >= 80 ? (
                <p className="text-lg text-green-500 mb-8">✅ DevOps пазл розблоковано!</p>
              ) : (
                <p className="text-lg text-yellow-500 mb-8">⚠️ Потрібно 80%</p>
              )}
              <div className="flex gap-4 justify-center">
                <Button onClick={() => {setShowResults(false); setAnswers({}); setScore(0);}} className="bg-christmas-red">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Знову
                </Button>
                <Button onClick={() => navigate("/games")} variant="outline">
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
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-christmas-red to-christmas-gold bg-clip-text text-transparent">
              📝 Технічний кросворд
            </h1>
            <p className="text-sm text-muted-foreground">Заповніть мінімум 80%</p>
          </div>

          <div className="glass-card p-6 rounded-3xl">
            <div className="space-y-6">
              {CROSSWORD_WORDS.map((word) => (
                <div key={word.id} className="border-b border-white/10 pb-4 last:border-0">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="inline-block bg-christmas-gold text-black font-black text-sm px-3 py-1.5 rounded">
                      {word.number}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold mb-1">
                        {word.clue} ({word.word.length} літ.)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {word.direction === "across" ? "→ Горизонталь" : "↓ Вертикаль"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-center">
                    {word.word.split("").map((_, letterIndex) => (
                      <input
                        key={letterIndex}
                        type="text"
                        maxLength={1}
                        value={(answers[word.id] || "")[letterIndex] || ""}
                        onChange={(e) => handleLetterInput(word.id, letterIndex, e.target.value)}
                        className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold bg-white/10 border-2 border-white/30 rounded-lg focus:border-christmas-gold focus:ring-2 focus:ring-christmas-gold uppercase"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="characters"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3 justify-center">
              <Button onClick={handleCheck} className="bg-gradient-to-r from-christmas-red to-christmas-gold">
                <Check className="mr-2 h-4 w-4" />
                Перевірити
              </Button>
              <Button onClick={() => navigate("/games")} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                До ігор
              </Button>
            </div>

            <div className="mt-4 p-3 rounded bg-blue-500/10 border border-blue-500/30 text-xs text-center">
              💡 Введіть відповіді в поля. Кожна відповідь окремо.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Crossword;
