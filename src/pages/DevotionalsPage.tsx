import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { 
  getTodaysDevotional, 
  getAllDevotionals, 
  getDevotionalsByTheme,
  getRandomDevotional,
  Devotional 
} from '@/lib/devotionals';
import { BIBLE_BOOKS } from '@/lib/bible-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Calendar, 
  User, 
  Quote, 
  Shuffle, 
  Book,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { format } from 'date-fns';

export default function DevotionalsPage() {
  const [currentDevotional, setCurrentDevotional] = useState<Devotional>(getTodaysDevotional());
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  const allDevotionals = getAllDevotionals();
  const themes = ['all', 'love', 'comfort', 'new beginnings', 'provision', 'strength', 'victory', 'peace'];

  const filteredDevotionals = selectedTheme === 'all' 
    ? allDevotionals 
    : getDevotionalsByTheme(selectedTheme);

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    const filtered = theme === 'all' ? allDevotionals : getDevotionalsByTheme(theme);
    if (filtered.length > 0) {
      setCurrentDevotional(filtered[0]);
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : filteredDevotionals.length - 1;
    setCurrentIndex(newIndex);
    setCurrentDevotional(filteredDevotionals[newIndex]);
  };

  const handleNext = () => {
    const newIndex = currentIndex < filteredDevotionals.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setCurrentDevotional(filteredDevotionals[newIndex]);
  };

  const handleRandom = () => {
    const randomDevotional = getRandomDevotional();
    setCurrentDevotional(randomDevotional);
    const index = filteredDevotionals.findIndex(d => d.id === randomDevotional.id);
    setCurrentIndex(index >= 0 ? index : 0);
  };

  const handleTodaysDevotional = () => {
    const todaysDevotional = getTodaysDevotional();
    setCurrentDevotional(todaysDevotional);
    setSelectedTheme('all');
    const index = allDevotionals.findIndex(d => d.id === todaysDevotional.id);
    setCurrentIndex(index);
  };

  // Parse verse reference to get book info
  const getVerseBookName = (verseRef: string) => {
    const parts = verseRef.split(' ');
    if (parts.length >= 2) {
      const bookName = parts.slice(0, -1).join(' ').toLowerCase();
      const book = BIBLE_BOOKS.find(b => 
        b.name.toLowerCase() === bookName || 
        b.id.toLowerCase() === bookName.replace(/\s+/g, '')
      );
      return book?.name || parts.slice(0, -1).join(' ');
    }
    return verseRef;
  };

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Daily Devotionals</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Filter by Theme</label>
                <Select value={selectedTheme} onValueChange={handleThemeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((theme) => (
                      <SelectItem key={theme} value={theme}>
                        {theme === 'all' ? 'All Themes' : theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Quick Actions</label>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTodaysDevotional}
                    className="flex items-center space-x-1"
                  >
                    <Calendar className="h-3 w-3" />
                    <span>Today</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRandom}
                    className="flex items-center space-x-1"
                  >
                    <Shuffle className="h-3 w-3" />
                    <span>Random</span>
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Navigation</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={filteredDevotionals.length <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    {currentIndex + 1} of {filteredDevotionals.length}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={filteredDevotionals.length <= 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Devotional */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{currentDevotional.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(), 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{currentDevotional.author}</span>
                  </div>
                </div>
              </div>
              
              <Badge variant="secondary" className="capitalize">
                {currentDevotional.theme}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Featured Verse */}
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Quote className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div className="space-y-2">
                    <p className="text-lg italic leading-relaxed">
                      "{currentDevotional.verse}"
                    </p>
                    <div className="flex items-center space-x-2">
                      <Book className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        {currentDevotional.verse_ref}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {getVerseBookName(currentDevotional.verse_ref)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Devotional Content */}
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-base leading-relaxed whitespace-pre-line">
                {currentDevotional.content}
              </p>
            </div>

            {/* Reflection Questions */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Reflection Questions</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• How does this verse speak to your current situation?</p>
                  <p>• What is one way you can apply this truth today?</p>
                  <p>• How can you share this encouragement with others?</p>
                </div>
              </CardContent>
            </Card>

            {/* Prayer Suggestion */}
            <Card className="bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>Prayer</span>
                </h4>
                <p className="text-sm text-muted-foreground italic">
                  "Lord, thank you for your Word that brings light to our path. Help me to apply 
                  today's truth in my life and to trust in your unfailing love. May your peace 
                  guard my heart and mind today. Amen."
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Browse Other Devotionals */}
        <Card>
          <CardHeader>
            <CardTitle>More Devotionals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDevotionals.slice(0, 6).map((devotional, index) => (
                <Card 
                  key={devotional.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    devotional.id === currentDevotional.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => {
                    setCurrentDevotional(devotional);
                    setCurrentIndex(index);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{devotional.title}</h4>
                        <Badge variant="outline" className="text-xs capitalize">
                          {devotional.theme}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {devotional.content.substring(0, 100)}...
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {devotional.verse_ref}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}