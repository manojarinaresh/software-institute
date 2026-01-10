-- Add DELETE Policies for Admin Functionality
-- Run this in Supabase SQL Editor to enable deletion from admin dashboard

-- Drop existing delete policies if they exist
DROP POLICY IF EXISTS "Users can delete own data" ON users;
DROP POLICY IF EXISTS "Enable delete for subscriptions" ON subscriptions;

-- Allow users to be deleted (for admin functionality)
CREATE POLICY "Users can delete own data" ON users
    FOR DELETE USING (true);

-- Allow subscriptions to be deleted (for admin functionality)
CREATE POLICY "Enable delete for subscriptions" ON subscriptions
    FOR DELETE USING (true);

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('users', 'subscriptions')
ORDER BY tablename, policyname;
