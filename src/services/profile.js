import { supabase, isSupabaseConfigured } from './supabase';

const ensureSupabaseConfigured = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
};

export const profileService = {
  async getProfile() {
    ensureSupabaseConfigured();
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .single();

    if (error) throw error;
    return profile;
  },

  async updateProfile(updates) {
    ensureSupabaseConfigured();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('You must be signed in to update your profile.');
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  async updatePreferences(preferences) {
    ensureSupabaseConfigured();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('You must be signed in to update preferences.');
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update({ preferences })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  async uploadAvatar(file) {
    ensureSupabaseConfigured();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('You must be signed in to upload an avatar.');
    }

    // Convert HEIC to JPEG if needed, or use original extension
    let fileExt = file.name.split('.').pop().toLowerCase();
    let uploadFile = file;
    
    // For HEIC files, we'll upload as-is but some browsers may not display them
    // Supabase accepts them, but we recommend using JPG/PNG
    if (fileExt === 'heic' || fileExt === 'heif') {
      // Keep the extension, Supabase should handle it
      fileExt = 'heic';
    }

    // File path must be: {user_id}/filename.ext to satisfy RLS policy
    const fileName = `avatar-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Delete old avatar if it exists (optional cleanup)
    try {
      const { data: existingFiles } = await supabase.storage
        .from('avatars')
        .list(user.id);
      
      if (existingFiles && existingFiles.length > 0) {
        const filesToDelete = existingFiles.map(f => `${user.id}/${f.name}`);
        await supabase.storage.from('avatars').remove(filesToDelete);
      }
    } catch (cleanupError) {
      // Ignore cleanup errors
      console.warn('Could not clean up old avatars:', cleanupError);
    }

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, uploadFile, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) throw updateError;
    return profile;
  }
}; 