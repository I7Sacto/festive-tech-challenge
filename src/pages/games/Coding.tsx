import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Trophy, RefreshCw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Snowflakes from "@/components/Snowflakes";
import Garland from "@/components/Garland";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface TestResult {
  passed: boolean;
  input: any;
  expected: any;
  actual: any;
}

interface TestCase {
  input: any;
  expected: number;
}

const Coding = () => {
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [code, setCode] = useState(`function countGifts(wishlist) {
  // Ваш код тут
  
}`);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const challenge = {
    title: "Підрахунок подарунків",
    description: "Напишіть функцію countGifts(wishlist), яка повертає загальну кількість подарунків.\n\nПриклад:\ncountGifts([{name:\"laptop\", quantity:2}, {name:\"mouse\", quantity:5}])\n// Повинно повернути: 7",
    
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
        input: [{ name: "телефон", quantity: 1 }, { name: "навушники", quantity: 2 }],
        expected: 3
      },
    ] as TestCase[]
  };

  const handleRunTests = async () => {
    try {
      const userFunction = new Function("return " + code)();

      const results: TestResult[] = challenge.testCases.map((testCase) => {
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
            actual: "Error: " + String(error),
          };
        }
      });

      setTestResults(results);
      const allPassed = results.every((r) => r.passed);

      if (allPassed) {
        setShowResults(true);

        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            await supabase
              .from("game_progress")
              .update({
                completed: true,
                score: 100,
                completed_at: new Date().toISOString()
              })
              .eq("user_id", user.id)
              .eq("game_number", 4);

            await supabase
              .from("game_progress")
              .update({ unlocked: true })
              .eq("user_id", user.id)
              .eq("game_number", 5);

            toast({
              title: "🎉 Вітаємо!",
              description: "Всі тести пройдені! Networking Quiz розблоковано!",
            });
          }
        } catch (error) {
          console.error("Error saving progress:", error);
        }
      } else {
        toast({
          title: "❌ Тести не пройдені",
          description: "Перевірте результати",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Помилка в коді",
        description: String(error),
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setCode(`function countGifts(wishlist) {
  // Ваш код тут
  
}`);
    setTestResults([]);
    setShowResults(false);
  };

  const insertText = (text: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newCode = code.substring(0, start) + text + code.substring(end);
      setCode(newCode);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + text.length;
          textareaRef.current.selectionEnd = start + text.length;
          textareaRef.current.focus();
        }
      }, 0);
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
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      <Snowflakes />
      <Garland />
      <Header />

      <main className="pt-36 pb-16 px-2 sm:px-4 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent">
              💻 Coding Challenge
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Розв'яжіть задачу
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="glass-card p-4 md:p-6 rounded-3xl">
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-christmas-gold">
                {challenge.title}
              </h2>
              <div className="text-sm md:text-base text-muted-foreground whitespace-pre-line mb-4">
                {challenge.description}
              </div>

              <div className="mt-4">
                <h3 className="text-base md:text-lg font-semibold mb-2">Тести:</h3>
                <div className="space-y-2">
                  {challenge.testCases.map((tc, i) => (
                    <div key={i} className="bg-white/5 p-2 md:p-3 rounded-lg text-xs md:text-sm">
                      <div className="font-mono break-all">
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

            <div className="glass-card p-4 md:p-6 rounded-3xl">
              <h3 className="text-base md:text-lg font-semibold mb-3">Ваш код:</h3>
              <Textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono text-xs md:text-sm min-h-[250px] md:min-h-[300px] bg-black/30 border-white/20"
                placeholder="Напишіть ваш код тут..."
              />

              <div className="mt-3 flex flex-wrap gap-1 md:hidden">
                {["return ", ".map(", ".reduce(", "=>", "{ }", "( )"].map((snippet) => (
                  <button
                    key={snippet}
                    onClick={() => insertText(snippet)}
                    className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded"
                  >
                    {snippet}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex gap-2 flex-wrap">
                <Button
                  onClick={handleRunTests}
                  className="flex-1 md:flex-none bg-gradient-to-r from-christmas-red to-christmas-gold hover:opacity-90"
                  size="sm"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Тести
                </Button>
                <Button onClick={handleReset} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Скинути
                </Button>
              </div>

              {testResults.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-base font-semibold mb-2">Результати:</h3>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {testResults.map((result, i) => (
                      <div
                        key={i}
                        className={cn(
                          "p-2 md:p-3 rounded-lg border-2 text-xs",
                          result.passed
                            ? "border-green-500 bg-green-500/10"
                            : "border-red-500 bg-red-500/10"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {result.passed ? (
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 font-mono break-all">
                            <div className="mb-1">Expected: {result.expected}</div>
                            <div className={result.passed ? "text-green-500" : "text-red-500"}>
                              Got: {JSON.stringify(result.actual)}
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
