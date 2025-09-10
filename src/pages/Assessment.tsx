import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionInterface } from "@/components/assessment/question-interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockQuestions } from "@/data/mock-data";
import { ArrowLeft, Brain, CheckCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const Assessment = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<{ questionId: string; selectedOption: number; isCorrect: boolean }>>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState(2); // 1=easy, 2=medium, 3=hard
  const [adaptiveQuestions, setAdaptiveQuestions] = useState(mockQuestions);

  const currentQuestion = adaptiveQuestions[currentQuestionIndex];
  const totalQuestions = adaptiveQuestions.length;

  const handleAnswer = (selectedOption: number, isCorrect: boolean) => {
    const newAnswer = {
      questionId: currentQuestion.id,
      selectedOption,
      isCorrect,
    };

    setAnswers([...answers, newAnswer]);

    // Adaptive difficulty adjustment
    let newDifficultyLevel = difficultyLevel;
    if (isCorrect) {
      newDifficultyLevel = Math.min(3, difficultyLevel + 0.5);
    } else {
      newDifficultyLevel = Math.max(1, difficultyLevel - 0.5);
    }
    setDifficultyLevel(newDifficultyLevel);

    // Move to next question or complete assessment
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setIsComplete(true);
      }
    }, 1500);
  };

  const calculateScore = () => {
    const correctAnswers = answers.filter(answer => answer.isCorrect).length;
    return Math.round((correctAnswers / answers.length) * 100);
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 85) return { level: "Excellent", color: "success" };
    if (score >= 70) return { level: "Good", color: "primary" };
    if (score >= 55) return { level: "Needs Improvement", color: "warning" };
    return { level: "Needs Significant Support", color: "destructive" };
  };

  if (isComplete) {
    const score = calculateScore();
    const performance = getPerformanceLevel(score);

    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card className="bg-gradient-learning text-white">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-6 bg-white/20 rounded-full w-fit">
                <CheckCircle className="h-16 w-16" />
              </div>
              <CardTitle className="text-3xl">Assessment Complete!</CardTitle>
              <p className="text-white/90">
                Your adaptive assessment has been completed and analyzed.
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-2">
                <div className="text-6xl font-bold">{score}%</div>
                <Badge 
                  variant="secondary"
                  className={cn(
                    "text-lg px-4 py-2",
                    performance.color === "success" && "bg-success text-success-foreground",
                    performance.color === "primary" && "bg-primary text-primary-foreground",
                    performance.color === "warning" && "bg-warning text-warning-foreground",
                    performance.color === "destructive" && "bg-destructive text-destructive-foreground"
                  )}
                >
                  {performance.level}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold">{answers.filter(a => a.isCorrect).length}</div>
                  <div className="text-white/80">Correct Answers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalQuestions}</div>
                  <div className="text-white/80">Total Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{difficultyLevel.toFixed(1)}</div>
                  <div className="text-white/80">Final Difficulty</div>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/reports")}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  <TrendingUp className="h-5 w-5 mr-2" />
                  View Detailed Report
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/practice")}
                  className="border-white text-white hover:bg-white/10"
                >
                  Start Practice Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-gradient-primary text-white">
              <Brain className="h-4 w-4 mr-1" />
              Adaptive Assessment
            </Badge>
            <Badge variant="outline">
              Difficulty: {difficultyLevel.toFixed(1)}/3.0
            </Badge>
          </div>
        </div>

        <QuestionInterface
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
};

export default Assessment;