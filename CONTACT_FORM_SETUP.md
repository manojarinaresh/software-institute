# Contact Form Integration Guide

## Current Status
The contact form is now configured with FormSpree integration placeholder.

## Setup Instructions:

### Option 1: FormSpree (Recommended - Free & Easy)
1. Go to https://formspree.io/
2. Sign up with your email
3. Create a new form
4. Get your unique form ID (looks like: xeojdkvq)
5. In contact.html, replace "YOUR_FORM_ID" with your actual form ID:
   ```html
   action="https://formspree.io/f/xeojdkvq"
   ```
6. All form submissions will be sent to your email!

**Benefits:**
- ✅ Free for up to 50 submissions/month
- ✅ No backend needed
- ✅ Email notifications
- ✅ Spam protection included
- ✅ Works immediately

---

### Option 2: EmailJS (No Server Needed)
1. Sign up at https://www.emailjs.com/
2. Add your email service (Gmail, Outlook, etc.)
3. Create an email template
4. Get your Service ID, Template ID, and User ID
5. Add this script to contact.html before </body>:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   <script>
     emailjs.init('YOUR_USER_ID');
   </script>
   ```
6. Update the form submission in js/script.js

**Benefits:**
- ✅ Free for 200 emails/month
- ✅ Customizable email templates
- ✅ Direct email integration

---

### Option 3: Google Sheets (Free - For Data Collection)
1. Go to https://sheet.best/
2. Connect your Google Sheets
3. Get your API endpoint
4. Update the form to POST to that endpoint

**Benefits:**
- ✅ Store all submissions in Google Sheets
- ✅ Free forever
- ✅ Easy to track and export data

---

### Option 4: Netlify Forms (If hosting on Netlify)
1. Add netlify attribute to form:
   ```html
   <form name="contact" netlify>
   ```
2. Deploy to Netlify
3. View submissions in Netlify dashboard

**Benefits:**
- ✅ Free for 100 submissions/month
- ✅ Built-in spam protection
- ✅ Dashboard to view submissions

---

### Option 5: Custom Backend (Full Control)
Create your own backend with:
- **Node.js + Nodemailer**
- **PHP mail() function**
- **Python Flask/Django**

Example with Node.js:
```javascript
// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  // Send email using nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'your-email@gmail.com', pass: 'your-password' }
  });
  
  await transporter.sendMail({
    from: email,
    to: 'skyedge@example.com',
    subject: `New Contact Form: ${name}`,
    text: message
  });
  
  res.json({ success: true });
});
```

---

## Quick Setup: FormSpree (Recommended)

**Step-by-step:**
1. Visit: https://formspree.io/
2. Click "Get Started"
3. Sign up with your email (info@skyedgetechnologies.com)
4. Click "New Form"
5. Copy your form endpoint
6. Replace in contact.html line 46:
   ```html
   action="https://formspree.io/f/YOUR_ACTUAL_ID"
   ```
7. Test the form - submissions go to your email!

**No coding or server setup required!**

---

## Need Help?
Let me know which option you'd like to use and I'll help you set it up completely!
