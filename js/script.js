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
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                course: document.getElementById('course').value,
                message: document.getElementById('message').value
            };

            // Validate form
            if (!formData.name || !formData.email || !formData.message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }

            if (!isValidEmail(formData.email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission (replace with actual API call)
            simulateFormSubmission(formData);
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
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }

    // Simulate form submission
    function simulateFormSubmission(data) {
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate API call with timeout
        setTimeout(() => {
            // Success
            showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // In production, replace with actual API call:
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(data),
            // })
            // .then(response => response.json())
            // .then(data => {
            //     showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
            //     contactForm.reset();
            // })
            // .catch(error => {
            //     showFormMessage('Something went wrong. Please try again later.', 'error');
            // })
            // .finally(() => {
            //     submitBtn.textContent = originalText;
            //     submitBtn.disabled = false;
            // });
        }, 1500);
    }

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
    console.log('Skyedge Technologies website loaded successfully');
    console.log('Current page:', currentPage);
});
