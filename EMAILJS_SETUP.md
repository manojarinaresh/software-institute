# EmailJS Setup - Quick Start Guide

## ✅ EmailJS is Now Active!

The code has been updated and is ready to send emails. You just need to add your EmailJS credentials (takes 5 minutes).

---

## Step 1: Create Free EmailJS Account

1. Go to: **https://www.emailjs.com/**
2. Click **"Sign Up"** (top right)
3. Choose **FREE plan** (200 emails/month)
4. Verify your email

---

## Step 2: Connect Your Email

1. After login, click **"Email Services"** (left sidebar)
2. Click **"Add New Service"**
3. Choose your email provider:
   - **Gmail** (recommended - easiest setup)
   - Outlook
   - Yahoo
   - Custom SMTP
4. Follow prompts to connect
5. **COPY THE SERVICE ID** (looks like: `service_abc123xyz`)

---

## Step 3: Create Email Template

1. Click **"Email Templates"** (left sidebar)
2. Click **"Create New Template"**
3. **Template Name:** `User Notifications`
4. In the template editor, paste EXACTLY this:

```
Subject: {{subject}}

{{{message_html}}}
```

**IMPORTANT:** Use triple braces `{{{ }}}` for message_html (not double braces)

5. Click **Save**
6. **COPY THE TEMPLATE ID** (looks like: `template_xyz789abc`)

---

## Step 4: Get Your Public Key

1. Click **"Account"** (top right) → **"General"**
2. Find **"Public Key"** section
3. **COPY THE PUBLIC KEY** (looks like: `aBc123DeF456`)

---

## Step 5: Update Your Website

**Open file:** `js/email-service.js`

**Find lines 12-16** and replace with YOUR credentials:

```javascript
const EMAIL_CONFIG = {
    serviceId: 'service_abc123xyz',           // ← Paste YOUR Service ID here
    templateId: 'template_xyz789abc',         // ← Paste YOUR Template ID here
    userId: 'aBc123DeF456',                   // ← Paste YOUR Public Key here
    adminEmail: 'info@manojtechnologies.com'  // ← Your email to receive notifications
};
```

**Save the file.**

---

## Step 6: Test It!

1. Open your website (register.html)
2. Register a new test user
3. Check browser console (F12) - you should see: ✅ Registration email sent successfully!
4. Check your email inbox (might take 10-30 seconds)
5. Check spam folder if not in inbox

---

## ✅ What You Get

Once configured, you'll automatically receive emails for:

### Registration Email
| Field | Details |
|-------|---------|
| Full Name | User's name |
| Email | User's email |
| Phone | User's phone |
| Date | When they registered |

### Login Email
| Field | Details |
|-------|---------|
| Full Name | User's name |
| Email | User's email |
| Login Time | When they logged in |
| Subscription | Their plan status |

### Subscription Email
| Field | Details |
|-------|---------|
| Customer | Name, email, phone |
| Plan | Monthly/Quarterly/Annual |
| Amount | ₹2500/₹6500/₹10000 |
| Dates | Start and expiry |
| Payment | Last 4 card digits, transaction ID |

**🔒 Security:** Passwords and full card details are NEVER included!

---

## 🎯 Current Status

✅ EmailJS library loaded on all pages  
✅ Code ready to send emails  
✅ Data backup to localStorage working  
✅ CSV export working  
⏳ **Waiting for your EmailJS credentials**

Once you add your credentials to `EMAIL_CONFIG`, emails will send automatically!

---

## Troubleshooting

### Console says "EmailJS not configured"
→ You haven't updated the credentials in email-service.js yet. See Step 5 above.

### Error: "Invalid public key"
→ Make sure you copied the correct Public Key from Account > General

### Error: "Service not found"
→ Make sure your Service ID is correct and service is connected

### Emails not arriving
→ Check spam folder
→ Verify your admin email in EMAIL_CONFIG is correct
→ Check EmailJS dashboard for delivery status

### Free plan limits
→ 200 emails/month on free plan
→ Track usage in EmailJS dashboard
→ Upgrade if needed (starts at $15/month for 1000 emails)

---

## View Data Without Email

Even without EmailJS configured, all data is captured. To view:

**In browser console (F12):**
```javascript
// View all data
emailService.viewAllNotifications()

// Export as CSV
emailService.exportNotificationsAsCSV()
```

---

## Need Help?

- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: Through their dashboard
- Your Support: info@manojtechnologies.com | +91 9008176314

---

**🚀 Ready to go! Just add your credentials and start receiving emails!**
