import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Target, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: string[];
  correct_answer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  skill: 'listening' | 'grasping' | 'retention' | 'application';
  subject: string;
}

interface Assessment {
  id: string;
  current_level: number;
  total_questions: number;
  correct_answers: number;
  skill_scores: any;
}

const AdaptiveAssessment = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (isStarted && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && currentQuestion) {
      handleTimeUp();
    }
  }, [timeRemaining, isStarted, currentQuestion]);

  const startAssessment = async () => {
    if (!profile) return;
    
    setIsLoading(true);
    try {
      // Create new assessment
      const { data: assessment, error: assessmentError } = await supabase
        .from('assessments')
        .insert({
          student_id: profile.id,
          assessment_type: 'adaptive',
        })
        .select()
        .single();

      if (assessmentError) throw assessmentError;

      setCurrentAssessment(assessment);
      await loadNextQuestion(assessment.current_level);
      setIsStarted(true);
    } catch (error: any) {
      toast({
        title: "Error starting assessment",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadNextQuestion = async (level: number) => {
    try {
      // Get question based on current level
      const difficulty = level <= 3 ? 'easy' : level <= 6 ? 'medium' : 'hard';
      
      const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .eq('difficulty', difficulty)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (questions && questions.length > 0) {
        const question = questions[0];
        setCurrentQuestion({
          ...question,
          options: typeof question.options === 'string' ? JSON.parse(question.options) : question.options,
          difficulty: question.difficulty as 'easy' | 'medium' | 'hard',
          skill: question.skill as 'listening' | 'grasping' | 'retention' | 'application',
        });
        setTimeRemaining(60);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    } catch (error: any) {
      toast({
        title: "Error loading question",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAnswerSubmit = async () => {
    if (!currentQuestion || !currentAssessment || selectedAnswer === null) return;

    const correct = selectedAnswer === currentQuestion.correct_answer;
    setIsCorrect(correct);
    setShowResult(true);

    try {
      // Save assessment response
      await supabase.from('assessment_responses').insert({
        assessment_id: currentAssessment.id,
        question_id: currentQuestion.id,
        selected_answer: selectedAnswer,
        is_correct: correct,
        time_taken: 60 - timeRemaining,
      });

      // Update assessment progress
      const newLevel = correct 
        ? Math.min(currentAssessment.current_level + 1, 10)
        : Math.max(currentAssessment.current_level - 1, 1);
      
      const newTotalQuestions = currentAssessment.total_questions + 1;
      const newCorrectAnswers = currentAssessment.correct_answers + (correct ? 1 : 0);
      
      // Update skill scores
      const skillScores = { ...currentAssessment.skill_scores };
      if (correct) {
        skillScores[currentQuestion.skill] += 10;
      } else {
        skillScores[currentQuestion.skill] = Math.max(skillScores[currentQuestion.skill] - 5, 0);
      }

      const { error } = await supabase
        .from('assessments')
        .update({
          current_level: newLevel,
          total_questions: newTotalQuestions,
          correct_answers: newCorrectAnswers,
          skill_scores: skillScores,
        })
        .eq('id', currentAssessment.id);

      if (error) throw error;

      setCurrentAssessment({
        ...currentAssessment,
        current_level: newLevel,
        total_questions: newTotalQuestions,
        correct_answers: newCorrectAnswers,
        skill_scores: skillScores,
      });

      // Continue to next question after delay
      setTimeout(() => {
        if (newTotalQuestions >= 10) {
          completeAssessment();
        } else {
          loadNextQuestion(newLevel);
        }
      }, 2000);

    } catch (error: any) {
      toast({
        title: "Error saving response",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      setSelectedAnswer(-1); // Mark as no answer
      handleAnswerSubmit();
    }
  };

  const completeAssessment = async () => {
    if (!currentAssessment) return;

    try {
      await supabase
        .from('assessments')
        .update({
          completed_at: new Date().toISOString(),
          is_completed: true,
        })
        .eq('id', currentAssessment.id);

      toast({
        title: "Assessment completed!",
        description: "Check your dashboard for detailed results.",
      });

      setIsStarted(false);
      setCurrentQuestion(null);
    } catch (error: any) {
      toast({
        title: "Error completing assessment",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case 'listening': return 'bg-blue-100 text-blue-800';
      case 'grasping': return 'bg-purple-100 text-purple-800';
      case 'retention': return 'bg-orange-100 text-orange-800';
      case 'application': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Adaptive Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                This adaptive assessment will adjust difficulty based on your responses to evaluate your skills across four fundamentals.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-accent/50 rounded-lg">
                  <h4 className="font-medium text-blue-600">Listening</h4>
                  <p className="text-xs text-muted-foreground">Audio comprehension</p>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg">
                  <h4 className="font-medium text-purple-600">Grasping</h4>
                  <p className="text-xs text-muted-foreground">Understanding concepts</p>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg">
                  <h4 className="font-medium text-orange-600">Retention</h4>
                  <p className="text-xs text-muted-foreground">Memory recall</p>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg">
                  <h4 className="font-medium text-teal-600">Application</h4>
                  <p className="text-xs text-muted-foreground">Practical usage</p>
                </div>
              </div>
            </div>
            <Button onClick={startAssessment} disabled={isLoading} size="lg" className="w-full">
              {isLoading ? "Starting Assessment..." : "Start Assessment"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion || !currentAssessment) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg animate-pulse mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                Question {currentAssessment.total_questions + 1} / 10
              </Badge>
              <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                {currentQuestion.difficulty}
              </Badge>
              <Badge className={getSkillColor(currentQuestion.skill)}>
                {currentQuestion.skill}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              {timeRemaining}s
            </div>
          </div>
          <Progress 
            value={(currentAssessment.total_questions / 10) * 100} 
            className="h-2"
          />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.text}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => !showResult && setSelectedAnswer(index)}
                disabled={showResult}
              >
                <span className="mr-3 text-sm font-medium">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
                {showResult && index === currentQuestion.correct_answer && (
                  <CheckCircle className="ml-auto h-5 w-5 text-green-600" />
                )}
                {showResult && selectedAnswer === index && index !== currentQuestion.correct_answer && (
                  <XCircle className="ml-auto h-5 w-5 text-red-600" />
                )}
              </Button>
            ))}
          </div>

          {!showResult && (
            <Button
              onClick={handleAnswerSubmit}
              disabled={selectedAnswer === null}
              className="w-full mt-6"
            >
              Submit Answer
            </Button>
          )}

          {showResult && (
            <div className="mt-6 p-4 rounded-lg bg-accent/50">
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-medium">
                  {isCorrect ? "Correct!" : "Incorrect"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {isCorrect 
                  ? "Great job! Moving to the next level." 
                  : "Don't worry, we'll adjust the difficulty to help you learn better."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Level Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="font-medium mb-2">Current Level</h3>
            <div className="text-3xl font-bold text-primary">
              Level {currentAssessment.current_level}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Accuracy: {currentAssessment.total_questions > 0 
                ? Math.round((currentAssessment.correct_answers / currentAssessment.total_questions) * 100)
                : 0}%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdaptiveAssessment;