// Email Service Configuration using EmailJS
// Sign up at https://www.emailjs.com/ to get your credentials

// SECURITY NOTE: This service NEVER captures or transmits:
// - User passwords
// - Full credit card numbers (only last 4 digits)
// - CVV codes
// - Card expiry dates
// All sensitive data is excluded from emails and localStorage

const EMAIL_CONFIG = {
    serviceId: 'service_72v3kho',  // ✅ EmailJS Service ID configured
    templateId: 'template_3f2t3mb', // ✅ EmailJS Template ID configured
    userId: 'jVVcQxc9q4_tOUuwz',      // ✅ EmailJS Public Key configured
    adminEmail: 'info@manojtechnologies.in' // Your admin email to receive notifications
};

// Initialize EmailJS
// TODO: Replace EMAIL_CONFIG values above with your actual EmailJS credentials from https://www.emailjs.com/
if (EMAIL_CONFIG.userId !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAIL_CONFIG.userId);
} else {
    console.warn('⚠️ EmailJS not configured. Please update EMAIL_CONFIG in email-service.js with your credentials.');
    console.info('📧 Data is being stored locally. Run emailService.exportNotificationsAsCSV() to export.');
}

// Function to send registration notification
async function sendRegistrationEmail(userData) {
    const emailParams = {
        to_email: EMAIL_CONFIG.adminEmail,
        subject: 'New User Registration - Manoj Technologies',
        message_html: `
            <h2>New User Registration</h2>
            <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                <tr style="background-color: #FF6B35; color: white;">
                    <th>Field</th>
                    <th>Details</th>
                </tr>
                <tr>
                    <td><strong>Full Name</strong></td>
                    <td>${userData.name}</td>
                </tr>
                <tr>
                    <td><strong>Email</strong></td>
                    <td>${userData.email}</td>
                </tr>
                <tr>
                    <td><strong>Phone</strong></td>
                    <td>${userData.phone}</td>
                </tr>
                <tr>
                    <td><strong>Registration Date</strong></td>
                    <td>${new Date(userData.registrationDate).toLocaleString()}</td>
                </tr>
            </table>
        `
    };

    try {
        // Send email via EmailJS
        if (EMAIL_CONFIG.userId !== 'YOUR_PUBLIC_KEY') {
            await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, emailParams);
            console.log('✅ Registration email sent successfully!');
        } else {
            console.log('⚠️ EmailJS not configured. Registration data stored locally.');
        }
        
        // Also store in localStorage as backup
        storeNotification('registration', userData);
        return true;
    } catch (error) {
        console.error('Failed to send registration email:', error);
        return false;
    }
}

// Function to send login notification
async function sendLoginEmail(userData) {
    const emailParams = {
        to_email: EMAIL_CONFIG.adminEmail,
        subject: 'User Login Activity - Manoj Technologies',
        message_html: `
            <h2>User Login Activity</h2>
            <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                <tr style="background-color: #FF6B35; color: white;">
                    <th>Field</th>
                    <th>Details</th>
                </tr>
                <tr>
                    <td><strong>Full Name</strong></td>
                    <td>${userData.name}</td>
                </tr>
                <tr>
                    <td><strong>Email</strong></td>
                    <td>${userData.email}</td>
                </tr>
                <tr>
                    <td><strong>Login Time</strong></td>
                    <td>${new Date().toLocaleString()}</td>
                </tr>
                <tr>
                    <td><strong>Subscription Status</strong></td>
                    <td>${userData.subscription ? userData.subscription.plan : 'No Active Subscription'}</td>
                </tr>
            </table>
        `
    };

    try {
        // Send email via EmailJS
        if (EMAIL_CONFIG.userId !== 'YOUR_PUBLIC_KEY') {
            await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, emailParams);
            console.log('✅ Login email sent successfully!');
        } else {
            console.log('⚠️ EmailJS not configured. Login data stored locally.');
        }
        
        // Store in localStorage as backup
        storeNotification('login', userData);
        return true;
    } catch (error) {
        console.error('Failed to send login email:', error);
        return false;
    }
}

// Function to send subscription notification
async function sendSubscriptionEmail(userData, subscriptionData) {
    const emailParams = {
        to_email: EMAIL_CONFIG.adminEmail,
        subject: 'New Subscription Purchase - Manoj Technologies',
        message_html: `
            <h2>New Subscription Purchase</h2>
            <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                <tr style="background-color: #FF6B35; color: white;">
                    <th colspan="2">Customer Information</th>
                </tr>
                <tr>
                    <td><strong>Full Name</strong></td>
                    <td>${userData.name}</td>
                </tr>
                <tr>
                    <td><strong>Email</strong></td>
                    <td>${userData.email}</td>
                </tr>
                <tr>
                    <td><strong>Phone</strong></td>
                    <td>${userData.phone}</td>
                </tr>
                <tr style="background-color: #00D9FF; color: white;">
                    <th colspan="2">Subscription Details</th>
                </tr>
                <tr>
                    <td><strong>Plan</strong></td>
                    <td>${subscriptionData.plan}</td>
                </tr>
                <tr>
                    <td><strong>Amount</strong></td>
                    <td>₹${subscriptionData.amount}</td>
                </tr>
                <tr>
                    <td><strong>Purchase Date</strong></td>
                    <td>${new Date(subscriptionData.startDate).toLocaleString()}</td>
                </tr>
                <tr>
                    <td><strong>Expiry Date</strong></td>
                    <td>${new Date(subscriptionData.expiryDate).toLocaleString()}</td>
                </tr>
                <tr>
                    <td><strong>Duration</strong></td>
                    <td>${subscriptionData.duration} days</td>
                </tr>
                <tr style="background-color: #FFD700;">
                    <th colspan="2">Payment Information</th>
                </tr>
                <tr>
                    <td><strong>Cardholder Name</strong></td>
                    <td>${subscriptionData.cardHolder}</td>
                </tr>
                <tr>
                    <td><strong>Card Number</strong></td>
                    <td>**** **** **** ${subscriptionData.cardNumber ? subscriptionData.cardNumber.replace(/\s/g, '').slice(-4) : '****'}</td>
                </tr>
                <tr>
                    <td><strong>Transaction ID</strong></td>
                    <td>${subscriptionData.transactionId || 'N/A'}</td>
                </tr>
            </table>
        `
    };

    try {
        // Send email via EmailJS
        if (EMAIL_CONFIG.userId !== 'YOUR_PUBLIC_KEY') {
            await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, emailParams);
            console.log('✅ Subscription email sent successfully!');
        } else {
            console.log('⚠️ EmailJS not configured. Subscription data stored locally.');
        }
        
        // Store in localStorage as backup
        storeNotification('subscription', { user: userData, subscription: subscriptionData });
        return true;
    } catch (error) {
        console.error('Failed to send subscription email:', error);
        return false;
    }
}

// Store notifications in localStorage as backup (excludes sensitive data)
function storeNotification(type, data) {
    // Create a sanitized copy of data without sensitive information
    let sanitizedData = {};
    
    if (type === 'registration') {
        sanitizedData = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            registrationDate: data.registrationDate
            // Password is intentionally excluded for security
        };
    } else if (type === 'login') {
        sanitizedData = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            subscription: data.subscription
            // Password is never included
        };
    } else if (type === 'subscription') {
        sanitizedData = {
            user: {
                name: data.user.name,
                email: data.user.email,
                phone: data.user.phone
                // Password is never included
            },
            subscription: {
                plan: data.subscription.plan,
                amount: data.subscription.amount,
                startDate: data.subscription.startDate,
                expiryDate: data.subscription.expiryDate,
                duration: data.subscription.duration,
                cardHolder: data.subscription.cardHolder,
                cardNumberLast4: data.subscription.cardNumber ? data.subscription.cardNumber.replace(/\s/g, '').slice(-4) : 'N/A',
                transactionId: data.subscription.transactionId
                // Full card details, CVV, and expiry are excluded for security
            }
        };
    }
    
    const notifications = JSON.parse(localStorage.getItem('emailNotifications') || '[]');
    notifications.push({
        type: type,
        data: sanitizedData,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('emailNotifications', JSON.stringify(notifications));
}

// Function to export all notifications as CSV
function exportNotificationsAsCSV() {
    const notifications = JSON.parse(localStorage.getItem('emailNotifications') || '[]');
    
    if (notifications.length === 0) {
        alert('No notifications to export');
        return;
    }

    let csvContent = "Type,Name,Email,Phone,Details,Timestamp\n";
    
    notifications.forEach(notification => {
        let name = '', email = '', phone = '', details = '';
        
        if (notification.type === 'registration') {
            name = notification.data.name;
            email = notification.data.email;
            phone = notification.data.phone;
            details = 'New Registration';
        } else if (notification.type === 'login') {
            name = notification.data.name;
            email = notification.data.email;
            phone = notification.data.phone || 'N/A';
            details = 'User Login';
        } else if (notification.type === 'subscription') {
            name = notification.data.user.name;
            email = notification.data.user.email;
            phone = notification.data.user.phone;
            details = `Subscription: ${notification.data.subscription.plan} - ₹${notification.data.subscription.amount}`;
        }
        
        csvContent += `"${notification.type}","${name}","${email}","${phone}","${details}","${new Date(notification.timestamp).toLocaleString()}"\n`;
    });
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `manoj-technologies-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Data exported successfully!');
}

// Function to view all stored notifications
function viewAllNotifications() {
    const notifications = JSON.parse(localStorage.getItem('emailNotifications') || '[]');
    console.table(notifications);
    return notifications;
}

// Make functions available globally
window.emailService = {
    sendRegistrationEmail,
    sendLoginEmail,
    sendSubscriptionEmail,
    exportNotificationsAsCSV,
    viewAllNotifications
};
