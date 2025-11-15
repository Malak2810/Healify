// GSAP Animations for UI elements
document.addEventListener('DOMContentLoaded', () => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Hero section animations
    const animateHero = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.to('.title-line', {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            delay: 0.5
        })
        .to('.hero-subtitle', {
            opacity: 1,
            duration: 0.8
        }, '-=0.4')
        .to('.hero-buttons', {
            opacity: 1,
            duration: 0.8
        }, '-=0.4')
        .to('.floating-stats', {
            opacity: 1,
            y: 0,
            duration: 1
        }, '-=0.4');
    };

    // Navigation scroll effect
    const setupNavigation = () => {
        const nav = document.querySelector('.glass-nav');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                nav.style.background = 'rgba(10, 10, 15, 0.95)';
                nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
            } else {
                nav.style.background = 'rgba(10, 10, 15, 0.8)';
                nav.style.boxShadow = 'none';
            }

            lastScroll = currentScroll;
        });

        // Smooth scroll for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: { y: targetSection, offsetY: 80 },
                        ease: 'power3.inOut'
                    });
                }

                // Update active state
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    };

    // Feature cards animation
    const animateFeatures = () => {
        gsap.from('.feature-card', {
            scrollTrigger: {
                trigger: '.features-section',
                start: 'top 70%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
        });

        // Feature card hover effects
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: 'power2.out'
                });

                const icon = card.querySelector('.icon-shape');
                gsap.to(icon, {
                    scale: 1.2,
                    rotation: '+=360',
                    duration: 0.6,
                    ease: 'back.out(1.7)'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });

                const icon = card.querySelector('.icon-shape');
                gsap.to(icon, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    };

    // Technology section animation
    const animateTechnology = () => {
        gsap.from('.tech-content', {
            scrollTrigger: {
                trigger: '.technology-section',
                start: 'top 70%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            x: -100,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('.tech-item', {
            scrollTrigger: {
                trigger: '.technology-section',
                start: 'top 70%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            x: -50,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out'
        });

        gsap.from('.globe-container', {
            scrollTrigger: {
                trigger: '.technology-section',
                start: 'top 70%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: 'back.out(1.7)'
        });
    };

    // Contact section animation
    const animateContact = () => {
        gsap.from('.contact-content', {
            scrollTrigger: {
                trigger: '.contact-section',
                start: 'top 70%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });
    };

    // Button hover effects
    const setupButtonEffects = () => {
        document.querySelectorAll('.primary-btn, .secondary-btn, .cta-button, .submit-btn').forEach(button => {
            button.addEventListener('mouseenter', () => {
                gsap.to(button, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            button.addEventListener('click', () => {
                gsap.to(button, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                });
            });
        });
    };

    // Parallax effect for sections
    const setupParallax = () => {
        gsap.utils.toArray('.glass-panel').forEach(panel => {
            gsap.to(panel, {
                scrollTrigger: {
                    trigger: panel,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: -50,
                ease: 'none'
            });
        });
    };

    // Stat counter animation
    const animateStatCounters = () => {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const text = stat.textContent;
            const hasPercent = text.includes('%');
            const hasPlus = text.includes('+');
            const number = parseFloat(text.replace(/[^0-9.]/g, ''));
            
            ScrollTrigger.create({
                trigger: stat,
                start: 'top 80%',
                onEnter: () => {
                    gsap.from(stat, {
                        textContent: 0,
                        duration: 2,
                        ease: 'power1.out',
                        snap: { textContent: hasPercent ? 0.1 : 1 },
                        onUpdate: function() {
                            const current = parseFloat(this.targets()[0].textContent);
                            let formatted = hasPercent ? current.toFixed(1) : Math.floor(current);
                            if (hasPercent) formatted += '%';
                            if (hasPlus && current > 0) {
                                if (current >= 1000000) {
                                    formatted = (current / 1000000).toFixed(0) + 'M+';
                                } else if (current >= 1000) {
                                    formatted = (current / 1000).toFixed(0) + 'K+';
                                } else {
                                    formatted += '+';
                                }
                            }
                            this.targets()[0].textContent = formatted;
                        }
                    });
                }
            });
        });
    };

    // Cursor trail effect
    const setupCursorTrail = () => {
        const trail = [];
        const trailLength = 20;

        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.style.position = 'fixed';
            dot.style.width = '4px';
            dot.style.height = '4px';
            dot.style.borderRadius = '50%';
            dot.style.background = `rgba(0, 212, 255, ${1 - i / trailLength})`;
            dot.style.pointerEvents = 'none';
            dot.style.zIndex = '9999';
            dot.style.transition = 'transform 0.1s ease-out';
            document.body.appendChild(dot);
            trail.push({ element: dot, x: 0, y: 0 });
        }

        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateTrail = () => {
            let x = mouseX;
            let y = mouseY;

            trail.forEach((dot, index) => {
                dot.element.style.left = x - 2 + 'px';
                dot.element.style.top = y - 2 + 'px';

                const nextDot = trail[index + 1] || trail[0];
                x += (nextDot.x - x) * 0.3;
                y += (nextDot.y - y) * 0.3;

                dot.x = x;
                dot.y = y;
            });

            requestAnimationFrame(animateTrail);
        };

        animateTrail();
    };

    // Form submission animation
    const setupFormAnimation = () => {
        const form = document.querySelector('.contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const button = form.querySelector('.submit-btn');
                const originalText = button.textContent;
                
                gsap.to(button, {
                    scale: 0.9,
                    duration: 0.2,
                    onComplete: () => {
                        button.textContent = 'Sending...';
                        gsap.to(button, {
                            scale: 1,
                            duration: 0.2
                        });
                        
                        setTimeout(() => {
                            button.textContent = '✓ Sent!';
                            gsap.to(button, {
                                backgroundColor: '#10b981',
                                duration: 0.3
                            });
                            
                            setTimeout(() => {
                                button.textContent = originalText;
                                gsap.to(button, {
                                    backgroundColor: '',
                                    duration: 0.3
                                });
                            }, 2000);
                        }, 1500);
                    }
                });
            });
        }
    };

    // Initialize all animations
    animateHero();
    setupNavigation();
    animateFeatures();
    animateTechnology();
    animateContact();
    setupButtonEffects();
    setupParallax();
    animateStatCounters();
    setupCursorTrail();
    setupFormAnimation();

    // Refresh ScrollTrigger on window resize
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });
});
