// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon
            this.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Hide admin link if regular user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
    const adminLoginNav = document.getElementById('adminLoginNav');
    const studentLoginNav = document.getElementById('studentLoginNav');
    
    if (currentUser && adminLoginNav) {
        // User is logged in - hide admin link
        adminLoginNav.style.display = 'none';
        
        // Also update student login link to show "My Portal" or logout
        if (studentLoginNav) {
            const studentLoginLink = document.getElementById('studentLoginLink');
            if (studentLoginLink) {
                studentLoginLink.textContent = 'My Portal';
                studentLoginLink.href = 'learning.html';
            }
        }
    } else if (!currentUser && adminLoginNav) {
        // No user logged in - show admin link
        adminLoginNav.style.display = 'list-item';
    }

    // Update Enroll button on courses page if user is logged in
    const enrollBtn = document.getElementById('enrollBtn');
    const courseActionButtons = document.getElementById('courseActionButtons');
    
    if (courseActionButtons && currentUser) {
        // User is logged in - show appropriate message
        courseActionButtons.innerHTML = `
            <a href="learning.html" class="btn btn-primary">Go to My Portal</a>
            <p style="margin: 15px 0; color: var(--text-light);">Want more content? <a href="subscription.html" style="color: #3b82f6;">Subscribe for Premium Access</a></p>
        `;
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Check for success parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true') {
            showFormMessage('✅ Thank you! Your message has been sent successfully. We will get back to you soon!', 'success');
        }
        
        // Show loading state on submit
        contactForm.addEventListener('submit', function(e) {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
            }
        });
    }

    // Form validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show form message
    function showFormMessage(message, type) {
        const formMessage = document.getElementById('formMessage');
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = `form-message ${type}`;
            formMessage.style.display = 'block';
            
            // Hide message after 8 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 8000);
        }
    }

    // Remove old simulateFormSubmission function as it's no longer needed

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .course-card, .stat-item, .team-member, .course-detail-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add active class to current page navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Counter animation for stats
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    function animateCounters() {
        const counters = document.querySelectorAll('.stat-item h3');
        counters.forEach(counter => {
            const target = counter.textContent;
            const isPercentage = target.includes('%');
            const isPlus = target.includes('+');
            const number = parseInt(target.replace(/[^0-9]/g, ''));
            
            let current = 0;
            const increment = number / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    const displayNumber = Math.floor(current);
                    counter.textContent = displayNumber + (isPercentage ? '%' : isPlus ? '+' : '');
                }
            }, 30);
        });
    }

    // Add hover effect to cards
    const cards = document.querySelectorAll('.feature-card, .course-card, .team-member');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease';
        });
    });

    // Back to top button (optional enhancement)
    const backToTopBtn = createBackToTopButton();
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    function createBackToTopButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '↑';
        btn.setAttribute('aria-label', 'Back to top');
        btn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #2563eb;
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            display: none;
            z-index: 999;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        `;
        
        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        btn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#1e40af';
            this.style.transform = 'scale(1.1)';
        });

        btn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#2563eb';
            this.style.transform = 'scale(1)';
        });

        document.body.appendChild(btn);
        return btn;
    }

    // Log page load (for analytics - replace with actual analytics)
    console.log('Manoj Technologies website loaded successfully');
    console.log('Current page:', currentPage);

    // ===== Update Navigation Based on Login Status =====
    const studentLoginLink = document.getElementById('studentLoginLink');
    if (studentLoginLink) {
        const user = getCurrentUser();
        if (user) {
            // User is logged in - change link to learning portal
            studentLoginLink.href = 'learning.html';
            studentLoginLink.textContent = 'My Portal';
            studentLoginLink.title = 'Go to Learning Portal';
        } else {
            // Not logged in - keep as Student Login
            studentLoginLink.href = 'login.html';
            studentLoginLink.textContent = 'Student Login';
        }
    }

    // ===== Initialize Demo User =====
    // Clear old demo user and reinitialize with new email
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const hasNewDemo = existingUsers.some(u => u.email === 'demo@manojtechnologies.com');
    
    if (!hasNewDemo) {
        // Remove old demo user if exists
        const updatedUsers = existingUsers.filter(u => u.email !== 'demo@skyedge.com');
        
        // Add new demo user
        updatedUsers.push({
            name: 'Demo Student',
            email: 'demo@manojtechnologies.com',
            phone: '1234567890',
            password: 'demo123',
            registrationDate: new Date().toISOString(),
            subscription: null
        });
        
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    }

    // ===== Helper Function: Get Current User =====
    function getCurrentUser() {
        try {
            const userFromLocal = localStorage.getItem('currentUser');
            const userFromSession = sessionStorage.getItem('currentUser');
            
            console.log('Checking user - localStorage:', !!userFromLocal, 'sessionStorage:', !!userFromSession);
            
            if (userFromLocal) {
                const user = JSON.parse(userFromLocal);
                // Also sync to sessionStorage for reliability
                if (!userFromSession) {
                    sessionStorage.setItem('currentUser', userFromLocal);
                }
                return user;
            } else if (userFromSession) {
                const user = JSON.parse(userFromSession);
                // Also sync to localStorage for persistence
                localStorage.setItem('currentUser', userFromSession);
                return user;
            }
            return null;
        } catch (e) {
            console.error('Error getting current user:', e);
            return null;
        }
    }

    // ===== Login Functionality =====
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            const messageDiv = document.getElementById('loginMessage');
            
            console.log('Login attempt:', email);
            
            // ALWAYS use Supabase database for login - never use cached localStorage passwords
            if (window.dbHelpers) {
                const result = await window.dbHelpers.loginUser(email, password);
                
                if (result.success) {
                    console.log('✅ Logged in from Supabase database');
                    
                    // Clear any old cached data before storing new session
                    localStorage.removeItem('registeredUsers'); // Remove old password cache
                    
                    // Get user subscription from database
                    const subscription = await window.dbHelpers.getUserSubscription(result.user.id);
                    
                    // Store user session
                    const userData = {
                        id: result.user.id,
                        email: result.user.email,
                        name: result.user.name,
                        phone: result.user.phone,
                        subscription: subscription,
                        loginTime: new Date().toISOString()
                    };
                    
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    sessionStorage.setItem('currentUser', JSON.stringify(userData));
                    
                    // Send login email notification
                    if (window.emailService) {
                        window.emailService.sendLoginEmail(userData);
                        
                        // Log email notification to database
                        await window.dbHelpers.logEmailNotification('login', email, result.user.name, {
                            subscription_status: subscription ? 'active' : 'none'
                        });
                    }
                    
                    messageDiv.className = 'form-message success';
                    messageDiv.textContent = '✓ Login successful! Redirecting...';
                    messageDiv.style.display = 'block';
                    
                    setTimeout(() => {
                        window.location.href = 'learning.html';
                    }, 500);
                    
                } else {
                    // Login failed - show error from database
                    messageDiv.className = 'form-message error';
                    messageDiv.textContent = '✗ ' + (result.error || 'Invalid email or password. Please check your credentials.');
                    messageDiv.style.display = 'block';
                }
            } else {
                // Database not available - show error message
                messageDiv.className = 'form-message error';
                messageDiv.textContent = '✗ Database connection unavailable. Please try again later.';
                messageDiv.style.display = 'block';
                console.error('Database helpers not loaded');
            }
        });
    }

    // ===== Registration Functionality =====
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;
            const messageDiv = document.getElementById('registerMessage');
            
            // Validation
            if (password !== confirmPassword) {
                messageDiv.className = 'form-message error';
                messageDiv.textContent = '✗ Passwords do not match!';
                messageDiv.style.display = 'block';
                return;
            }
            
            if (!agreeTerms) {
                messageDiv.className = 'form-message error';
                messageDiv.textContent = '✗ Please agree to the Terms & Conditions!';
                messageDiv.style.display = 'block';
                return;
            }
            
            // Try Supabase first, fallback to localStorage
            if (window.dbHelpers) {
                const result = await window.dbHelpers.registerUser(fullName, email, phone, password);
                
                if (result.success) {
                    // Registration successful in Supabase
                    console.log('✅ Registered in Supabase database');
                    
                    // Send registration email notification (without password)
                    if (window.emailService) {
                        const sanitizedUserData = {
                            name: fullName,
                            email: email,
                            phone: phone,
                            registrationDate: new Date().toISOString()
                        };
                        window.emailService.sendRegistrationEmail(sanitizedUserData);
                        
                        // Log email notification to database
                        await window.dbHelpers.logEmailNotification('registration', email, fullName, {
                            phone: phone
                        });
                    }
                    
                    messageDiv.className = 'form-message success';
                    messageDiv.textContent = '✓ Registration successful! Redirecting to login...';
                    messageDiv.style.display = 'block';
                    
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                    
                } else if (result.fallback) {
                    // Supabase failed, use localStorage fallback
                    console.warn('⚠️ Supabase unavailable, using localStorage');
                    registerWithLocalStorage();
                } else {
                    // Registration failed with specific error
                    messageDiv.className = 'form-message error';
                    messageDiv.textContent = '✗ ' + result.error;
                    messageDiv.style.display = 'block';
                }
            } else {
                // dbHelpers not loaded, use localStorage
                console.warn('⚠️ Database helpers not loaded, using localStorage');
                registerWithLocalStorage();
            }
            
            // LocalStorage fallback function
            function registerWithLocalStorage() {
                const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                
                if (users.some(u => u.email === email)) {
                    messageDiv.className = 'form-message error';
                    messageDiv.textContent = '✗ Email already registered! Please login instead.';
                    messageDiv.style.display = 'block';
                    return;
                }
                
                const newUser = {
                    name: fullName,
                    email: email,
                    phone: phone,
                    password: password,
                    registrationDate: new Date().toISOString(),
                    subscription: null
                };
                
                users.push(newUser);
                localStorage.setItem('registeredUsers', JSON.stringify(users));
                
                if (window.emailService) {
                    const sanitizedUserData = {
                        name: newUser.name,
                        email: newUser.email,
                        phone: newUser.phone,
                        registrationDate: newUser.registrationDate
                    };
                    window.emailService.sendRegistrationEmail(sanitizedUserData);
                }
                
                messageDiv.className = 'form-message success';
                messageDiv.textContent = '✓ Registration successful! Redirecting to login...';
                messageDiv.style.display = 'block';
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }
        });
    }

    // ===== Learning Portal Protection =====
    const currentPath = window.location.pathname;
    const currentHref = window.location.href;
    
    console.log('Page loaded:', currentPath);
    console.log('Full URL:', currentHref);
    
    // Check if on protected pages
    const isLearningPage = currentPath.includes('learning.html') || currentHref.includes('learning.html');
    const isSubscriptionPage = currentPath.includes('subscription.html') || currentHref.includes('subscription.html');
    
    if (isLearningPage || isSubscriptionPage) {
        // Check if user is logged in
        const user = getCurrentUser();
        
        console.log('Protected page - User found:', !!user);
        
        if (!user) {
            console.log('No user, redirecting to login...');
            window.location.href = 'login.html';
        } else {
            console.log('User authenticated:', user.email);
            
            // Display user name on learning portal
            const studentNameElement = document.getElementById('studentName');
            if (studentNameElement && user.name) {
                studentNameElement.textContent = user.name;
            }
            
            // Refresh subscription from database and display status
            if (isLearningPage) {
                refreshSubscriptionAndDisplay(user);
            }
        }
    }

    // Function to refresh subscription from database
    async function refreshSubscriptionAndDisplay(user) {
        try {
            // Fetch latest subscription from database
            if (window.dbHelpers && user.id) {
                const subscription = await window.dbHelpers.getUserSubscription(user.id);
                
                // Update user object with fresh subscription data
                user.subscription = subscription;
                
                // Update localStorage with refreshed data
                localStorage.setItem('currentUser', JSON.stringify(user));
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                
                console.log('✅ Subscription refreshed from database:', subscription);
            }
        } catch (error) {
            console.error('Error refreshing subscription:', error);
        }
        
        // Display the subscription status (with updated data)
        displaySubscriptionStatus(user);
    }

    // Function to display subscription status
    function displaySubscriptionStatus(user) {
        const subStatus = document.getElementById('subStatus');
        const subExpiry = document.getElementById('subExpiry');
        const subscribeBtn = document.getElementById('subscribeBtn');
        const noSubscriptionMessage = document.getElementById('noSubscriptionMessage');
        const courseContent = document.getElementById('courseContent');
        
        // Check if admin is logged in - grant full access to all videos
        const isAdmin = sessionStorage.getItem('adminAuthenticated') === 'true';
        
        // Check if user has active subscription
        let hasActiveSubscription = isAdmin || false; // Admin gets automatic access
        
        // Handle both database format (expiry_date) and old localStorage format (expiryDate)
        const expiryDateValue = user.subscription?.expiry_date || user.subscription?.expiryDate;
        
        if (isAdmin) {
            // Admin access - show admin badge
            if (subStatus) {
                subStatus.textContent = '👑 Admin Access - Full Access';
                subStatus.className = 'subscription-status active';
            }
            if (subExpiry) {
                subExpiry.textContent = 'Administrator - All premium content unlocked';
            }
            if (subscribeBtn) {
                subscribeBtn.style.display = 'none'; // Hide subscribe button for admin
            }
        } else if (!user.subscription || !expiryDateValue) {
            // No subscription
            if (subStatus) {
                subStatus.textContent = 'No Subscription';
                subStatus.className = 'subscription-status free';
            }
            if (subExpiry) {
                subExpiry.textContent = 'Subscribe to access all courses';
            }
            if (subscribeBtn) {
                subscribeBtn.textContent = 'Subscribe Now';
            }
        } else {
            // Has subscription
            const expiryDate = new Date(expiryDateValue);
            const today = new Date();
            const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
            
            if (daysRemaining < 0) {
                // Expired
                if (subStatus) {
                    subStatus.textContent = 'Subscription Expired';
                    subStatus.className = 'subscription-status expired';
                }
                if (subExpiry) {
                    subExpiry.textContent = `Expired on ${expiryDate.toLocaleDateString()}`;
                }
                if (subscribeBtn) {
                    subscribeBtn.textContent = 'Renew Now';
                }
            } else if (daysRemaining <= 7) {
                // Expiring soon but still active
                hasActiveSubscription = true;
                if (subStatus) {
                    subStatus.textContent = `${user.subscription.plan} - Expiring Soon`;
                    subStatus.className = 'subscription-status expiring-soon';
                }
                if (subExpiry) {
                    subExpiry.textContent = `${daysRemaining} days remaining (Expires: ${expiryDate.toLocaleDateString()})`;
                }
                if (subscribeBtn) {
                    subscribeBtn.textContent = 'Renew Subscription';
                }
            } else {
                // Active
                hasActiveSubscription = true;
                if (subStatus) {
                    subStatus.textContent = `${user.subscription.plan} - Active`;
                    subStatus.className = 'subscription-status active';
                }
                if (subExpiry) {
                    subExpiry.textContent = `${daysRemaining} days remaining (Expires: ${expiryDate.toLocaleDateString()})`;
                }
                if (subscribeBtn) {
                    subscribeBtn.textContent = 'Manage Subscription';
                }
            }
        }
        
        // Show course content to all logged-in users (free videos available)
        // Show/hide premium content based on subscription status
        if (noSubscriptionMessage && courseContent) {
            // Always show free course content (DevOps Demo 1 and Git Session 1)
            noSubscriptionMessage.style.display = 'none';
            courseContent.style.display = 'block';
            
            // Show/hide premium content based on subscription
            const premiumContent = document.getElementById('premiumContent');
            const subscriptionUpsell = document.getElementById('subscriptionUpsell');
            
            if (premiumContent && subscriptionUpsell) {
                if (hasActiveSubscription) {
                    // User has active subscription - show premium content
                    premiumContent.style.display = 'block';
                    subscriptionUpsell.style.display = 'none';
                } else {
                    // No active subscription - show upsell
                    premiumContent.style.display = 'none';
                    subscriptionUpsell.style.display = 'block';
                }
            }
        }
        
        // Update progress statistics and video card statuses
        updateProgressStatistics(hasActiveSubscription);
        updateVideoCardStatuses();
    }
    
    // Function to update video card completion statuses
    function updateVideoCardStatuses() {
        const completedVideos = JSON.parse(localStorage.getItem('completedVideos') || '[]');
        const videoCards = document.querySelectorAll('.video-card');
        
        videoCards.forEach(card => {
            const button = card.querySelector('.btn-video');
            if (button) {
                const videoId = button.getAttribute('data-video');
                const videoUrl = button.getAttribute('data-video-url');
                const identifier = videoUrl || videoId;
                
                const statusSpan = card.querySelector('.not-started, .completed, .in-progress');
                if (statusSpan && identifier && completedVideos.includes(identifier)) {
                    statusSpan.textContent = '✓ Completed';
                    statusSpan.className = 'completed';
                    statusSpan.style.color = '#27ae60';
                }
            }
        });
    }
    
    // Function to update progress statistics
    function updateProgressStatistics(hasActiveSubscription) {
        const coursesEnrolledElement = document.getElementById('coursesEnrolled');
        const videosCompletedElement = document.getElementById('videosCompleted');
        const learningHoursElement = document.getElementById('learningHours');
        
        if (hasActiveSubscription) {
            // Count available courses/modules in the courseContent section
            const courseModules = document.querySelectorAll('#courseContent .course-module');
            const videoCards = document.querySelectorAll('#courseContent .video-card');
            
            // Update courses enrolled (number of course modules available)
            if (coursesEnrolledElement) {
                coursesEnrolledElement.textContent = courseModules.length || 1;
            }
            
            // Get completed videos from localStorage
            const completedVideos = JSON.parse(localStorage.getItem('completedVideos') || '[]');
            if (videosCompletedElement) {
                videosCompletedElement.textContent = completedVideos.length;
            }
            
            // Calculate learning hours (estimate: 15 min per completed video)
            if (learningHoursElement) {
                const hours = Math.round((completedVideos.length * 15) / 60 * 10) / 10;
                learningHoursElement.textContent = hours;
            }
        } else {
            // No active subscription - show zeros
            if (coursesEnrolledElement) coursesEnrolledElement.textContent = '0';
            if (videosCompletedElement) videosCompletedElement.textContent = '0';
            if (learningHoursElement) learningHoursElement.textContent = '0';
        }
    }

    // ===== Subscription Page Protection =====
    if (currentPath.includes('subscription.html')) {
        const user = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || 'null');
        
        if (!user) {
            window.location.href = 'login.html';
        } else {
            // Display current subscription if exists
            if (user.subscription) {
                const currentSubBox = document.getElementById('currentSubscriptionBox');
                if (currentSubBox) {
                    currentSubBox.style.display = 'block';
                    
                    const expiryDate = new Date(user.subscription.expiryDate);
                    const today = new Date();
                    const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                    
                    document.getElementById('currentPlan').textContent = user.subscription.plan;
                    document.getElementById('currentExpiry').textContent = expiryDate.toLocaleDateString();
                    document.getElementById('daysRemaining').textContent = daysRemaining > 0 ? daysRemaining : 'Expired';
                    
                    const statusElement = document.getElementById('currentStatus');
                    if (daysRemaining < 0) {
                        statusElement.textContent = 'Expired';
                        statusElement.className = 'status-expired';
                    } else {
                        statusElement.textContent = 'Active';
                        statusElement.className = 'status-active';
                    }
                }
            }
        }
    }

    // ===== Logout Functionality =====
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Confirm logout
            if (confirm('Are you sure you want to logout?')) {
                // Clear session
                localStorage.removeItem('currentUser');
                sessionStorage.removeItem('currentUser');
                
                // Redirect to login
                window.location.href = 'login.html';
            }
        });
    }

    // ===== Subscription Page - Course to Plans Flow =====
    const viewPlansBtn = document.getElementById('viewPlansBtn');
    const courseSection = document.getElementById('courseSection');
    const plansSection = document.getElementById('plansSection');
    
    if (viewPlansBtn && courseSection && plansSection) {
        viewPlansBtn.addEventListener('click', function() {
            // Hide course section and show plans section
            courseSection.style.display = 'none';
            plansSection.style.display = 'block';
            
            // Smooth scroll to plans section
            plansSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // ===== Subscription Payment Functionality (Razorpay Integration) =====
    const subscribeButtons = document.querySelectorAll('.btn-subscribe');
    
    if (subscribeButtons.length > 0) {
        subscribeButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Get current user
                const user = getCurrentUser();
                if (!user) {
                    alert('Please login first to subscribe!');
                    window.location.href = 'login.html';
                    return;
                }
                
                // Get plan details from button attributes
                const plan = this.getAttribute('data-plan');
                const price = parseFloat(this.getAttribute('data-price'));
                
                // Validate Razorpay integration is loaded
                if (typeof Razorpay === 'undefined') {
                    alert('Payment gateway is loading. Please try again in a moment.');
                    console.error('Razorpay SDK not loaded');
                    return;
                }
                
                if (typeof initializeRazorpayPayment === 'undefined') {
                    alert('Payment module not loaded. Please refresh the page.');
                    console.error('razorpay-payment.js not loaded');
                    return;
                }
                
                // Initialize Razorpay payment
                try {
                    initializeRazorpayPayment(
                        plan,
                        price,
                        user.id,
                        user.email,
                        user.name
                    );
                } catch (error) {
                    console.error('Error initializing payment:', error);
                    alert('Unable to start payment process. Please try again.');
                }
            });
        });
    }
    
    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    // Expiry date formatting
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // CVV numeric only
    const cardCVVInput = document.getElementById('cardCVV');
    if (cardCVVInput) {
        cardCVVInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\\D/g, '');
        });
    }

    // ===== Video Player Modal =====
    const videoModal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const closeModal = document.querySelector('.close-modal');
    const videoButtons = document.querySelectorAll('.btn-video');
    let currentVideoId = null;
    
    if (videoButtons.length > 0) {
        videoButtons.forEach(button => {
            button.addEventListener('click', function() {
                const videoId = this.getAttribute('data-video');
                const videoUrl = this.getAttribute('data-video-url');
                const videoType = this.getAttribute('data-video-type') || 'youtube';
                
                // Store the video identifier for marking as complete
                currentVideoId = videoUrl || videoId || this.closest('.video-card').querySelector('h5')?.textContent || 'video-' + Date.now();
                
                if (videoModal && videoPlayer) {
                    let embedUrl = '';
                    
                    // Support different video sources
                    switch(videoType) {
                        case 'youtube':
                            // YouTube embed with maximum branding removal
                            embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1&fs=1&iv_load_policy=3&disablekb=0&playsinline=1&color=white&cc_load_policy=0`;
                            videoPlayer.src = embedUrl;
                            break;
                            
                        case 'vimeo':
                            // Vimeo embed
                            embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
                            videoPlayer.src = embedUrl;
                            break;
                            
                        case 'mp4':
                        case 'self-hosted':
                            // Self-hosted or S3 video
                            if (videoUrl) {
                                // Create video element instead of iframe
                                const videoContainer = videoPlayer.parentElement;
                                videoContainer.innerHTML = `
                                    <video id="customVideoPlayer" controls autoplay style="width: 100%; height: 100%; background: #000;">
                                        <source src="${videoUrl}" type="video/mp4">
                                        Your browser does not support the video tag.
                                    </video>
                                `;
                            }
                            break;
                            
                        default:
                            // Default to YouTube
                            embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                            videoPlayer.src = embedUrl;
                    }
                    
                    videoModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent background scrolling
                }
            });
        });
    }
    
    // Close modal functionality
    if (closeModal && videoModal) {
        closeModal.addEventListener('click', function() {
            closeVideoModal();
        });
        
        // Close when clicking outside the video
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
    
    function closeVideoModal() {
        if (videoModal && videoPlayer) {
            videoModal.classList.remove('active');
            
            // Check if there's a custom video player
            const customPlayer = document.getElementById('customVideoPlayer');
            if (customPlayer) {
                customPlayer.pause();
                // Restore iframe
                const videoContainer = videoPlayer.parentElement;
                videoContainer.innerHTML = `
                    <iframe 
                        id="videoPlayer" 
                        width="100%" 
                        height="100%" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                `;
            } else {
                videoPlayer.src = ''; // Stop YouTube/Vimeo playback
            }
            
            document.body.style.overflow = ''; // Restore scrolling
        }
    }
    
    // Mark video as complete
    const markCompleteBtn = document.getElementById('markComplete');
    
    if (markCompleteBtn) {
        markCompleteBtn.addEventListener('click', function() {
            if (currentVideoId) {
                // Get completed videos from localStorage
                let completedVideos = JSON.parse(localStorage.getItem('completedVideos') || '[]');
                
                // Add current video if not already completed
                if (!completedVideos.includes(currentVideoId)) {
                    completedVideos.push(currentVideoId);
                    localStorage.setItem('completedVideos', JSON.stringify(completedVideos));
                    
                    // Update progress statistics
                    const user = getCurrentUser();
                    if (user && user.subscription) {
                        const expiryDateValue = user.subscription.expiry_date || user.subscription.expiryDate;
                        if (expiryDateValue) {
                            const expiryDate = new Date(expiryDateValue);
                            const today = new Date();
                            const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                            updateProgressStatistics(daysRemaining > 0);
                        }
                    }
                    
                    alert('Video marked as complete! ✓\n\nYour progress has been saved.');
                } else {
                    alert('This video is already marked as complete! ✓');
                }
            }
            closeVideoModal();
        });
    }

    // ===== PDF Viewer Functionality =====
    const pdfModal = document.getElementById('pdfModal');
    const pdfViewer = document.getElementById('pdfViewer');
    const pdfButtons = document.querySelectorAll('.btn-view-pdf');
    const closePdfModal = document.getElementById('closePdfModal');
    const closePdfBtn = document.getElementById('closePdfBtn');
    const pdfDownloadBtn = document.getElementById('pdfDownloadBtn');
    
    if (pdfButtons.length > 0) {
        pdfButtons.forEach(button => {
            button.addEventListener('click', function() {
                const pdfUrl = this.getAttribute('data-pdf-url');
                
                if (pdfUrl && pdfModal && pdfViewer) {
                    // Test if PDF is accessible first
                    fetch(pdfUrl, { method: 'HEAD' })
                        .then(response => {
                            if (response.ok) {
                                // PDF is accessible, show in viewer
                                // Use Google Docs Viewer or direct embed
                                // Google Docs Viewer is more reliable for S3 PDFs
                                pdfViewer.src = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
                                
                                // Fallback: try direct embed after 2 seconds if Google fails
                                setTimeout(() => {
                                    if (!pdfViewer.src.includes('docs.google.com')) {
                                        pdfViewer.src = pdfUrl;
                                    }
                                }, 2000);
                                
                                // Set download button URL
                                if (pdfDownloadBtn) {
                                    pdfDownloadBtn.href = pdfUrl;
                                }
                                
                                // Show modal
                                pdfModal.classList.add('active');
                                document.body.style.overflow = 'hidden';
                            } else {
                                alert('⚠️ PDF Access Error\n\nThe PDF file is not accessible.\n\nPossible issues:\n1. File doesn\'t exist at that location\n2. CORS not configured in S3\n3. Wrong URL or region\n\nTry clicking "Open Direct" to test the URL.\n\nURL: ' + pdfUrl);
                            }
                        })
                        .catch(error => {
                            // CORS error or network issue
                            console.log('PDF access error:', error);
                            // Try to open anyway with Google Docs Viewer
                            pdfViewer.src = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
                            
                            if (pdfDownloadBtn) {
                                pdfDownloadBtn.href = pdfUrl;
                            }
                            
                            pdfModal.classList.add('active');
                            document.body.style.overflow = 'hidden';
                        });
                }
            });
        });
    }
    
    // Close PDF modal handlers
    if (closePdfModal && pdfModal) {
        closePdfModal.addEventListener('click', closePdfModalFunc);
    }
    
    if (closePdfBtn) {
        closePdfBtn.addEventListener('click', closePdfModalFunc);
    }
    
    if (pdfModal) {
        pdfModal.addEventListener('click', function(e) {
            if (e.target === pdfModal) {
                closePdfModalFunc();
            }
        });
    }
    
    function closePdfModalFunc() {
        if (pdfModal && pdfViewer) {
            pdfModal.classList.remove('active');
            pdfViewer.src = '';
            document.body.style.overflow = '';
        }
    }
    
    // Close PDF with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (pdfModal && pdfModal.classList.contains('active')) {
                closePdfModalFunc();
            }
        }
    });
});
