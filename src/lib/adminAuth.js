import supabase from './supabase';

class AdminAuth {
  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };

      const { data: profile, error: profileError } = await supabase
        .from('profiles_la2024')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || profile?.role !== 'admin') {
        await supabase.auth.signOut();
        return { success: false, error: 'Access denied. Admin privileges required.' };
      }

      return { success: true, user: { id: data.user.id, email: data.user.email, role: 'admin' } };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async logout() {
    await supabase.auth.signOut();
  }

  getUser() {
    try {
      const keys = Object.keys(localStorage);
      const authKey = keys.find(key => key.startsWith('sb-') && key.endsWith('-auth-token'));
      if (authKey) {
        const session = JSON.parse(localStorage.getItem(authKey));
        if (session?.user) {
          return {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            role: 'admin'
          };
        }
      }
    } catch (e) {
      console.error('Error getting cached admin user:', e);
    }
    return null;
  }
}

export default new AdminAuth();
