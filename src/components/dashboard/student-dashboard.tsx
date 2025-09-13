import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LearningCard } from "@/components/ui/learning-card";
import { LearningStats } from "@/components/ui/learning-stats";
import { ProgressRing } from "@/components/ui/progress-ring";
import { 
  Play, 
  TrendingUp, 
  Target, 
  BookOpen, 
  Brain,
  Ear,
  Eye,
  Lightbulb,
  BarChart3,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentDashboardProps {
  studentName: string;
  onStartAssessment: () => void;
  onStartPractice: () => void;
  onViewReports: () => void;
  className?: string;
}

const skillsData = [
  { name: "Listening", icon: Ear, progress: 85, status: "excellent" as const },
  { name: "Grasping", icon: Eye, progress: 72, status: "good" as const },
  { name: "Retention", icon: Brain, progress: 68, status: "needs-improvement" as const },
  { name: "Application", icon: Lightbulb, progress: 45, status: "critical" as const },
];

const subjectsData = [
  {
    title: "Mathematics",
    subject: "Algebra & Geometry",
    progress: 78,
    level: "Grade 8",
    status: "good" as const,
    lastActivity: "2 hours ago",
  },
  {
    title: "Science",
    subject: "Physics & Chemistry",
    progress: 65,
    level: "Grade 8",
    status: "needs-improvement" as const,
    lastActivity: "1 day ago",
  },
  {
    title: "English",
    subject: "Reading & Writing",
    progress: 82,
    level: "Grade 8",
    status: "excellent" as const,
    lastActivity: "3 hours ago",
  },
  {
    title: "History",
    subject: "World History",
    progress: 55,
    level: "Grade 8",
    status: "critical" as const,
    lastActivity: "3 days ago",
  },
];

const statsData = [
  { label: "Overall Progress", value: "67%", change: 12, trend: "up" as const, highlight: true },
  { label: "Assessments Taken", value: "24", change: 8, trend: "up" as const },
  { label: "Practice Sessions", value: "156", change: -3, trend: "down" as const },
  { label: "Learning Streak", value: "7 days", change: 0, trend: "stable" as const },
];

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  studentName,
  onStartAssessment,
  onStartPractice,
  onViewReports,
  className,
}) => {
  return (
    <div className={cn("space-y-8 p-6", className)}>
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Welcome back, {studentName}!
        </h1>
        <p className="text-lg text-muted-foreground">
          Ready to continue your learning journey?
        </p>
      </div>

      {/* Stats Overview */}
      <LearningStats stats={statsData} />

      {/* Quick Actions */}
      <Card className="bg-gradient-learning text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button
            variant="secondary"
            size="lg"
            onClick={onStartAssessment}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Play className="h-5 w-5 mr-2" />
            Start Assessment
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={onStartPractice}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Practice Mode
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => window.location.href = '/edubot'}
            className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 hover:from-yellow-400/30 hover:to-orange-400/30 text-white border-yellow-400/40"
          >
            <Bot className="h-5 w-5 mr-2" />
            Ask EduBot
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={onViewReports}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <BarChart3 className="h-5 w-5 mr-2" />
            View Reports
          </Button>
        </CardContent>
      </Card>

      {/* Learning Skills Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <span>Learning Skills Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {skillsData.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <div key={index} className="text-center space-y-3">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 rounded-full bg-gradient-primary text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">{skill.name}</h3>
                  </div>
                  <ProgressRing progress={skill.progress} size={80}>
                    <span className="text-sm font-bold">{skill.progress}%</span>
                  </ProgressRing>
                  <Badge 
                    variant="outline"
                    className={cn(
                      "text-xs capitalize",
                      skill.status === "excellent" && "border-success text-success",
                      skill.status === "good" && "border-primary text-primary",
                      skill.status === "needs-improvement" && "border-warning text-warning",
                      skill.status === "critical" && "border-destructive text-destructive"
                    )}
                  >
                    {skill.status.replace("-", " ")}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Subject Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span>Subject Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjectsData.map((subject, index) => (
              <LearningCard
                key={index}
                {...subject}
                onClick={() => console.log(`Navigate to ${subject.title}`)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};