import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Trophy, RefreshCw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";

const Coding = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(`function countGifts(wishlist) {
  // Ваш код тут
  
}`);
  const [testResults, setTestResults] = useState<{ passed: boolean; input: any; expected: any; actual: any }[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [allTestsPassed, setAllTestsPassed] = useState(false);

  const challenge = {
    title: "Підрахунок подарунків",
    description: `Напишіть функцію countGifts(wishlist), яка приймає масив об'єктів з бажаннями і повертає загальну кількість подарунків.

Кожен об'єкт має структуру: { name: string, quantity: number }

Приклад:
countGifts([{ name: "laptop", quantity: 2 }, { name: "mouse", quantity: 5 }])
// Повинно повернути: 7`,
    
    testCases: [
      {
        input: [{ name: "laptop", quantity: 2 }, { name: "mouse", quantity: 5 }],
        expected: 7
      },
      {
        input: [{ name: "книга", quantity: 3 }],
        expected: 3
      },
      {
        input: [],
        expected: 0
      },
      {
        input: [{ name: "телефон", quantity: 1 }, { name: "навушники", quantity: 2 }, { name: "клавіатура", quantity: 1 }],
        expected: 4
      },
    ]
  };

  const handleRunTests = () => {
    try {
      // Створюємо функцію з коду користувача
      const userFunction = new Function("return " + code)();

      const results = challenge.testCases.map((testCase) => {
        try {
          const actual = userFunction(testCase.input);
          return {
            passed: actual === testCase.expected,
            input: testCase.input,
            expected: testCase.expected,
            actual: actual,
          };
        } catch (error) {
          return {
            passed: false,
            input: testCase.input,
            expected: testCase.expected,
            actual: `Error: ${error}`,
          };
        }
      });

      setTestResults(results);
      const allPassed = results.every((r) => r.passed);
      setAllTestsPassed(allPassed);
if (allPassed) {
  setShowResults(true);

  // Зберегти в Supabase
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase
        .from('game_progress')
        .update({
          completed: true,
          score: 100,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('game_number', 4);

      // Розблокувати Гру 5
      await supabase
        .from('game_progress')
        .update({ unlocked: true })
        .eq('user_id', user.id)
        .eq('game_number', 5);

      toast({
        title: "🎉 Вітаємо!",
        description: "Всі тести пройдені! Networking Quiz розблоковано!",
      });
    }
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

  const handleReset = () => {
    setCode(`function countGifts(wishlist) {
  // Ваш код тут
  
}`);
    setTestResults([]);
    setShowResults(false);
    setAllTestsPassed(false);
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

              <h1 className="text-4xl font-bold mb-4">Challenge завершено! 🎉</h1>

              <div className="text-6xl font-bold mb-6 bg-gradient-to-r from-christmas-red to-christmas-gold bg-clip-text text-transparent">
                100%
              </div>

              <p className="text-lg text-green-500 mb-8">✅ Networking Quiz розблоковано!</p>

              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  onClick={handleReset}
                  className="bg-christmas-red hover:bg-christmas-red/90"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Нове завдання
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
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent">
              💻 Coding Challenge
            </h1>
            <p className="text-muted-foreground">Розв'яжіть задачу для розблокування наступної гри</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Challenge Description */}
            <div className="glass-card p-6 rounded-3xl">
              <h2 className="text-2xl font-bold mb-4 text-christmas-gold">{challenge.title}</h2>
              <div className="text-muted-foreground whitespace-pre-line mb-6">
                {challenge.description}
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Тестові випадки:</h3>
                <div className="space-y-2">
                  {challenge.testCases.map((tc, i) => (
                    <div key={i} className="bg-white/5 p-3 rounded-lg text-sm">
                      <div className="font-mono">
                        Input: {JSON.stringify(tc.input)}
                      </div>
                      <div className="font-mono text-christmas-green">
                        Expected: {tc.expected}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="glass-card p-6 rounded-3xl">
              <h3 className="text-lg font-semibold mb-3">Ваш код:</h3>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono min-h-[300px] bg-black/30 border-white/20"
                placeholder="Напишіть ваш код тут..."
              />

              <div className="mt-4 flex gap-3">
                <Button
                  onClick={handleRunTests}
                  className="bg-gradient-to-r from-christmas-red to-christmas-gold hover:opacity-90"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Запустити тести
                </Button>
                <Button onClick={handleReset} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Скинути
                </Button>
              </div>

              {/* Test Results */}
              {testResults.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Результати тестів:</h3>
                  <div className="space-y-2">
                    {testResults.map((result, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border-2 ${
                          result.passed
                            ? "border-green-500 bg-green-500/10"
                            : "border-red-500 bg-red-500/10"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {result.passed ? (
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 text-sm font-mono">
                            <div>Input: {JSON.stringify(result.input)}</div>
                            <div>Expected: {result.expected}</div>
                            <div className={result.passed ? "text-green-500" : "text-red-500"}>
                              Actual: {JSON.stringify(result.actual)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button onClick={() => navigate("/games")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              До ігор
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Coding;
