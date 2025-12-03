// Enhanced project slider with indicators/dots
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.project-slider').forEach(function(slider) {
        const slides = slider.querySelectorAll('.slider-image');
        if (!slides.length) return;

        let index = 0;

        // Create slider controls HTML
        const controls = document.createElement('div');
        controls.className = 'slider-controls';
        
        // Create dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        
        // Create navigation buttons
        const prevBtn = document.createElement('button');
        prevBtn.className = 'slider-nav prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left" aria-hidden="true"></i>';
        prevBtn.setAttribute('aria-label', 'Previous image');
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'slider-nav next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right" aria-hidden="true"></i>';
        nextBtn.setAttribute('aria-label', 'Next image');
        
        controls.appendChild(prevBtn);
        controls.appendChild(dotsContainer);
        controls.appendChild(nextBtn);
        
        slider.appendChild(controls);

        // Show first slide
        slides.forEach((s, i) => {
            s.style.display = i === 0 ? 'block' : 'none';
        });

        let intervalRef = null;

        function show(i) {
            slides.forEach(s => s.style.display = 'none');
            slides[i].style.display = 'block';
            
            // Update dots
            document.querySelectorAll('.slider-dot').forEach((dot, dotIndex) => {
                const isActive = dotIndex === i;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
        }

        function goToSlide(i) {
            stop();
            index = i;
            show(index);
            start();
        }

        function start() {
            if (intervalRef) return;
            intervalRef = setInterval(() => {
                index = (index + 1) % slides.length;
                show(index);
            }, 3000);
        }

        function stop() {
            if (intervalRef) {
                clearInterval(intervalRef);
                intervalRef = null;
            }
        }

        // Wire up navigation buttons
        prevBtn.addEventListener('click', () => {
            stop();
            index = (index - 1 + slides.length) % slides.length;
            show(index);
            start();
        });
        
        nextBtn.addEventListener('click', () => {
            stop();
            index = (index + 1) % slides.length;
            show(index);
            start();
        });

        // Pause on hover
        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        
        // Pause on touch
        slider.addEventListener('touchstart', stop);
        slider.addEventListener('touchend', start);

        // Start autoplay
        start();
    });
});
