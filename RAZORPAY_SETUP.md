# Razorpay Payment Integration Setup Guide

## Complete step-by-step guide to integrate Razorpay payments for your subscription system

---

## Part 1: Create Razorpay Account

### Step 1: Sign Up for Razorpay
1. Go to https://razorpay.com
2. Click **"Sign Up"** (top right)
3. Enter your details:
   - Email address
   - Phone number
   - Create password
4. Verify email and phone via OTP

### Step 2: Complete Basic Profile
1. After login, go to **Settings** → **Profile**
2. Fill in business details:
   - Business Name: Manoj Technologies
   - Business Type: Individual/Proprietorship/Private Limited
   - Category: Education & Training
   - Sub-category: Online Education
3. Click **Save**

### Step 3: Add Bank Account
1. Go to **Settings** → **Bank Account**
2. Enter bank details:
   - Account Holder Name (must match PAN)
   - Account Number
   - IFSC Code
   - Account Type: Savings/Current
3. Razorpay will verify with ₹1 deposit (takes 1-2 hours)

### Step 4: Complete KYC (for Live Mode)
1. Go to **Settings** → **KYC Details**
2. Upload documents:
   - **PAN Card** (mandatory)
   - **Aadhaar Card** (for address proof)
   - **Business Proof** (if applicable):
     - GST Certificate, OR
     - Shop & Establishment License, OR
     - Partnership Deed, OR
     - Certificate of Incorporation
3. Submit for verification
4. **Approval time**: 1-3 business days

---

## Part 2: Get Your API Keys

### Test Mode (Start Here - No KYC Needed!)

1. Login to Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Click on **"Generate Test Key"**
4. You'll see:
   ```
   Key ID: rzp_test_XXXXXXXXXXXX
   Key Secret: YYYYYYYYYYYYYYYY (click "View" to see)
   ```
5. **Copy both keys** - you'll need them!

### Live Mode (After KYC Approval)

1. Go to **Settings** → **API Keys**
2. Toggle to **"Live Mode"**
3. Click **"Generate Live Key"**
4. You'll see:
   ```
   Key ID: rzp_live_XXXXXXXXXXXX
   Key Secret: ZZZZZZZZZZZZZZZZ
   ```
5. Keep these **VERY SECURE** - never share publicly!

---

## Part 3: Configure Your Website

### Step 1: Update Razorpay Configuration File

Open `js/razorpay-payment.js` and replace the placeholder keys:

```javascript
// Line 2-3: Replace with your actual keys
const RAZORPAY_KEY_ID = 'rzp_test_YOUR_KEY_ID_HERE';  // ← Paste your Key ID here
const RAZORPAY_KEY_SECRET = 'YOUR_KEY_SECRET_HERE';   // ← NOT USED in frontend (for server-side only)
```

**For Test Mode:**
```javascript
const RAZORPAY_KEY_ID = 'rzp_test_1A2b3C4d5E6f7G';  // Your test key
```

**For Live Mode (after KYC approved):**
```javascript
const RAZORPAY_KEY_ID = 'rzp_live_9Z8y7X6w5V4u3T';  // Your live key
```

### Step 2: Update Supabase Database

1. Login to your Supabase dashboard
2. Go to **SQL Editor** → **New Query**
3. Copy the SQL from `supabase-schema.sql` (payment_transactions table)
4. Click **Run** to create the table

---

## Part 4: Enable Payment Methods

### In Razorpay Dashboard:

1. Go to **Settings** → **Payment Methods**
2. Enable the methods you want to accept:
   - ✅ **UPI** (PhonePe, Google Pay, Paytm, etc.)
   - ✅ **Debit Cards** (Visa, Mastercard, RuPay)
   - ✅ **Credit Cards** (Visa, Mastercard, Amex)
   - ✅ **Net Banking** (All major banks)
   - ✅ **Wallets** (Paytm, PhonePe, Mobikwik, etc.)
3. Click **Save**

---

## Part 5: Test the Integration

### Using Test Mode (Recommended First)

1. Go to your website: `subscription.html`
2. Click **"Subscribe Now"** on any plan
3. Razorpay payment popup will open
4. Use **Test Card Details**:
   ```
   Card Number: 4111 1111 1111 1111
   CVV: Any 3 digits (e.g., 123)
   Expiry: Any future date (e.g., 12/25)
   Name: Any name
   ```

5. **Test UPI**:
   ```
   UPI ID: success@razorpay
   ```

6. Click **Pay** - payment will succeed instantly!
7. Check if:
   - Subscription appears in your portal
   - Email confirmation sent
   - Payment recorded in Supabase

### Test Payment Scenarios

**Successful Payment:**
- Card: 4111 1111 1111 1111
- UPI: success@razorpay

**Failed Payment:**
- Card: 4000 0000 0000 0002
- UPI: failure@razorpay

---

## Part 6: Go Live!

### When you're ready for real payments:

1. **Ensure KYC is Approved**
   - Check Razorpay Dashboard → KYC Status = "Approved"

2. **Generate Live API Keys**
   - Settings → API Keys → Switch to Live Mode
   - Generate Live Key

3. **Update Your Website**
   - Replace test key with live key in `js/razorpay-payment.js`
   - Line 2: Change `rzp_test_xxx` to `rzp_live_xxx`

4. **Test with Small Real Payment**
   - Subscribe with ₹1 test plan
   - Verify payment goes through
   - Check bank settlement (2-3 business days)

5. **Deploy Changes**
   - Commit and push to GitHub
   - Wait for GitHub Pages to update (2-3 minutes)

---

## Part 7: Monitor Payments

### Razorpay Dashboard

1. **View Payments**: Dashboard → Payments
2. **View Settlements**: Dashboard → Settlements (money to your bank)
3. **Refunds**: Select payment → Issue Refund
4. **Download Reports**: Reports → Custom Reports

### Your Admin Portal

1. Login to `admin.html` with your credentials
2. View subscription statistics
3. Check payment_transactions in Supabase

---

## Pricing & Fees

### Transaction Fees (Standard Plans)
- **Domestic Cards**: 2% per transaction
- **UPI**: 2% per transaction
- **Net Banking**: 2% per transaction
- **Wallets**: 2% per transaction
- **International Cards**: 3% + ₹2 per transaction

### No Hidden Costs
- ✅ No setup fees
- ✅ No annual fees
- ✅ No maintenance charges

### Settlement Time
- **2-3 business days** to your bank account
- Can enable instant settlements (additional charges apply)

---

## Security Best Practices

### ✅ DO:
- Keep API Secret Key secure (never commit to GitHub)
- Use HTTPS (GitHub Pages has it by default)
- Verify payment signatures on backend (if you add one)
- Enable webhook signature verification
- Monitor payments regularly

### ❌ DON'T:
- Share your Key Secret publicly
- Use live keys in test mode
- Store card details (Razorpay handles this)
- Skip payment verification

---

## Troubleshooting

### Payment not working?

**Check 1: API Keys**
- Correct key in `js/razorpay-payment.js`?
- Test mode key starts with `rzp_test_`
- Live mode key starts with `rzp_live_`

**Check 2: Payment Methods**
- All methods enabled in Razorpay dashboard?
- Settings → Payment Methods → Enable all

**Check 3: KYC Status (for Live Mode)**
- KYC approved in Razorpay dashboard?
- Bank account verified?

**Check 4: Browser Console**
- Open browser DevTools (F12)
- Check for JavaScript errors
- Look for Razorpay error messages

### Payment successful but subscription not created?

**Check 1: Supabase Connection**
- Verify Supabase keys in `js/supabase-config.js`
- Check browser console for errors

**Check 2: Database Table**
- Run payment_transactions table SQL in Supabase

**Check 3: RLS Policies**
- Ensure RLS policies allow inserts
- Check Supabase logs for errors

---

## Need Help?

### Razorpay Support
- **Dashboard**: Click "Support" icon (bottom right)
- **Email**: support@razorpay.com
- **Phone**: 1800-123-0420 (Mon-Fri, 9 AM - 6 PM)
- **Docs**: https://razorpay.com/docs

### Website Issues
- Check browser console (F12) for errors
- Verify all files are uploaded to GitHub
- Test in incognito mode
- Clear browser cache

---

## Quick Reference: Test Cards

```
✅ Successful Payment:
Card: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25

❌ Failed Payment:
Card: 4000 0000 0000 0002
CVV: 123
Expiry: 12/25

⏱️ Payment Requires Auth:
Card: 4000 0025 0000 3155
CVV: 123
Expiry: 12/25
```

---

## Your Integration Checklist

- [ ] Razorpay account created
- [ ] Email and phone verified
- [ ] Bank account added and verified
- [ ] Test API keys generated
- [ ] Keys added to `js/razorpay-payment.js`
- [ ] Payment_transactions table created in Supabase
- [ ] Payment methods enabled in dashboard
- [ ] Test payment successful
- [ ] Email notifications working
- [ ] KYC documents uploaded (for live mode)
- [ ] KYC approved (for live mode)
- [ ] Live API keys generated (for live mode)
- [ ] Test keys replaced with live keys (for live mode)
- [ ] First real payment tested (for live mode)

---

## Contact Information

**Manoj Technologies**
- Email: info@manojtechnologies.in
- Phone: +91 9008176314
- Website: https://manojtechnologies.in

**For payment integration support, contact Razorpay directly.**

---

*Last Updated: January 2026*
