document.addEventListener('DOMContentLoaded', () => {

    // ===== HEADER SCROLL EFFECT =====
    const header = document.querySelector('.main-header');
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        // Header background on scroll
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll-to-top button visibility
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== MOBILE MENU TOGGLE =====
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            mobileToggle.classList.toggle('active');
        });
    }

    // ===== SCROLL REVEAL ANIMATION =====
    const fadeElements = document.querySelectorAll('.fade-elem');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation slightly for each element
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => revealObserver.observe(el));

    // ===== FEATURE TILE TILT EFFECT =====
    const tiles = document.querySelectorAll('.feature-tile');
    tiles.forEach(tile => {
        tile.addEventListener('mousemove', (e) => {
            const rect = tile.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            tile.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        tile.addEventListener('mouseleave', () => {
            tile.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ===== COUNTER ANIMATION FOR TRANSFER AMOUNT =====
    const amountEl = document.querySelector('.transfer-amount');
    if (amountEl) {
        const targetAmount = 1500000;
        let current = 0;
        const duration = 2000;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = targetAmount / steps;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const interval = setInterval(() => {
                        current += increment;
                        if (current >= targetAmount) {
                            current = targetAmount;
                            clearInterval(interval);
                        }
                        amountEl.textContent = '$' + current.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        });
                    }, stepTime);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterObserver.observe(amountEl);
    }

    // ===== GENESIS FLOW INTERACTIVE ACCORDION =====
    const genesisAccordion = document.querySelector('.genesis-accordion');
    const genesisSlices = document.querySelectorAll('.genesis-slice');

    if (genesisAccordion && genesisSlices.length > 0) {
        // Function to set the active slice
        const setActiveSlice = (activeSlice) => {
            genesisSlices.forEach(s => {
                s.classList.remove('active');
                s.style.flex = '1 1 0%';
            });
            activeSlice.classList.add('active');
            activeSlice.style.flex = '5 1 0%';
        };

        // Set initial active slice (first one by default)
        setActiveSlice(genesisSlices[0]);

        // Add hover (mouseenter) event listeners to each slice
        genesisSlices.forEach(slice => {
            slice.addEventListener('mouseenter', () => {
                setActiveSlice(slice);
            });
        });

        // Optional: Reset to the first slice when mouse leaves the entire accordion container
        // genesisAccordion.addEventListener('mouseleave', () => {
        //     setActiveSlice(genesisSlices[0]);
        // });
    }

    // ===== NETWORK STATISTICS COUNTERS =====
    const counterElements = document.querySelectorAll('.counter-value');

    if (counterElements.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const targetVal = parseFloat(el.getAttribute('data-target'));
                    const decimals = parseInt(el.getAttribute('data-decimals') || 0);
                    const duration = 2500; // 2.5 seconds
                    const frameRate = 30; // ms per frame
                    const totalFrames = duration / frameRate;
                    let frame = 0;

                    const counter = setInterval(() => {
                        frame++;
                        const progress = frame / totalFrames;
                        // Use easeOutQuart for smooth deceleration
                        const easeOut = 1 - Math.pow(1 - progress, 4);
                        const currentVal = targetVal * easeOut;

                        el.textContent = currentVal.toFixed(decimals);

                        if (frame >= totalFrames) {
                            clearInterval(counter);
                            el.textContent = targetVal.toFixed(decimals); // Ensure exact final value
                        }
                    }, frameRate);

                    statsObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counterElements.forEach(el => statsObserver.observe(el));
    }

    // ===== NETWORK PARTICLES CANVAS =====
    const canvas = document.getElementById('network-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.parentElement.clientWidth;
            height = canvas.parentElement.clientHeight;
            canvas.width = width;
            canvas.height = height;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
                this.color = Math.random() > 0.5 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(34, 211, 238, 0.5)';
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw lines between close particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        // Opacity based on distance
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - dist / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        animate();
    }

});
