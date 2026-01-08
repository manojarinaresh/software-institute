# Skyedge Technologies - Student Portal

## 🎓 Student Authentication & Subscription System

### Features Overview

#### 1. **User Registration** (register.html)
- Students can create their own accounts with:
  - Full Name
  - Email Address
  - Phone Number
  - Password (minimum 6 characters)
- Email validation to prevent duplicate registrations
- Terms & Conditions agreement
- Automatic redirect to login after successful registration

#### 2. **Student Login** (login.html)
- Secure login with email and password
- "Remember me" option for persistent sessions
- Demo account available for testing
- Registration link for new users

#### 3. **Subscription Plans** (subscription.html)
Three flexible subscription options:

- **Monthly Plan** - $29/month
  - 30 days access
  - All video courses
  - Certificate of completion
  - 24/7 support
  
- **Quarterly Plan** - $69/3 months (BEST VALUE)
  - 90 days access
  - All Monthly features
  - Priority support
  - Career guidance sessions
  - Save $18!
  
- **Annual Plan** - $199/year (BEST DEAL)
  - 365 days access
  - All Quarterly features
  - 1-on-1 mentorship
  - Job placement assistance
  - Lifetime updates
  - Save $149!

#### 4. **Subscription Management**
- Real-time subscription status tracking
- Expiry date monitoring
- Days remaining counter
- Visual indicators:
  - 🟢 Active (more than 7 days remaining)
  - 🟡 Expiring Soon (7 days or less)
  - 🔴 Expired
- Automatic renewal reminders

#### 5. **Learning Portal** (learning.html)
- Personalized welcome with student name
- Subscription status banner (sticky header)
- Progress tracking dashboard
- Video course library with subscription gating
- Real educational content from YouTube

### User Flow

```
1. Register → 2. Login → 3. Subscribe → 4. Access Learning Portal
```

### Demo Credentials

**Pre-registered Demo Account:**
- Email: demo@skyedge.com
- Password: demo123

**Or register your own account with any email!**

### Technical Implementation

#### Data Storage (localStorage)
```javascript
// Registered Users
{
  name: "Student Name",
  email: "student@email.com",
  phone: "1234567890",
  password: "encrypted_password",
  registrationDate: "2026-01-08T...",
  subscription: {
    plan: "Monthly Plan",
    price: "29",
    startDate: "2026-01-08T...",
    expiryDate: "2026-02-07T...",
    duration: 30
  }
}

// Current User Session
{
  email: "student@email.com",
  name: "Student Name",
  phone: "1234567890",
  subscription: {...},
  loginTime: "2026-01-08T..."
}
```

### Subscription Expiry Logic

The system automatically:
1. Calculates days remaining until expiry
2. Updates subscription status badge color
3. Shows appropriate messages:
   - Free Trial (no subscription)
   - Active (7+ days remaining)
   - Expiring Soon (1-7 days)
   - Expired (0 days)
4. Adjusts call-to-action buttons accordingly

### Payment Processing

**Note:** This is a demo implementation. In production:
- Integrate with Stripe, PayPal, or Razorpay
- Use secure backend API for payment processing
- Store encrypted payment information
- Send confirmation emails
- Implement webhooks for automatic renewal

### Files Structure

```
/
├── index.html           # Homepage
├── register.html        # New user registration
├── login.html          # Student login
├── subscription.html   # Subscription plans & payment
├── learning.html       # Protected learning portal
├── css/
│   └── style.css       # All styles including subscription UI
└── js/
    └── script.js       # Authentication & subscription logic
```

### Security Considerations

⚠️ **Important for Production:**
- Hash passwords (use bcrypt or similar)
- Implement HTTPS
- Use JWT tokens for session management
- Backend API for authentication
- CSRF protection
- Rate limiting on login attempts
- Email verification
- Password reset functionality
- Two-factor authentication (2FA)

### Future Enhancements

- [ ] Email notifications for expiry warnings
- [ ] Auto-renewal option
- [ ] Subscription upgrade/downgrade
- [ ] Payment history
- [ ] Invoice generation
- [ ] Referral program
- [ ] Multi-user family plans
- [ ] Course completion certificates
- [ ] Student progress reports

### Testing

1. **Register a new account:**
   - Go to register.html
   - Fill in your details
   - Create account

2. **Login:**
   - Use your email and password
   - Or use demo account

3. **Subscribe:**
   - Click "Subscribe Now" in learning portal
   - Or navigate to subscription.html
   - Choose a plan
   - Complete payment (demo mode - no real charge)

4. **Check subscription:**
   - View status banner in learning portal
   - See expiry date and days remaining
   - Access all video courses

### Support

For questions or issues, contact:
- Email: info@skyedge.com
- Phone: (123) 456-7890
