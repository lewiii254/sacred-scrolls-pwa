import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Heart, Bookmark, FileText, TrendingUp, Calendar } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

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
              <p className="text-2xl font-bold">7</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Book className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">Books Read</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Bookmark className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Bookmarks</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">Notes</p>
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
            <CardDescription>God's Love</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life. This verse reminds us of the incredible depth of God's love for humanity.
            </p>
            <p className="text-xs text-muted-foreground italic">- John 3:16</p>
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
              <p className="text-sm text-muted-foreground">Last read: Psalms 23</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/search")}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-accent" />
                <span>Daily Reading Plan</span>
              </CardTitle>
              <CardDescription>Stay on track with your goals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Today: Genesis 1-3</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
