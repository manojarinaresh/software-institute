# How to View Captured Registration/Login/Subscription Data

## Quick Access (Without Email Setup)

All data is automatically stored in your browser's localStorage. Here's how to access it:

### Method 1: View in Console (Instant)

1. Open any page of your website (e.g., index.html)
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Run this command:
   ```javascript
   emailService.viewAllNotifications()
   ```
5. You'll see a table with all registrations, logins, and subscriptions

### Method 2: Export as Excel/CSV File

1. Open any page of your website
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Run this command:
   ```javascript
   emailService.exportNotificationsAsCSV()
   ```
5. A CSV file will automatically download
6. Open with Excel or Google Sheets

### Method 3: View Raw Data in Browser Storage

1. Open any page of your website
2. Press **F12** to open Developer Tools
3. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
4. On the left, expand **Local Storage**
5. Click on your website URL
6. Find the key: `emailNotifications`
7. Click to view all captured data

---

## Enable Email Notifications (Optional - Takes 10 Minutes)

To receive emails automatically, follow these steps:

### Step 1: Sign Up for EmailJS (Free - 200 emails/month)

1. Go to https://www.emailjs.com/
2. Click "Sign Up"
3. Choose "Free" plan (no credit card required)
4. Verify your email

### Step 2: Connect Your Email Account

1. After login, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider:
   - Gmail (recommended)
   - Outlook
   - Yahoo
   - Or any SMTP service
4. Follow the prompts to connect your account
5. **Copy the Service ID** (looks like: service_abc123)

### Step 3: Create Email Template

1. Go to **Email Templates**
2. Click **Create New Template**
3. Template Name: `User Activity Notification`
4. In the template editor, paste this:
   ```
   Subject: {{subject}}
   
   {{{message_html}}}
   ```
   Note: Use triple braces {{{ }}} for message_html
5. Click **Save**
6. **Copy the Template ID** (looks like: template_xyz789)

### Step 4: Get Your Public Key

1. Go to **Account** > **General**
2. Find **Public Key** section
3. **Copy the Public Key** (looks like: abc123xyz789)

### Step 5: Update Your Website Files

Open the file: `js/email-service.js`

Find lines 4-13 and update with your credentials:

```javascript
const EMAIL_CONFIG = {
    serviceId: 'service_abc123',           // Paste your Service ID here
    templateId: 'template_xyz789',         // Paste your Template ID here
    userId: 'abc123xyz789',                // Paste your Public Key here
    adminEmail: 'info@manojtechnologies.in'  // Your email address
};
```

### Step 6: Enable Email Sending

In the same file (`js/email-service.js`):

1. Find line 22 and uncomment:
   ```javascript
   emailjs.init(EMAIL_CONFIG.userId);
   ```
   Change to:
   ```javascript
   emailjs.init(EMAIL_CONFIG.userId);  // Remove the //
   ```

2. Find line 55 and uncomment:
   ```javascript
   // await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, emailParams);
   ```
   Change to:
   ```javascript
   await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, emailParams);
   ```

3. Repeat for lines:
   - Line 91 (login email)
   - Line 147 (subscription email)

### Step 7: Add EmailJS Library to HTML Files

Add this line to the `<head>` section of these files:
- register.html
- login.html
- subscription.html

```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
```

Add it right before the closing `</head>` tag.

### Step 8: Test the System

1. Open your website
2. Go to registration page
3. Register a new test user
4. Check your email inbox - you should receive a notification within seconds!

---

## What Data is Captured?

### Registration:
- Full Name
- Email Address
- Phone Number
- Registration Date
- ❌ Password is NEVER captured

### Login:
- Full Name
- Email Address
- Login Time
- Subscription Status
- ❌ Password is NEVER captured

### Subscription:
- Customer Name, Email, Phone
- Plan Type (Monthly/Quarterly/Annual)
- Amount Paid
- Start and Expiry Dates
- Cardholder Name
- Last 4 digits of card only
- Transaction ID
- ❌ Full card number, CVV, expiry NEVER captured

---

## Troubleshooting

### "emailService is not defined"
- Make sure you're on a page where the script is loaded (register.html, login.html, or subscription.html)
- Or load it manually: Open any page, press F12, go to Console, and paste the email-service.js code

### "No notifications to export"
- This means no users have registered/logged in yet
- Try registering a test user first

### Emails not arriving after setup
1. Check EmailJS dashboard for delivery status
2. Check spam/junk folder
3. Verify all credentials are correct
4. Check browser console for error messages
5. Make sure you uncommented all the lines mentioned in Step 6

### Free Plan Limits
- EmailJS free plan: 200 emails/month
- If you exceed, upgrade to paid plan or use alternative service

---

## Alternative: Manual Daily Reports

If you don't want to set up email now, you can manually export data daily:

1. Open your website
2. Press F12 > Console
3. Run: `emailService.exportNotificationsAsCSV()`
4. Open the CSV file in Excel
5. Keep a backup of this data

This way you'll have all user activity without setting up emails!

---

## Need Help?

Contact: info@manojtechnologies.in | +91 9008176314
