import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Play, 
  BarChart3,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Zap,
  BookOpen,
  GraduationCap
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "Adaptive Assessment",
      description: "Dynamic difficulty adjustment based on real-time performance analysis",
      highlight: "AI-Powered",
    },
    {
      icon: Target,
      title: "Learning Gap Analysis",
      description: "Identify specific weaknesses across listening, grasping, retention, and application",
      highlight: "4 Core Skills",
    },
    {
      icon: TrendingUp,
      title: "Personalized Practice",
      description: "Targeted content generation focusing on individual improvement areas",
      highlight: "Custom Content",
    },
    {
      icon: BarChart3,
      title: "Comprehensive Reports",
      description: "Detailed insights for students, teachers, and parents with actionable recommendations",
      highlight: "Multi-Stakeholder",
    },
  ];

  const benefits = [
    "Real-time difficulty adaptation during assessments",
    "Detailed skill breakdown across 4 learning fundamentals",
    "Personalized practice content generation",
    "Multi-level reporting for all stakeholders",
    "Progress tracking and improvement analytics",
    "Evidence-based learning recommendations",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center bg-gradient-hero">
        <div className="max-w-6xl mx-auto space-y-8 text-white">
          <div className="space-y-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Zap className="h-4 w-4 mr-1" />
              AI-Powered Adaptive Learning
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Personalized Learning
              <br />
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Assessment Platform
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Transform education with adaptive assessments that identify individual learning gaps 
              and provide targeted practice for every student's unique needs.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 shadow-strong"
            >
              <Play className="h-6 w-6 mr-2" />
              Try Demo Dashboard
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/reports")}
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-4"
            >
              <BarChart3 className="h-6 w-6 mr-2" />
              View Sample Reports
            </Button>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000" />
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-learning bg-clip-text text-transparent">
              Adaptive Learning Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform goes beyond traditional testing to provide truly personalized learning experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-medium group"
                >
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="p-3 bg-gradient-primary rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-8 w-8" />
                      </div>
                      <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
                        {feature.highlight}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold">
                  See It In Action
                </h2>
                <p className="text-xl text-muted-foreground">
                  Experience how our platform identifies learning gaps and provides personalized support for students like Sanga and Shyam.
                </p>
              </div>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/assessment")}
                  className="bg-gradient-primary text-white hover:opacity-90"
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Try Assessment
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/practice")}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Practice Mode
                </Button>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card className="bg-gradient-learning text-white transform hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-6 w-6" />
                    <span>Student Success Stories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Sanga Kumar - Grade 8</h4>
                    <p className="text-white/90 text-sm">
                      "Excellent listener but struggled with application. Our platform identified this pattern 
                      and provided targeted practice that improved performance by 15%."
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Shyam Patel - Grade 8</h4>
                    <p className="text-white/90 text-sm">
                      "Quick learner with listening challenges. Personalized support helped bridge the gap 
                      while leveraging his strengths in mathematical reasoning."
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardContent className="p-6 text-center">
                  <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h4 className="font-bold text-lg mb-2">Ready to Transform Learning?</h4>
                  <p className="text-muted-foreground mb-4">
                    Join thousands of educators using our adaptive assessment platform
                  </p>
                  <Button 
                    onClick={() => navigate("/dashboard")}
                    className="w-full"
                  >
                    Get Started Today
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-secondary text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Personalize Every Learning Journey
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Stop using one-size-fits-all assessments. Start providing every student with 
            the personalized learning support they need to succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4"
            >
              <Lightbulb className="h-6 w-6 mr-2" />
              Explore Platform
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/reports")}
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-4"
            >
              View Sample Reports
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
