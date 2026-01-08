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
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            const messageDiv = document.getElementById('loginMessage');
            
            console.log('Login attempt:', email); // Debug log
            
            // Get all registered users from localStorage
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            console.log('Available users:', users.length); // Debug log
            
            // Find user by email
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                console.log('Login successful for:', email); // Debug log
                
                // Store user session in BOTH localStorage and sessionStorage for reliability
                const userData = {
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    subscription: user.subscription || null,
                    loginTime: new Date().toISOString()
                };
                
                // Always store in localStorage for persistent login
                localStorage.setItem('currentUser', JSON.stringify(userData));
                
                // Also store in sessionStorage as backup
                sessionStorage.setItem('currentUser', JSON.stringify(userData));
                
                // Send login email notification
                if (window.emailService) {
                    window.emailService.sendLoginEmail(userData);
                }
                
                console.log('User data saved, redirecting...'); // Debug log
                
                // Show success message
                messageDiv.className = 'form-message success';
                messageDiv.textContent = '✓ Login successful! Redirecting...';
                messageDiv.style.display = 'block';
                
                // Redirect to learning portal
                setTimeout(() => {
                    window.location.href = 'learning.html';
                }, 500);
            } else {
                console.log('Login failed for:', email); // Debug log
                
                // Show error message
                messageDiv.className = 'form-message error';
                messageDiv.textContent = '✗ Invalid email or password. Please try again.';
                messageDiv.style.display = 'block';
            }
        });
    }

    // ===== Registration Functionality =====
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
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
            
            // Get existing users
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            
            // Check if email already exists
            if (users.some(u => u.email === email)) {
                messageDiv.className = 'form-message error';
                messageDiv.textContent = '✗ Email already registered! Please login instead.';
                messageDiv.style.display = 'block';
                return;
            }
            
            // Create new user
            const newUser = {
                name: fullName,
                email: email,
                phone: phone,
                password: password,
                registrationDate: new Date().toISOString(),
                subscription: null
            };
            
            // Add user to array and save
            users.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(users));
            
            // Send registration email notification (without password for security)
            if (window.emailService) {
                const sanitizedUserData = {
                    name: newUser.name,
                    email: newUser.email,
                    phone: newUser.phone,
                    registrationDate: newUser.registrationDate
                    // Password is intentionally excluded from email notification
                };
                window.emailService.sendRegistrationEmail(sanitizedUserData);
            }
            
            // Show success message
            messageDiv.className = 'form-message success';
            messageDiv.textContent = '✓ Registration successful! Redirecting to login...';
            messageDiv.style.display = 'block';
            
            // Redirect to login
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
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
            
            // Display subscription status
            if (isLearningPage) {
                displaySubscriptionStatus(user);
            }
        }
    }

    // Function to display subscription status
    function displaySubscriptionStatus(user) {
        const subStatus = document.getElementById('subStatus');
        const subExpiry = document.getElementById('subExpiry');
        const subscribeBtn = document.getElementById('subscribeBtn');
        
        if (!user.subscription || !user.subscription.expiryDate) {
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
            const expiryDate = new Date(user.subscription.expiryDate);
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
                // Expiring soon
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

    // ===== Subscription Payment Functionality =====
    const subscribeButtons = document.querySelectorAll('.btn-subscribe');
    const paymentModal = document.getElementById('paymentModal');
    const paymentForm = document.getElementById('paymentForm');
    const closeModalBtn = document.querySelector('.close-modal');
    
    let selectedPlan = null;
    
    if (subscribeButtons.length > 0) {
        subscribeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const plan = this.getAttribute('data-plan');
                const duration = parseInt(this.getAttribute('data-duration'));
                const price = this.getAttribute('data-price');
                
                selectedPlan = { plan, duration, price };
                
                // Update payment modal
                document.getElementById('paymentPlan').textContent = plan.charAt(0).toUpperCase() + plan.slice(1) + ' Plan';
                document.getElementById('paymentDuration').textContent = duration + ' days';
                document.getElementById('paymentAmount').textContent = '₹' + price + '.00';
                
                // Show modal
                paymentModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }
    
    if (closeModalBtn && paymentModal) {
        closeModalBtn.addEventListener('click', function() {
            closePaymentModal();
        });
        
        paymentModal.addEventListener('click', function(e) {
            if (e.target === paymentModal) {
                closePaymentModal();
            }
        });
    }
    
    function closePaymentModal() {
        if (paymentModal) {
            paymentModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Payment form submission
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get current user
            const user = getCurrentUser();
            if (!user) {
                alert('Please login first!');
                window.location.href = 'login.html';
                return;
            }
            
            // Get form data
            const cardHolder = document.getElementById('cardHolder').value;
            const cardNumber = document.getElementById('cardNumber').value;
            const cardExpiry = document.getElementById('cardExpiry').value;
            const cardCVV = document.getElementById('cardCVV').value;
            
            // Calculate expiry date
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + selectedPlan.duration);
            
            // Create subscription data
            const subscriptionData = {
                plan: selectedPlan.plan.charAt(0).toUpperCase() + selectedPlan.plan.slice(1) + ' Plan',
                amount: selectedPlan.price,
                startDate: new Date().toISOString(),
                expiryDate: expiryDate.toISOString(),
                duration: selectedPlan.duration,
                cardHolder: cardHolder,
                cardNumber: cardNumber,
                transactionId: 'TXN-' + Date.now()
            };
            
            // Update user subscription
            user.subscription = {
                plan: subscriptionData.plan,
                price: subscriptionData.amount,
                startDate: subscriptionData.startDate,
                expiryDate: subscriptionData.expiryDate,
                duration: subscriptionData.duration
            };
            
            // Save updated user to BOTH storages
            localStorage.setItem('currentUser', JSON.stringify(user));
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            // Update in registered users
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const userIndex = users.findIndex(u => u.email === user.email);
            if (userIndex !== -1) {
                users[userIndex].subscription = user.subscription;
                localStorage.setItem('registeredUsers', JSON.stringify(users));
            }
            
            // Send subscription email notification
            if (window.emailService) {
                window.emailService.sendSubscriptionEmail(user, subscriptionData);
            }
            
            // Show success and redirect
            alert('🎉 Payment Successful!\n\nYour subscription has been activated.\nExpiry Date: ' + expiryDate.toLocaleDateString() + '\n\nEnjoy unlimited access to all courses!');
            
            closePaymentModal();
            
            // Redirect to learning portal
            setTimeout(() => {
                window.location.href = 'learning.html';
            }, 1000);
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
    
    if (videoButtons.length > 0) {
        videoButtons.forEach(button => {
            button.addEventListener('click', function() {
                const videoId = this.getAttribute('data-video');
                const videoUrl = this.getAttribute('data-video-url');
                const videoType = this.getAttribute('data-video-type') || 'youtube';
                
                if (videoModal && videoPlayer) {
                    let embedUrl = '';
                    
                    // Support different video sources
                    switch(videoType) {
                        case 'youtube':
                            // YouTube embed
                            embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
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
            alert('Video marked as complete! ✓\n\nYour progress has been saved.');
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
