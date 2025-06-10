import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User Profile Functions
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Search History Functions
export const addSearchHistory = async (userId, searchItem) => {
  const { data, error } = await supabase
    .from('search_history')
    .insert([
      {
        user_id: userId,
        query: searchItem.query,
        grade_level: searchItem.gradeLevel,
        timestamp: new Date().toISOString()
      }
    ])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getSearchHistory = async (userId, limit = 100) => {
  const { data, error } = await supabase
    .from('search_history')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
};

// Practice Results Functions
export const savePracticeResult = async (userId, result) => {
  const { data, error } = await supabase
    .from('practice_results')
    .insert([
      {
        user_id: userId,
        concept_id: result.conceptId,
        score: result.score,
        total_questions: result.totalQuestions,
        correct_answers: result.correctAnswers,
        time_taken: result.timeTaken,
        difficulty: result.difficulty,
        completed_at: new Date().toISOString()
      }
    ])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getPracticeResults = async (userId, limit = 50) => {
  const { data, error } = await supabase
    .from('practice_results')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
};

// Review Items Functions
export const saveReviewItem = async (userId, item) => {
  const { data, error } = await supabase
    .from('review_items')
    .insert([
      {
        user_id: userId,
        concept: item.concept,
        prompt: item.prompt,
        level: item.level,
        interval: item.interval,
        ease: item.ease,
        review_count: item.reviewCount,
        next_review_date: item.nextReviewDate,
        created_at: new Date().toISOString()
      }
    ])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getReviewItems = async (userId) => {
  const { data, error } = await supabase
    .from('review_items')
    .select('*')
    .eq('user_id', userId)
    .order('next_review_date', { ascending: true });
  
  if (error) throw error;
  return data;
};

// Study Stats Functions
export const updateStudyStats = async (userId, stats) => {
  const { data, error } = await supabase
    .from('study_stats')
    .upsert([
      {
        user_id: userId,
        total_questions: stats.totalQuestions,
        correct_answers: stats.correctAnswers,
        search_count: stats.searchCount,
        practice_count: stats.practiceCount,
        review_count: stats.reviewCount,
        time_spent: stats.timeSpent,
        weekly_activity: stats.weeklyActivity,
        streak_days: stats.streakDays,
        last_active_date: new Date().toISOString()
      }
    ])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getStudyStats = async (userId) => {
  const { data, error } = await supabase
    .from('study_stats')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

// Concept Mastery Functions
export const updateConceptMastery = async (userId, conceptId, mastery) => {
  const { data, error } = await supabase
    .from('concept_mastery')
    .upsert([
      {
        user_id: userId,
        concept_id: conceptId,
        attempts: mastery.attempts,
        correct: mastery.correct,
        score: mastery.score,
        last_attempt: new Date().toISOString()
      }
    ])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getConceptMastery = async (userId) => {
  const { data, error } = await supabase
    .from('concept_mastery')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
}; 