import supabase from './supabase';

// Admin authentication with real credentials
class AdminAuth {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('admin_user') || 'null');
  }

  async login(email, password) {
    try {
      // Real admin credentials
      if (email === 'Lilian.Adegbola' && password === 'Adegbola@2025') {
        const user = {
          id: '1',
          email: 'Lilian.Adegbola',
          name: 'Lillian Adegbola',
          role: 'super_admin'
        };
        
        this.currentUser = user;
        localStorage.setItem('admin_user', JSON.stringify(user));
        return { success: true, user };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('admin_user');
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  getUser() {
    return this.currentUser;
  }
}

export default new AdminAuth();