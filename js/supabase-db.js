// Supabase Database Helper Functions
// Handles all database operations for users, subscriptions, login history

// =============================================
// 1. PASSWORD HASHING (Simple SHA-256 based)
// =============================================
async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function verifyPassword(password, hash) {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
}

// =============================================
// 2. USER REGISTRATION
// =============================================
async function registerUser(name, email, phone, password) {
    try {
        // Check if Supabase is available
        if (!window.supabaseClient || !isSupabaseEnabled()) {
            console.warn('Supabase not available, using localStorage fallback');
            return { success: false, error: 'Database not available', fallback: true };
        }

        // Hash the password
        const passwordHash = await hashPassword(password);

        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabaseClient
            .from('users')
            .select('email')
            .eq('email', email)
            .single();

        if (existingUser) {
            return { success: false, error: 'Email already registered' };
        }

        // Insert new user
        const { data, error } = await supabaseClient
            .from('users')
            .insert([
                {
                    name: name,
                    email: email,
                    phone: phone,
                    password_hash: passwordHash
                }
            ])
            .select();

        if (error) {
            console.error('Supabase registration error:', error);
            return { success: false, error: error.message, fallback: true };
        }

        console.log('✅ User registered in Supabase:', data[0]);
        return { success: true, user: data[0] };

    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: error.message, fallback: true };
    }
}

// =============================================
// 3. USER LOGIN
// =============================================
async function loginUser(email, password) {
    try {
        // Check if Supabase is available
        if (!window.supabaseClient || !isSupabaseEnabled()) {
            console.warn('Supabase not available, using localStorage fallback');
            return { success: false, error: 'Database not available', fallback: true };
        }

        // Get user by email
        const { data: user, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return { success: false, error: 'Invalid email or password' };
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password_hash);
        
        if (!isValidPassword) {
            return { success: false, error: 'Invalid email or password' };
        }

        // Log the login in login_history
        await logLoginHistory(user.id, email);

        console.log('✅ User logged in from Supabase:', user.name);
        return { 
            success: true, 
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        };

    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message, fallback: true };
    }
}

// =============================================
// 4. GET USER SUBSCRIPTION
// =============================================
async function getUserSubscription(userId) {
    try {
        if (!window.supabaseClient || !isSupabaseEnabled()) {
            return null;
        }

        // Get active subscription for user
        const { data, error } = await supabaseClient
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1);

        if (error) {
            console.error('Error fetching subscription:', error);
            return null;
        }

        if (data && data.length > 0) {
            const subscription = data[0];
            
            // Check if subscription is expired
            const expiryDate = new Date(subscription.expiry_date);
            const now = new Date();
            
            if (expiryDate < now) {
                // Update status to expired
                await supabaseClient
                    .from('subscriptions')
                    .update({ status: 'expired' })
                    .eq('id', subscription.id);
                
                return null;
            }
            
            return subscription;
        }

        return null;

    } catch (error) {
        console.error('Error getting user subscription:', error);
        return null;
    }
}

// =============================================
// 5. CREATE SUBSCRIPTION
// =============================================
async function createSubscription(userId, plan, amount, duration, paymentData) {
    try {
        if (!window.supabaseClient || !isSupabaseEnabled()) {
            console.warn('Supabase not available, using localStorage fallback');
            return { success: false, error: 'Database not available', fallback: true };
        }

        // Calculate expiry date based on duration
        const startDate = new Date();
        const expiryDate = new Date();
        
        switch(duration) {
            case 'monthly':
                expiryDate.setDate(expiryDate.getDate() + 30);
                break;
            case 'quarterly':
                expiryDate.setDate(expiryDate.getDate() + 90);
                break;
            case 'annual':
                expiryDate.setDate(expiryDate.getDate() + 365);
                break;
            default:
                expiryDate.setDate(expiryDate.getDate() + 30);
        }

        // Insert subscription
        const { data, error } = await supabaseClient
            .from('subscriptions')
            .insert([
                {
                    user_id: userId,
                    plan: plan,
                    amount: amount,
                    start_date: startDate.toISOString(),
                    expiry_date: expiryDate.toISOString(),
                    status: 'active',
                    transaction_id: paymentData.transactionId || 'TXN' + Date.now(),
                    payment_method: paymentData.paymentMethod || 'card',
                    card_last4: paymentData.cardLast4 || null
                }
            ])
            .select();

        if (error) {
            console.error('Supabase subscription error:', error);
            return { success: false, error: error.message, fallback: true };
        }

        console.log('✅ Subscription created in Supabase:', data[0]);
        return { success: true, subscription: data[0] };

    } catch (error) {
        console.error('Subscription creation error:', error);
        return { success: false, error: error.message, fallback: true };
    }
}

// =============================================
// 6. LOG LOGIN HISTORY
// =============================================
async function logLoginHistory(userId, email) {
    try {
        if (!window.supabaseClient || !isSupabaseEnabled()) {
            return;
        }

        // Get device info
        const userAgent = navigator.userAgent;
        let deviceType = 'desktop';
        if (/mobile/i.test(userAgent)) {
            deviceType = 'mobile';
        } else if (/tablet/i.test(userAgent)) {
            deviceType = 'tablet';
        }

        // Insert login history
        await supabaseClient
            .from('login_history')
            .insert([
                {
                    user_id: userId,
                    user_agent: userAgent,
                    device_type: deviceType
                }
            ]);

        console.log('✅ Login history logged');

    } catch (error) {
        console.error('Error logging login history:', error);
    }
}

// =============================================
// 7. LOG EMAIL NOTIFICATION
// =============================================
async function logEmailNotification(type, userEmail, userName, metadata) {
    try {
        if (!window.supabaseClient || !isSupabaseEnabled()) {
            return;
        }

        await supabaseClient
            .from('email_notifications')
            .insert([
                {
                    notification_type: type,
                    user_email: userEmail,
                    user_name: userName,
                    delivered: true,
                    metadata: metadata
                }
            ]);

        console.log('✅ Email notification logged:', type);

    } catch (error) {
        console.error('Error logging email notification:', error);
    }
}

// =============================================
// 8. GET USER BY EMAIL (for localStorage migration)
// =============================================
async function getUserByEmail(email) {
    try {
        if (!window.supabaseClient || !isSupabaseEnabled()) {
            return null;
        }

        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            return null;
        }

        return data;

    } catch (error) {
        console.error('Error getting user by email:', error);
        return null;
    }
}

// Export functions for use in script.js
window.dbHelpers = {
    registerUser,
    loginUser,
    getUserSubscription,
    createSubscription,
    logLoginHistory,
    logEmailNotification,
    getUserByEmail
};
