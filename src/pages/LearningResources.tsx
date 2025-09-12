import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Search, Star, BookOpen, Monitor, Globe } from 'lucide-react';

interface LearningResource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  subject: string;
  difficulty_level: string;
  is_featured: boolean;
}

const LearningResources = () => {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<LearningResource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchTerm, categoryFilter, difficultyFilter]);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_resources')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('title');

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching learning resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(resource => resource.category === categoryFilter);
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(resource => resource.difficulty_level === difficultyFilter);
    }

    setFilteredResources(filtered);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic': return <BookOpen className="h-5 w-5" />;
      case 'programming': return <Monitor className="h-5 w-5" />;
      case 'language': return <Globe className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-500/10 text-red-700 border-red-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg animate-pulse mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading learning resources...</p>
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
            <h1 className="text-3xl font-bold">Learning Resources</h1>
            <p className="text-muted-foreground">Explore curated learning websites and platforms</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="programming">Programming</SelectItem>
              <SelectItem value="language">Language</SelectItem>
              <SelectItem value="video">Video Learning</SelectItem>
            </SelectContent>
          </Select>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Featured Resources */}
        {filteredResources.some(r => r.is_featured) && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Featured Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources
                .filter(resource => resource.is_featured)
                .map((resource) => (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(resource.category)}
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                        </div>
                        <Badge className={getDifficultyColor(resource.difficulty_level)}>
                          {resource.difficulty_level}
                        </Badge>
                      </div>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {resource.subject}
                        </div>
                        <Button asChild size="sm">
                          <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            Visit <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* All Resources */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources
              .filter(resource => !resource.is_featured)
              .map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(resource.category)}
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                      </div>
                      <Badge className={getDifficultyColor(resource.difficulty_level)}>
                        {resource.difficulty_level}
                      </Badge>
                    </div>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {resource.subject}
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          Visit <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">No resources found matching your criteria.</div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default LearningResources;