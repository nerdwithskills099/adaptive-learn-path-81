import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Play, 
  Settings, 
  Target, 
  Shuffle,
  Brain,
  BookOpen,
  Zap,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

const Practice = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<"difficulty" | "mixed" | null>(null);
  const [difficultyLevel, setDifficultyLevel] = useState([2]);
  const [enableAdaptive, setEnableAdaptive] = useState(true);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["mathematics", "science"]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["application"]);

  const subjects = [
    { id: "mathematics", name: "Mathematics", color: "primary" },
    { id: "science", name: "Science", color: "secondary" },
    { id: "english", name: "English", color: "accent" },
    { id: "history", name: "History", color: "warning" },
  ];

  const skills = [
    { id: "listening", name: "Listening", icon: "🎧" },
    { id: "grasping", name: "Grasping", icon: "👁️" },
    { id: "retention", name: "Retention", icon: "🧠" },
    { id: "application", name: "Application", icon: "💡" },
  ];

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleSkillToggle = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const startPractice = () => {
    // In a real app, this would configure the practice session and navigate to it
    console.log("Starting practice with:", {
      mode: selectedMode,
      difficulty: difficultyLevel[0],
      adaptive: enableAdaptive,
      subjects: selectedSubjects,
      skills: selectedSkills,
    });
    navigate("/assessment"); // For demo purposes, redirect to assessment
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <Badge variant="outline" className="bg-gradient-secondary text-white">
            <BookOpen className="h-4 w-4 mr-1" />
            Practice Mode
          </Badge>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-learning bg-clip-text text-transparent">
            Practice Session Setup
          </h1>
          <p className="text-lg text-muted-foreground">
            Customize your practice session to target specific areas for improvement.
          </p>
        </div>

        {/* Practice Mode Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-primary" />
              <span>Choose Practice Mode</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                className={cn(
                  "cursor-pointer transition-all duration-300 border-2",
                  selectedMode === "difficulty" 
                    ? "border-primary bg-primary/5 shadow-medium" 
                    : "border-border hover:border-primary/50 hover:shadow-soft"
                )}
                onClick={() => setSelectedMode("difficulty")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Layers className="h-5 w-5 text-primary" />
                    <span>Difficulty-Based Practice</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Select your preferred difficulty level and practice questions at that specific level.
                  </p>
                </CardContent>
              </Card>

              <Card 
                className={cn(
                  "cursor-pointer transition-all duration-300 border-2",
                  selectedMode === "mixed" 
                    ? "border-primary bg-primary/5 shadow-medium" 
                    : "border-border hover:border-primary/50 hover:shadow-soft"
                )}
                onClick={() => setSelectedMode("mixed")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Shuffle className="h-5 w-5 text-secondary" />
                    <span>Mixed Practice</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Practice with questions from multiple chapters and varying difficulty levels.
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Options */}
        {selectedMode && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Difficulty Settings */}
            {selectedMode === "difficulty" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-6 w-6 text-primary" />
                    <span>Difficulty Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      Difficulty Level: {difficultyLevel[0]}/5
                    </Label>
                    <Slider
                      value={difficultyLevel}
                      onValueChange={setDifficultyLevel}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Easy</span>
                      <span>Medium</span>
                      <span>Hard</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-semibold">Adaptive Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically adjust difficulty based on performance
                      </p>
                    </div>
                    <Switch
                      checked={enableAdaptive}
                      onCheckedChange={setEnableAdaptive}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Subject Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <span>Subject Selection</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {subjects.map((subject) => (
                    <Button
                      key={subject.id}
                      variant={selectedSubjects.includes(subject.id) ? "default" : "outline"}
                      onClick={() => handleSubjectToggle(subject.id)}
                      className={cn(
                        "justify-start",
                        selectedSubjects.includes(subject.id) && "bg-gradient-primary"
                      )}
                    >
                      {subject.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skill Focus */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-primary" />
                  <span>Learning Skills Focus</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {skills.map((skill) => (
                    <Card
                      key={skill.id}
                      className={cn(
                        "cursor-pointer transition-all duration-300 border-2",
                        selectedSkills.includes(skill.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => handleSkillToggle(skill.id)}
                    >
                      <CardContent className="p-4 text-center space-y-2">
                        <div className="text-2xl">{skill.icon}</div>
                        <h3 className="font-semibold text-sm">{skill.name}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Start Practice Button */}
        {selectedMode && selectedSubjects.length > 0 && selectedSkills.length > 0 && (
          <Card className="bg-gradient-learning text-white">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="text-2xl font-bold">Ready to Start?</h3>
              <p className="text-white/90">
                Your practice session has been configured. Click below to begin!
              </p>
              <Button
                size="lg"
                onClick={startPractice}
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3"
              >
                <Play className="h-6 w-6 mr-2" />
                Start Practice Session
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Practice;