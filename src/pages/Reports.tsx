import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DiagnosticReport } from "@/components/reports/diagnostic-report";
import { mockStudents } from "@/data/mock-data";
import { 
  ArrowLeft, 
  FileText, 
  Users, 
  GraduationCap,
  Download,
  Share,
  Calendar
} from "lucide-react";

const Reports = () => {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState<"sanga" | "shyam">("sanga");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-gradient-accent text-white">
              <FileText className="h-4 w-4 mr-1" />
              Diagnostic Reports
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Learning Analytics & Reports
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive diagnostic insights for personalized learning support.
          </p>
        </div>

        {/* Student Personas Demo */}
        <Card className="bg-gradient-primary text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <span>Student Personas Demo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  selectedStudent === "sanga" 
                    ? "border-white bg-white/20" 
                    : "border-white/30 bg-white/10 hover:bg-white/15"
                }`}
                onClick={() => setSelectedStudent("sanga")}
              >
                <CardContent className="p-6 text-center">
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-white/20 rounded-full mx-auto flex items-center justify-center">
                      <GraduationCap className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Sanga Kumar</h3>
                      <p className="text-white/80">Grade 8 • Strong Listener</p>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>✓ Excellent listening skills (85%)</p>
                      <p>⚠ Struggles with application (45%)</p>
                      <p>📈 Improving in English & Math</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  selectedStudent === "shyam" 
                    ? "border-white bg-white/20" 
                    : "border-white/30 bg-white/10 hover:bg-white/15"
                }`}
                onClick={() => setSelectedStudent("shyam")}
              >
                <CardContent className="p-6 text-center">
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-white/20 rounded-full mx-auto flex items-center justify-center">
                      <GraduationCap className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Shyam Patel</h3>
                      <p className="text-white/80">Grade 8 • Quick Learner</p>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>✓ Exceptional grasping ability (85%)</p>
                      <p>⚠ Listening challenges (68%)</p>
                      <p>📈 Math prodigy, needs English support</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Report Tabs */}
        <Tabs defaultValue="diagnostic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="diagnostic" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Student Report</span>
            </TabsTrigger>
            <TabsTrigger value="teacher" className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4" />
              <span>Teacher View</span>
            </TabsTrigger>
            <TabsTrigger value="parent" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Parent View</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Progress Tracking</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diagnostic" className="mt-8">
            <DiagnosticReport studentData={mockStudents[selectedStudent]} />
          </TabsContent>

          <TabsContent value="teacher" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <span>Teacher Dashboard View</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-6 rounded-lg text-center">
                  <h3 className="text-xl font-semibold mb-4">Class Overview for {mockStudents[selectedStudent].name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold text-primary">Intervention Needed</h4>
                      <p className="text-2xl font-bold text-destructive">Application Skills</p>
                      <p className="text-sm text-muted-foreground">Immediate attention required</p>
                    </div>
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold text-primary">Recommended Strategy</h4>
                      <p className="text-lg font-semibold">Visual Learning</p>
                      <p className="text-sm text-muted-foreground">Use diagrams and hands-on activities</p>
                    </div>
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold text-primary">Next Assessment</h4>
                      <p className="text-lg font-semibold">In 2 weeks</p>
                      <p className="text-sm text-muted-foreground">Focus on improved areas</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Recommended Teaching Strategies</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Implement more hands-on learning activities for better concept application</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Use visual aids and real-world examples to improve retention</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Consider peer tutoring sessions for collaborative learning</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Break complex problems into smaller, manageable steps</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parent" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-primary" />
                  <span>Parent Report Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-secondary/10 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">How You Can Help {mockStudents[selectedStudent].name} at Home</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-success mb-3">✓ Continue Encouraging</h4>
                      <ul className="space-y-2 text-sm">
                        {mockStudents[selectedStudent].strengths.slice(0, 2).map((strength, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-success mt-1">•</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-warning mb-3">⚠ Areas to Support</h4>
                      <ul className="space-y-2 text-sm">
                        {mockStudents[selectedStudent].weaknesses.slice(0, 2).map((weakness, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-warning mt-1">•</span>
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Simple Home Activities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h5 className="font-semibold mb-2">📚 Daily Reading (15 min)</h5>
                      <p className="text-sm text-muted-foreground">
                        Read together and discuss the story to improve comprehension and retention.
                      </p>
                    </Card>
                    <Card className="p-4">
                      <h5 className="font-semibold mb-2">🧮 Math in Daily Life</h5>
                      <p className="text-sm text-muted-foreground">
                        Use cooking, shopping, and games to practice real-world math applications.
                      </p>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  <span>Progress Tracking Over Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-8 rounded-lg text-center">
                  <h3 className="text-xl font-semibold mb-4">Progress Timeline</h3>
                  <p className="text-muted-foreground mb-6">
                    Track {mockStudents[selectedStudent].name}'s learning journey and improvements over time.
                  </p>
                  
                  <div className="space-y-6">
                    {[
                      { date: "March 2024", score: mockStudents[selectedStudent].overallScore, status: "Current" },
                      { date: "February 2024", score: mockStudents[selectedStudent].overallScore - 8, status: "Previous" },
                      { date: "January 2024", score: mockStudents[selectedStudent].overallScore - 15, status: "Historical" },
                    ].map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-card rounded-lg">
                        <div className="text-left">
                          <div className="font-semibold">{entry.date}</div>
                          <div className="text-sm text-muted-foreground">{entry.status} Assessment</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{entry.score}%</div>
                          {index > 0 && (
                            <div className="text-sm text-success">
                              +{entry.score - (index === 1 ? mockStudents[selectedStudent].overallScore - 15 : mockStudents[selectedStudent].overallScore - 8)}% improvement
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;