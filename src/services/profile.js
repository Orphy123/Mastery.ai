import { supabase } from './supabase';

export const profileService = {
  async getProfile() {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .single();

    if (error) throw error;
    return profile;
  },

  async updateProfile(updates) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', (await supabase.auth.getUser()).data.user.id)
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  async updatePreferences(preferences) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({ preferences })
      .eq('id', (await supabase.auth.getUser()).data.user.id)
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  async uploadAvatar(file) {
    const user = (await supabase.auth.getUser()).data.user;
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

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