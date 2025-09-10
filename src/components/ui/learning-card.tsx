import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "./progress-ring";
import { cn } from "@/lib/utils";

interface LearningCardProps {
  title: string;
  subject: string;
  progress: number;
  level: string;
  status: "excellent" | "good" | "needs-improvement" | "critical";
  lastActivity?: string;
  className?: string;
  onClick?: () => void;
}

const statusColors = {
  excellent: "success",
  good: "primary",
  "needs-improvement": "warning",
  critical: "destructive",
};

const statusBgColors = {
  excellent: "bg-gradient-success",
  good: "bg-gradient-primary",
  "needs-improvement": "bg-gradient-accent",
  critical: "bg-destructive",
};

export const LearningCard: React.FC<LearningCardProps> = ({
  title,
  subject,
  progress,
  level,
  status,
  lastActivity,
  className,
  onClick,
}) => {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-medium hover:scale-105 border-2",
        "bg-card backdrop-blur-sm",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{subject}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Progress</p>
            <p className="text-xs text-muted-foreground">
              {lastActivity && `Last activity: ${lastActivity}`}
            </p>
          </div>
          <ProgressRing progress={progress} size={60} strokeWidth={4}>
            <span className="text-sm font-semibold">{progress}%</span>
          </ProgressRing>
        </div>
        <div className={cn(
          "w-full h-1.5 rounded-full",
          statusBgColors[status]
        )} />
        <div className="flex items-center justify-between">
          <Badge 
            variant="secondary" 
            className={cn(
              "text-xs capitalize",
              status === "excellent" && "bg-success/10 text-success-foreground border-success/20",
              status === "good" && "bg-primary/10 text-primary-foreground border-primary/20",
              status === "needs-improvement" && "bg-warning/10 text-warning-foreground border-warning/20",
              status === "critical" && "bg-destructive/10 text-destructive-foreground border-destructive/20"
            )}
          >
            {status.replace("-", " ")}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};