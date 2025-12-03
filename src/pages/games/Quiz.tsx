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
    question: "Яка команда в Linux показує поточну директорію?",
    options: ["ls", "pwd", "cd", "mkdir"],
    correctAnswers: [1],
    type: "single",
    category: "Linux",
  },
  {
    id: 3,
    question: "Які з цих є системами контролю версій?",
    options: ["Git", "SVN", "Docker", "Mercurial", "Kubernetes", "Bazaar"],
    correctAnswers: [0, 1, 3, 5],
    type: "multiple",
    category: "DevOps",
  },
  {
    id: 4,
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
    id: 5,
    question: "Які з цих є JavaScript фреймворками?",
    options: ["React", "Django", "Vue.js", "Angular", "Flask", "Svelte"],
    correctAnswers: [0, 2, 3, 5],
    type: "multiple",
    category: "Програмування",
  },
  {
    id: 6,
    question: "Який HTTP метод використовується для оновлення ресурсу?",
    options: ["GET", "POST", "PUT", "DELETE"],
    correctAnswers: [2],
    type: "single",
    category: "Web",
  },
  {
    id: 7,
    question: "Які з цих є типами баз даних?",
    options: ["SQL", "NoSQL", "HTML", "GraphQL", "Time-series", "XML"],
    correctAnswers: [0, 1, 4],
    type: "multiple",
    category: "Бази даних",
  },
  {
    id: 8,
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
    id: 9,
    question: "Який порт використовує SSH за замовчуванням?",
    options: ["21", "22", "23", "25"],
    correctAnswers: [1],
    type: "single",
    category: "Мережі",
  },
  {
    id: 10,
    question: "Які з цих є мовами програмування?",
    options: ["Python", "HTML", "JavaScript", "CSS", "TypeScript", "JSON"],
    correctAnswers: [0, 2, 4],
    type: "multiple",
    category: "Програмування",
  },
  {
    id: 11,
    question: "Що означає ORM?",
    options: [
      "Object-Relational Mapping",
      "Online Resource Manager",
      "Operational Runtime Module",
      "Output Response Method"
    ],
    correctAnswers: [0],
    type: "single",
    category: "Бази даних",
  },
  {
    id: 12,
    question: "Яка команда клонує репозиторій Git?",
    options: ["git pull", "git clone", "git fetch", "git init"],
    correctAnswers: [1],
    type: "single",
    category: "DevOps",
  },
  {
    id: 13,
    question: "Які з цих є контейнерними технологіями?",
    options: ["Docker", "VMware", "Kubernetes", "Podman", "VirtualBox", "containerd"],
    correctAnswers: [0, 2, 3, 5],
    type: "multiple",
    category: "DevOps",
  },
  {
    id: 14,
    question: "Що таке API?",
    options: [
      "Application Programming Interface",
      "Advanced Protocol Integration",
      "Automated Program Installation",
      "Application Process Identifier"
    ],
    correctAnswers: [0],
    type: "single",
    category: "Web",
  },
  {
    id: 15,
    question: "Який HTTP статус код означає 'Not Found'?",
    options: ["400", "401", "403", "404"],
    correctAnswers: [3],
    type: "single",
    category: "Web",
  },
  {
    id: 16,
    question: "Які з цих є хмарними провайдерами?",
    options: ["AWS", "GitHub", "Azure", "Docker Hub", "GCP", "GitLab"],
    correctAnswers: [0, 2, 4],
    type: "multiple",
    category: "DevOps",
  },
  {
    id: 17,
    question: "Що робить команда 'chmod 755' в Linux?",
    options: [
      "Видаляє файл",
      "Змінює власника файлу",
      "Встановлює права доступу rwxr-xr-x",
      "Переміщує файл"
    ],
    correctAnswers: [2],
    type: "single",
    category: "Linux",
  },
  {
    id: 18,
    question: "Який формат даних найчастіше використовується в REST API?",
    options: ["XML", "JSON", "CSV", "YAML"],
    correctAnswers: [1],
    type: "single",
    category: "Web",
  },
  {
    id: 19,
    question: "Які з цих є NoSQL базами даних?",
    options: ["MongoDB", "PostgreSQL", "Redis", "MySQL", "Cassandra", "Oracle"],
    correctAnswers: [0, 2, 4],
    type: "multiple",
    category: "Бази даних",
  },
  {
    id: 20,
    question: "Що таке VPN?",
    options: [
      "Virtual Private Network",
      "Very Protected Node",
      "Visual Programming Network",
      "Verified Public Network"
    ],
    correctAnswers: [0],
    type: "single",
    category: "Мережі",
  },
  {
    id: 21,
    question: "Яка команда показує запущені процеси в Linux?",
    options: ["ps", "ls", "cd", "cat"],
    correctAnswers: [0],
    type: "single",
    category: "Linux",
  },
  {
    id: 22,
    question: "Які з цих є методами HTTP?",
    options: ["GET", "SEND", "POST", "RECEIVE", "DELETE", "PATCH"],
    correctAnswers: [0, 2, 4, 5],
    type: "multiple",
    category: "Web",
  },
  {
    id: 23,
    question: "Що означає SOLID у програмуванні?",
    options: [
      "П'ять принципів об'єктно-орієнтованого дизайну",
      "Тип структури даних",
      "Метод тестування коду",
      "Формат файлу конфігурації"
    ],
    correctAnswers: [0],
    type: "single",
    category: "Програмування",
  },
  {
    id: 24,
    question: "Який протокол використовує порт 25?",
    options: ["HTTP", "FTP", "SMTP", "DNS"],
    correctAnswers: [2],
    type: "single",
    category: "Мережі",
  },
  {
    id: 25,
    question: "Які з цих є інструментами автоматизації?",
    options: ["Ansible", "Notepad", "Terraform", "Paint", "Puppet", "Chef"],
    correctAnswers: [0, 2, 4, 5],
    type: "multiple",
    category: "DevOps",
  },
  {
    id: 26,
    question: "Що таке Docker image?",
    options: [
      "Шаблон для створення контейнерів",
      "Тип віртуальної машини",
      "Формат зображення",
      "Мережевий протокол"
    ],
    correctAnswers: [0],
    type: "single",
    category: "DevOps",
  },
  {
    id: 27,
    question: "Яка команда створює нову гілку в Git?",
    options: ["git branch", "git checkout", "git merge", "git commit"],
    correctAnswers: [0],
    type: "single",
    category: "DevOps",
  },
  {
    id: 28,
    question: "Які з цих є типами тестування?",
    options: ["Unit", "Compilation", "Integration", "Syntax", "E2E", "Performance"],
    correctAnswers: [0, 2, 4, 5],
    type: "multiple",
    category: "Програмування",
  },
  {
    id: 29,
    question: "Що таке SSL/TLS?",
    options: [
      "Протоколи шифрування для безпечного з'єднання",
      "Мови програмування",
      "Типи баз даних",
      "Формати файлів"
    ],
    correctAnswers: [0],
    type: "single",
    category: "Мережі",
  },
  {
    id: 30,
    question: "Які з цих є пакетними менеджерами?",
    options: ["npm", "Photoshop", "pip", "Word", "yarn", "apt"],
    correctAnswers: [0, 2, 4, 5],
    type: "multiple",
    category: "DevOps",
  },
];

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [questionResults, setQuestionResults] = useState<("correct" | "incorrect" | null)[]>(new Array(questions.length).fill(null));

  const question = questions[currentQuestion];

  const handleSelectAnswer = (index: number) => {
    if (answeredQuestions[currentQuestion]) return;

    if (question.type === "single") {
      setSelectedAnswers([index]);
    } else {
      setSelectedAnswers((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswers.length === 0) {
      toast({
        title: "⚠️ Оберіть відповідь",
        description: "Потрібно вибрати хоча б один варіант",
        variant: "destructive",
      });
      return;
    }

    const isCorrect =
      selectedAnswers.length === question.correctAnswers.length &&
      selectedAnswers.every((a) => question.correctAnswers.includes(a));

    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestion] = true;
    setAnsweredQuestions(newAnsweredQuestions);

    const newQuestionResults = [...questionResults];
    newQuestionResults[currentQuestion] = isCorrect ? "correct" : "incorrect";
    setQuestionResults(newQuestionResults);

    if (isCorrect) {
      const points = question.type === "multiple" ? 15 : 10;
      setScore((prev) => prev + points);
      toast({
        title: "✅ Правильно!",
        description: `+${points} балів`,
      });
    } else {
      toast({
        title: "❌ Неправильно",
        description: "Спробуйте наступне питання",
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswers([]);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedAnswers([]);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setScore(0);
    setShowResult(false);
    setAnsweredQuestions(new Array(questions.length).fill(false));
    setQuestionResults(new Array(questions.length).fill(null));
  };

  const maxScore = questions.reduce((acc, q) => acc + (q.type === "multiple" ? 15 : 10), 0);
  const isUnlocked = score >= 70;

  if (showResult) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <Snowflakes />
        <Garland />
        <Header />

        <main className="pt-36 pb-16 px-4 relative z-10">
          <div className="container mx-auto max-w-2xl">
            <div className="glass-card rounded-3xl p-8 text-center">
              <div className="text-6xl mb-6">
                {isUnlocked ? "🏆" : "📊"}
              </div>
              <h1 className="font-heading font-bold text-3xl mb-4 text-foreground">
                {isUnlocked ? "Вітаємо!" : "Результати"}
              </h1>
              
              <div className="mb-6">
                <p className="text-5xl font-bold text-gradient-gold mb-2">
                  {score} / {maxScore}
                </p>
                <p className="text-muted-foreground">балів</p>
              </div>

              {isUnlocked ? (
                <div className="bg-christmas-green/20 rounded-xl p-4 mb-6">
                  <p className="text-christmas-green font-medium">
                    🎉 Ви розблокували Гру 2: Технічний кросворд!
                  </p>
                </div>
              ) : (
                <div className="bg-christmas-red/20 rounded-xl p-4 mb-6">
                  <p className="text-christmas-red font-medium">
                    Потрібно 70+ балів для розблокування наступної гри.
                    <br />
                    Спробуйте ще раз!
                  </p>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button variant="silver" onClick={handleRestart}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Грати знову
                </Button>
                {isUnlocked && (
                  <Button variant="gold" onClick={() => navigate("/games/crossword")}>
                    Далі до кросворду
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
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
        <div className="container mx-auto max-w-2xl">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Питання {currentQuestion + 1} з {questions.length}
              </span>
              <span className="text-sm font-bold text-christmas-gold">
                Рахунок: {score}
              </span>
            </div>
            <div className="flex gap-1">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-2 flex-1 rounded-full transition-all",
                    questionResults[index] === "correct" && "bg-christmas-green",
                    questionResults[index] === "incorrect" && "bg-christmas-red",
                    questionResults[index] === null && index === currentQuestion && "bg-christmas-gold",
                    questionResults[index] === null && index !== currentQuestion && "bg-secondary"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Question Card */}
          <div className="glass-card rounded-3xl p-6 md:p-8">
            {/* Category badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-christmas-gold/20 text-christmas-gold text-sm font-medium">
                {question.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-secondary text-muted-foreground text-sm">
                {question.type === "multiple" ? "Множинний вибір" : "Один вибір"}
              </span>
            </div>

            {/* Question */}
            <h2 className="font-heading font-bold text-xl md:text-2xl mb-6 text-foreground">
              {question.question}
            </h2>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswers.includes(index);
                const isAnswered = answeredQuestions[currentQuestion];
                const isCorrect = question.correctAnswers.includes(index);

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={isAnswered}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all duration-300 flex items-center gap-3",
                      !isAnswered && isSelected && "bg-christmas-gold/20 border-2 border-christmas-gold",
                      !isAnswered && !isSelected && "bg-secondary hover:bg-secondary/80 border-2 border-transparent",
                      isAnswered && isCorrect && "bg-christmas-green/20 border-2 border-christmas-green",
                      isAnswered && isSelected && !isCorrect && "bg-christmas-red/20 border-2 border-christmas-red",
                      isAnswered && !isSelected && !isCorrect && "bg-secondary opacity-50"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      isSelected ? "border-christmas-gold bg-christmas-gold" : "border-muted-foreground",
                      isAnswered && isCorrect && "border-christmas-green bg-christmas-green",
                      isAnswered && isSelected && !isCorrect && "border-christmas-red bg-christmas-red"
                    )}>
                      {isAnswered && isCorrect && <Check className="w-4 h-4 text-foreground" />}
                      {isAnswered && isSelected && !isCorrect && <X className="w-4 h-4 text-foreground" />}
                    </div>
                    <span className="text-foreground">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>

              {!answeredQuestions[currentQuestion] ? (
                <Button variant="gold" onClick={handleSubmitAnswer}>
                  Перевірити
                </Button>
              ) : (
                <Button variant="gold" onClick={handleNext}>
                  {currentQuestion === questions.length - 1 ? "Результати" : "Далі"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Quiz;
