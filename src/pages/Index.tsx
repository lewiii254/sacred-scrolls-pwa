import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useBibleStudy } from "@/contexts/BibleStudyContext";
import { getTodaysDevotional } from "@/lib/devotionals";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Heart, Bookmark, FileText, TrendingUp, Calendar, Palette } from "lucide-react";
import { useEffect, useState } from "react";

const Index = () => {
  const { user, loading } = useAuth();
  const { notes, bookmarks, highlights } = useBibleStudy();
  const navigate = useNavigate();
  const [todaysDevotional, setTodaysDevotional] = useState(getTodaysDevotional());
  const [readingStreak, setReadingStreak] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Calculate reading streak from localStorage
    const lastReadDate = localStorage.getItem('lastReadDate');
    const streakCount = localStorage.getItem('readingStreak');
    
    if (lastReadDate && streakCount) {
      const today = new Date().toDateString();
      const lastRead = new Date(lastReadDate).toDateString();
      
      if (today === lastRead) {
        setReadingStreak(parseInt(streakCount));
      } else {
        // Reset streak if not read today
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (yesterday.toDateString() === lastRead) {
          setReadingStreak(parseInt(streakCount));
        } else {
          setReadingStreak(0);
        }
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Book className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Get unique books from user data
  const booksWithNotes = [...new Set(notes.map(note => note.book_id))].length;
  const booksWithBookmarks = [...new Set(bookmarks.map(bookmark => bookmark.book_id))].length;
  const booksWithHighlights = [...new Set(highlights.map(highlight => highlight.book_id))].length;
  const totalUniqueBooks = new Set([
    ...notes.map(n => n.book_id),
    ...bookmarks.map(b => b.book_id),
    ...highlights.map(h => h.book_id)
  ]).size;

  // Get today's stats
  const today = new Date().toDateString();
  const todaysNotes = notes.filter(note => 
    new Date(note.created_at).toDateString() === today
  ).length;
  const todaysBookmarks = bookmarks.filter(bookmark => 
    new Date(bookmark.created_at).toDateString() === today
  ).length;
  const todaysHighlights = highlights.filter(highlight => 
    new Date(highlight.created_at).toDateString() === today
  ).length;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary">Welcome Back!</h1>
          <p className="text-muted-foreground">Continue your spiritual journey</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{readingStreak}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Book className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold">{totalUniqueBooks}</p>
              <p className="text-sm text-muted-foreground">Books Studied</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Bookmark className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{bookmarks.length}</p>
              <p className="text-sm text-muted-foreground">Bookmarks</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{notes.length}</p>
              <p className="text-sm text-muted-foreground">Notes</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Activity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Calendar className="h-4 w-4" />
                <span>Today's Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Notes Created</span>
                <span className="font-medium">{todaysNotes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bookmarks Added</span>
                <span className="font-medium">{todaysBookmarks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Verses Highlighted</span>
                <span className="font-medium">{todaysHighlights}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Palette className="h-4 w-4" />
                <span>Study Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Highlights</span>
                <span className="font-medium">{highlights.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Books with Notes</span>
                <span className="font-medium">{booksWithNotes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Books Bookmarked</span>
                <span className="font-medium">{booksWithBookmarks}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <TrendingUp className="h-4 w-4" />
                <span>Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Reading Consistency</span>
                  <span>{readingStreak > 0 ? 'Active' : 'Start Today'}</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(readingStreak * 10, 100)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Bible Coverage</span>
                  <span>{Math.round((totalUniqueBooks / 66) * 100)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div 
                    className="h-full bg-accent rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((totalUniqueBooks / 66) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Devotional */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Today's Devotional</span>
            </CardTitle>
            <CardDescription>{todaysDevotional.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4 line-clamp-3">
              {todaysDevotional.content.substring(0, 200)}...
            </p>
            <p className="text-xs text-muted-foreground italic mb-4">
              "{todaysDevotional.verse}" - {todaysDevotional.verse_ref}
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/devotionals")}
            >
              Read Full Devotional
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/bible")}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Book className="h-5 w-5 text-primary" />
                <span>Continue Reading</span>
              </CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {totalUniqueBooks > 0 
                  ? `You've studied ${totalUniqueBooks} book${totalUniqueBooks === 1 ? '' : 's'} so far`
                  : 'Start your Bible reading journey today'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/search")}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-accent" />
                <span>Explore Scripture</span>
              </CardTitle>
              <CardDescription>Search and discover God's Word</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {notes.length > 0 
                  ? `You have ${notes.length} note${notes.length === 1 ? '' : 's'} to review`
                  : 'Search verses and add your first note'
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
