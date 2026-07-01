# Lillian Adegbola Website

A professional website for leadership coach and keynote speaker Lillian Adegbola, featuring admin dashboard, blog management, and client engagement tools.

## Quick Start

### For Windows Users:
```bash
# Double-click build.bat or run:
build.bat
```

### For Mac/Linux Users:
```bash
# Make executable and run:
chmod +x build-and-deploy.sh
./build-and-deploy.sh
```

### Manual Build:
```bash
npm install
npm run build
```

## Deployment to cPanel

### Method 1: File Manager Upload
1. Run the build script above
2. Login to your cPanel
3. Open File Manager → public_html
4. Upload ALL files from the `dist` folder
5. Upload the `.htaccess` file
6. Test your website

### Method 2: ZIP Upload (Easier)
1. After building, you'll have `lillian-website-deploy.zip`
2. Upload this ZIP to cPanel File Manager
3. Extract it in public_html
4. Upload the `.htaccess` file separately

## Admin Access
- URL: `yourdomain.com/#/admin`
- Username: `Lilian.Adegbola`
- Password: `Adegbola@2025`

## Features
- ✅ Responsive design for all devices
- ✅ Admin dashboard for content management
- ✅ Blog system with rich content
- ✅ Contact form with database storage
- ✅ Booking system for consultations
- ✅ Newsletter subscription
- ✅ Testimonials management
- ✅ SEO optimization
- ✅ Social media integration

## Technology Stack
- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (Database + Auth)
- **Deployment**: Static hosting (cPanel compatible)
- **Admin**: Full content management system

## File Structure After Build
```
dist/
├── index.html          # Main page
├── assets/             # CSS, JS, images
├── admin/              # Admin routes (handled by React Router)
└── [other static files]
```

## Troubleshooting

### Build Issues
If you get ESLint errors:
```bash
# Skip linting and build directly
npm run build
```

### Routing Issues (404 on refresh)
Make sure `.htaccess` is uploaded to handle React Router:
```apache
RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Admin Access Issues
- Clear browser cache
- Check URL: `yourdomain.com/#/admin`
- Verify credentials: `Lilian.Adegbola` / `Adegbola@2025`

## Support
- Check browser console for JavaScript errors
- Verify all files uploaded correctly
- Ensure .htaccess file is in place
- Test on different devices and browsers

## Performance
- ✅ Optimized images and assets
- ✅ Compressed CSS and JavaScript
- ✅ Browser caching configured
- ✅ Mobile-first responsive design

Built with ❤️ for transformational leadership