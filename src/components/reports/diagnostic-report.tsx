import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProgressRing } from "@/components/ui/progress-ring";
import { 
  User, 
  Calendar, 
  Target, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DiagnosticReportProps {
  studentData: {
    name: string;
    grade: string;
    assessmentDate: string;
    overallScore: number;
    skillBreakdown: Array<{
      skill: string;
      score: number;
      status: "excellent" | "good" | "needs-improvement" | "critical";
      improvement: number;
    }>;
    subjectPerformance: Array<{
      subject: string;
      score: number;
      trend: "up" | "down" | "stable";
      recommendations: string[];
    }>;
    strengths: string[];
    weaknesses: string[];
  };
  className?: string;
}

const statusColors = {
  excellent: { bg: "bg-success/10", text: "text-success", border: "border-success" },
  good: { bg: "bg-primary/10", text: "text-primary", border: "border-primary" },
  "needs-improvement": { bg: "bg-warning/10", text: "text-warning", border: "border-warning" },
  critical: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive" },
};

export const DiagnosticReport: React.FC<DiagnosticReportProps> = ({
  studentData,
  className,
}) => {
  return (
    <div className={cn("space-y-6 max-w-6xl mx-auto", className)}>
      {/* Header */}
      <Card className="bg-gradient-learning text-white">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl flex items-center space-x-2">
                <FileText className="h-7 w-7" />
                <span>Diagnostic Assessment Report</span>
              </CardTitle>
              <div className="flex items-center space-x-4 text-white/90">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{studentData.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>{studentData.grade}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{studentData.assessmentDate}</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <ProgressRing progress={studentData.overallScore} size={100} strokeWidth={8}>
                <div className="text-center">
                  <div className="text-2xl font-bold">{studentData.overallScore}%</div>
                  <div className="text-xs text-white/80">Overall</div>
                </div>
              </ProgressRing>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Skills Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-primary" />
            <span>Learning Skills Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentData.skillBreakdown.map((skill, index) => (
              <div key={index} className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{skill.skill}</h3>
                  <ProgressRing progress={skill.score} size={80}>
                    <span className="text-sm font-bold">{skill.score}%</span>
                  </ProgressRing>
                </div>
                <div className="space-y-2">
                  <Badge 
                    variant="outline"
                    className={cn(
                      "w-full justify-center capitalize",
                      statusColors[skill.status].bg,
                      statusColors[skill.status].text,
                      statusColors[skill.status].border
                    )}
                  >
                    {skill.status.replace("-", " ")}
                  </Badge>
                  <div className="flex items-center justify-center space-x-1 text-sm">
                    {skill.improvement > 0 ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                    <span className={skill.improvement > 0 ? "text-success" : "text-destructive"}>
                      {skill.improvement > 0 ? "+" : ""}{skill.improvement}% from last assessment
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span>Subject Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {studentData.subjectPerformance.map((subject, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{subject.subject}</h3>
                  <div className="flex items-center space-x-2">
                    {subject.trend === "up" && <TrendingUp className="h-4 w-4 text-success" />}
                    {subject.trend === "down" && <TrendingDown className="h-4 w-4 text-destructive" />}
                    {subject.trend === "stable" && <div className="h-4 w-4" />}
                    <span className="text-sm text-muted-foreground">
                      {subject.trend === "up" && "Improving"}
                      {subject.trend === "down" && "Needs attention"}
                      {subject.trend === "stable" && "Stable performance"}
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary">{subject.score}%</div>
              </div>
              <Progress value={subject.score} className="h-3" />
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4 text-warning" />
                  <span>Recommendations</span>
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {subject.recommendations.map((rec, recIndex) => (
                    <li key={recIndex} className="flex items-start space-x-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-success">
              <CheckCircle className="h-6 w-6" />
              <span>Key Strengths</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {studentData.strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-warning">
              <AlertTriangle className="h-6 w-6" />
              <span>Areas for Improvement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {studentData.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};