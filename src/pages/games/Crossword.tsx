import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Trophy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface Word {
  number: number;
  clue: string;
  answer: string;
  direction: string;
}

const WORDS: Word[] = [
  { number: 1, clue: "Платформа контейнеризації", answer: "DOCKER", direction: "→" },
  { number: 2, clue: "Система оркестрації контейнерів", answer: "KUBERNETES", direction: "→" },
  { number: 3, clue: "Infrastructure as Code від HashiCorp", answer: "TERRAFORM", direction: "→" },
  { number: 4, clue: "Continuous Integration/Continuous Delivery", answer: "CICD", direction: "→" },
  { number: 5, clue: "Мова програмування Google", answer: "GO", direction: "↓" },
  { number: 6, clue: "Платформа для спільної роботи розробників", answer: "GITHUB", direction: "↓" },
  { number: 7, clue: "Structured Query Language", answer: "SQL", direction: "↓" },
  { number: 8, clue: "Протокол передачі гіпертексту", answer: "HTTP", direction: "↓" },
  { number: 9, clue: "JavaScript Object Notation", answer: "JSON", direction: "↓" },
  { number: 10, clue: "Application Programming Interface", answer: "API", direction: "↓" },
];

const Crossword = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleLetterChange = (wordNum: number, letterIndex: number, value: string) => {
    const word = WORDS.find(w => w.number === wordNum);
    if (!word) return;

    const currentAnswer = answers[wordNum] || "";
    const letter = value.toUpperCase().slice(-1);
    
    if (/[A-Z]/.test(letter) || value === "") {
      const newAnswer = currentAnswer.split("");
      while (newAnswer.length < word.answer.length) newAnswer.push("");
      newAnswer[letterIndex] = letter;
      
      setAnswers({
        ...answers,
        [wordNum]: newAnswer.join("")
      });

      // Автофокус на наступне поле
      if (letter && letterIndex < word.answer.length - 1) {
        const nextInput = document.getElementById(`word-${wordNum}-letter-${letterIndex + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleCheck = async () => {
    let correct = 0;
    let total = 0;

    WORDS.forEach(word => {
      const userAnswer = (answers[word.number] || "").toUpperCase();
      total += word.answer.length;
      
      for (let i = 0; i < word.answer.length; i++) {
        if (userAnswer[i] === word.answer[i]) correct++;
      }
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
              <h1 className="text-4xl font-bold mb-4">Кросворд завершено! 🎉</h1>
              <div className="text-6xl font-bold mb-6 bg-gradient-to-r from-christmas-red to-christmas-gold bg-clip-text text-transparent">{score}%</div>
              {score >= 80 ? <p className="text-lg text-green-500 mb-8">✅ DevOps пазл розблоковано!</p> : <p className="text-lg text-yellow-500 mb-8">⚠️ Потрібно 80%</p>}
              <div className="flex gap-4 justify-center flex-wrap">
                <Button onClick={() => {setShowResults(false); setAnswers({}); setScore(0);}} className="bg-christmas-red"><RefreshCw className="mr-2 h-4 w-4" />Пройти знову</Button>
                <Button onClick={() => navigate("/games")} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />До ігор</Button>
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

      <main className="pt-36 pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent">
              📝 Технічний кросворд
            </h1>
            <p className="text-sm text-muted-foreground">Відгадайте всі слова. Мінімум 80%</p>
          </div>

          <div className="glass-card p-6 md:p-8 rounded-3xl">
            <div className="space-y-5">
              {WORDS.map((word) => (
                <div key={word.number} className="border-b border-white/10 pb-5 last:border-0">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="inline-block bg-christmas-gold text-black font-black text-base px-3 py-2 rounded shadow-lg min-w-[36px] text-center">
                      {word.number}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm md:text-base">{word.clue}</p>
                        <span className="text-lg">{word.direction}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{word.answer.length} літер</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {word.answer.split("").map((_, letterIndex) => (
                      <input
                        key={letterIndex}
                        id={`word-${word.number}-letter-${letterIndex}`}
                        type="text"
                        maxLength={1}
                        value={(answers[word.number] || "")[letterIndex] || ""}
                        onChange={(e) => handleLetterChange(word.number, letterIndex, e.target.value)}
                        className="w-11 h-11 sm:w-13 sm:h-13 text-center text-xl font-bold bg-white/10 border-2 border-white/30 rounded-lg focus:border-christmas-gold focus:ring-2 focus:ring-christmas-gold uppercase"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="characters"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3 justify-center flex-wrap">
              <Button onClick={handleCheck} className="bg-gradient-to-r from-christmas-red to-christmas-gold hover:opacity-90">
                <Check className="mr-2 h-4 w-4" />
                Перевірити відповіді
              </Button>
              <Button onClick={() => navigate("/games")} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                До ігор
              </Button>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30">
              <p className="text-xs text-center">
                💡 10 технічних термінів. Введіть відповіді в поля. Всі цифри видимі!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Crossword;
