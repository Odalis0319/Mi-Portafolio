// Scroll Animation: Reveal items on scroll
const reveals = document.querySelectorAll('.reveal');

function reveal() {
    for (let i = 0; i < reveals.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = reveals[i].getBoundingClientRect().top;
        let elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        } else {
            // Optional: remove class to animate again on scroll up
            // reveals[i].classList.remove('active');
        }
    }
}

window.addEventListener('scroll', reveal);

// Initial call to reveal items in view on load
reveal();

// Sticky Navbar change background on scroll
const navbar = document.getElementById('navbar');
window.onscroll = function() {
    if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
};

// Cursor Glow Effect
const glow = document.querySelector('.cursor-glow');
document.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
});

// Smooth Scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Multimedia Switchers Logic (Zenith, HPE, etc.)
const setupProjectSwitcher = (projectContainer) => {
    const tabs = projectContainer.querySelectorAll('.media-tab');
    const videoElement = projectContainer.querySelector('video');
    const playerContainer = projectContainer.querySelector('.video-frame');
    const galleryContainers = projectContainer.querySelectorAll('.gallery-v3');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab styling
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const type = tab.getAttribute('data-type');
            const targetId = tab.getAttribute('data-target');
            const label = tab.textContent;

            // Handle Video Display
            if (type === 'video') {
                if (playerContainer) playerContainer.classList.remove('hidden');
                galleryContainers.forEach(g => g.classList.add('hidden'));

                // Special handling for portrait/mobile videos
                if (label === 'App Demo') {
                    playerContainer.classList.add('portrait');
                } else if (playerContainer) {
                    playerContainer.classList.remove('portrait');
                }

                if (videoElement) {
                    const src = tab.getAttribute('data-src');
                    const poster = tab.getAttribute('data-poster');
                    if (videoElement.getAttribute('src') !== src) {
                        videoElement.setAttribute('src', src);
                        videoElement.setAttribute('poster', poster);
                        videoElement.load();
                    }
                }
            } 
            // Handle Gallery Display
            else if (type === 'gallery') {
                if (playerContainer) playerContainer.classList.add('hidden');
                galleryContainers.forEach(g => {
                    if (g.id === targetId || !targetId) {
                        g.classList.remove('hidden');
                    } else {
                        g.classList.add('hidden');
                    }
                });
            }
        });
    });

    // Set initial state based on active tab
    const activeTab = projectContainer.querySelector('.media-tab.active');
    if (activeTab) {
        const type = activeTab.getAttribute('data-type');
        const label = activeTab.textContent;
        const targetId = activeTab.getAttribute('data-target');

        if (type === 'video') {
            if (label === 'App Demo' && playerContainer) playerContainer.classList.add('portrait');
        } else if (type === 'gallery') {
            if (playerContainer) playerContainer.classList.add('hidden');
            galleryContainers.forEach(g => {
                if (g.id === targetId || !targetId) g.classList.remove('hidden');
            });
        }
    }
};

// Initialize all featured project switchers
document.querySelectorAll('.project-card.featured').forEach(project => {
    setupProjectSwitcher(project);
});

// Lightbox Logic - Image Zoom
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const allExpandableImages = document.querySelectorAll('.gallery-grid img, .gallery-scroll img, .cert-card img');

allExpandableImages.forEach(img => {
    img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        if (lightboxCaption) {
            lightboxCaption.textContent = img.alt || "";
        }
        lightbox.style.display = 'flex';
        // Force reflow
        void lightbox.offsetWidth;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevents background scrolling
    });
});

const closeLightbox = () => {
    if (lightbox) {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
};

if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Close on Escape key for better UX
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

// Gallery Scrolling Logic (Slider / Carousel)
function scrollGallery(containerId, direction) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const wrapper = container.querySelector('.gallery-scroll-wrapper');
    if (!wrapper) return;
    
    // Each scroll moves by 100% of the visible width
    const scrollAmount = wrapper.clientWidth;
    
    wrapper.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}
