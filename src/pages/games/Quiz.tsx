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
  correctAnswers: number[];
  type: "single" | "multiple";
  category: string;
}

const questions: Question[] = [
  // Мережі (10 питань)
  {
    id: 1,
    question: "Який протокол використовує порт 443 за замовчуванням?",
    options: ["HTTP", "HTTPS", "FTP", "SSH"],
    correctAnswers: [1],
    type: "single",
    category: "Мережі",
  },
  {
    id: 2,
    question: "Що таке DNS?",
    options: [
      "Domain Name System",
      "Data Network Service",
      "Digital Naming Server",
      "Dynamic Node System"
    ],
    correctAnswers: [0],
    type: "single",
    category: "Мережі",
  },
  {
    id: 3,
    question: "Який порт використовує SSH за замовчуванням?",
    options: ["21", "22", "23", "25"],
    correctAnswers: [1],
    type: "single",
    category: "Мережі",
  },
  {
    id: 4,
    question: "Які протоколи працюють на транспортному рівні OSI?",
    options: ["TCP", "UDP", "IP", "HTTP", "ICMP", "FTP"],
    correctAnswers: [0, 1],
    type: "multiple",
    category: "Мережі",
  },
  {
    id: 5,
    question: "Яка адреса є приватною IPv4?",
    options: ["8.8.8.8", "192.168.1.1", "1.1.1.1", "203.0.113.1"],
    correctAnswers: [1],
    type: "single",
    category: "Мережі",
  },
  {
    id: 6,
    question: "Що таке DHCP?",
    options: [
      "Dynamic Host Configuration Protocol",
      "Data Host Control Protocol",
      "Domain Host Configuration Process",
      "Dynamic HTTP Configuration Protocol"
    ],
    correctAnswers: [0],
    type: "single",
    category: "Мережі",
  },
  {
    id: 7,
    question: "Які типи NAT існують?",
    options: ["Static NAT", "Dynamic NAT", "PAT", "DNS NAT", "HTTP NAT", "Overload"],
    correctAnswers: [0, 1, 2, 5],
    type: "multiple",
    category: "Мережі",
  },
  {
    id: 8,
    question: "Який HTTP метод використовується для оновлення ресурсу?",
    options: ["GET", "POST", "PUT", "DELETE"],
    correctAnswers: [2],
    type: "single",
    category: "Мережі",
  },
  {
    id: 9,
    question: "Що означає CDN?",
    options: [
      "Content Delivery Network",
      "Central Data Network",
      "Cloud Distribution Node",
      "Content Distribution Network"
    ],
    correctAnswers: [0],
    type: "single",
    category: "Мережі",
  },
  {
    id: 10,
    question: "Які з цих є протоколами маршрутизації?",
    options: ["OSPF", "BGP", "DNS", "RIP", "SMTP", "EIGRP"],
    correctAnswers: [0, 1, 3, 5],
    type: "multiple",
    category: "Мережі",
  },

  // Linux/SysAdmin (7 питань)
  {
    id: 11,
    question: "Яка команда в Linux показує поточну директорію?",
    options: ["ls", "pwd", "cd", "mkdir"],
    correctAnswers: [1],
    type: "single",
    category: "Linux",
  },
  {
    id: 12,
    question: "Які команди використовуються для перегляду процесів?",
    options: ["ps", "top", "ls", "htop", "cat", "grep"],
    correctAnswers: [0, 1, 3],
    type: "multiple",
    category: "Linux",
  },
  {
    id: 13,
    question: "Що робить команда 'chmod 755 file'?",
    options: [
      "Встановлює повні права власнику, читання+виконання групі та іншим",
      "Видаляє файл",
      "Змінює власника файлу",
      "Копіює файл"
    ],
    correctAnswers: [0],
    type: "single",
    category: "Linux",
  },
  {
    id: 14,
    question: "Яка команда показує використання диску?",
    options: ["du", "df", "ls", "pwd"],
    correctAnswers: [1],
    type: "single",
    category: "Linux",
  },
  {
    id: 15,
    question: "Які з цих є текстовими редакторами Linux?",
    options: ["vim", "nano", "emacs", "notepad", "gedit", "word"],
    correctAnswers: [0, 1, 2, 4],
    type: "multiple",
    category: "Linux",
  },
  {
    id: 16,
    question: "Що робить команда 'sudo'?",
    options: [
      "Виконує команду з правами суперкористувача",
      "Зупиняє процес",
      "Показує системну інформацію",
      "Змінює пароль"
    ],
    correctAnswers: [0],
    type: "single",
    category: "Linux",
  },
  {
    id: 17,
    question: "Яка команда для пошуку файлів?",
    options: ["find", "search", "locate", "grep"],
    correctAnswers: [0],
    type: "single",
    category: "Linux",
  },

  // DevOps (7 питань)
  {
    id: 18,
    question: "Що означає CI/CD?",
    options: [
      "Continuous Integration/Continuous Delivery",
      "Computer Interface/Cloud Data",
      "Code Inspector/Container Deployment",
      "Central Integration/Continuous Development"
    ],
    correctAnswers: [0],
    type: "single",
    category: "DevOps",
  },
  {
    id: 19,
    question: "Які з цих є системами контролю версій?",
    options: ["Git", "SVN", "Docker", "Mercurial", "Kubernetes", "Bazaar"],
    correctAnswers: [0, 1, 3, 5],
    type: "multiple",
    category: "DevOps",
  },
  {
    id: 20,
    question: "Що таке Docker?",
    options: [
      "Платформа контейнеризації",
      "Система контролю версій",
      "База даних",
      "Мова програмування"
    ],
    correctAnswers: [0],
    type: "single",
    category: "DevOps",
  },
  {
    id: 21,
    question: "Які з цих є інструментами CI/CD?",
    options: ["Jenkins", "GitLab CI", "MySQL", "CircleCI", "MongoDB", "Travis CI"],
    correctAnswers: [0, 1, 3, 5],
    type: "multiple",
    category: "DevOps",
  },
  {
    id: 22,
    question: "Що таке Kubernetes?",
    options: [
      "Система оркестрації контейнерів",
      "База даних",
      "Мова програмування",
      "Текстовий редактор"
    ],
    correctAnswers: [0],
    type: "single",
    category: "DevOps",
  },
  {
    id: 23,
    question: "Які з цих є Infrastructure as Code інструментами?",
    options: ["Terraform", "Ansible", "Photoshop", "Puppet", "Excel", "Chef"],
    correctAnswers: [0, 1, 3, 5],
    type: "multiple",
    category: "DevOps",
  },
  {
    id: 24,
    question: "Що таке Blue-Green Deployment?",
    options: [
      "Стратегія deployment з двома ідентичними середовищами",
      "Колірна схема інтерфейсу",
      "Тип бази даних",
      "Мова програмування"
    ],
    correctAnswers: [0],
    type: "single",
    category: "DevOps",
  },

  // Програмування (6 питань)
  {
    id: 25,
    question: "Які з цих є JavaScript фреймворками?",
    options: ["React", "Django", "Vue.js", "Angular", "Flask", "Svelte"],
    correctAnswers: [0, 2, 3, 5],
    type: "multiple",
    category: "Програмування",
  },
  {
    id: 26,
    question: "Що таке API?",
    options: [
      "Application Programming Interface",
      "Advanced Program Integration",
      "Automated Process Interface",
      "Application Process Integration"
    ],
    correctAnswers: [0],
    type: "single",
    category: "Програмування",
  },
  {
    id: 27,
    question: "Які мови є статично типізованими?",
    options: ["Java", "Python", "C++", "JavaScript", "TypeScript", "Ruby"],
    correctAnswers: [0, 2, 4],
    type: "multiple",
    category: "Програмування",
  },
  {
    id: 28,
    question: "Що таке REST?",
    options: [
      "Representational State Transfer",
      "Remote Execution Service Tool",
      "Rapid Error Stack Trace",
      "Resource Execution State Transfer"
    ],
    correctAnswers: [0],
    type: "single",
    category: "Програмування",
  },
  {
    id: 29,
    question: "Які з цих є типами баз даних?",
    options: ["SQL", "NoSQL", "HTML", "GraphQL", "Time-series", "XML"],
    correctAnswers: [0, 1, 4],
    type: "multiple",
    category: "Бази даних",
  },
  {
    id: 30,
    question: "Що таке MVC?",
    options: [
      "Model-View-Controller",
      "Multiple Version Control",
      "Main Visual Component",
      "Modern Video Codec"
    ],
    correctAnswers: [0],
    type: "single",
    category: "Програмування",
  },
];

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number[] }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (index: number) => {
    if (question.type === "single") {
      setSelectedAnswers([index]);
    } else {
      if (selectedAnswers.includes(index)) {
        setSelectedAnswers(selectedAnswers.filter(i => i !== index));
      } else {
        setSelectedAnswers([...selectedAnswers, index]);
      }
    }
  };

  const handleNext = () => {
    setUserAnswers({ ...userAnswers, [currentQuestion]: selectedAnswers });
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswers(userAnswers[currentQuestion + 1] || []);
    } else {
      calculateScore();
    }
  };
  
const calculateScore = async () => {
  const allAnswers = { ...userAnswers, [currentQuestion]: selectedAnswers };
  let correct = 0;

  questions.forEach((q, index) => {
    const userAns = allAnswers[index] || [];
    const correctAns = q.correctAnswers;

    if (
      userAns.length === correctAns.length &&
      userAns.every(a => correctAns.includes(a))
    ) {
      correct++;
    }
  });

  const finalScore = Math.round((correct / questions.length) * 100);
  setScore(finalScore);
  setShowResults(true);

  // Зберегти в Supabase
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Оновити прогрес Гри 1
      await supabase
        .from('game_progress')
        .update({
          completed: true,
          score: finalScore,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('game_number', 1);

      // Розблокувати Гру 2 якщо score >= 70
      if (finalScore >= 70) {
        await supabase
          .from('game_progress')
          .update({ unlocked: true })
          .eq('user_id', user.id)
          .eq('game_number', 2);

        toast({
          title: "🎉 Вітаємо!",
          description: `Ви набрали ${finalScore} балів! Технічний кросворд розблоковано!`,
        });
      } else {
        toast({
          title: "😔 Майже!",
          description: `Ви набрали ${finalScore} балів. Потрібно мінімум 70.`,
          variant: "destructive",
        });
      }
    }
  } catch (error) {
    console.error('Error saving progress:', error);
    toast({
      title: "⚠️ Помилка збереження",
      description: "Увійдіть в акаунт щоб зберігати прогрес",
      variant: "destructive",
    });
  }
};
  
  const handlePrevious = () => {
    setUserAnswers({ ...userAnswers, [currentQuestion]: selectedAnswers });
    setCurrentQuestion(currentQuestion - 1);
    setSelectedAnswers(userAnswers[currentQuestion - 1] || []);
  };
;

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const isAnswerCorrect = (questionIndex: number, answerIndex: number) => {
    return questions[questionIndex].correctAnswers.includes(answerIndex);
  };

  if (showResults) {
    const correctCount = questions.reduce((acc, q, index) => {
      const userAns = userAnswers[index] || [];
      const correctAns = q.correctAnswers;
      if (
        userAns.length === correctAns.length &&
        userAns.every(a => correctAns.includes(a))
      ) {
        return acc + 1;
      }
      return acc;
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
              
              <h1 className="text-4xl font-bold mb-4">
                Вітаємо! Вікторину завершено! 🎉
              </h1>
              
              <div className="text-6xl font-bold mb-6 bg-gradient-to-r from-christmas-red to-christmas-gold bg-clip-text text-transparent">
                {score}/100
              </div>

              <p className="text-xl mb-2">
                Правильних відповідей: {correctCount} з {questions.length}
              </p>

              {score >= 70 ? (
                <p className="text-lg text-green-500 mb-8">
                  ✅ Технічний кросворд розблоковано!
                </p>
              ) : (
                <p className="text-lg text-yellow-500 mb-8">
                  ⚠️ Потрібно мінімум 70 балів для розблокування наступної гри
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
                <Button
                  onClick={() => navigate('/games')}
                  variant="outline"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  До ігор
                </Button>
              </div>

              {/* Detailed results */}
              <div className="mt-12 text-left">
                <h2 className="text-2xl font-bold mb-6 text-center">Детальні результати:</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {questions.map((q, qIndex) => {
                    const userAns = userAnswers[qIndex] || [];
                    const isCorrect =
                      userAns.length === q.correctAnswers.length &&
                      userAns.every(a => q.correctAnswers.includes(a));

                    return (
                      <div
                        key={q.id}
                        className={cn(
                          "p-4 rounded-xl border-2",
                          isCorrect ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"
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
                            <p className="text-sm text-muted-foreground">
                              <span className="font-semibold">Правильна відповідь:</span>{" "}
                              {q.correctAnswers.map(i => q.options[i]).join(", ")}
                            </p>
                            {!isCorrect && userAns.length > 0 && (
                              <p className="text-sm text-red-500 mt-1">
                                <span className="font-semibold">Ваша відповідь:</span>{" "}
                                {userAns.map(i => q.options[i]).join(", ")}
                              </p>
                            )}
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
              <span>Питання {currentQuestion + 1} з {questions.length}</span>
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
              {question.type === "multiple" && (
                <span className="text-sm px-3 py-1 rounded-full bg-christmas-gold/20 text-christmas-gold ml-2">
                  Кілька відповідей
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold mb-6">{question.question}</h2>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={cn(
                    "w-full p-4 rounded-xl text-left transition-all border-2",
                    selectedAnswers.includes(index)
                      ? "border-christmas-gold bg-christmas-gold/20"
                      : "border-white/10 hover:border-white/30 bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                        selectedAnswers.includes(index)
                          ? "border-christmas-gold bg-christmas-gold"
                          : "border-white/30"
                      )}
                    >
                      {selectedAnswers.includes(index) && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
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

            <Button
              onClick={() => navigate('/games')}
              variant="ghost"
            >
              До ігор
            </Button>

            <Button
              onClick={handleNext}
              disabled={selectedAnswers.length === 0}
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

export default Quiz;
