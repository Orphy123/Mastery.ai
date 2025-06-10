-- Create search_history table
CREATE TABLE IF NOT EXISTS search_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    query TEXT NOT NULL,
    grade_level TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create practice_results table
CREATE TABLE IF NOT EXISTS practice_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    concept_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    time_taken INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create review_items table
CREATE TABLE IF NOT EXISTS review_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    concept TEXT NOT NULL,
    prompt TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    interval INTEGER DEFAULT 0,
    ease REAL DEFAULT 2.5,
    review_count INTEGER DEFAULT 0,
    next_review_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create study_stats table
CREATE TABLE IF NOT EXISTS study_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    search_count INTEGER DEFAULT 0,
    practice_count INTEGER DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    weekly_activity JSONB DEFAULT '[]'::jsonb,
    streak_days INTEGER DEFAULT 0,
    last_active_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create concept_mastery table
CREATE TABLE IF NOT EXISTS concept_mastery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    concept_id TEXT NOT NULL,
    attempts INTEGER DEFAULT 0,
    correct INTEGER DEFAULT 0,
    score REAL DEFAULT 0,
    last_attempt TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, concept_id)
);

-- Enable Row Level Security for all tables
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_mastery ENABLE ROW LEVEL SECURITY;

-- Create policies for search_history
CREATE POLICY "Users can view their own search history"
    ON search_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own search history"
    ON search_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policies for practice_results
CREATE POLICY "Users can view their own practice results"
    ON practice_results FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own practice results"
    ON practice_results FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policies for review_items
CREATE POLICY "Users can view their own review items"
    ON review_items FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own review items"
    ON review_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own review items"
    ON review_items FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policies for study_stats
CREATE POLICY "Users can view their own study stats"
    ON study_stats FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own study stats"
    ON study_stats FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study stats"
    ON study_stats FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policies for concept_mastery
CREATE POLICY "Users can view their own concept mastery"
    ON concept_mastery FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own concept mastery"
    ON concept_mastery FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own concept mastery"
    ON concept_mastery FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for avatars
CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]); 