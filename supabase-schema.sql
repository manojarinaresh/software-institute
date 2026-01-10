-- Supabase Database Schema for Manoj Technologies
-- Run these queries in Supabase SQL Editor (Database > SQL Editor > New Query)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan VARCHAR(50) NOT NULL, -- 'monthly', 'quarterly', 'annual'
    amount DECIMAL(10, 2) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'cancelled'
    transaction_id VARCHAR(100),
    payment_method VARCHAR(50), -- 'card', 'upi', etc.
    card_last4 VARCHAR(4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expiry ON subscriptions(expiry_date);

-- 3. Login History Table
CREATE TABLE IF NOT EXISTS login_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_type VARCHAR(50)
);

-- Add index for user lookups
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_time ON login_history(login_time DESC);

-- 4. Email Notifications Log Table
CREATE TABLE IF NOT EXISTS email_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    notification_type VARCHAR(50) NOT NULL, -- 'registration', 'login', 'subscription'
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered BOOLEAN DEFAULT FALSE,
    metadata JSONB -- Store additional data like plan details, amount, etc.
);

-- Add index for querying by type and time
CREATE INDEX IF NOT EXISTS idx_email_notifications_type ON email_notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_email_notifications_time ON email_notifications(sent_at DESC);

-- 5. Create a view for active subscriptions with user details
CREATE OR REPLACE VIEW active_subscriptions_view AS
SELECT 
    s.id as subscription_id,
    u.id as user_id,
    u.name,
    u.email,
    u.phone,
    s.plan,
    s.amount,
    s.start_date,
    s.expiry_date,
    s.status,
    CASE 
        WHEN s.expiry_date < NOW() THEN 'Expired'
        WHEN s.expiry_date < NOW() + INTERVAL '7 days' THEN 'Expiring Soon'
        ELSE 'Active'
    END as subscription_status,
    EXTRACT(DAY FROM (s.expiry_date - NOW())) as days_remaining
FROM subscriptions s
JOIN users u ON s.user_id = u.id
WHERE s.status = 'active'
ORDER BY s.expiry_date ASC;

-- 6. Function to automatically update subscription status
CREATE OR REPLACE FUNCTION update_subscription_status()
RETURNS void AS $$
BEGIN
    UPDATE subscriptions
    SET status = 'expired'
    WHERE expiry_date < NOW()
    AND status = 'active';
END;
$$ LANGUAGE plpgsql;

-- 7. Enable Row Level Security (RLS) - Important for security!
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;

-- 8. Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert for registration" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can delete own data" ON users;
DROP POLICY IF EXISTS "Enable insert for subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Enable read for subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Enable update for subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Enable delete for subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Enable insert for login history" ON login_history;
DROP POLICY IF EXISTS "Enable read for login history" ON login_history;
DROP POLICY IF EXISTS "Enable all for email notifications" ON email_notifications;

-- 9. Create policies for public access (needed for your website)
-- Allow anyone to insert new users (registration)
CREATE POLICY "Enable insert for registration" ON users
    FOR INSERT WITH CHECK (true);

-- Allow anyone to read users (for login verification)
CREATE POLICY "Enable read access for all users" ON users
    FOR SELECT USING (true);

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (true);

-- Allow users to be deleted (for admin functionality)
CREATE POLICY "Users can delete own data" ON users
    FOR DELETE USING (true);

-- Allow insert for subscriptions
CREATE POLICY "Enable insert for subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (true);

-- Allow read for subscriptions
CREATE POLICY "Enable read for subscriptions" ON subscriptions
    FOR SELECT USING (true);

-- Allow update for subscriptions
CREATE POLICY "Enable update for subscriptions" ON subscriptions
    FOR UPDATE USING (true);

-- Allow delete for subscriptions (for admin functionality)
CREATE POLICY "Enable delete for subscriptions" ON subscriptions
    FOR DELETE USING (true);

-- Allow insert for login history
CREATE POLICY "Enable insert for login history" ON login_history
    FOR INSERT WITH CHECK (true);

-- Allow read for login history
CREATE POLICY "Enable read for login history" ON login_history
    FOR SELECT USING (true);

-- Allow all operations on email notifications
CREATE POLICY "Enable all for email notifications" ON email_notifications
    FOR ALL USING (true);

-- 10. Create admin stats view
CREATE OR REPLACE VIEW admin_statistics AS
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM subscriptions WHERE status = 'active') as active_subscriptions,
    (SELECT COUNT(*) FROM subscriptions WHERE status = 'expired') as expired_subscriptions,
    (SELECT SUM(amount) FROM subscriptions WHERE status = 'active') as total_active_revenue,
    (SELECT SUM(amount) FROM subscriptions) as total_revenue,
    (SELECT COUNT(*) FROM login_history WHERE login_time > NOW() - INTERVAL '24 hours') as logins_last_24h,
    (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days') as new_users_last_week;

-- 11. Payment Transactions Table (for Razorpay integration)
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    razorpay_payment_id VARCHAR(100) UNIQUE,
    razorpay_order_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    plan VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'success', 'failed', 'pending'
    payment_method VARCHAR(50), -- 'card', 'upi', 'netbanking', 'wallet'
    error_code VARCHAR(50),
    error_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for payment queries
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created ON payment_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_razorpay_id ON payment_transactions(razorpay_payment_id);

-- Enable RLS for payment transactions
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing payment policies if they exist
DROP POLICY IF EXISTS "Enable insert for payment transactions" ON payment_transactions;
DROP POLICY IF EXISTS "Enable read for payment transactions" ON payment_transactions;

-- Create policies for payment transactions
CREATE POLICY "Enable insert for payment transactions" ON payment_transactions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for payment transactions" ON payment_transactions
    FOR SELECT USING (true);

-- Create view for successful payments with user details
CREATE OR REPLACE VIEW successful_payments_view AS
SELECT 
    pt.id as transaction_id,
    pt.razorpay_payment_id,
    pt.amount,
    pt.currency,
    pt.plan,
    pt.payment_method,
    pt.created_at as payment_date,
    u.name as user_name,
    u.email as user_email,
    u.phone as user_phone
FROM payment_transactions pt
JOIN users u ON pt.user_id = u.id
WHERE pt.status = 'success'
ORDER BY pt.created_at DESC;

-- Update admin statistics view to include payment data
DROP VIEW IF EXISTS admin_statistics;
CREATE OR REPLACE VIEW admin_statistics AS
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM subscriptions WHERE status = 'active') as active_subscriptions,
    (SELECT COUNT(*) FROM subscriptions WHERE status = 'expired') as expired_subscriptions,
    (SELECT SUM(amount) FROM subscriptions WHERE status = 'active') as total_active_revenue,
    (SELECT SUM(amount) FROM subscriptions) as total_revenue,
    (SELECT COUNT(*) FROM login_history WHERE login_time > NOW() - INTERVAL '24 hours') as logins_last_24h,
    (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days') as new_users_last_week,
    (SELECT COUNT(*) FROM payment_transactions WHERE status = 'success') as total_successful_payments,
    (SELECT COUNT(*) FROM payment_transactions WHERE status = 'failed') as total_failed_payments,
    (SELECT SUM(amount) FROM payment_transactions WHERE status = 'success') as total_payment_revenue,
    (SELECT COUNT(*) FROM payment_transactions WHERE status = 'success' AND created_at > NOW() - INTERVAL '30 days') as payments_last_30_days;

-- Done! Your database is ready with Razorpay payment integration.
-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Get your Razorpay API keys from https://razorpay.com
-- 3. Update js/razorpay-payment.js with your keys
-- 4. Test payments using test mode first
