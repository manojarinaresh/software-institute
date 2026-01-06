# Tech Masters Institute Website

A modern, responsive website for a software training institute built with HTML, CSS, and JavaScript.

## 📁 Project Structure

```
software-institute/
├── index.html          # Home page
├── about.html          # About us page
├── courses.html        # Courses listing page
├── contact.html        # Contact page
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   └── script.js       # JavaScript functionality
└── images/             # Image assets folder
```

## 🚀 Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean and professional interface with smooth animations
- **Interactive Navigation**: Mobile-friendly hamburger menu
- **Contact Form**: Functional form with validation
- **Course Catalog**: Detailed information about all available courses
- **Scroll Animations**: Elements animate as you scroll down the page
- **Back to Top Button**: Smooth scroll to top functionality

## 📄 Pages

1. **Home (index.html)**
   - Hero section with call-to-action buttons
   - Features showcase
   - Popular courses preview
   - Statistics section
   - Footer with links and contact info

2. **About (about.html)**
   - Company story and mission
   - Core values
   - Team members showcase
   - Vision and goals

3. **Courses (courses.html)**
   - Full Stack Web Development
   - Python & Data Science
   - Mobile App Development
   - Cloud Computing & DevOps
   - Cybersecurity Fundamentals
   - UI/UX Design

4. **Contact (contact.html)**
   - Contact form with validation
   - Contact information
   - Office hours
   - Map placeholder

## 🎨 Customization

### Colors
Edit the CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --accent-color: #10b981;
    /* ... more colors */
}
```

### Content
- Update company name in all HTML files
- Modify course information in `courses.html`
- Change contact details in `contact.html` and footer sections
- Add your logo/images to the `images/` folder

### Form Integration
Replace the simulated form submission in `js/script.js` with your actual backend API:
```javascript
fetch('/api/contact', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
})
```

## 🌐 How to Use

1. **Local Development**:
   - Open `index.html` in your web browser
   - Or use a local server (e.g., Live Server extension in VS Code)

2. **Deployment**:
   - Upload all files to your web hosting service
   - Ensure folder structure is maintained
   - Update paths if deploying to a subdirectory

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🛠️ Technologies Used

- HTML5
- CSS3 (with Flexbox and Grid)
- Vanilla JavaScript (ES6+)
- No external frameworks or libraries required

## 📝 To-Do / Future Enhancements

- [ ] Add actual images to the `images/` folder
- [ ] Integrate with a backend API for form submissions
- [ ] Add student testimonials section
- [ ] Implement blog functionality
- [ ] Add course registration system
- [ ] Integrate Google Maps for location
- [ ] Add multilingual support
- [ ] Implement dark mode toggle

## 📞 Support

For questions or support, contact: info@techmasters.com

---

**© 2026 Tech Masters Institute. All rights reserved.**
