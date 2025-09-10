import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface LearningStatsProps {
  stats: Array<{
    label: string;
    value: string | number;
    change?: number;
    trend?: "up" | "down" | "stable";
    highlight?: boolean;
  }>;
  className?: string;
}

export const LearningStats: React.FC<LearningStatsProps> = ({
  stats,
  className,
}) => {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className={cn(
            "relative overflow-hidden transition-all duration-300 hover:shadow-medium",
            stat.highlight && "ring-2 ring-primary/20 bg-gradient-primary/5"
          )}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{stat.value}</p>
              {stat.change !== undefined && (
                <div className="flex items-center space-x-1">
                  {stat.trend === "up" && (
                    <TrendingUp className="h-4 w-4 text-success" />
                  )}
                  {stat.trend === "down" && (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  {stat.trend === "stable" && (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      stat.trend === "up" && "border-success text-success",
                      stat.trend === "down" && "border-destructive text-destructive",
                      stat.trend === "stable" && "border-muted-foreground text-muted-foreground"
                    )}
                  >
                    {stat.change > 0 ? "+" : ""}{stat.change}%
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};