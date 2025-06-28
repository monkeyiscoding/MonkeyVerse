// Script loaded check
console.log('🚀 MonkeyVerse script.js loaded successfully!');

// ======================================================
// MOBILE PERFORMANCE OPTIMIZATION
// ======================================================

// Detect device performance and apply optimizations
function initMobileOptimizations() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowPerformance = checkLowPerformanceDevice();
    
    if (isMobile || isLowPerformance) {
        console.log('📱 Mobile/Low-performance device detected, applying optimizations...');
        
        // Add performance optimization class to body
        document.body.classList.add('mobile-optimized');
        
        // Reduce animation complexity
        optimizeBackgroundAnimations();
        
        // Monitor performance and adjust
        if (isMobile) {
            monitorPerformance();
        }
    }
}

function checkLowPerformanceDevice() {
    // Check for performance indicators
    const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
    const slowConnection = navigator.connection && 
        (navigator.connection.effectiveType === 'slow-2g' || 
         navigator.connection.effectiveType === '2g' ||
         navigator.connection.effectiveType === '3g');
    const lowHardware = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    return lowMemory || slowConnection || lowHardware;
}

function optimizeBackgroundAnimations() {
    // Add CSS class for static backgrounds on low-performance devices
    const style = document.createElement('style');
    style.textContent = `
        .mobile-optimized .matrix-bg::before,
        .mobile-optimized .circuit-pattern,
        .mobile-optimized .hex-grid {
            animation-play-state: paused !important;
        }
        
        .mobile-optimized .particles::before,
        .mobile-optimized .particles::after {
            display: none !important;
        }
        
        /* Fallback background for optimized mode */
        .mobile-optimized .bg-animation {
            background: linear-gradient(180deg, #000 0%, #0a0a0a 50%, #000 100%);
        }
        
        .mobile-optimized .bg-animation::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 25% 25%, rgba(0, 255, 255, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(176, 38, 255, 0.05) 0%, transparent 50%);
            z-index: 1;
        }
    `;
    document.head.appendChild(style);
}

function monitorPerformance() {
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;
    
    function measureFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
            fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            frameCount = 0;
            lastTime = currentTime;
            
            // If FPS drops below 30, disable all animations
            if (fps < 30) {
                console.log(`⚠️ Low FPS detected (${fps}), disabling animations...`);
                document.body.classList.add('low-performance');
                
                const lowPerfStyle = document.createElement('style');
                lowPerfStyle.textContent = `
                    .low-performance * {
                        animation: none !important;
                        transition: none !important;
                    }
                    .low-performance .bg-animation {
                        display: none !important;
                    }
                `;
                document.head.appendChild(lowPerfStyle);
                return; // Stop monitoring
            }
        }
        
        requestAnimationFrame(measureFPS);
    }
    
    // Start monitoring after page load
    setTimeout(() => {
        requestAnimationFrame(measureFPS);
    }, 2000);
}

// Initialize optimizations when DOM is ready
document.addEventListener('DOMContentLoaded', initMobileOptimizations);

// DOM Elements
const enterVerseBtn = document.getElementById('enterVerse');
const introOverlay = document.getElementById('introOverlay');
const welcomeText = document.getElementById('welcomeText');
const gamesGrid = document.getElementById('gamesGrid') || document.getElementById('gamesCarousel');
const gameCards = document.querySelectorAll('.game-card');
const playButtons = document.querySelectorAll('.play-button');
const terminalButtons = document.querySelectorAll('.terminal-button');
const playersOnlineElement = document.getElementById('playersOnline');

// Menu Elements
const menuToggle = document.getElementById('menuToggle');
const cyberMenu = document.getElementById('cyberMenu');
const menuOverlay = document.getElementById('menuOverlay');
const menuClose = document.getElementById('menuClose');
const logoutBtn = document.getElementById('logoutBtn');
const menuItems = document.querySelectorAll('.menu-item');
const menuLinks = document.querySelectorAll('.menu-link');

// Utility Functions
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Dynamic Player Count Animation
function animatePlayerCount() {
    const baseCount = 12200;
    const variation = 500;
    const newCount = baseCount + getRandomInt(-variation, variation);
    
    if (playersOnlineElement) {
        playersOnlineElement.textContent = formatNumber(newCount);
    }
}

// ======================================================
// HACKING AUDIO SYSTEM
// ======================================================

class HackingAudioSystem {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.isInitialized = false;
        this.masterVolume = 0.3;
        
        // Initialize on first user interaction
        this.initializeOnUserGesture();
    }
    
    initializeOnUserGesture() {
        const initAudio = () => {
            if (!this.isInitialized) {
                this.initializeAudioContext();
                document.removeEventListener('click', initAudio);
                document.removeEventListener('keydown', initAudio);
            }
        };
        
        document.addEventListener('click', initAudio);
        document.addEventListener('keydown', initAudio);
    }
    
    initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.isInitialized = true;
            console.log('🔊 Hacking Audio System initialized');
        } catch (error) {
            console.warn('Audio not supported:', error);
        }
    }
    
    // Generate hacking beep sound
    playHackingBeep(frequency = 800, duration = 0.1) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filterNode = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(2000, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    // Generate glitch sound
    playGlitchSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filterNode = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sawtooth';
        
        // Rapid frequency changes for glitch effect
        let time = this.audioContext.currentTime;
        for (let i = 0; i < 8; i++) {
            const freq = Math.random() * 1000 + 200;
            oscillator.frequency.setValueAtTime(freq, time + i * 0.02);
        }
        
        filterNode.type = 'highpass';
        filterNode.frequency.setValueAtTime(400, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.2, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.15);
    }
    
    // Generate typing sound
    playTypingSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(1200 + Math.random() * 400, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.15, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.05);
    }
    
    // Generate matrix data stream sound
    playDataStreamSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filterNode = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + 0.3);
        
        filterNode.type = 'bandpass';
        filterNode.frequency.setValueAtTime(600, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.2, this.audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }
    
    // Generate system access sound
    playSystemAccessSound() {
        if (!this.audioContext) return;
        
        // Create multiple layers for complex sound
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                const filterNode = this.audioContext.createBiquadFilter();
                
                oscillator.connect(filterNode);
                filterNode.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.type = i === 0 ? 'sine' : i === 1 ? 'square' : 'triangle';
                const baseFreq = 300 + i * 200;
                oscillator.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(baseFreq * 1.5, this.audioContext.currentTime + 0.5);
                
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(1000 + i * 500, this.audioContext.currentTime);
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.15, this.audioContext.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.5);
            }, i * 100);
        }
    }
    
    // Play random ambient hacking sounds
    playAmbientHackingSounds() {
        if (!this.audioContext) return;
        
        const sounds = [
            () => this.playHackingBeep(600 + Math.random() * 400, 0.08),
            () => this.playGlitchSound(),
            () => this.playDataStreamSound(),
            () => this.playHackingBeep(1000 + Math.random() * 500, 0.12)
        ];
        
        // Play random sounds at intervals
        const playRandomSound = () => {
            const sound = sounds[Math.floor(Math.random() * sounds.length)];
            sound();
        };
        
        // Play initial sound immediately
        playRandomSound();
        
        // Continue playing sounds for the duration of the intro
        const interval = setInterval(playRandomSound, 300 + Math.random() * 500);
        
        // Stop after 6 seconds
        setTimeout(() => {
            clearInterval(interval);
        }, 6000);
    }
}

// Initialize global audio system
const hackingAudio = new HackingAudioSystem();

// Matrix Rain Effect
function createMatrixRain() {
    const matrixBg = document.querySelector('.matrix-bg');
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    for (let i = 0; i < 20; i++) {
        const span = document.createElement('span');
        span.style.position = 'absolute';
        span.style.left = Math.random() * 100 + '%';
        span.style.animationDelay = Math.random() * 5 + 's';
        span.style.fontSize = '14px';
        span.style.color = 'rgba(0, 255, 255, 0.3)';
        span.style.animation = 'matrixFall 8s linear infinite';
        span.textContent = characters[Math.floor(Math.random() * characters.length)];
        matrixBg.appendChild(span);
    }
}

// Particle System
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = i % 3 === 0 ? '#00ffff' : i % 3 === 1 ? '#b026ff' : '#00ff8c';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `particleFloat ${5 + Math.random() * 5}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 2 + 's';
        particlesContainer.appendChild(particle);
    }
}

// Glitch Effect for Text
function addGlitchEffect(element) {
    const text = element.textContent;
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let iteration = 0;
    
    const interval = setInterval(() => {
        element.textContent = text
            .split('')
            .map((char, index) => {
                if (index < iteration) {
                    return text[index];
                }
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            })
            .join('');
        
        if (iteration >= text.length) {
            clearInterval(interval);
            element.textContent = text;
        }
        
        iteration += 1/3;
    }, 30);
}

// Game Card Hover Effects
function initGameCardEffects() {
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const title = card.querySelector('.game-title');
            if (title) {
                addGlitchEffect(title);
            }
        });
        
        // Disabled game card click functionality
        // card.addEventListener('click', () => {
        //     const gameName = card.dataset.game;
        //     showGameModal(gameName);
        // });
    });
}

// Play Button Effects
function initPlayButtonEffects() {
    playButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const gameCard = button.closest('.game-card');
            const gameName = gameCard.dataset.game;
            launchGame(gameName);
        });
        
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1) rotate(360deg)';
            button.style.transition = 'all 0.5s ease';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Modal System
function showGameModal(gameName) {
    const modal = createModal();
    const gameInfo = getGameInfo(gameName);
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${gameInfo.title}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="game-preview">
                    <div class="game-screenshot"></div>
                </div>
                <div class="game-details">
                    <p>${gameInfo.description}</p>
                    <div class="game-stats">
                        <div class="stat">
                            <span class="stat-label">Players:</span>
                            <span class="stat-value">${gameInfo.players}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Rating:</span>
                            <span class="stat-value">${gameInfo.rating}/5</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Difficulty:</span>
                            <span class="stat-value">${gameInfo.difficulty}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="modal-button primary" onclick="launchGame('${gameName}')">Launch Game</button>
                <button class="modal-button secondary" onclick="closeModal()">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

function createModal() {
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.game-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Game Information Database
function getGameInfo(gameName) {
    const games = {
        'cyber-chess': {
            title: 'Cyber Chess',
            description: 'Experience chess like never before in a digital realm where pieces come alive with holographic effects. Challenge AI opponents or compete globally.',
            players: '4.2K',
            rating: '4.9',
            difficulty: 'Expert'
        },
        'cyber-drift': {
            title: 'Cyber Drift',
            description: 'Race through neon-lit cityscapes at impossible speeds. Master gravity-defying vehicles in the ultimate racing experience.',
            players: '5.7K',
            rating: '4.6',
            difficulty: 'Medium'
        },
        'quantum-heist': {
            title: 'Quantum Heist',
            description: 'Infiltrate quantum-secured facilities using stealth and hacking skills. Every decision creates alternate timelines.',
            players: '1.9K',
            rating: '4.9',
            difficulty: 'Expert'
        },
        'neon-wars': {
            title: 'Neon Wars',
            description: 'Enter the arena where cybernetic warriors clash in spectacular combat. Upgrade your arsenal and dominate the battlefield.',
            players: '8.1K',
            rating: '4.7',
            difficulty: 'Hard'
        },
        'data-breach': {
            title: 'Data Breach',
            description: 'Become the ultimate hacker. Penetrate corporate networks, uncover conspiracies, and reshape the digital world.',
            players: '3.4K',
            rating: '4.5',
            difficulty: 'Hard'
        }
    };
    
    return games[gameName] || games['cyber-chess'];
}

// Game Launch System
function launchGame(gameName) {
    closeModal();
    showLoadingScreen(gameName);
}

function showLoadingScreen(gameName) {
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #000, #001a1a);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        color: #00ffff;
        font-family: 'Orbitron', monospace;
    `;
    
    loadingScreen.innerHTML = `
        <div class="loading-logo">
            <div class="loading-circle"></div>
            <h2>MonkeyVerse</h2>
        </div>
        <div class="loading-text">
            <p>Initializing ${getGameInfo(gameName).title}...</p>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
            <p class="loading-status">Connecting to neural network...</p>
        </div>
    `;
    
    // Add loading screen styles
    const style = document.createElement('style');
    style.textContent = `
        .loading-circle {
            width: 100px;
            height: 100px;
            border: 3px solid rgba(0, 255, 255, 0.3);
            border-top: 3px solid #00ffff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        
        .loading-bar {
            width: 300px;
            height: 4px;
            background: rgba(0, 255, 255, 0.2);
            border-radius: 2px;
            overflow: hidden;
            margin: 20px 0;
        }
        
        .loading-progress {
            height: 100%;
            background: linear-gradient(90deg, #00ffff, #00ff8c);
            width: 0%;
            animation: loadingProgress 3s ease-in-out forwards;
        }
        
        .loading-status {
            font-size: 14px;
            opacity: 0.8;
            margin-top: 10px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes loadingProgress {
            0% { width: 0%; }
            100% { width: 100%; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(loadingScreen);
    
    // Simulate loading process
    const statusTexts = [
        'Connecting to neural network...',
        'Loading game assets...',
        'Synchronizing player data...',
        'Establishing secure connection...',
        'Game ready!'
    ];
    
    let statusIndex = 0;
    const statusElement = loadingScreen.querySelector('.loading-status');
    
    const statusInterval = setInterval(() => {
        if (statusIndex < statusTexts.length - 1) {
            statusIndex++;
            statusElement.textContent = statusTexts[statusIndex];
        } else {
            clearInterval(statusInterval);
            setTimeout(() => {
                loadingScreen.remove();
                style.remove();
                showGameNotification(gameName);
            }, 1000);
        }
    }, 600);
}

function showGameNotification(gameName) {
    // For cyber-chess, redirect to the game instead of showing notification
    if (gameName === 'cyber-chess') {
        setTimeout(() => {
            window.location.href = 'cyber-chess.html';
        }, 500);
        return;
    }
    
    const notification = document.createElement('div');
    notification.className = 'game-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, rgba(0, 255, 255, 0.9), rgba(0, 255, 140, 0.9));
        color: #000;
        padding: 20px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 10002;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 255, 255, 0.3);
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">🎮</span>
            <div>
                <strong>${getGameInfo(gameName).title}</strong>
                <div style="font-size: 12px; opacity: 0.8;">Game would launch here in full version</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Terminal Effects
function initTerminalEffects() {
    terminalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isLogin = button.classList.contains('login-btn');
            showTerminalAction(isLogin ? 'login' : 'signup');
        });
    });
}

function showTerminalAction(action) {
    const terminal = document.querySelector('.terminal-body');
    const output = terminal.querySelector('.terminal-output');
    
    const newLine = document.createElement('p');
    newLine.textContent = `$ ${action}_sequence --execute`;
    output.appendChild(newLine);
    
    setTimeout(() => {
        const response = document.createElement('p');
        response.className = 'success';
        response.textContent = action === 'login' ? 
            '✓ Authentication required - redirecting...' : 
            '✓ Account creation initiated - welcome to the verse!';
        output.appendChild(response);
        
        // Scroll to bottom
        terminal.scrollTop = terminal.scrollHeight;
    }, 1000);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        observer.observe(section);
    });
    
    // Observe cards
    document.querySelectorAll('.game-card, .feature-card, .progress-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        observer.observe(card);
    });
}

// Progress Bar Animations
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.xp-fill, .skill-fill, .rank-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 200);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => observer.observe(bar));
}

// Keyboard Shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Enter key on Enter the Verse button
        if (e.key === 'Enter' && document.activeElement === enterVerseBtn) {
            enterVerseBtn.click();
        }
        
        // Escape key to close modals
        if (e.key === 'Escape') {
            closeModal();
        }
        
        // Number keys to launch games
        if (e.key >= '1' && e.key <= '5') {
            const gameIndex = parseInt(e.key) - 1;
            const gameCard = gameCards[gameIndex];
            if (gameCard) {
                const gameName = gameCard.dataset.game;
                launchGame(gameName);
            }
        }
    });
}

// Mouse Tracking for Parallax Effect
function initMouseTracking() {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        
        // Apply parallax to background elements
        const particles = document.querySelector('.particles');
        const hexGrid = document.querySelector('.hex-grid');
        
        if (particles) {
            particles.style.transform = `translate(${mouseX * 10}px, ${mouseY * 10}px)`;
        }
        
        if (hexGrid) {
            hexGrid.style.transform = `translate(${mouseX * 5}px, ${mouseY * 5}px)`;
        }
    });
}

// Audio System (Visual feedback since we can't include actual audio files)
function initAudioFeedback() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Visual audio feedback
            button.style.boxShadow = '0 0 30px currentColor';
            setTimeout(() => {
                button.style.boxShadow = '';
            }, 200);
        });
        
        button.addEventListener('mouseenter', () => {
            // Visual hover sound feedback
            button.style.filter = 'brightness(1.2)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.filter = '';
        });
    });
}

// Performance Monitoring
function initPerformanceMonitoring() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function checkFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            // Adjust animations based on performance
            if (fps < 30) {
                document.body.classList.add('low-performance');
            } else {
                document.body.classList.remove('low-performance');
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(checkFPS);
    }
    
    requestAnimationFrame(checkFPS);
}

// Add CSS for performance optimization
function addPerformanceCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .low-performance * {
            animation-duration: 0s !important;
            transition-duration: 0.1s !important;
        }
        
        .low-performance .particles,
        .low-performance .matrix-bg::before,
        .low-performance .circuit-pattern {
            display: none;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes matrixFall {
            0% {
                top: -10px;
                opacity: 1;
            }
            100% {
                top: 100vh;
                opacity: 0;
            }
        }
        
        @keyframes particleFloat {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0.3;
            }
            50% {
                transform: translateY(-20px) rotate(180deg);
                opacity: 1;
            }
        }
        
        .game-modal.active {
            opacity: 1;
        }
        
        .modal-content {
            background: linear-gradient(145deg, rgba(0, 0, 0, 0.9), rgba(0, 20, 20, 0.9));
            border: 1px solid rgba(0, 255, 255, 0.3);
            border-radius: 15px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            color: #fff;
            box-shadow: 0 20px 60px rgba(0, 255, 255, 0.2);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(0, 255, 255, 0.2);
        }
        
        .modal-close {
            background: none;
            border: none;
            color: #fff;
            font-size: 24px;
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: rgba(255, 0, 0, 0.2);
            color: #ff4444;
        }
        
        .modal-body {
            margin-bottom: 30px;
        }
        
        .game-preview {
            width: 100%;
            height: 200px;
            background: linear-gradient(45deg, rgba(0, 255, 255, 0.1), rgba(176, 38, 255, 0.1));
            border-radius: 10px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(255, 255, 255, 0.5);
            font-size: 18px;
        }
        
        .game-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .stat {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            background: rgba(0, 255, 255, 0.05);
            border-radius: 5px;
            border: 1px solid rgba(0, 255, 255, 0.1);
        }
        
        .stat-label {
            color: rgba(255, 255, 255, 0.7);
        }
        
        .stat-value {
            color: #00ffff;
            font-weight: 600;
        }
        
        .modal-footer {
            display: flex;
            gap: 15px;
            justify-content: flex-end;
        }
        
        .modal-button {
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .modal-button.primary {
            background: linear-gradient(45deg, #00ffff, #00ff8c);
            color: #000;
        }
        
        .modal-button.primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 255, 255, 0.3);
        }
        
        .modal-button.secondary {
            background: transparent;
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: #fff;
        }
        
        .modal-button.secondary:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.5);
        }
    `;
    
    document.head.appendChild(style);
}

// Menu System Functions
function initMenuSystem() {
    // Menu toggle functionality
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }
    
    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }
    
    // Menu item interactions
    menuItems.forEach(item => {
        const link = item.querySelector('.menu-link');
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                handleMenuItemClick(item);
            });
        }
    });
    
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Keyboard shortcuts for menu
    document.addEventListener('keydown', handleMenuKeyboard);
}

function toggleMenu() {
    if (cyberMenu.classList.contains('active')) {
        closeMenu();
    } else {
        openMenu();
    }
}

function openMenu() {
    cyberMenu.classList.add('active');
    menuToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Terminal boot-up effect
    playTerminalBootSound();
    
    // Stagger animation for menu items
    menuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px) scale(0.9)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
        }, 100 + (index * 50));
    });
}

function closeMenu() {
    cyberMenu.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset menu item styles
    setTimeout(() => {
        menuItems.forEach(item => {
            item.style.transition = '';
            item.style.opacity = '';
            item.style.transform = '';
        });
    }, 400);
}

function handleMenuItemClick(clickedItem) {
    // Remove active class from all items
    menuItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to clicked item
    clickedItem.classList.add('active');
    
    // Get page data
    const page = clickedItem.dataset.page;
    
    // Simulate page navigation
    showPageTransition(page);
    
    // Close menu on mobile
    if (window.innerWidth <= 768) {
        setTimeout(closeMenu, 200);
    }
}

function showPageTransition(page) {
    const pageNames = {
        profile: 'User Profile',
        progress: 'Progress Dashboard',
        games: 'Games Library',
        leaderboard: 'Global Leaderboard',
        settings: 'System Settings',
        themes: 'Theme Customizer',
        help: 'Help & Support'
    };
    
    // Create transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, rgba(0, 255, 255, 0.9), rgba(176, 38, 255, 0.9));
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10003;
        color: #000;
        font-family: 'Orbitron', monospace;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    overlay.innerHTML = `
        <div class="transition-content">
            <div class="loading-spinner"></div>
            <h2 style="margin: 20px 0 10px; font-size: 28px;">Loading ${pageNames[page] || 'Page'}</h2>
            <p style="opacity: 0.8;">Initializing neural interface...</p>
        </div>
    `;
    
    // Add spinner styles
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            width: 60px;
            height: 60px;
            border: 4px solid rgba(0, 0, 0, 0.3);
            border-top: 4px solid #000;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    
    setTimeout(() => overlay.style.opacity = '1', 10);
    
    // Remove overlay after transition
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            style.remove();
            showPageNotification(pageNames[page] || 'Page');
        }, 300);
    }, 2000);
}

function showPageNotification(pageName) {
    const notification = document.createElement('div');
    notification.className = 'page-notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, rgba(0, 255, 255, 0.9), rgba(0, 255, 140, 0.9));
        color: #000;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10002;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 255, 255, 0.3);
        font-family: 'Orbitron', monospace;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 18px;">📱</span>
            <div>
                <strong>${pageName}</strong>
                <div style="font-size: 12px; opacity: 0.8;">Feature would load here in full version</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function handleLogout() {
    const confirmOverlay = document.createElement('div');
    confirmOverlay.className = 'logout-confirm';
    confirmOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10004;
        backdrop-filter: blur(10px);
    `;
    
    confirmOverlay.innerHTML = `
        <div class="confirm-dialog" style="
            background: linear-gradient(145deg, rgba(13, 13, 13, 0.95), rgba(17, 24, 39, 0.95));
            border: 2px solid rgba(255, 68, 68, 0.3);
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            color: #fff;
            max-width: 400px;
            margin: 20px;
        ">
            <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
            <h3 style="color: #ff4444; margin-bottom: 15px; font-family: 'Orbitron', monospace;">Disconnect from MonkeyVerse?</h3>
            <p style="margin-bottom: 25px; opacity: 0.8;">Your session will be terminated and all progress saved.</p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button id="confirmLogout" style="
                    background: linear-gradient(45deg, #ff4444, #ff6666);
                    border: none;
                    color: #fff;
                    padding: 12px 25px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Logout</button>
                <button id="cancelLogout" style="
                    background: transparent;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    color: #fff;
                    padding: 12px 25px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmOverlay);
    
    // Handle confirmation
    const confirmBtn = confirmOverlay.querySelector('#confirmLogout');
    const cancelBtn = confirmOverlay.querySelector('#cancelLogout');
    
    confirmBtn.addEventListener('click', () => {
        confirmOverlay.remove();
        performLogout();
    });
    
    cancelBtn.addEventListener('click', () => {
        confirmOverlay.remove();
    });
    
    confirmOverlay.addEventListener('click', (e) => {
        if (e.target === confirmOverlay) {
            confirmOverlay.remove();
        }
    });
}

function performLogout() {
    const logoutScreen = document.createElement('div');
    logoutScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #000, #001a1a);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10005;
        color: #00ffff;
        font-family: 'Orbitron', monospace;
    `;
    
    logoutScreen.innerHTML = `
        <div class="logout-animation">
            <div style="font-size: 64px; margin-bottom: 20px; animation: fadeOut 2s ease-in-out;">⚡</div>
            <h2 style="margin-bottom: 20px;">Disconnecting from MonkeyVerse...</h2>
            <div class="logout-progress" style="
                width: 300px;
                height: 4px;
                background: rgba(0, 255, 255, 0.2);
                border-radius: 2px;
                overflow: hidden;
                margin-bottom: 20px;
            ">
                <div style="
                    height: 100%;
                    background: linear-gradient(90deg, #00ffff, #ff4444);
                    width: 0%;
                    animation: logoutProgress 3s ease-in-out forwards;
                "></div>
            </div>
            <p style="opacity: 0.8;">Session terminated. Thank you for playing!</p>
        </div>
    `;
    
    // Add logout animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0.3; transform: scale(0.8); }
        }
        
        @keyframes logoutProgress {
            0% { width: 0%; }
            100% { width: 100%; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(logoutScreen);
    
    // Remove after animation
    setTimeout(() => {
        logoutScreen.remove();
        style.remove();
        // In a real app, this would redirect to login page
        location.reload();
    }, 4000);
}

function handleMenuKeyboard(e) {
    // Escape key to close menu
    if (e.key === 'Escape' && cyberMenu.classList.contains('active')) {
        closeMenu();
    }
    
    // Alt + M to toggle menu
    if (e.altKey && e.key === 'm') {
        e.preventDefault();
        toggleMenu();
    }
}

function playTerminalBootSound() {
    // Visual sound feedback since we can't include actual audio
    const soundFeedback = document.createElement('div');
    soundFeedback.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: rgba(0, 255, 255, 0.1);
        border: 1px solid rgba(0, 255, 255, 0.3);
        padding: 10px 15px;
        border-radius: 5px;
        color: #00ffff;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        z-index: 10001;
        animation: soundPulse 0.5s ease-in-out;
    `;
    
    soundFeedback.textContent = '♪ TERMINAL_BOOT.wav';
    document.body.appendChild(soundFeedback);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes soundPulse {
            0% { opacity: 0; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 0; transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        soundFeedback.remove();
        style.remove();
    }, 500);
}

// Update notification badge dynamically
function updateNotificationBadge() {
    const settingsItem = document.querySelector('[data-page="settings"]');
    const badge = settingsItem?.querySelector('.notification-badge');
    
    if (badge) {
        const count = Math.floor(Math.random() * 5) + 1;
        badge.textContent = count;
        
        // Pulse animation when updated
        badge.style.animation = 'none';
        setTimeout(() => {
            badge.style.animation = 'notificationPulse 2s ease-in-out infinite';
        }, 10);
    }
}

// Auto-update notifications every 30 seconds
function initNotificationSystem() {
    updateNotificationBadge();
    setInterval(updateNotificationBadge, 30000);
}

// Cyber Monkey Functions
function initCyberMonkey() {
    const monkeyContainer = document.querySelector('.cyber-monkey-container');
    const eyes = document.querySelectorAll('.eye');
    
    if (!monkeyContainer) return;
    
    // Random blinking
    setInterval(() => {
        eyes.forEach(eye => {
            if (Math.random() > 0.7) {
                eye.style.animation = 'eyeBlink 0.3s ease-out';
                setTimeout(() => {
                    eye.style.animation = 'eyeBlink 4s infinite, eyeGlow 2s ease-in-out infinite alternate';
                }, 300);
            }
        });
    }, 3000);
    
    // Boot sequence on load
    setTimeout(() => {
        if (monkeyContainer.classList.contains('boot-up')) {
            monkeyContainer.classList.remove('boot-up');
        }
    }, 3000);
    
    // Enhanced hover effects
    monkeyContainer.addEventListener('mouseenter', () => {
        monkeyContainer.style.filter = 'brightness(1.1) saturate(1.2)';
        // Wake up sound effect simulation
        showWakeUpEffect();
    });
    
    monkeyContainer.addEventListener('mouseleave', () => {
        monkeyContainer.style.filter = 'brightness(1) saturate(1)';
    });
    
    // Click interaction
    monkeyContainer.addEventListener('click', () => {
        triggerMonkeyInteraction();
    });
}

function showWakeUpEffect() {
    const wakeEffect = document.createElement('div');
    wakeEffect.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 255, 255, 0.1);
        border: 1px solid rgba(0, 255, 255, 0.3);
        padding: 10px 15px;
        border-radius: 5px;
        color: #00ffff;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        z-index: 10001;
        animation: wakeUpNotification 1s ease-in-out;
        pointer-events: none;
    `;
    
    wakeEffect.textContent = '> CYBER_MONKEY.exe activated';
    document.body.appendChild(wakeEffect);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes wakeUpNotification {
            0% { opacity: 0; transform: translateX(100%); }
            20% { opacity: 1; transform: translateX(0); }
            80% { opacity: 1; transform: translateX(0); }
            100% { opacity: 0; transform: translateX(100%); }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        wakeEffect.remove();
        style.remove();
    }, 1000);
}

function triggerMonkeyInteraction() {
    const monkeyFace = document.querySelector('.monkey-face');
    const messages = [
        '> Neural link established',
        '> Monkey.exe is running',
        '> Welcome to the MonkeyVerse',
        '> System status: ONLINE',
        '> Ready for digital adventure'
    ];
    
    if (monkeyFace) {
        // Trigger special glitch effect
        monkeyFace.style.animation = 'faceGlitch 0.5s ease-out, faceGlitch 8s infinite';
        
        // Show random message
        const message = messages[Math.floor(Math.random() * messages.length)];
        showMonkeyMessage(message);
        
        // Reset animation
        setTimeout(() => {
            monkeyFace.style.animation = 'faceGlitch 8s infinite';
        }, 500);
    }
}

function showMonkeyMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(145deg, rgba(0, 0, 0, 0.95), rgba(17, 24, 39, 0.95));
        border: 2px solid rgba(0, 255, 255, 0.5);
        border-radius: 10px;
        padding: 20px 30px;
        color: #00ffff;
        font-family: 'Courier New', monospace;
        font-size: 16px;
        z-index: 10002;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 255, 255, 0.2);
        animation: messageAppear 2s ease-out;
        pointer-events: none;
    `;
    
    messageDiv.innerHTML = `
        <div style="margin-bottom: 10px; font-size: 24px;">🤖</div>
        <div>${message}</div>
        <div style="margin-top: 10px; font-size: 12px; opacity: 0.7;">MonkeyVerse AI</div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes messageAppear {
            0% { 
                opacity: 0; 
                transform: translate(-50%, -50%) scale(0.5) rotateY(90deg);
                filter: blur(10px);
            }
            50% { 
                opacity: 1; 
                transform: translate(-50%, -50%) scale(1.05) rotateY(0deg);
                filter: blur(0px);
            }
            90% { 
                opacity: 1; 
                transform: translate(-50%, -50%) scale(1) rotateY(0deg);
            }
            100% { 
                opacity: 0; 
                transform: translate(-50%, -50%) scale(0.8) rotateY(-90deg);
                filter: blur(5px);
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
        style.remove();
    }, 2000);
}

// Auto monkey interactions
function initMonkeyAutoInteractions() {
    // Random monkey activities every 30 seconds
    setInterval(() => {
        if (Math.random() > 0.7) {
            const actions = [
                () => triggerRandomBlink(),
                () => triggerEarTwitch(),
                () => triggerGlitchEffect()
            ];
            
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            randomAction();
        }
    }, 30000);
}

function triggerRandomBlink() {
    const eyes = document.querySelectorAll('.eye');
    eyes.forEach((eye, index) => {
        setTimeout(() => {
            eye.style.animation = 'eyeBlink 0.2s ease-out';
            setTimeout(() => {
                eye.style.animation = 'eyeBlink 4s infinite, eyeGlow 2s ease-in-out infinite alternate';
            }, 200);
        }, index * 100);
    });
}

function triggerEarTwitch() {
    const ears = document.querySelectorAll('.ear');
    ears.forEach(ear => {
        const currentAnimation = ear.style.animation;
        ear.style.animation = 'earTwitch 0.5s ease-out';
        setTimeout(() => {
            ear.style.animation = currentAnimation || 'earTwitch 6s ease-in-out infinite';
        }, 500);
    });
}

function triggerGlitchEffect() {
    const monkeyFace = document.querySelector('.monkey-face');
    if (monkeyFace) {
        monkeyFace.style.animation = 'faceGlitch 1s ease-out';
        setTimeout(() => {
            monkeyFace.style.animation = 'faceGlitch 8s infinite';
        }, 1000);
    }
}

// Cyberpunk Intro Animation System
const introAnimation = {
    isPlaying: false,
    duration: 6000, // 6 seconds total (reduced for mobile)
    
    // Welcome messages to type out
    messages: [
        "INITIALIZING NEURAL LINK...",
        "ACCESSING MAINFRAME...",
        "WELCOME TO MONKEYVERSE",
        "ENTERING THE MATRIX..."
    ],
    
    // Check if device should have simplified intro
    shouldSimplify() {
        return document.body.classList.contains('mobile-optimized') || 
               document.body.classList.contains('low-performance') ||
               window.innerWidth < 768;
    },
    
    // Start the intro sequence
    start() {
        console.log('Intro animation start() called');
        console.log('isPlaying:', this.isPlaying);
        console.log('introOverlay element:', introOverlay);
        
        if (this.isPlaying) {
            console.log('Animation already playing, returning');
            return;
        }
        this.isPlaying = true;
        
        // Check if we should simplify for mobile/low-performance
        if (this.shouldSimplify()) {
            console.log('📱 Using simplified intro for mobile/low-performance device');
            this.duration = 3000; // Shorter duration for mobile
            this.startSimplifiedIntro();
            return;
        }
        
        // Start ambient hacking sounds (only on desktop)
        hackingAudio.playAmbientHackingSounds();
        
        // Show intro overlay
        if (introOverlay) {
            console.log('Showing intro overlay');
            introOverlay.style.display = 'flex';
            introOverlay.style.opacity = '0';
            
            // Fade in
            setTimeout(() => {
                console.log('Fading in intro overlay');
                introOverlay.style.opacity = '1';
                // Play additional glitch sound on fade in
                hackingAudio.playGlitchSound();
            }, 50);
            
            // Start animations
            this.animateMask();
            this.animateParticles();
            this.startTypingSequence();
            this.addGlitchEffects();
            
            // Complete intro after duration
            setTimeout(() => {
                this.complete();
            }, this.duration);
        } else {
            console.error('introOverlay element not found!');
        }
    },
    
    // Simplified intro for mobile/low-performance devices
    startSimplifiedIntro() {
        if (introOverlay) {
            introOverlay.style.display = 'flex';
            introOverlay.style.opacity = '0';
            
            // Add mobile-specific class
            introOverlay.classList.add('mobile-intro');
            
            // Quick fade in
            setTimeout(() => {
                introOverlay.style.opacity = '1';
            }, 50);
            
            // Only show typing without complex animations
            this.startSimpleTypingSequence();
            
            // Complete intro after shorter duration
            setTimeout(() => {
                this.complete();
            }, this.duration);
        }
    },
    
    // Simplified typing sequence for mobile
    startSimpleTypingSequence() {
        const terminalContent = document.querySelector('.terminal-content');
        if (!terminalContent) return;
        
        const messages = ["WELCOME TO MONKEYVERSE", "ENTERING THE MATRIX..."];
        let currentMessageIndex = 0;
        
        const typeMessage = () => {
            if (currentMessageIndex >= messages.length) return;
            
            const messageElement = document.createElement('div');
            messageElement.className = 'terminal-line simple-line';
            messageElement.textContent = `> ${messages[currentMessageIndex]}`;
            terminalContent.appendChild(messageElement);
            
            currentMessageIndex++;
            if (currentMessageIndex < messages.length) {
                setTimeout(typeMessage, 800);
            }
        };
        
        typeMessage();
    },
    
    // Animate the SVG binary mask
    animateMask() {
        const mask = document.querySelector('.binary-mask');
        const eyes = document.querySelectorAll('.mask-eye');
        const smile = document.querySelector('.mask-smile');
        
        if (mask) {
            // Initial entrance animation
            mask.style.transform = 'scale(0.8) rotateY(10deg)';
            mask.style.filter = 'brightness(0.7)';
            
            // Float and glow animation
            setTimeout(() => {
                mask.style.transform = 'scale(1) rotateY(0deg)';
                mask.style.filter = 'brightness(1.2) drop-shadow(0 0 20px #00ffff)';
            }, 500);
            
            // Animate eyes
            if (eyes.length > 0) {
                eyes.forEach((eye, index) => {
                    setTimeout(() => {
                        eye.style.fill = '#00ff00';
                        eye.style.filter = 'drop-shadow(0 0 10px #00ff00)';
                        
                        // Blink effect
                        setInterval(() => {
                            eye.style.opacity = '0.3';
                            setTimeout(() => {
                                eye.style.opacity = '1';
                            }, 150);
                        }, 2000 + index * 500);
                    }, 1000 + index * 200);
                });
            }
            
            // Animate smile
            if (smile) {
                setTimeout(() => {
                    smile.style.stroke = '#ff0080';
                    smile.style.filter = 'drop-shadow(0 0 5px #ff0080)';
                }, 1500);
            }
            
            // Random glitch effects
            setInterval(() => {
                if (this.isPlaying) {
                    mask.style.filter = 'brightness(1.5) hue-rotate(90deg) drop-shadow(0 0 20px #ff0080)';
                    setTimeout(() => {
                        mask.style.filter = 'brightness(1.2) drop-shadow(0 0 20px #00ffff)';
                    }, 100);
                }
            }, 800);
        }
    },
    
    // Animate floating particles
    animateParticles() {
        const particles = document.querySelectorAll('.floating-particles .particle');
        
        particles.forEach((particle, index) => {
            const colors = ['#00ffff', '#ff0080', '#00ff00', '#ffff00', '#ff8000'];
            const color = colors[index % colors.length];
            
            particle.style.background = color;
            particle.style.boxShadow = `0 0 10px ${color}`;
            
            // Random movement
            setInterval(() => {
                if (this.isPlaying) {
                    const x = Math.random() * 100;
                    const y = Math.random() * 100;
                    particle.style.left = x + '%';
                    particle.style.top = y + '%';
                }
            }, 1500 + index * 300);
        });
    },
    
    // Start typing sequence for welcome text
    startTypingSequence() {
        let messageIndex = 0;
        
        const typeNextMessage = () => {
            if (messageIndex < this.messages.length && this.isPlaying) {
                this.typeMessage(this.messages[messageIndex], () => {
                    messageIndex++;
                    setTimeout(typeNextMessage, 800);
                });
            }
        };
        
        // Start typing after a brief delay
        setTimeout(typeNextMessage, 1000);
    },
    
    // Type out a single message with cursor effect
    typeMessage(message, callback) {
        if (!welcomeText) return;
        
        let index = 0;
        welcomeText.textContent = '';
        
        const typeInterval = setInterval(() => {
            if (index < message.length && this.isPlaying) {
                welcomeText.textContent += message[index];
                index++;
                
                // Play typing sound for each character
                hackingAudio.playTypingSound();
                
                // Add random typing sounds (visual feedback)
                this.addTypingEffect();
            } else {
                clearInterval(typeInterval);
                
                // Play completion beep
                hackingAudio.playHackingBeep(1200, 0.15);
                
                // Brief pause before clearing/callback
                setTimeout(() => {
                    if (callback) callback();
                }, 500);
            }
        }, 50 + Math.random() * 50); // Variable typing speed
    },
    
    // Visual typing effect
    addTypingEffect() {
        const cursor = document.querySelector('.terminal-cursor');
        if (cursor) {
            cursor.style.opacity = '1';
            cursor.style.color = '#00ff00';
            
            setTimeout(() => {
                cursor.style.opacity = '0.3';
            }, 100);
        }
    },
    
    // Add glitch effects to various elements
    addGlitchEffects() {
        const glitchElements = [
            document.querySelector('.intro-glitch-bg'),
            document.querySelector('.binary-mask-container')
        ];
        
        glitchElements.forEach(element => {
            if (element) {
                setInterval(() => {
                    if (this.isPlaying) {
                        element.style.filter = 'hue-rotate(180deg) brightness(1.5)';
                        // Play glitch sound effect
                        hackingAudio.playGlitchSound();
                        setTimeout(() => {
                            element.style.filter = 'none';
                        }, 100);
                    }
                }, 1200);
            }
        });
    },
    
    // Complete the intro and transition to homepage
    complete() {
        this.isPlaying = false;
        
        // Play completion sound sequence
        hackingAudio.playSystemAccessSound();
        setTimeout(() => {
            hackingAudio.playDataStreamSound();
        }, 200);
        
        if (introOverlay) {
            // Final message
            if (welcomeText) {
                welcomeText.textContent = 'WELCOME TO THE VERSE';
                
                // Add final glow effect
                setTimeout(() => {
                    welcomeText.style.color = '#00ff00';
                    welcomeText.style.textShadow = '0 0 20px #00ff00';
                    // Play final confirmation beep
                    hackingAudio.playHackingBeep(1500, 0.3);
                }, 500);
            }
            
            // Fade out intro
            setTimeout(() => {
                introOverlay.style.opacity = '0';
                introOverlay.style.transform = 'scale(1.1)';
                
                // Hide completely and enable homepage
                setTimeout(() => {
                    introOverlay.style.display = 'none';
                    this.enableHomepage();
                }, 800);
            }, 1000);
        }
    },
    
    // Enable homepage interactions
    enableHomepage() {
        // Add entrance animation to homepage elements
        const hero = document.querySelector('.hero');
        const nav = document.querySelector('.nav');
        const footer = document.querySelector('.footer');
        
        [hero, nav, footer].forEach((element, index) => {
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.8s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
        
        // Re-enable all interactive elements
        document.body.style.pointerEvents = 'auto';
        
        // Optional: Play success sound effect
        this.playSound('welcome');
    },
    
    // Optional sound effects
    playSound(type) {
        // You can add Web Audio API sounds here
        // For now, just visual feedback
        console.log(`Playing ${type} sound effect`);
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add performance CSS
    addPerformanceCSS();
    
    // Initialize all systems
    createMatrixRain();
    createParticles();
    initGameCardEffects();
    initPlayButtonEffects();
    initTerminalEffects();
    initScrollAnimations();
    animateProgressBars();
    initKeyboardShortcuts();
    initMouseTracking();
    initAudioFeedback();
    initPerformanceMonitoring();
    
    // Initialize menu system
    initMenuSystem();
    initNotificationSystem();
    
    // Initialize cyber monkey
    initCyberMonkey();
    initMonkeyAutoInteractions();
    initCyberMonkey();
    
    // Start dynamic updates
    animatePlayerCount();
    setInterval(animatePlayerCount, 5000);
    
    // Enter the Verse button action
    const testBtn = document.getElementById('enterVerse');
    if (testBtn) {
        console.log('✅ Enter the Verse button found, adding click listener');
        testBtn.addEventListener('click', (e) => {
            console.log('🎯 Enter the Verse button clicked!');
            e.preventDefault();
            
            // Play immediate system access sound
            hackingAudio.playSystemAccessSound();
            
            // Disable interactions during intro
            document.body.style.pointerEvents = 'none';
            testBtn.style.pointerEvents = 'auto';
            
            // Start cyberpunk intro animation
            console.log('🎮 Starting intro animation...');
            introAnimation.start();
        });
    } else {
        console.error('❌ Enter the Verse button not found!');
    }
    
    // Add window resize handler
    window.addEventListener('resize', () => {
        // Recalculate responsive elements
        const hero = document.querySelector('.hero');
        if (window.innerWidth <= 768) {
            hero.style.flexDirection = 'column';
        } else {
            hero.style.flexDirection = 'row';
        }
    });
    
    // Add scroll smooth behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Initialize intro overlay as hidden
    if (introOverlay) {
        console.log('Initializing intro overlay');
        introOverlay.style.display = 'none';
        introOverlay.style.opacity = '0';
    } else {
        console.error('introOverlay not found during initialization');
    }
    
    console.log('🚀 MonkeyVerse initialized successfully!');
    console.log('🎮 Ready to hack the matrix...');
});