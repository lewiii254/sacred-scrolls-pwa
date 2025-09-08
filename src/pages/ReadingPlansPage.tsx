import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Calendar, Target, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  duration_days: number;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface UserPlanProgress {
  planId: string;
  startDate: string;
  currentDay: number;
  completedDays: number[];
  completed: boolean;
}

const SAMPLE_READING_PLANS: ReadingPlan[] = [
  {
    id: '1',
    name: 'Bible in a Year',
    description: 'Read through the entire Bible in 365 days with a systematic approach.',
    duration_days: 365,
    category: 'Complete Bible',
    difficulty: 'Intermediate'
  },
  {
    id: '2',
    name: 'New Testament in 30 Days',
    description: 'Focus on the New Testament with daily readings designed for completion in one month.',
    duration_days: 30,
    category: 'New Testament',
    difficulty: 'Beginner'
  },
  {
    id: '3',
    name: 'Psalms & Proverbs',
    description: 'Daily wisdom from Psalms and Proverbs for spiritual growth and reflection.',
    duration_days: 60,
    category: 'Wisdom Literature',
    difficulty: 'Beginner'
  },
  {
    id: '4',
    name: 'Gospel Deep Dive',
    description: 'In-depth study of the four Gospels with detailed daily readings.',
    duration_days: 90,
    category: 'Gospels',
    difficulty: 'Advanced'
  },
  {
    id: '5',
    name: 'Paul\'s Letters',
    description: 'Journey through the epistles of Paul with contextual study.',
    duration_days: 45,
    category: 'Epistles',
    difficulty: 'Intermediate'
  }
];

export default function ReadingPlansPage() {
  const { user } = useAuth();
  const [availablePlans] = useState<ReadingPlan[]>(SAMPLE_READING_PLANS);
  const [userProgress, setUserProgress] = useState<UserPlanProgress[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    if (user) {
      loadUserProgress();
    }
  }, [user]);

  const loadUserProgress = () => {
    // Load from localStorage for now
    const saved = localStorage.getItem(`reading_plans_${user?.id}`);
    if (saved) {
      setUserProgress(JSON.parse(saved));
    }
  };

  const saveUserProgress = (progress: UserPlanProgress[]) => {
    if (user) {
      localStorage.setItem(`reading_plans_${user.id}`, JSON.stringify(progress));
      setUserProgress(progress);
    }
  };

  const startPlan = (planId: string) => {
    if (!user) {
      toast.error('Please sign in to start a reading plan');
      return;
    }

    const existingProgress = userProgress.find(p => p.planId === planId);
    if (existingProgress) {
      toast.error('You have already started this plan');
      return;
    }

    const newProgress: UserPlanProgress = {
      planId,
      startDate: new Date().toISOString(),
      currentDay: 1,
      completedDays: [],
      completed: false
    };

    saveUserProgress([...userProgress, newProgress]);
    toast.success('Reading plan started! Happy reading!');
  };

  const markDayComplete = (planId: string, day: number) => {
    const updatedProgress = userProgress.map(progress => {
      if (progress.planId === planId) {
        const completedDays = [...progress.completedDays, day];
        const plan = availablePlans.find(p => p.id === planId);
        const completed = plan ? completedDays.length >= plan.duration_days : false;
        
        return {
          ...progress,
          completedDays,
          currentDay: Math.min(day + 1, plan?.duration_days || day + 1),
          completed
        };
      }
      return progress;
    });

    saveUserProgress(updatedProgress);
    toast.success('Day marked as complete!');
  };

  const getProgressPercentage = (planId: string): number => {
    const progress = userProgress.find(p => p.planId === planId);
    const plan = availablePlans.find(p => p.id === planId);
    
    if (!progress || !plan) return 0;
    return (progress.completedDays.length / plan.duration_days) * 100;
  };

  const getUserPlanStatus = (planId: string): 'not_started' | 'in_progress' | 'completed' => {
    const progress = userProgress.find(p => p.planId === planId);
    if (!progress) return 'not_started';
    if (progress.completed) return 'completed';
    return 'in_progress';
  };

  const filteredPlans = availablePlans.filter(plan => {
    const categoryMatch = selectedCategory === 'all' || plan.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || plan.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const categories = ['all', ...Array.from(new Set(availablePlans.map(p => p.category)))];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reading Plans</h1>
            <p className="text-muted-foreground">
              Structured Bible reading plans to guide your spiritual journey
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty === 'all' ? 'All Levels' : difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Plans */}
        {user && userProgress.filter(p => !p.completed).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Your Active Plans</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {userProgress
                  .filter(progress => !progress.completed)
                  .map(progress => {
                    const plan = availablePlans.find(p => p.id === progress.planId);
                    const percentage = getProgressPercentage(progress.planId);
                    
                    if (!plan) return null;
                    
                    return (
                      <Card key={progress.planId} className="border-l-4 border-l-primary">
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{plan.name}</h4>
                              <Badge variant="outline">{plan.difficulty}</Badge>
                            </div>
                            <Progress value={percentage} className="h-2" />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>Day {progress.currentDay} of {plan.duration_days}</span>
                              <span>{Math.round(percentage)}% complete</span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => markDayComplete(progress.planId, progress.currentDay)}
                              disabled={progress.completedDays.includes(progress.currentDay)}
                              className="w-full"
                            >
                              {progress.completedDays.includes(progress.currentDay) 
                                ? 'Day Complete' 
                                : 'Mark Today Complete'
                              }
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Plans */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map(plan => {
            const status = getUserPlanStatus(plan.id);
            const progress = getProgressPercentage(plan.id);
            
            return (
              <Card key={plan.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    {status === 'completed' && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{plan.category}</Badge>
                    <Badge variant={
                      plan.difficulty === 'Beginner' ? 'default' :
                      plan.difficulty === 'Intermediate' ? 'secondary' : 'outline'
                    }>
                      {plan.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{plan.duration_days} days</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>~{Math.round(plan.duration_days / 30)} months</span>
                    </div>
                  </div>

                  {status === 'in_progress' && (
                    <div className="space-y-2">
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {Math.round(progress)}% complete
                      </p>
                    </div>
                  )}

                  <Button 
                    className="w-full"
                    onClick={() => startPlan(plan.id)}
                    disabled={status !== 'not_started'}
                    variant={status === 'completed' ? 'outline' : 'default'}
                  >
                    {status === 'not_started' && 'Start Plan'}
                    {status === 'in_progress' && 'Continue Reading'}
                    {status === 'completed' && 'Completed ✓'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredPlans.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No plans found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more reading plans.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}