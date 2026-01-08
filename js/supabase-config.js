// Supabase Configuration
// Project: Manoj Technologies Learning Platform

const SUPABASE_CONFIG = {
    url: 'https://tarxywwovixlgjzddkke.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhcnh5d3dvdml4bGdqemRka2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4Njg1MjUsImV4cCI6MjA4MzQ0NDUyNX0.BAnDV7JhDIOWqL6mHHnbEBHAg4e35ixGaTR1Qep2mqI'
};

// Initialize Supabase client
let supabaseClient = null;

// Check if Supabase is configured
function initSupabase() {
    if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
        
        if (typeof window.supabase !== 'undefined') {
            supabaseClient = window.supabase.createClient(
                SUPABASE_CONFIG.url,
                SUPABASE_CONFIG.anonKey
            );
            window.supabaseClient = supabaseClient;
            console.log('✅ Supabase connected successfully!');
            console.log('🗄️ Database backend is active - data will be saved to cloud');
            return true;
        } else {
            console.error('❌ Supabase library not loaded. Add script tag to HTML.');
            return false;
        }
    } else {
        console.warn('⚠️ Supabase not configured. Using localStorage fallback.');
        return false;
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
