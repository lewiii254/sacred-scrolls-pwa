-- Create Bible translations table
CREATE TABLE public.bible_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE, -- KJV, NIV, ESV, etc.
  name TEXT NOT NULL, -- King James Version, New International Version, etc.
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Bible books table
CREATE TABLE public.bible_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number INTEGER NOT NULL, -- 1-66
  name TEXT NOT NULL, -- Genesis, Exodus, etc.
  testament TEXT NOT NULL CHECK (testament IN ('OT', 'NT')),
  chapters_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Bible verses table
CREATE TABLE public.bible_verses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  translation_id UUID NOT NULL REFERENCES public.bible_translations(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.bible_books(id) ON DELETE CASCADE,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(translation_id, book_id, chapter, verse)
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  preferred_translation TEXT DEFAULT 'KJV',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user notes table
CREATE TABLE public.user_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_id UUID NOT NULL REFERENCES public.bible_books(id) ON DELETE CASCADE,
  chapter INTEGER NOT NULL,
  verse INTEGER,
  note_text TEXT NOT NULL,
  color TEXT DEFAULT 'yellow' CHECK (color IN ('yellow', 'green', 'blue', 'red', 'purple')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user bookmarks table
CREATE TABLE public.user_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_id UUID NOT NULL REFERENCES public.bible_books(id) ON DELETE CASCADE,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user highlights table
CREATE TABLE public.user_highlights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_id UUID NOT NULL REFERENCES public.bible_books(id) ON DELETE CASCADE,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  color TEXT NOT NULL DEFAULT 'yellow' CHECK (color IN ('yellow', 'green', 'blue', 'red', 'purple')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily devotionals table
CREATE TABLE public.daily_devotionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  verse_reference TEXT, -- e.g., "John 3:16"
  book_id UUID REFERENCES public.bible_books(id),
  chapter INTEGER,
  verse INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reading streaks table
CREATE TABLE public.reading_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  chapters_read INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create reading plans table
CREATE TABLE public.reading_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reading plan days table
CREATE TABLE public.reading_plan_days (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES public.reading_plans(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  book_id UUID NOT NULL REFERENCES public.bible_books(id) ON DELETE CASCADE,
  chapter_start INTEGER NOT NULL,
  chapter_end INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bible_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_devotionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_plan_days ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access to Bible data
CREATE POLICY "Bible translations are viewable by everyone" 
ON public.bible_translations FOR SELECT USING (true);

CREATE POLICY "Bible books are viewable by everyone" 
ON public.bible_books FOR SELECT USING (true);

CREATE POLICY "Bible verses are viewable by everyone" 
ON public.bible_verses FOR SELECT USING (true);

CREATE POLICY "Daily devotionals are viewable by everyone" 
ON public.daily_devotionals FOR SELECT USING (true);

CREATE POLICY "Reading plans are viewable by everyone" 
ON public.reading_plans FOR SELECT USING (true);

CREATE POLICY "Reading plan days are viewable by everyone" 
ON public.reading_plan_days FOR SELECT USING (true);

-- RLS Policies for user-specific data
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own notes" 
ON public.user_notes FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own bookmarks" 
ON public.user_bookmarks FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own highlights" 
ON public.user_highlights FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own reading streaks" 
ON public.reading_streaks FOR ALL USING (auth.uid()::text = user_id::text);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_notes_updated_at
  BEFORE UPDATE ON public.user_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample Bible books (first few for demonstration)
INSERT INTO public.bible_books (number, name, testament, chapters_count) VALUES
(1, 'Genesis', 'OT', 50),
(2, 'Exodus', 'OT', 40),
(3, 'Leviticus', 'OT', 27),
(39, 'Malachi', 'OT', 4),
(40, 'Matthew', 'NT', 28),
(41, 'Mark', 'NT', 16),
(42, 'Luke', 'NT', 24),
(43, 'John', 'NT', 21),
(66, 'Revelation', 'NT', 22);

-- Insert sample Bible translations
INSERT INTO public.bible_translations (code, name, language) VALUES
('KJV', 'King James Version', 'en'),
('NIV', 'New International Version', 'en'),
('ESV', 'English Standard Version', 'en'),
('NLT', 'New Living Translation', 'en');

-- Insert a sample daily devotional
INSERT INTO public.daily_devotionals (date, title, content, verse_reference) VALUES
(CURRENT_DATE, 'God''s Love', 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life. This verse reminds us of the incredible depth of God''s love for humanity.', 'John 3:16');