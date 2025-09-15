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

// Funcionalidade do Header com scroll (movido para o sistema unificado)
function initHeaderScroll() {
    // Header scroll agora é gerenciado pelo sistema unificado
}

// Funcionalidade do Portfólio Moderno
function initPortfolioFilter() {
    // Dados dos projetos
    const projects = [
        {
            id: 0,
            title: "Vídeo Institucional - Tech Corp",
            category: "Corporativo",
            description: "Produção completa de vídeo institucional para empresa de tecnologia, incluindo roteiro, filmagem e pós-produção. O projeto destacou os valores da empresa e sua missão no mercado.",
            client: "Tech Corporation",
            year: "2024",
            duration: "2:30",
            videoId: "sample1" // Aqui você colocará o ID real do vídeo
        },
        {
            id: 1,
            title: "Campanha Digital - Fashion Brand",
            category: "Marketing",
            description: "Campanha publicitária completa para marca de moda, com conceito criativo inovador e execução impecável. Incluiu direção de arte, filmagem e pós-produção.",
            client: "Fashion Brand",
            year: "2024",
            duration: "1:45",
            videoId: "sample2"
        },
        {
            id: 2,
            title: "Cobertura - Evento Empresarial",
            category: "Eventos",
            description: "Cobertura audiovisual completa de evento corporativo, capturando os momentos mais importantes e criando uma narrativa envolvente para a empresa.",
            client: "Evento Corp",
            year: "2024",
            duration: "3:15",
            videoId: "sample3"
        },
        {
            id: 3,
            title: "Treinamento Interno - StartUp",
            category: "Corporativo",
            description: "Série de vídeos educativos para treinamento interno de startup, com linguagem clara e didática para facilitar o aprendizado dos colaboradores.",
            client: "StartUp Innovation",
            year: "2023",
            duration: "4:20",
            videoId: "sample4"
        },
        {
            id: 4,
            title: "Social Media - Restaurante",
            category: "Marketing",
            description: "Produção de conteúdo para redes sociais de restaurante gourmet, destacando pratos especiais e criando conexão emocional com o público.",
            client: "Restaurante Gourmet",
            year: "2023",
            duration: "0:45",
            videoId: "sample5"
        },
        {
            id: 5,
            title: "Casamento - Villa Exclusive",
            category: "Eventos",
            description: "Filmagem completa de casamento em villa exclusiva, capturando momentos únicos e emocionantes para criar uma lembrança eterna para o casal.",
            client: "Villa Exclusive",
            year: "2024",
            duration: "5:30",
            videoId: "sample6"
        }
    ];

    let currentProjectIndex = 0;
    let autoPlayInterval;
    let isAutoPlaying = true;

    // Elementos do DOM
    const currentCategory = document.getElementById('current-category');
    const currentProject = document.getElementById('current-project');
    const totalProjects = document.getElementById('total-projects');
    const projectTitle = document.getElementById('project-title');
    const projectDescription = document.getElementById('project-description');
    const portfolioPlayer = document.getElementById('portfolio-player');
    const prevBtn = document.getElementById('prev-project');
    const nextBtn = document.getElementById('next-project');
    const thumbnails = document.querySelectorAll('.thumbnail-item');

    // Inicialização
    if (totalProjects) {
        totalProjects.textContent = projects.length.toString().padStart(2, '0');
        updateProject(0);
        startAutoPlay();
    }

    // Função para iniciar auto-play
    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        
        autoPlayInterval = setInterval(() => {
            if (isAutoPlaying) {
                const nextIndex = (currentProjectIndex + 1) % projects.length;
                updateProject(nextIndex);
            }
        }, 5000); // 5 segundos
    }

    // Função para parar auto-play
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }

    // Função para reiniciar auto-play
    function restartAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Função para atualizar projeto
    function updateProject(index) {
        if (index < 0 || index >= projects.length) return;

        const project = projects[index];
        currentProjectIndex = index;

        // Adiciona animação de saída
        const infoElements = document.querySelector('.portfolio-info');
        if (infoElements) {
            infoElements.classList.add('portfolio-fade');
        }

        setTimeout(() => {
            // Atualiza conteúdo
            if (currentCategory) currentCategory.textContent = project.category;
            if (currentProject) currentProject.textContent = (index + 1).toString().padStart(2, '0');
            if (projectTitle) projectTitle.textContent = project.title;
            if (projectDescription) projectDescription.textContent = project.description;

            // Atualiza thumbnails
            thumbnails.forEach((thumb, i) => {
                if (i === index) {
                    thumb.classList.add('active');
                } else {
                    thumb.classList.remove('active');
                }
            });

            // Atualiza estado dos botões
            if (prevBtn) prevBtn.disabled = index === 0;
            if (nextBtn) nextBtn.disabled = index === projects.length - 1;

            // Simula loading do vídeo
            if (portfolioPlayer) {
                portfolioPlayer.classList.add('video-loading');
                setTimeout(() => {
                    portfolioPlayer.classList.remove('video-loading');
                }, 800);
            }

            // Remove animação de saída e adiciona de entrada
            if (infoElements) {
                infoElements.classList.remove('portfolio-fade');
                infoElements.classList.add('active');
            }
        }, 250);
    }

    // Event Listeners para navegação
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentProjectIndex > 0) {
                updateProject(currentProjectIndex - 1);
                restartAutoPlay(); // Reinicia o timer após interação manual
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentProjectIndex < projects.length - 1) {
                updateProject(currentProjectIndex + 1);
                restartAutoPlay(); // Reinicia o timer após interação manual
            }
        });
    }

    // Event Listeners para thumbnails
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            updateProject(index);
            restartAutoPlay(); // Reinicia o timer após interação manual
        });
    });

    // Event Listener para o player principal
    if (portfolioPlayer) {
        portfolioPlayer.addEventListener('click', () => {
            // Aqui você pode integrar com um player de vídeo real
            // Por enquanto, vamos simular o carregamento
            portfolioPlayer.classList.add('video-loading');
            
            setTimeout(() => {
                portfolioPlayer.classList.remove('video-loading');
                showNotification(`Reproduzindo: ${projects[currentProjectIndex].title}`, 'info');
            }, 1500);
        });
    }

    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentProjectIndex > 0) {
            updateProject(currentProjectIndex - 1);
            restartAutoPlay(); // Reinicia o timer após interação manual
        } else if (e.key === 'ArrowRight' && currentProjectIndex < projects.length - 1) {
            updateProject(currentProjectIndex + 1);
            restartAutoPlay(); // Reinicia o timer após interação manual
        }
    });

    // Pausar auto-play quando hover na seção do portfólio
    const portfolioSection = document.querySelector('.portfolio-showcase');
    if (portfolioSection) {
        portfolioSection.addEventListener('mouseenter', () => {
            isAutoPlaying = false;
        });

        portfolioSection.addEventListener('mouseleave', () => {
            isAutoPlaying = true;
        });
    }
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

// Parallax effect movido para o sistema unificado

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

// Sistema de Scroll Unificado e Otimizado
let lastScrollTime = 0;
let lastScroll = 0;
let ticking = false;

function initUnifiedScrollSystem() {
    const header = document.querySelector('.header');
    const heroTop = document.querySelector('.hero-top');
    const heroBottom = document.querySelector('.hero-bottom');
    const videoOverlay = document.querySelector('.video-overlay');
    const hero = document.querySelector('.hero');
    
    function updateScroll() {
        const currentTime = performance.now();
        const currentScroll = window.pageYOffset;
        const heroHeight = hero ? hero.offsetHeight : 0;
        const scrollPercent = heroHeight > 0 ? Math.min(currentScroll / (heroHeight * 0.8), 1) : 0;
        
        // Throttle para 60fps
        if (currentTime - lastScrollTime < 16) {
            ticking = false;
            requestAnimationFrame(updateScroll);
            return;
        }
        
        // Header effects
        if (header) {
            if (currentScroll > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }

            // Hide/show header com hysteresis para evitar flicker
            const threshold = 200;
            const hysteresis = 20;
            
            if (currentScroll > lastScroll + hysteresis && currentScroll > threshold) {
                header.style.transform = 'translateY(-100%)';
            } else if (currentScroll < lastScroll - hysteresis) {
                header.style.transform = 'translateY(0)';
            }
        }
        
        // Hero effects (apenas se os elementos existirem e estiver na área do hero)
        if (heroTop && heroBottom && videoOverlay && currentScroll < heroHeight * 1.2) {
            const scale = Math.max(0.7, 1 - (scrollPercent * 0.25)); // Redução mais suave
            const opacity = Math.max(0.4, 1 - (scrollPercent * 0.4)); // Redução mais suave
            
            // Aplica transformações de forma mais suave e eficiente
            const translateY = currentScroll * 0.15; // Parallax mais suave
            heroTop.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
            heroTop.style.opacity = opacity;
            
            // Overlay com transição mais suave
            const overlayOpacity1 = Math.min(0.35, 0.25 + scrollPercent * 0.08);
            const overlayOpacity2 = Math.min(0.45, 0.35 + scrollPercent * 0.08);
            videoOverlay.style.background = `linear-gradient(135deg, 
                rgba(255, 107, 53, ${overlayOpacity1}) 0%, 
                rgba(44, 62, 80, ${overlayOpacity2}) 100%)`;
            
            // Move o bottom content de forma mais suave
            if (scrollPercent > 0.6) {
                const bottomTransform = (scrollPercent - 0.6) * 2.5; // Início mais tardio
                heroBottom.style.transform = `translate3d(0, ${-bottomTransform * 25}px, 0)`;
            } else {
                heroBottom.style.transform = 'translate3d(0, 0, 0)';
            }
        }
        
        lastScroll = currentScroll;
        lastScrollTime = currentTime;
        ticking = false;
    }
    
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScroll);
            ticking = true;
        }
    }
    
    // Um único listener otimizado com passive para melhor performance
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
}

// Event listeners para performance otimizada (removido o listener vazio)
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

// Efeitos especiais do Hero com scroll (movido para o sistema unificado)
function initHeroScrollEffects() {
    // Hero scroll agora é gerenciado pelo sistema unificado
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
