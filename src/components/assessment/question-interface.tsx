import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
  skill: "listening" | "grasping" | "retention" | "application";
}

interface QuestionInterfaceProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedOption: number, isCorrect: boolean) => void;
  timeRemaining?: number;
  className?: string;
}

const difficultyColors = {
  easy: "bg-success",
  medium: "bg-warning",
  hard: "bg-destructive",
};

const skillColors = {
  listening: "bg-gradient-primary",
  grasping: "bg-gradient-secondary",
  retention: "bg-gradient-accent",
  application: "bg-gradient-learning",
};

export const QuestionInterface: React.FC<QuestionInterfaceProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  timeRemaining,
  className,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleOptionSelect = (optionIndex: number) => {
    if (answered) return;
    
    setSelectedOption(optionIndex);
    setAnswered(true);
    setShowResult(true);
    
    const isCorrect = optionIndex === question.correctAnswer;
    
    setTimeout(() => {
      onAnswer(optionIndex, isCorrect);
    }, 1500);
  };

  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl">Question {questionNumber}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {questionNumber} of {totalQuestions}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge 
              variant="outline" 
              className={cn("capitalize", difficultyColors[question.difficulty], "text-white")}
            >
              {question.difficulty}
            </Badge>
            <Badge 
              variant="outline" 
              className={cn("capitalize", skillColors[question.skill], "text-white")}
            >
              {question.skill}
            </Badge>
            {timeRemaining && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
              </div>
            )}
          </div>
        </div>
        
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-muted/50 p-6 rounded-lg">
          <p className="text-lg leading-relaxed">{question.text}</p>
        </div>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={answered}
              className={cn(
                "w-full p-4 text-left rounded-lg border-2 transition-all duration-300",
                "hover:shadow-medium hover:scale-[1.02]",
                !answered && "hover:border-primary/50 hover:bg-primary/5",
                selectedOption === index && !showResult && "border-primary bg-primary/10",
                showResult && selectedOption === index && index === question.correctAnswer && 
                  "border-success bg-success/10 text-success-foreground",
                showResult && selectedOption === index && index !== question.correctAnswer && 
                  "border-destructive bg-destructive/10 text-destructive-foreground",
                showResult && index === question.correctAnswer && selectedOption !== index &&
                  "border-success bg-success/5 text-success-foreground",
                answered && "cursor-not-allowed"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="flex-1">{option}</span>
                {showResult && (
                  <div className="ml-3">
                    {index === question.correctAnswer ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : selectedOption === index ? (
                      <XCircle className="h-5 w-5 text-destructive" />
                    ) : null}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
        
        {!answered && (
          <div className="text-center text-sm text-muted-foreground">
            Select an answer to continue
          </div>
        )}
      </CardContent>
    </Card>
  );
};