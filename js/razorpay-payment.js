// Razorpay Payment Integration for Manoj Technologies
const RAZORPAY_KEY_ID = 'rzp_test_YOUR_KEY_ID_HERE'; // Replace with your Razorpay Key ID
// Note: Never use Key Secret in frontend! It's only for server-side verification

// Payment configuration
const PAYMENT_CONFIG = {
    currency: 'INR',
    company_name: 'Manoj Technologies',
    company_logo: 'https://manojtechnologies.in/images/logo.png', // Optional: Add your logo
    theme_color: '#2563eb',
    contact: '+919008176314',
    email: 'info@manojtechnologies.in'
};

// Initialize Razorpay payment
async function initializeRazorpayPayment(plan, amount, userId, userEmail, userName) {
    // Validate user is logged in
    if (!userId || !userEmail) {
        showNotification('Please login before subscribing', 'error');
        window.location.href = 'login.html';
        return;
    }

    // Convert amount to paise (Razorpay requires amount in smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    // Create Razorpay options
    const options = {
        key: RAZORPAY_KEY_ID,
        amount: amountInPaise,
        currency: PAYMENT_CONFIG.currency,
        name: PAYMENT_CONFIG.company_name,
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Subscription - DevOps & AWS Training`,
        image: PAYMENT_CONFIG.company_logo,
        prefill: {
            name: userName,
            email: userEmail,
            contact: '' // User's phone if available
        },
        theme: {
            color: PAYMENT_CONFIG.theme_color
        },
        modal: {
            ondismiss: function() {
                console.log('Payment popup closed by user');
                showNotification('Payment cancelled', 'info');
            }
        },
        handler: async function(response) {
            // Payment successful - response contains payment_id, order_id, signature
            console.log('Payment successful:', response);
            await handlePaymentSuccess(response, plan, amount, userId, userEmail, userName);
        },
        notes: {
            user_id: userId,
            plan: plan,
            email: userEmail
        }
    };

    // Create Razorpay instance and open payment modal
    try {
        const razorpay = new Razorpay(options);
        
        // Handle payment failure
        razorpay.on('payment.failed', function(response) {
            console.error('Payment failed:', response.error);
            handlePaymentFailure(response.error);
        });

        // Open payment modal
        razorpay.open();
    } catch (error) {
        console.error('Error initializing Razorpay:', error);
        showNotification('Unable to initialize payment. Please try again.', 'error');
    }
}

// Handle successful payment
async function handlePaymentSuccess(paymentResponse, plan, amount, userId, userEmail, userName) {
    try {
        showNotification('Processing payment...', 'info');

        // Calculate subscription dates
        const startDate = new Date();
        const expiryDate = calculateExpiryDate(startDate, plan);

        // Store payment transaction in database
        const paymentData = {
            user_id: userId,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_order_id: paymentResponse.razorpay_order_id || null,
            razorpay_signature: paymentResponse.razorpay_signature || null,
            amount: amount,
            currency: PAYMENT_CONFIG.currency,
            plan: plan,
            status: 'success',
            payment_method: 'razorpay',
            created_at: new Date().toISOString()
        };

        const { data: paymentRecord, error: paymentError } = await supabaseClient
            .from('payment_transactions')
            .insert([paymentData])
            .select()
            .single();

        if (paymentError) {
            console.error('Error storing payment:', paymentError);
            throw new Error('Failed to record payment');
        }

        // Create subscription
        const subscriptionData = {
            user_id: userId,
            plan: plan,
            amount: amount,
            start_date: startDate.toISOString(),
            expiry_date: expiryDate.toISOString(),
            status: 'active',
            transaction_id: paymentResponse.razorpay_payment_id,
            payment_method: 'razorpay',
            created_at: new Date().toISOString()
        };

        const { data: subscription, error: subscriptionError } = await supabaseClient
            .from('subscriptions')
            .insert([subscriptionData])
            .select()
            .single();

        if (subscriptionError) {
            console.error('Error creating subscription:', subscriptionError);
            throw new Error('Failed to create subscription');
        }

        // Update localStorage with new subscription
        const subscriptionInfo = {
            plan: plan,
            startDate: startDate.toISOString(),
            expiryDate: expiryDate.toISOString(),
            status: 'active',
            transactionId: paymentResponse.razorpay_payment_id
        };
        localStorage.setItem('subscription', JSON.stringify(subscriptionInfo));

        // Send confirmation email
        await sendPaymentConfirmationEmail(userName, userEmail, plan, amount, paymentResponse.razorpay_payment_id);

        // Show success message
        showNotification('Payment successful! Your subscription is now active.', 'success');

        // Redirect to learning portal after 2 seconds
        setTimeout(() => {
            window.location.href = 'learning.html';
        }, 2000);

    } catch (error) {
        console.error('Error processing payment:', error);
        showNotification('Payment received but there was an error activating your subscription. Please contact support.', 'error');
    }
}

// Handle payment failure
function handlePaymentFailure(error) {
    console.error('Payment failed:', error);
    
    let errorMessage = 'Payment failed. ';
    
    // Parse error reason
    if (error.reason) {
        errorMessage += error.reason;
    } else if (error.description) {
        errorMessage += error.description;
    } else {
        errorMessage += 'Please try again or contact support.';
    }

    showNotification(errorMessage, 'error');
    
    // Log failed payment attempt to database (optional)
    logFailedPayment(error);
}

// Log failed payment attempt
async function logFailedPayment(error) {
    try {
        const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        if (!user) return;

        const failedPaymentData = {
            user_id: user.id,
            razorpay_payment_id: error.metadata?.payment_id || null,
            amount: 0,
            currency: PAYMENT_CONFIG.currency,
            plan: 'unknown',
            status: 'failed',
            error_code: error.code || 'UNKNOWN_ERROR',
            error_description: error.description || error.reason || 'Payment failed',
            payment_method: 'razorpay',
            created_at: new Date().toISOString()
        };

        await supabaseClient
            .from('payment_transactions')
            .insert([failedPaymentData]);
    } catch (err) {
        console.error('Error logging failed payment:', err);
    }
}

// Calculate subscription expiry date based on plan
function calculateExpiryDate(startDate, plan) {
    const expiry = new Date(startDate);
    
    switch(plan.toLowerCase()) {
        case 'monthly':
            expiry.setMonth(expiry.getMonth() + 1);
            break;
        case 'quarterly':
            expiry.setMonth(expiry.getMonth() + 3);
            break;
        case 'annual':
        case 'yearly':
            expiry.setFullYear(expiry.getFullYear() + 1);
            break;
        default:
            expiry.setMonth(expiry.getMonth() + 1); // Default to 1 month
    }
    
    return expiry;
}

// Send payment confirmation email via EmailJS
async function sendPaymentConfirmationEmail(userName, userEmail, plan, amount, transactionId) {
    try {
        const emailParams = {
            to_name: userName,
            to_email: userEmail,
            plan_name: plan.charAt(0).toUpperCase() + plan.slice(1),
            amount: `₹${amount.toLocaleString('en-IN')}`,
            transaction_id: transactionId,
            login_url: window.location.origin + '/learning.html'
        };

        await emailjs.send(
            emailServiceConfig.serviceId,
            'template_payment_success', // You'll need to create this template in EmailJS
            emailParams,
            emailServiceConfig.publicKey
        );

        console.log('Payment confirmation email sent');
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        // Don't throw error - payment already succeeded
    }
}

// Show notification to user
function showNotification(message, type = 'info') {
    // Check if notification container exists, if not create it
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(notificationContainer);
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        margin-bottom: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease-out;
        font-size: 14px;
        line-height: 1.5;
    `;
    notification.textContent = message;

    notificationContainer.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add animation styles
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Verify payment status (can be called to check payment status)
async function verifyPaymentStatus(paymentId) {
    try {
        // In production, you should verify payment signature on your backend
        // This is a simplified version for frontend-only setup
        const { data, error } = await supabaseClient
            .from('payment_transactions')
            .select('*')
            .eq('razorpay_payment_id', paymentId)
            .single();

        if (error) throw error;
        
        return data.status === 'success';
    } catch (error) {
        console.error('Error verifying payment:', error);
        return false;
    }
}

// Export functions for use in subscription.html
window.initializeRazorpayPayment = initializeRazorpayPayment;
window.verifyPaymentStatus = verifyPaymentStatus;

console.log('Razorpay payment module loaded');
