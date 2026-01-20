// Supabase Configuration
// Project: Manoj Technologies Learning Platform



// Initialize Supabase client
let supabaseClient = null;

// Check if Supabase is configured
function initSupabase() {
    if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
        
        if (typeof window.supabase !== 'undefined') {
            try {
                supabaseClient = window.supabase.createClient(
                    SUPABASE_CONFIG.url,
                    SUPABASE_CONFIG.anonKey,
                    {
                        auth: {
                            persistSession: false,
                            autoRefreshToken: false
                        }
                    }
                );
                window.supabaseClient = supabaseClient;
                console.log('✅ Supabase connected successfully!');
                console.log('🗄️ Database backend is active - data will be saved to cloud');
                
                // Test connection
                testConnection();
                
                return true;
            } catch (error) {
                console.error('❌ Supabase initialization error:', error);
                return false;
            }
        } else {
            console.error('❌ Supabase library not loaded. Add script tag to HTML.');
            return false;
        }
    } else {
        console.warn('⚠️ Supabase not configured. Using localStorage fallback.');
        return false;
    }
}

// Test database connection
async function testConnection() {
    try {
        const { data, error } = await supabaseClient
            .from('users')
            .select('count', { count: 'exact', head: true });
        
        if (error) {
            console.error('❌ Database connection test failed:', error.message);
            console.error('Error details:', error);
        } else {
            console.log('✅ Database connection test successful');
        }
    } catch (err) {
        console.error('❌ Connection test exception:', err);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initSupabase);

// Also try to initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
} else {
    // DOM already loaded
    initSupabase();
}

// Export for use in other files
window.isSupabaseEnabled = () => supabaseClient !== null;
