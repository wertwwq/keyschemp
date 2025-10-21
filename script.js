// Modal functionality
function openRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchToLogin() {
    closeRegisterModal();
    openLoginModal();
}

function switchToRegister() {
    closeLoginModal();
    openRegisterModal();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const registerModal = document.getElementById('registerModal');
    const loginModal = document.getElementById('loginModal');
    const videoModal = document.getElementById('videoModal');
    
    if (event.target === registerModal) {
        closeRegisterModal();
    }
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === videoModal) {
        closeVideoModal();
    }
}

// Form handling
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        phone: document.getElementById('regPhone').value,
        password: document.getElementById('regPassword').value,
        trainingType: document.getElementById('regTrainingType').value
    };
    
    // Basic validation
    if (formData.password !== document.getElementById('regConfirmPassword').value) {
        showNotification('Пароли не совпадают!', 'error');
        return;
    }
    
    if (!document.getElementById('regAgreement').checked) {
        showNotification('Необходимо согласие с условиями использования', 'error');
        return;
    }
    
    // Here you would typically send the data to a server
    console.log('Registration data:', formData);
    
    // Show success message
    showNotification('Регистрация успешна! Добро пожаловать в FitPro!', 'success');
    closeRegisterModal();
    
    // Reset form
    this.reset();
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value,
        rememberMe: document.getElementById('rememberMe').checked
    };
    
    // Here you would typically send the data to a server
    console.log('Login data:', formData);
    
    // Show success message
    showNotification('Вход выполнен успешно!', 'success');
    closeLoginModal();
    
    // Update UI for logged in user
    updateUserUI(formData.email);
    
    // Reset form
    this.reset();
});

// Training selection
function selectTraining(type) {
    const trainingTypes = {
        'strength': 'Силовые тренировки',
        'yoga': 'Йога',
        'cardio': 'Кардио',
        'functional': 'Функциональный тренинг'
    };
    
    openRegisterModal();
    
    // Set the selected training type in the registration form
    setTimeout(() => {
        document.getElementById('regTrainingType').value = type;
    }, 100);
}

// Plan selection
function selectPlan(plan) {
    const plans = {
        'basic': 'Базовый (990₽/месяц)',
        'pro': 'Профессиональный (1990₽/месяц)',
        'premium': 'Премиум (3990₽/месяц)'
    };
    
    if (!isUserLoggedIn()) {
        openRegisterModal();
        showNotification('Пожалуйста, зарегистрируйтесь для выбора тарифа', 'info');
        return;
    }
    
    // Here you would typically process the payment
    console.log('Selected plan:', plan, plans[plan]);
    
    showNotification(`Вы успешно выбрали тариф: ${plans[plan]}! Мы свяжемся с вами для подтверждения.`, 'success');
}

// Video Modal functions
function openVideoPreview() {
    document.getElementById('videoModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    document.getElementById('videoModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Watch Live Session
function watchLiveSession() {
    if (!isUserLoggedIn()) {
        openRegisterModal();
        showNotification('Пожалуйста, зарегистрируйтесь для участия в живом занятии', 'info');
        return;
    }
    
    // Simulate opening live stream
    const sessionTime = document.getElementById('nextSessionTime').textContent;
    const liveStreamURL = "https://www.youtube.com/live/jfKfPfyJRdk?si=KqKQdPN1sC7qQ8yZ";
    
    // Open in new tab
    window.open(liveStreamURL, '_blank');
    
    showNotification(`Присоединяйтесь к трансляции! Ссылка открывается в новом окне. Время: ${sessionTime}`, 'success');
}

// Set Reminder
function setReminder() {
    const sessionTime = document.getElementById('nextSessionTime').textContent;
    
    if ('Notification' in window && Notification.permission === 'granted') {
        // Schedule browser notification
        scheduleNotification(sessionTime);
    } else if ('Notification' in window && Notification.permission !== 'denied') {
        // Request permission
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                scheduleNotification(sessionTime);
            } else {
                showNotification(`Напоминание установлено! Мы напомним вам о занятии: ${sessionTime}`, 'success');
            }
        });
    } else {
        showNotification(`Напоминание установлено! Мы напомним вам о занятии: ${sessionTime}`, 'success');
    }
}

function scheduleNotification(sessionTime) {
    const now = new Date();
    const notificationTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        // For PWA notifications
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('Напоминание о тренировке', {
                body: `Пробное занятие начнется через 1 час! ${sessionTime}`,
                icon: '/icon-192x192.png',
                badge: '/icon-72x72.png',
                tag: 'trial-reminder',
                renotify: true,
                actions: [
                    {
                        action: 'join',
                        title: 'Присоединиться'
                    }
                ]
            });
        });
    } else {
        // Fallback to simple notification
        setTimeout(() => {
            if (Notification.permission === 'granted') {
                new Notification('FitPro - Напоминание', {
                    body: `Пробное занятие начнется через 1 час! ${sessionTime}`,
                    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23667eea" d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7H9V5.5L3 7V9L5 9.5V15.5L3 16V18L9 16.5V18H15V16.5L21 18V16L19 15.5V9.5L21 9Z"/></svg>'
                });
            }
        }, 60 * 60 * 1000);
    }
    
    showNotification('Напоминание установлено! Мы напомним вам за 1 час до начала занятия.', 'success');
}

// Trial Session Timer
let trialTimer;
let nextSessionDate;

function startTrialTimer() {
    // Set next session based on schedule
    const now = new Date();
    nextSessionDate = calculateNextSession(now);
    
    updateNextSessionTime(nextSessionDate);
    
    // Start timer
    trialTimer = setInterval(() => {
        updateTrialCountdown(nextSessionDate);
        updateWatchButton(nextSessionDate);
    }, 1000);
    
    // Initial update
    updateTrialCountdown(nextSessionDate);
    updateWatchButton(nextSessionDate);
}

function calculateNextSession(now) {
    const nextSession = new Date(now);
    const dayOfWeek = now.getDay();
    const currentHour = now.getHours();
    
    // Schedule: Mon, Wed, Fri at 19:00, Sat at 11:00
    const schedule = [
        { day: 1, hour: 19 }, // Monday
        { day: 3, hour: 19 }, // Wednesday
        { day: 5, hour: 19 }, // Friday
        { day: 6, hour: 11 }  // Saturday
    ];
    
    // Find next session
    for (let i = 0; i < 7; i++) {
        const testDate = new Date(now);
        testDate.setDate(now.getDate() + i);
        const testDay = testDate.getDay();
        
        for (const session of schedule) {
            if (testDay === session.day) {
                const sessionDate = new Date(testDate);
                sessionDate.setHours(session.hour, 0, 0, 0);
                
                // If this session is in the future, return it
                if (sessionDate > now) {
                    return sessionDate;
                }
                
                // If it's today but time hasn't passed yet
                if (testDate.getDate() === now.getDate() && 
                    (currentHour < session.hour || (currentHour === session.hour && now.getMinutes() === 0))) {
                    return sessionDate;
                }
            }
        }
    }
    
    // Fallback: next Monday at 19:00
    const daysUntilMonday = (1 - dayOfWeek + 7) % 7;
    nextSession.setDate(now.getDate() + (daysUntilMonday === 0 ? 7 : daysUntilMonday));
    nextSession.setHours(19, 0, 0, 0);
    return nextSession;
}

function updateTrialCountdown(targetDate) {
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) {
        // Session time passed, calculate next session
        const nextSession = calculateNextSession(new Date());
        updateNextSessionTime(nextSession);
        updateTrialCountdown(nextSession);
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('trialDays').textContent = days.toString().padStart(2, '0');
    document.getElementById('trialHours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('trialMinutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('trialSeconds').textContent = seconds.toString().padStart(2, '0');
}

function updateNextSessionTime(sessionDate) {
    const options = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    const sessionTime = sessionDate.toLocaleDateString('ru-RU', options);
    document.getElementById('nextSessionTime').textContent = sessionTime;
}

function updateWatchButton(targetDate) {
    const now = new Date().getTime();
    const distance = targetDate - now;
    const watchButton = document.querySelector('.btn-watch-live');
    
    // Enable button 15 minutes before session and during session
    if (distance <= 15 * 60 * 1000 && distance > -2 * 60 * 60 * 1000) { // 2 hours after session end
        watchButton.classList.add('active');
        watchButton.disabled = false;
        
        if (distance <= 0) {
            watchButton.innerHTML = '<i class="fas fa-circle"></i> Присоединиться к трансляции';
        } else {
            watchButton.innerHTML = '<i class="fas fa-circle"></i> Смотреть онлайн';
        }
    } else {
        watchButton.classList.remove('active');
        watchButton.disabled = true;
        watchButton.innerHTML = '<i class="fas fa-circle"></i> Смотреть онлайн';
    }
}

// User management
function isUserLoggedIn() {
    // Check if user is logged in (for demo, always false)
    return localStorage.getItem('userLoggedIn') === 'true';
}

function updateUserUI(email) {
    // Update UI for logged in user
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons && isUserLoggedIn()) {
        authButtons.innerHTML = `
            <div class="user-menu">
                <span class="user-greeting">Привет, ${email || 'Пользователь'}!</span>
                <button class="logout-btn" onclick="logout()">Выйти</button>
            </div>
        `;
    }
}

function logout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    location.reload();
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 10000;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                border-left: 4px solid #007bff;
                animation: slideInRight 0.3s ease-out;
                max-width: 400px;
            }
            .notification-success { border-left-color: #28a745; }
            .notification-error { border-left-color: #dc3545; }
            .notification-warning { border-left-color: #ffc107; }
            .notification-info { border-left-color: #17a2b8; }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: #6c757d;
                cursor: pointer;
                padding: 0.2rem;
                margin-left: auto;
            }
            .notification-close:hover {
                color: #343a40;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header background on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 30px rgba(0,0,0,0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    }
});

// Social auth buttons
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const platform = this.classList[1].replace('-btn', '');
        showNotification(`Вход через ${platform} будет реализован позже`, 'info');
    });
});

// Map button functionality
document.querySelector('.map-placeholder .btn-outline')?.addEventListener('click', function() {
    showNotification('Функция карты будет реализована в ближайшее время!', 'info');
});

// Coach booking
function bookCoachSession(coachName) {
    if (!isUserLoggedIn()) {
        openRegisterModal();
        showNotification('Пожалуйста, зарегистрируйтесь для записи к тренеру', 'info');
        return;
    }
    
    showNotification(`Вы записаны на пробную тренировку с ${coachName}! Мы свяжемся с вами для подтверждения.`, 'success');
}

// Training card interactions
document.querySelectorAll('.training-card').forEach(card => {
    card.addEventListener('click', function() {
        const trainingName = this.querySelector('h3').textContent;
        showNotification(`Вы выбрали: ${trainingName}. Переходите к регистрации!`, 'info');
    });
});

// Price card interactions
document.querySelectorAll('.price-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        if (!this.classList.contains('popular')) {
            this.style.transform = 'translateY(0)';
        }
    });
});

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('FitPro website loaded successfully!');
    
    // Start trial timer
    startTrialTimer();
    
    // Check if user was logged in
    if (isUserLoggedIn()) {
        const userEmail = localStorage.getItem('userEmail');
        updateUserUI(userEmail);
    }
    
    // Add loading animation
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transition = 'opacity 0.5s ease-in';
        
        setTimeout(() => {
            mainContent.style.opacity = '1';
        }, 100);
    }
    
    // Initialize tooltips
    initializeTooltips();
});

// Tooltip system
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltipText = this.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        font-size: 0.8rem;
        z-index: 1000;
        white-space: nowrap;
        pointer-events: none;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = this.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    this._tooltip = tooltip;
}

function hideTooltip() {
    if (this._tooltip) {
        this._tooltip.remove();
        this._tooltip = null;
    }
}

// Performance optimization - lazy loading for images
if ('IntersectionObserver' in window) {
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
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Error occurred:', e.error);
    showNotification('Произошла ошибка. Пожалуйста, обновите страницу.', 'error');
});

// Offline detection
window.addEventListener('online', function() {
    showNotification('Соединение восстановлено', 'success');
});

window.addEventListener('offline', function() {
    showNotification('Отсутствует подключение к интернету', 'warning');
});

// Add to home screen prompt (PWA)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install prompt
    setTimeout(() => {
        showNotification(
            'Установите FitPro на свой телефон для быстрого доступа!',
            'info'
        );
    }, 5000);
});

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
// Online Training Modal
function showOnlineTrainingModal() {
    document.getElementById('onlineTrainingModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeOnlineTrainingModal() {
    document.getElementById('onlineTrainingModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Select Training Option - теперь только один вариант
function selectTrainingOption(option) {
    showNotification('Вы выбрали видео-курсы! Переходим к подпискам...', 'success');
    
    // Close modal and scroll to pricing
    setTimeout(() => {
        closeOnlineTrainingModal();
        goToPricing();
    }, 1000);
}

// Go to Pricing Section
function goToPricing() {
    // Close any open modals
    closeOnlineTrainingModal();
    closeRegisterModal();
    closeLoginModal();
    
    // Scroll to pricing section
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = pricingSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Add highlight animation
        pricingSection.style.animation = 'highlight 2s ease-in-out';
        setTimeout(() => {
            pricingSection.style.animation = '';
        }, 2000);
    }
}

// Update close modal function
window.onclick = function(event) {
    const registerModal = document.getElementById('registerModal');
    const loginModal = document.getElementById('loginModal');
    const onlineTrainingModal = document.getElementById('onlineTrainingModal');
    
    if (event.target === registerModal) {
        closeRegisterModal();
    }
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === onlineTrainingModal) {
        closeOnlineTrainingModal();
    }
}

// Keyboard support for modals
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeOnlineTrainingModal();
        closeRegisterModal();
        closeLoginModal();
    }
});

// Update navigation
document.querySelectorAll('.nav-links a[href="#online-training"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        showOnlineTrainingModal();
    });
});

// Auto-scroll to pricing
document.querySelectorAll('a[href="#pricing"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        goToPricing();
    });
});
// Mobile Menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    const navbar = document.querySelector('.navbar');
    navbar.appendChild(mobileMenuBtn);
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.addEventListener('click', closeMobileMenu);
    document.body.appendChild(overlay);
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.nav-overlay');
    
    navLinks.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.nav-overlay');
    
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Close mobile menu when clicking on links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    // ... остальной код инициализации
});

// Prevent zoom on double tap (iOS)
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Improve touch scrolling
document.addEventListener('touchstart', function() {
    // Add smooth scrolling for touch devices
}, { passive: true });
