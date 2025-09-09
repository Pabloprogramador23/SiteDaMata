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
    initHeaderScroll();
    initScrollIndicator();
    initHeroScrollEffects();
    
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
                autoplay: 1,          // Reproduz automaticamente
                mute: 1,             // Inicia mutado (necessário para autoplay)
                loop: 1,             // Repete em loop
                controls: 0,         // Remove controles
                showinfo: 0,         // Remove informações
                rel: 0,              // Remove vídeos relacionados
                iv_load_policy: 3,   // Remove anotações
                modestbranding: 1,   // Remove logo do YouTube
                playsinline: 1,      // Para mobile
                start: 0,            // Inicia do começo
                playlist: 'VzvOj_QrcVU' // Necessário para loop funcionar
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

// Quando o player está pronto
function onPlayerReady(event) {
    console.log('YouTube player pronto');
    event.target.playVideo();
    
    // Esconde o fallback
    const fallback = document.getElementById('fallback-bg');
    if (fallback) {
        fallback.style.display = 'none';
    }
    
    // Aplica estilos adicionais ao iframe
    const iframe = document.querySelector('#youtube-player iframe');
    if (iframe) {
        iframe.style.pointerEvents = 'none';
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
    }
}

// Controla mudanças de estado do vídeo
function onPlayerStateChange(event) {
    // Se o vídeo parar, reinicia
    if (event.data === YT.PlayerState.ENDED) {
        event.target.playVideo();
    }
    
    // Se pausar, continua
    if (event.data === YT.PlayerState.PAUSED) {
        event.target.playVideo();
    }
}

// Se houver erro, mostra fallback
function onPlayerError(event) {
    console.log('Erro no YouTube player:', event.data);
    showFallbackBackground();
}

// Mostra background de fallback
function showFallbackBackground() {
    const fallback = document.getElementById('fallback-bg');
    const youtubeContainer = document.getElementById('youtube-player');
    
    if (fallback) {
        fallback.style.display = 'block';
    }
    
    if (youtubeContainer) {
        youtubeContainer.style.display = 'none';
    }
}

// Função para ser chamada globalmente quando a API carregar
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

// Funcionalidade do Menu Mobile
function initNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Toggle do menu mobile
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animação do hamburger
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Fecha menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Reset hamburger animation
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Fecha menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Funcionalidade do Header com scroll
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Adiciona/remove classe baseado no scroll
        if (currentScroll > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }

        // Hide/show header baseado na direção do scroll
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// Funcionalidade do Filtro do Portfólio
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Remove active class de todos os botões
            filterBtns.forEach(b => b.classList.remove('active'));
            // Adiciona active class no botão clicado
            this.classList.add('active');

            // Filtra os items do portfólio
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || filter === category) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    
                    // Animação de entrada
                    setTimeout(() => {
                        item.style.transition = 'all 0.3s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Funcionalidade do Formulário de Contato
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Coleta os dados do formulário
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Validação básica
        if (!validateForm(formData)) {
            return;
        }

        // Simula envio do formulário
        const submitBtn = form.querySelector('.btn');
        const originalText = submitBtn.textContent;
        
        // Loading state
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        // Simula delay de envio
        setTimeout(() => {
            // Sucesso
            submitBtn.textContent = 'Mensagem Enviada! ✓';
            submitBtn.style.background = '#28a745';
            
            // Reset form
            form.reset();
            
            // Show success message
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.background = '';
            }, 3000);
            
        }, 2000);
    });
}

// Validação do formulário
function validateForm(data) {
    const errors = [];

    if (!data.name.trim()) {
        errors.push('Nome é obrigatório');
    }

    if (!data.email.trim()) {
        errors.push('Email é obrigatório');
    } else if (!isValidEmail(data.email)) {
        errors.push('Email inválido');
    }

    if (!data.subject.trim()) {
        errors.push('Assunto é obrigatório');
    }

    if (!data.message.trim()) {
        errors.push('Mensagem é obrigatória');
    }

    if (errors.length > 0) {
        showNotification(errors.join(', '), 'error');
        return false;
    }

    return true;
}

// Validação de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    // Remove notificação existente se houver
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Cria nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Adiciona estilos
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;

    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    document.body.appendChild(notification);

    // Animação de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove após 5 segundos
    const autoRemove = setTimeout(() => {
        removeNotification(notification);
    }, 5000);

    // Remove ao clicar no X
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
}

// Remove notificação
function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// Animações de scroll
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .stat-item');
    
    // Adiciona classe para animação
    animatedElements.forEach(el => {
        el.classList.add('scroll-animate');
    });

    // Observer para detectar elementos na tela
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Smooth scroll para links de navegação
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Efeito parallax no hero
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');
    
    if (hero && heroBackground) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            
            if (scrolled < heroHeight) {
                const speed = 0.5;
                heroBackground.style.transform = `translateY(${scrolled * speed}px)`;
            }
        });
    }
}

// Contador animado para estatísticas
function initCounters() {
    const counters = document.querySelectorAll('.stat-item h3');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const finalNumber = parseInt(counter.textContent);
                const increment = finalNumber / 100;
                let currentNumber = 0;
                
                const updateCounter = () => {
                    currentNumber += increment;
                    if (currentNumber < finalNumber) {
                        counter.textContent = Math.floor(currentNumber) + (counter.textContent.includes('+') ? '+' : '');
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = finalNumber + (counter.textContent.includes('+') ? '+' : '');
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.7 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Funcionalidade do player de vídeo (placeholder)
function initVideoPlayer() {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            // Aqui você pode integrar com um player de vídeo real
            // Por enquanto, vamos simular o carregamento
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Carregando...</span>';
            
            setTimeout(() => {
                showNotification('Player de vídeo será implementado em breve!', 'info');
                this.innerHTML = '<i class="fas fa-play"></i><span>Assista nosso showreel</span>';
            }, 2000);
        });
    }
}

// Lazy loading para imagens
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Detecta modo escuro do sistema
function initDarkModeDetection() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Usuário prefere modo escuro
        document.body.classList.add('dark-mode-preferred');
    }
}

// Inicialização de funcionalidades extras
setTimeout(() => {
    initParallaxEffect();
    initCounters();
    initVideoPlayer();
    initLazyLoading();
    initDarkModeDetection();
}, 1000);

// Utilitários
const utils = {
    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Format phone number
    formatPhone: (phone) => {
        return phone.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
};

// Event listeners para performance otimizada
window.addEventListener('scroll', utils.throttle(() => {
    // Scroll events otimizados
}, 16)); // ~60fps

window.addEventListener('resize', utils.debounce(() => {
    // Resize events otimizados
}, 250));

// Funcionalidade do Scroll Indicator
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const heroSection = document.querySelector('.hero');
    
    if (scrollIndicator && heroSection) {
        scrollIndicator.addEventListener('click', function() {
            const servicesSection = document.querySelector('#services');
            if (servicesSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = servicesSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
        
        // Hide scroll indicator quando sair da hero section
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    scrollIndicator.style.opacity = '1';
                    scrollIndicator.style.visibility = 'visible';
                } else {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.visibility = 'hidden';
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(heroSection);
    }
}

// Efeitos especiais do Hero com scroll
function initHeroScrollEffects() {
    const heroTop = document.querySelector('.hero-top');
    const heroBottom = document.querySelector('.hero-bottom');
    const videoOverlay = document.querySelector('.video-overlay');
    
    if (!heroTop || !heroBottom || !videoOverlay) return;
    
    window.addEventListener('scroll', utils.throttle(() => {
        const scrollY = window.pageYOffset;
        const heroHeight = document.querySelector('.hero').offsetHeight;
        const scrollPercent = Math.min(scrollY / (heroHeight * 0.8), 1);
        
        // Efeito de "funil" - o vídeo vai diminuindo conforme desce
        if (scrollPercent <= 1) {
            const scale = 1 - (scrollPercent * 0.3); // Reduz até 70% do tamanho
            const opacity = 1 - (scrollPercent * 0.5); // Reduz opacidade
            
            // Aplica transformações no top
            heroTop.style.transform = `translateY(${scrollY * 0.3}px) scale(${scale})`;
            heroTop.style.opacity = opacity;
            
            // Intensifica o overlay do vídeo (mas mantém suave)
            videoOverlay.style.background = `linear-gradient(135deg, 
                rgba(255, 107, 53, ${0.25 + scrollPercent * 0.15}) 0%, 
                rgba(44, 62, 80, ${0.35 + scrollPercent * 0.15}) 100%)`;
            
            // Move o bottom content para cima
            if (scrollPercent > 0.5) {
                const bottomTransform = (scrollPercent - 0.5) * 2; // 0 to 1
                heroBottom.style.transform = `translateY(${-bottomTransform * 50}px)`;
            }
        }
    }, 16));
}

// Adiciona classe loaded quando a página termina de carregar
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Service Worker registration (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
