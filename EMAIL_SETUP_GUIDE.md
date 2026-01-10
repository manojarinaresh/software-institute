# Email Notification Setup Guide

## Overview
The platform now captures all user activity (registrations, logins, and subscriptions) and sends email notifications with detailed tables to the admin email address.

## 🔒 Security Features

**The system NEVER captures or transmits:**
- ❌ User passwords
- ❌ Full credit card numbers (only last 4 digits stored)
- ❌ CVV codes
- ❌ Card expiry dates

All sensitive information is automatically excluded from emails and localStorage for your security.

## Features Implemented

### 1. **Registration Notifications**
When a user registers, an email is sent with:
- Full Name
- Email Address
- Phone Number
- Registration Date/Time
- ⚠️ Password is NEVER included

### 2. **Login Notifications**
When a user logs in, an email is sent with:
- Full Name
- Email Address
- Login Time
- Subscription Status
- ⚠️ Password is NEVER included

### 3. **Subscription Notifications**
When a user purchases a subscription, an email is sent with:
- Customer Information (Name, Email, Phone)
- Subscription Details (Plan, Amount, Duration, Dates)
- Payment Information (Cardholder Name, Last 4 digits of card only, Transaction ID)
- ⚠️ Full card number, CVV, and expiry are NEVER included

## Setup Instructions

### Option 1: Using EmailJS (Recommended - Free & Easy)

1. **Sign Up for EmailJS**
   - Go to https://www.emailjs.com/
   - Create a free account (allows 200 emails/month)

2. **Create an Email Service**
   - Go to Email Services
   - Click "Add New Service"
   - Choose Gmail, Outlook, or any SMTP provider
   - Connect your email account
   - Note the **Service ID**

3. **Create an Email Template**
   - Go to Email Templates
   - Click "Create New Template"
   - Template Content:
     ```
     Subject: {{subject}}
     
     {{message_html}}
     ```
   - Note the **Template ID**

4. **Get Your Public Key**
   - Go to Account > General
   - Copy your **Public Key**

5. **Update Configuration**
   - Open `js/email-service.js`
   - Update lines 4-8:
     ```javascript
     const EMAIL_CONFIG = {
         serviceId: 'YOUR_SERVICE_ID',     // From step 2
         templateId: 'YOUR_TEMPLATE_ID',   // From step 3
         userId: 'YOUR_PUBLIC_KEY',        // From step 4
         adminEmail: 'info@manojtechnologies.in' // Your receiving email
     };
     ```

6. **Add EmailJS Library**
   - Open `register.html`, `login.html`, and `subscription.html`
   - Add this line in the `<head>` section:
     ```html
     <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
     ```

7. **Uncomment Email Functions**
   - In `js/email-service.js`, uncomment these lines:
     - Line 13: `// emailjs.init(EMAIL_CONFIG.userId);`
     - Line 46: `// await emailjs.send(...)`
     - Line 82: `// await emailjs.send(...)`
     - Line 138: `// await emailjs.send(...)`

### Option 2: Using Web3Forms (Alternative - No Registration Required)

1. Visit https://web3forms.com/
2. Get a free API key
3. Use their SMTP relay service
4. Update the configuration accordingly

## Data Storage & Backup

Even without email configuration, all data is automatically stored in browser's localStorage:

### View All Stored Data
Open browser console and run:
```javascript
emailService.viewAllNotifications()
```

### Export Data as CSV
Open browser console and run:
```javascript
emailService.exportNotificationsAsCSV()
```

This will download a CSV file with all registrations, logins, and subscriptions.

### Manual Data Export Steps
1. Open any page of the website
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Type: `emailService.exportNotificationsAsCSV()`
5. Press Enter
6. A CSV file will download automatically

## Email Table Format

All emails are sent with HTML tables for easy reading:

**Registration Email:**
| Field | Details |
|-------|---------|
| Full Name | John Doe |
| Email | john@example.com |
| Phone | +91 9876543210 |
| Registration Date | Jan 8, 2026, 10:30 AM |

**Subscription Email:**
| Field | Details |
|-------|---------|
| **Customer Information** | |
| Full Name | John Doe |
| Email | john@example.com |
| Phone | +91 9876543210 |
| **Subscription Details** | |
| Plan | Annual Plan |
| Amount | ₹10,000 |
| Purchase Date | Jan 8, 2026, 10:30 AM |
| Expiry Date | Jan 8, 2027, 10:30 AM |
| Duration | 365 days |
| **Payment Information** | |
| Cardholder Name | John Doe |
| Card Number | **** **** **** 1234 |
| Transaction ID | TXN-1704711000000 |

## Testing

1. **Test Registration:**
   - Go to register.html
   - Fill in the form
   - Submit
   - Check console for "Registration email sent" message
   - Check your admin email (if configured)

2. **Test Login:**
   - Go to login.html
   - Login with registered credentials
   - Check console for "Login email sent" message

3. **Test Subscription:**
   - Login first
   - Go to subscription.html
   - Select a plan and fill payment form
   - Submit
   - Check console for "Subscription email sent" message

## Troubleshooting

### Emails not sending?
1. Check browser console for errors
2. Verify EmailJS credentials are correct
3. Make sure EmailJS script is loaded
4. Check your EmailJS monthly quota

### Data not storing?
1. Check if localStorage is enabled in browser
2. Try in incognito/private mode
3. Clear browser cache and try again

### Export not working?
1. Make sure you're on a page with the script loaded
2. Try: `window.emailService.exportNotificationsAsCSV()`
3. Check browser's download permissions

## Security Notes

⚠️ **Security Features Implemented:**

1. **Passwords:** ✅ NEVER captured, stored in notifications, or sent via email
2. **Card Security:** ✅ Only last 4 digits stored; CVV and expiry never captured
3. **Data Sanitization:** ✅ All sensitive data automatically excluded before storage/transmission
4. **Email Credentials:** Never commit your EmailJS credentials to public repositories

⚠️ **Additional Security for Production:**

1. **Password Storage:** Currently in localStorage for demo. For production:
   - Use bcrypt or Argon2 password hashing
   - Implement server-side authentication
   - Add rate limiting and brute force protection

2. **Payment Processing:** For production:
   - Integrate Razorpay, Stripe, or PayPal (PCI DSS compliant)
   - Never handle raw card data on client-side
   - Use tokenization for card processing

3. **Data Storage:** For production:
   - Use encrypted database (MySQL/PostgreSQL with encryption)
   - Implement HTTPS/SSL for all communications
   - Add data retention policies

## Production Recommendations

For a production environment, consider:

1. **Backend Server:** Set up Node.js/PHP backend to handle emails server-side
2. **Database:** Use MySQL/PostgreSQL instead of localStorage
3. **Payment Gateway:** Integrate Razorpay or Stripe for real payments
4. **Security:** Implement HTTPS, input validation, and SQL injection prevention
5. **Email Service:** Use SendGrid or AWS SES for higher volume

## Support

For questions or issues:
- Email: info@manojtechnologies.in
- Phone: +91 9008176314

## Files Modified

- `js/email-service.js` - New file with email functionality
- `js/script.js` - Updated registration, login, and subscription handlers
- `register.html` - Added email-service.js script
- `login.html` - Added email-service.js script
- `subscription.html` - Added email-service.js script

## Current Status

✅ Data capture working  
✅ LocalStorage backup working  
✅ CSV export working  
⏳ Email sending - Requires EmailJS configuration  

Once you configure EmailJS credentials, all emails will be sent automatically!
