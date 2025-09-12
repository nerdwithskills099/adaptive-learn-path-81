import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Plus, Edit, Play, Clock, FileText, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomTest {
  id: string;
  title: string;
  description: string;
  questions_count: number;
  time_limit: number;
  is_published: boolean;
  created_at: string;
}

interface CustomQuestion {
  id: string;
  title: string;
  text: string;
  options: any; // Can be string[] or Json from database
  correct_answer: number;
  difficulty: string;
  skill: string;
  subject: string;
  chapter: string;
}

const CustomTests = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [tests, setTests] = useState<CustomTest[]>([]);
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [editingTest, setEditingTest] = useState<CustomTest | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<CustomQuestion | null>(null);

  // Form states
  const [testForm, setTestForm] = useState({
    title: '',
    description: '',
    time_limit: 30,
    is_published: false
  });

  const [questionForm, setQuestionForm] = useState({
    title: '',
    text: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    difficulty: 'medium',
    skill: 'application',
    subject: '',
    chapter: ''
  });

  useEffect(() => {
    if (profile?.id) {
      fetchTests();
      fetchQuestions();
    }
  }, [profile]);

  const fetchTests = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_tests')
        .select('*')
        .eq('creator_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTests(data || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_questions')
        .select('*')
        .eq('creator_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Ensure options is always an array
      const processedData = (data || []).map(question => ({
        ...question,
        options: Array.isArray(question.options) ? question.options : []
      }));
      setQuestions(processedData);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTest = async () => {
    if (!profile?.id) return;

    try {
      const testData = {
        ...testForm,
        creator_id: profile.id
      };

      if (editingTest) {
        const { error } = await supabase
          .from('custom_tests')
          .update(testData)
          .eq('id', editingTest.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('custom_tests')
          .insert([testData]);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Test ${editingTest ? 'updated' : 'created'} successfully`,
      });

      setShowTestDialog(false);
      setEditingTest(null);
      setTestForm({ title: '', description: '', time_limit: 30, is_published: false });
      fetchTests();
    } catch (error) {
      console.error('Error saving test:', error);
      toast({
        title: "Error",
        description: "Failed to save test",
        variant: "destructive",
      });
    }
  };

  const handleSaveQuestion = async () => {
    if (!profile?.id) return;
    if (questionForm.options.some(opt => !opt.trim())) {
      toast({
        title: "Error",
        description: "All answer options must be filled",
        variant: "destructive",
      });
      return;
    }

    try {
      const questionData = {
        ...questionForm,
        creator_id: profile.id
      };

      if (editingQuestion) {
        const { error } = await supabase
          .from('custom_questions')
          .update(questionData)
          .eq('id', editingQuestion.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('custom_questions')
          .insert([questionData]);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Question ${editingQuestion ? 'updated' : 'created'} successfully`,
      });

      setShowQuestionDialog(false);
      setEditingQuestion(null);
      setQuestionForm({
        title: '',
        text: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        difficulty: 'medium',
        skill: 'application',
        subject: '',
        chapter: ''
      });
      fetchQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
      toast({
        title: "Error",
        description: "Failed to save question",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTest = async (testId: string) => {
    try {
      const { error } = await supabase
        .from('custom_tests')
        .delete()
        .eq('id', testId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Test deleted successfully",
      });
      fetchTests();
    } catch (error) {
      console.error('Error deleting test:', error);
      toast({
        title: "Error",
        description: "Failed to delete test",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('custom_questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  const openTestDialog = (test?: CustomTest) => {
    if (test) {
      setEditingTest(test);
      setTestForm({
        title: test.title,
        description: test.description || '',
        time_limit: test.time_limit || 30,
        is_published: test.is_published
      });
    } else {
      setEditingTest(null);
      setTestForm({ title: '', description: '', time_limit: 30, is_published: false });
    }
    setShowTestDialog(true);
  };

  const openQuestionDialog = (question?: CustomQuestion) => {
    if (question) {
      setEditingQuestion(question);
      setQuestionForm({
        title: question.title,
        text: question.text,
        options: question.options,
        correct_answer: question.correct_answer,
        difficulty: question.difficulty,
        skill: question.skill,
        subject: question.subject,
        chapter: question.chapter || ''
      });
    } else {
      setEditingQuestion(null);
      setQuestionForm({
        title: '',
        text: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        difficulty: 'medium',
        skill: 'application',
        subject: '',
        chapter: ''
      });
    }
    setShowQuestionDialog(true);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg animate-pulse mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading custom tests...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Custom Tests</h1>
            <p className="text-muted-foreground">Create and manage your own tests and questions</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => openQuestionDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingQuestion ? 'Edit Question' : 'Create New Question'}</DialogTitle>
                  <DialogDescription>
                    {editingQuestion ? 'Update the question details' : 'Add a new question to your question bank'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="question-title">Question Title</Label>
                    <Input
                      id="question-title"
                      value={questionForm.title}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter question title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="question-text">Question Text</Label>
                    <Textarea
                      id="question-text"
                      value={questionForm.text}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, text: e.target.value }))}
                      placeholder="Enter the question"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Answer Options</Label>
                    {questionForm.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-medium min-w-[20px]">{index + 1}.</span>
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...questionForm.options];
                            newOptions[index] = e.target.value;
                            setQuestionForm(prev => ({ ...prev, options: newOptions }));
                          }}
                          placeholder={`Option ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant={questionForm.correct_answer === index ? "default" : "outline"}
                          size="sm"
                          onClick={() => setQuestionForm(prev => ({ ...prev, correct_answer: index }))}
                        >
                          Correct
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={questionForm.subject}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="e.g., Mathematics"
                      />
                    </div>
                    <div>
                      <Label htmlFor="chapter">Chapter (Optional)</Label>
                      <Input
                        id="chapter"
                        value={questionForm.chapter}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, chapter: e.target.value }))}
                        placeholder="e.g., Algebra"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select value={questionForm.difficulty} onValueChange={(value) => setQuestionForm(prev => ({ ...prev, difficulty: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="skill">Skill</Label>
                      <Select value={questionForm.skill} onValueChange={(value) => setQuestionForm(prev => ({ ...prev, skill: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="listening">Listening</SelectItem>
                          <SelectItem value="grasping">Grasping</SelectItem>
                          <SelectItem value="retention">Retention</SelectItem>
                          <SelectItem value="application">Application</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowQuestionDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveQuestion}>
                      {editingQuestion ? 'Update Question' : 'Create Question'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => openTestDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Test
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingTest ? 'Edit Test' : 'Create New Test'}</DialogTitle>
                  <DialogDescription>
                    {editingTest ? 'Update the test details' : 'Create a new custom test'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="test-title">Test Title</Label>
                    <Input
                      id="test-title"
                      value={testForm.title}
                      onChange={(e) => setTestForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter test title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="test-description">Description</Label>
                    <Textarea
                      id="test-description"
                      value={testForm.description}
                      onChange={(e) => setTestForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter test description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                    <Input
                      id="time-limit"
                      type="number"
                      value={testForm.time_limit}
                      onChange={(e) => setTestForm(prev => ({ ...prev, time_limit: parseInt(e.target.value) || 30 }))}
                      min="1"
                      max="180"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowTestDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveTest}>
                      {editingTest ? 'Update Test' : 'Create Test'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tests Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">My Tests</h2>
          {tests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test) => (
                <Card key={test.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{test.title}</CardTitle>
                      <Badge variant={test.is_published ? "default" : "secondary"}>
                        {test.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {test.questions_count} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {test.time_limit} min
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Play className="h-4 w-4 mr-2" />
                          Take Test
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openTestDialog(test)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteTest(test.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No tests created yet</p>
                <Button onClick={() => openTestDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Test
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Questions Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Question Bank ({questions.length})</h2>
          {questions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {questions.map((question) => (
                <Card key={question.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{question.title}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline">{question.difficulty}</Badge>
                        <Badge variant="secondary">{question.skill}</Badge>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">{question.text}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        Subject: {question.subject}
                        {question.chapter && ` • Chapter: ${question.chapter}`}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openQuestionDialog(question)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No questions created yet</p>
                <Button onClick={() => openQuestionDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Question
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default CustomTests;