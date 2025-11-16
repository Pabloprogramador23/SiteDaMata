// Variável global para o player do YouTube
let youtubePlayer;
let isYouTubeReady = false;

// Aguarda o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    // Inicialização de todas as funcionalidades
    initNavbar();
    initPortfolioFilter();
    initContactForm();
    initScrollAnimations();
    initSmoothScroll();
    initUnifiedScrollSystem(); // Novo sistema unificado
    initScrollIndicator();
    initLightbox(); // Inicializa o lightbox
    
    // Inicializa YouTube se a API já estiver carregada
    if (window.YT && window.YT.Player) {
        onYouTubeIframeAPIReady();
    }
});

// Função chamada quando a API do YouTube está pronta
function onYouTubeIframeAPIReady() {
    isYouTubeReady = true;
    createYouTubePlayer();
}

// Cria o player do YouTube
function createYouTubePlayer() {
    try {
        youtubePlayer = new YT.Player('youtube-player', {
            videoId: 'VzvOj_QrcVU', // ID do vídeo do YouTube
            playerVars: {
                autoplay: 1, mute: 1, loop: 1, controls: 0, showinfo: 0,
                rel: 0, iv_load_policy: 3, modestbranding: 1,
                playsinline: 1, start: 0, playlist: 'VzvOj_QrcVU'
            },
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
                onError: onPlayerError
            }
        });
    } catch (error) {
        console.log('Erro ao criar player do YouTube:', error);
        showFallbackBackground();
    }
}

function onPlayerReady(event) {
    event.target.playVideo();
    const fallback = document.getElementById('fallback-bg');
    if (fallback) fallback.style.display = 'none';
    const iframe = document.querySelector('#youtube-player iframe');
    if (iframe) {
        Object.assign(iframe.style, {
            pointerEvents: 'none', position: 'absolute', top: '0',
            left: '0', width: '100%', height: '100%'
        });
    }
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED || event.data === YT.PlayerState.PAUSED) {
        event.target.playVideo();
    }
}

function onPlayerError(event) {
    console.log('Erro no YouTube player:', event.data);
    showFallbackBackground();
}

function showFallbackBackground() {
    const fallback = document.getElementById('fallback-bg');
    const youtubeContainer = document.getElementById('youtube-player');
    if (fallback) fallback.style.display = 'block';
    if (youtubeContainer) youtubeContainer.style.display = 'none';
}

window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

function initNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

function initPortfolioFilter() {
    const feedContainer = document.getElementById('portfolio-feed');
    if (!feedContainer) return;

    let projectsData = [];

    async function loadProjects() {
        try {
            const response = await fetch(`portfolio.json?v=${Date.now()}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            projectsData = await response.json();
            renderProjects(projectsData);
        } catch (error) {
            console.error("Não foi possível carregar os projetos:", error);
            feedContainer.innerHTML = '<p style="text-align: center; color: var(--text-light);">Erro ao carregar o portfólio.</p>';
        }
    }

    function renderProjects(projects) {
        feedContainer.innerHTML = projects.length === 0 ? '<p style="text-align: center; color: var(--text-light);">Nenhum projeto encontrado.</p>' : '';
        projects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card-feed';
            projectCard.dataset.index = index;

            const mediaItems = [];
            // Adiciona imagens
            if (project.imageUrls && Array.isArray(project.imageUrls)) {
                project.imageUrls.forEach(url => mediaItems.push({ type: 'image', url }));
            }
            // Adiciona vídeo
            if (project.videoId) {
                const videoIdMatch = project.videoId.match(/(?:embed\/|v=)([\w-]{11})/);
                if (videoIdMatch && videoIdMatch[1]) {
                    const videoId = videoIdMatch[1];
                    mediaItems.push({
                        type: 'video',
                        embedUrl: `https://www.youtube.com/embed/${videoId}`,
                        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                    });
                }
            }

            let mediaHtml = '';
            if (mediaItems.length > 1) { // Carrossel
                mediaHtml = `
                    <div class="carousel-slides">
                        ${mediaItems.map((item, i) => `
                            <div class="carousel-slide ${i === 0 ? 'active' : ''}" data-media-type="${item.type}" data-embed-url="${item.embedUrl || ''}">
                                <img src="${item.type === 'image' ? item.url : item.thumbnailUrl}" alt="${project.title} - Mídia ${i + 1}">
                                ${item.type === 'video' ? '<div class="play-overlay"><i class="fas fa-play"></i></div>' : ''}
                            </div>
                        `).join('')}
                    </div>
                    <button class="carousel-btn prev">&lt;</button>
                    <button class="carousel-btn next">&gt;</button>
                    <div class="carousel-dots">
                        ${mediaItems.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></span>`).join('')}
                    </div>`;
            } else if (mediaItems.length === 1) { // Mídia única
                const item = mediaItems[0];
                mediaHtml = `
                    <div class="carousel-slide active" data-media-type="${item.type}" data-embed-url="${item.embedUrl || ''}">
                        <img src="${item.type === 'image' ? item.url : item.thumbnailUrl}" alt="${project.title}">
                        ${item.type === 'video' ? '<div class="play-overlay"><i class="fas fa-play"></i></div>' : ''}
                    </div>`;
            }

            projectCard.innerHTML = `
                <div class="project-card-header">
                    <div class="project-card-avatar"><img src="assets/img/logo-S-c5.png" alt="Da Mata Produtora"></div>
                    <div class="project-card-user"><h4>Da Mata Produtora</h4><span>${project.client}</span></div>
                </div>
                <div class="project-card-media">${mediaHtml}</div>
                <div class="project-card-body">
                    <div class="project-card-info">
                        <p><strong>${project.title}</strong><span class="category-tag">${project.category}</span></p>
                        <p>${project.description}</p>
                    </div>
                </div>`;
            feedContainer.appendChild(projectCard);
        });
        initializeCarousels(feedContainer);
    }
    
    window.getProjectsData = () => projectsData;
    loadProjects();
}

function initializeCarousels(context = document) {
    const carousels = context.querySelectorAll('.project-card-media, .lightbox-content');
    carousels.forEach(carousel => {
        const slides = carousel.querySelectorAll('.carousel-slide');
        if (slides.length <= 1) return;
        const dots = carousel.querySelectorAll('.dot');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        let currentIndex = 0;

        const showSlide = (index) => {
            slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
            if(dots.length > 0) {
                dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
            }
            currentIndex = index;
        };

        if(prevBtn && nextBtn) {
            prevBtn.addEventListener('click', e => { e.stopPropagation(); showSlide((currentIndex - 1 + slides.length) % slides.length); });
            nextBtn.addEventListener('click', e => { e.stopPropagation(); showSlide((currentIndex + 1) % slides.length); });
        }
        if(dots) {
            dots.forEach(dot => dot.addEventListener('click', e => { e.stopPropagation(); showSlide(parseInt(e.target.dataset.slide, 10)); }));
        }
    });
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const feedContainer = document.getElementById('portfolio-feed');

    feedContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card-feed');
        if (!card) return;
        const mediaContainer = card.querySelector('.project-card-media');
        // Impede a abertura do lightbox se o clique for nos botões do carrossel
        if (!mediaContainer.contains(e.target) || e.target.matches('button.carousel-btn, .dot')) return;

        lightboxContent.innerHTML = '';
        const mediaClone = mediaContainer.cloneNode(true);
        lightboxContent.appendChild(mediaClone);
        initializeCarousels(lightboxContent);
        
        lightbox.classList.add('visible');
        document.body.classList.add('lightbox-active');
    });

    // Adiciona o listener para tocar o vídeo DENTRO do lightbox
    lightboxContent.addEventListener('click', (e) => {
        const slide = e.target.closest('.carousel-slide');
        if (slide && slide.dataset.mediaType === 'video') {
            const embedUrl = slide.dataset.embedUrl;
            if (embedUrl) {
                // Substitui o conteúdo do slide pelo iframe
                slide.innerHTML = `<iframe src="${embedUrl}?autoplay=1&rel=0&modestbranding=1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="width:100%; height:100%;"></iframe>`;
            }
        }
    });

    const closeLightbox = () => {
        lightbox.classList.remove('visible');
        document.body.classList.remove('lightbox-active');
        lightboxContent.innerHTML = ''; // Limpa o conteúdo para parar vídeos e remover clones
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = { name: form.name.value, email: form.email.value, subject: form.subject.value, message: form.message.value };
        if (!validateForm(formData)) return;
        const submitBtn = form.querySelector('.btn');
        submitBtn.textContent = 'Enviando...'; submitBtn.disabled = true;
        setTimeout(() => {
            submitBtn.textContent = 'Mensagem Enviada! ✓'; submitBtn.style.background = '#28a745';
            form.reset();
            showNotification('Mensagem enviada com sucesso!', 'success');
            setTimeout(() => {
                submitBtn.textContent = 'Enviar Mensagem'; submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        }, 2000);
    });
}

function validateForm(data) {
    if (!data.name.trim() || !data.email.trim() || !data.subject.trim() || !data.message.trim()) {
        showNotification('Todos os campos são obrigatórios.', 'error');
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        showNotification('Email inválido.', 'error');
        return false;
    }
    return true;
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<div class="notification-content"><span>${message}</span><button class="notification-close">&times;</button></div>`;
    Object.assign(notification.style, {
        position: 'fixed', top: '100px', right: '20px',
        background: type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff',
        color: 'white', padding: '1rem 1.5rem', borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: '10000',
        transform: 'translateX(100%)', transition: 'transform 0.3s ease'
    });
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);
    const autoRemove = setTimeout(() => removeNotification(notification), 5000);
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => { if (notification.parentNode) notification.remove(); }, 300);
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .stat-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    animatedElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute('href'));
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                window.scrollTo({ top: targetSection.offsetTop - headerHeight - 20, behavior: 'smooth' });
            }
        });
    });
}

function initUnifiedScrollSystem() {
    const header = document.querySelector('.header');
    const hero = document.querySelector('.hero');
    if (!header || !hero) return;
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            header.style.background = 'rgba(13, 13, 13, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(13, 13, 13, 0.95)';
            header.style.boxShadow = 'none';
        }
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    }, { passive: true });
}

function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const heroSection = document.querySelector('.hero');
    if (!scrollIndicator || !heroSection) return;
    scrollIndicator.addEventListener('click', () => {
        const servicesSection = document.querySelector('#services');
        if (servicesSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            window.scrollTo({ top: servicesSection.offsetTop - headerHeight - 20, behavior: 'smooth' });
        }
    });
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            scrollIndicator.style.opacity = entry.isIntersecting ? '1' : '0';
            scrollIndicator.style.visibility = entry.isIntersecting ? 'visible' : 'hidden';
        });
    }, { threshold: 0.5 });
    observer.observe(heroSection);
}

window.addEventListener('load', () => document.body.classList.add('loaded'));
