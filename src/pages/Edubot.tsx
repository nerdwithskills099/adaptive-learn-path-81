import React from 'react';
import AppLayout from '@/components/layout/app-layout';
import EdubotChat from '@/components/edubot/edubot-chat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Camera, BookOpen, Calculator, FlaskConical, Globe } from 'lucide-react';

const Edubot = () => {
  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Bot className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold">EduBot AI Assistant</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your intelligent study companion for mathematics, science, and social studies. 
            Get instant help with problems, explanations, and step-by-step solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5 text-blue-500" />
                Mathematics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Algebra, geometry, calculus, statistics, and more with step-by-step solutions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FlaskConical className="h-5 w-5 text-green-500" />
                Science
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Physics, chemistry, biology concepts explained with clear examples.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5 text-purple-500" />
                Social Studies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                History, geography, civics, and cultural studies with context.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Camera className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold">Snap & Solve Feature</h3>
              <p className="text-sm text-muted-foreground">
                Take a photo of any problem, worksheet, or textbook question and get instant help!
              </p>
            </div>
          </div>
        </div>

        <EdubotChat />
      </div>
    </AppLayout>
  );
};

export default Edubot;