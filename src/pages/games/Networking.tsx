import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, X, Trophy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Яка маска підмережі відповідає /24 у CIDR нотації?",
    options: ["255.255.0.0", "255.255.255.0", "255.255.255.255", "255.0.0.0"],
    correctAnswer: 1,
    category: "IP адресація",
    explanation: "/24 означає 24 біти для мережі, що дає маску 255.255.255.0"
  },
  {
    id: 2,
    question: "Який протокол використовується для автоматичного отримання IP-адреси?",
    options: ["DNS", "DHCP", "ARP", "ICMP"],
    correctAnswer: 1,
    category: "Протоколи",
    explanation: "DHCP (Dynamic Host Configuration Protocol) автоматично призначає IP-адреси"
  },
  {
    id: 3,
    question: "Скільки адрес можна використати в підмережі /30?",
    options: ["2", "4", "6", "8"],
    correctAnswer: 0,
    category: "Підмережі",
    explanation: "/30 дає 4 адреси, але 2 зарезервовані (мережа і broadcast), залишається 2"
  },
  {
    id: 4,
    question: "Який порт використовує протокол HTTPS?",
    options: ["80", "443", "8080", "22"],
    correctAnswer: 1,
    category: "Порти",
    explanation: "HTTPS використовує порт 443 для захищеного HTTP трафіку"
  },
  {
    id: 5,
    question: "Що означає TTL у TCP/IP пакеті?",
    options: ["Total Transfer Length", "Time To Live", "Transfer Time Limit", "Transmission Type Level"],
    correctAnswer: 1,
    category: "TCP/IP",
    explanation: "TTL (Time To Live) визначає максимальну кількість переходів між роутерами"
  },
  {
    id: 6,
    question: "Який протокол працює на рівні 3 моделі OSI?",
    options: ["TCP", "HTTP", "IP", "Ethernet"],
    correctAnswer: 2,
    category: "OSI Model",
    explanation: "IP (Internet Protocol) працює на мережевому рівні (Layer 3)"
  },
  {
    id: 7,
    question: "Що робить команда 'ping'?",
    options: [
      "Перевіряє доступність хоста через ICMP",
      "Встановлює TCP з'єднання",
      "Показує маршрут до хоста",
      "Резолвить DNS ім'я"
    ],
    correctAnswer: 0,
    category: "Діагностика",
    explanation: "ping використовує ICMP для перевірки доступності хоста в мережі"
  }
];

const Networking = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(false);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    setUserAnswers({ ...userAnswers, [currentQuestion]: selectedAnswer });
    setShowExplanation(true);

    // Почекати трохи перед переходом до наступного питання
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(userAnswers[currentQuestion + 1] ?? null);
        setShowExplanation(false);
      } else {
        calculateScore();
      }
    }, 2000);
  };

  const handlePrevious = () => {
    setUserAnswers({ ...userAnswers, [currentQuestion]: selectedAnswer ?? -1 });
    setCurrentQuestion(currentQuestion - 1);
    setSelectedAnswer(userAnswers[currentQuestion - 1] ?? null);
    setShowExplanation(false);
  };

  const calculateScore = async () => {
  const allAnswers = { ...userAnswers, [currentQuestion]: selectedAnswer ?? -1 };
  let correct = 0;

  questions.forEach((q, index) => {
    if (allAnswers[index] === q.correctAnswer) {
      correct++;
    }
  });

  const percentage = Math.round((correct / questions.length) * 100);
  setScore(percentage);
  setShowResults(true);

  // Зберегти в Supabase
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase
        .from('game_progress')
        .update({
          completed: true,
          score: percentage,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('game_number', 5);

      // Розблокувати Гру 6 якщо score >= 60
      if (percentage >= 60) {
        await supabase
          .from('game_progress')
          .update({ unlocked: true })
          .eq('user_id', user.id)
          .eq('game_number', 6);

        toast({
          title: "🎉 Вітаємо!",
          description: `Ви набрали ${percentage} балів! Фінальний сюрприз розблоковано!`,
        });
      } else {
        toast({
          title: "😔 Майже!",
          description: `Ви набрали ${percentage} балів. Потрібно мінімум 60.`,
          variant: "destructive",
        });
      }
    }
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
    setShowExplanation(false);
  };

  if (showResults) {
    const correctCount = questions.reduce((acc, q, index) => {
      return acc + (userAnswers[index] === q.correctAnswer ? 1 : 0);
    }, 0);

    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <Snowflakes />
        <Garland />
        <Header />

        <main className="pt-36 pb-16 px-4 relative z-10">
          <div className="container mx-auto max-w-4xl">
            <div className="glass-card p-8 rounded-3xl text-center">
              <Trophy className="w-24 h-24 mx-auto mb-6 text-christmas-gold" />

              <h1 className="text-4xl font-bold mb-4">Networking Quiz завершено! 🎉</h1>

              <div className="text-6xl font-bold mb-6 bg-gradient-to-r from-christmas-red to-christmas-gold bg-clip-text text-transparent">
                {score}/100
              </div>

              <p className="text-xl mb-2">
                Правильних відповідей: {correctCount} з {questions.length}
              </p>

              {score >= 60 ? (
                <p className="text-lg text-green-500 mb-8">
                  ✅ Фінальний сюрприз розблоковано!
                </p>
              ) : (
                <p className="text-lg text-yellow-500 mb-8">
                  ⚠️ Потрібно мінімум 60 балів для розблокування фінального сюрпризу
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

              {/* Detailed results */}
              <div className="mt-12 text-left">
                <h2 className="text-2xl font-bold mb-6 text-center">Детальні результати:</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {questions.map((q, qIndex) => {
                    const userAnswer = userAnswers[qIndex];
                    const isCorrect = userAnswer === q.correctAnswer;

                    return (
                      <div
                        key={q.id}
                        className={cn(
                          "p-4 rounded-xl border-2",
                          isCorrect
                            ? "border-green-500 bg-green-500/10"
                            : "border-red-500 bg-red-500/10"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {isCorrect ? (
                            <Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                          ) : (
                            <X className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold mb-2">
                              {qIndex + 1}. {q.question}
                            </p>
                            <p className="text-sm text-muted-foreground mb-1">
                              <span className="font-semibold text-green-500">Правильна відповідь:</span>{" "}
                              {q.options[q.correctAnswer]}
                            </p>
                            {!isCorrect && userAnswer !== undefined && (
                              <p className="text-sm text-red-500 mb-1">
                                <span className="font-semibold">Ваша відповідь:</span>{" "}
                                {q.options[userAnswer]}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground italic mt-2">
                              💡 {q.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
        <div className="container mx-auto max-w-3xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span>
                Питання {currentQuestion + 1} з {questions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-christmas-red to-christmas-gold transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="glass-card p-8 rounded-3xl mb-6">
            <div className="mb-4">
              <span className="text-sm px-3 py-1 rounded-full bg-christmas-red/20 text-christmas-red">
                {question.category}
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-6">{question.question}</h2>

            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correctAnswer;
                const showCorrectness = showExplanation;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all border-2",
                      isSelected && !showCorrectness && "border-christmas-gold bg-christmas-gold/20",
                      !isSelected && !showCorrectness && "border-white/10 hover:border-white/30 bg-white/5",
                      showCorrectness && isCorrect && "border-green-500 bg-green-500/20",
                      showCorrectness && isSelected && !isCorrect && "border-red-500 bg-red-500/20",
                      showCorrectness && "cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                          isSelected && !showCorrectness && "border-christmas-gold bg-christmas-gold",
                          !isSelected && !showCorrectness && "border-white/30",
                          showCorrectness && isCorrect && "border-green-500 bg-green-500",
                          showCorrectness && isSelected && !isCorrect && "border-red-500 bg-red-500"
                        )}
                      >
                        {showCorrectness && isCorrect && <Check className="h-4 w-4 text-white" />}
                        {showCorrectness && isSelected && !isCorrect && (
                          <X className="h-4 w-4 text-white" />
                        )}
                        {isSelected && !showCorrectness && <Check className="h-4 w-4 text-white" />}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border-2 border-blue-500">
                <p className="text-sm">
                  <span className="font-semibold">💡 Пояснення:</span> {question.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>

            <Button onClick={() => navigate("/games")} variant="ghost">
              До ігор
            </Button>

            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null || showExplanation}
              className="bg-gradient-to-r from-christmas-red to-christmas-gold hover:opacity-90"
            >
              {currentQuestion === questions.length - 1 ? "Завершити" : "Далі"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Networking;
