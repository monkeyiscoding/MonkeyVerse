// Cyber Chess Game Logic
class CyberChess {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.gameState = 'waiting'; // waiting, playing, check, checkmate, stalemate, paused
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.gameTimer = { white: 600, black: 600 }; // Default 10 minutes
        this.timerInterval = null;
        this.hackerMoveUsed = false;
        this.glitchModeActive = false;
        this.aiDifficulty = 'strategist';
        this.gameMode = 'blitz';
        this.powerUpSystem = null;
        
        // Cyberpunk piece symbols
        this.pieceSymbols = {
            white: {
                king: '♔', queen: '♕', rook: '♖', 
                bishop: '♗', knight: '♘', pawn: '♙'
            },
            black: {
                king: '♚', queen: '♛', rook: '♜', 
                bishop: '♝', knight: '♞', pawn: '♟'
            }
        };
        
        this.init();
    }
    
    init() {
        this.bindStartScreenEvents();
        this.showStartScreen();
        this.initializeEffects();
    }
    
    bindStartScreenEvents() {
        // Wait for DOM to be ready
        const startBtn = document.getElementById('startGameBtn');
        const backBtn = document.getElementById('backToMenuBtn');
        
        if (!startBtn || !backBtn) {
            console.error('Start screen buttons not found!');
            return;
        }
        
        // Start game button
        startBtn.addEventListener('click', (e) => {
            console.log('Start game button clicked');
            e.preventDefault();
            this.startGame();
        });
        
        // Back to menu button
        backBtn.addEventListener('click', (e) => {
            console.log('Back button clicked');
            e.preventDefault();
            this.exitGame();
        });
        
        // Mode selection changes
        document.querySelectorAll('input[name="startGameMode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.gameMode = e.target.value;
                this.updateTimerForMode();
            });
        });
        
        // Opponent selection changes
        document.querySelectorAll('input[name="opponent"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.aiDifficulty = e.target.value;
                this.updateOpponentDisplay();
            });
        });
    }
    
    showStartScreen() {
        document.getElementById('gameStartModal').style.display = 'flex';
        document.getElementById('gameContainer').style.display = 'none';
        
        // Auto-select default options
        document.querySelector('input[name="startGameMode"][value="blitz"]').checked = true;
        document.querySelector('input[name="opponent"][value="strategist"]').checked = true;
        
        this.updateTimerForMode();
        this.updateOpponentDisplay();
    }
    
    updateTimerForMode() {
        const mode = document.querySelector('input[name="startGameMode"]:checked').value;
        const timeSettings = {
            bullet: { white: 60, black: 60 }, // 1 minute
            blitz: { white: 600, black: 600 }, // 10 minutes
            rapid: { white: 1800, black: 1800 } // 30 minutes
        };
        
        this.gameTimer = timeSettings[mode];
        document.getElementById('gameMode').textContent = {
            bullet: 'Bullet 1+0',
            blitz: 'Blitz 10+0', 
            rapid: 'Rapid 30+0'
        }[mode];
    }
    
    updateOpponentDisplay() {
        const opponent = document.querySelector('input[name="opponent"]:checked').value;
        const opponentData = {
            novice: { name: 'The Novice', rating: '1200', avatar: '🤖' },
            hacker: { name: 'The Hacker', rating: '1500', avatar: '👨‍💻' },
            strategist: { name: 'The Strategist', rating: '1850', avatar: '🧠' },
            matrix: { name: 'The Matrix', rating: '2200', avatar: '🤖' }
        };
        
        const data = opponentData[opponent];
        document.getElementById('opponentName').textContent = data.name;
        document.getElementById('opponentRating').textContent = data.rating;
        document.querySelector('.opponent .avatar-image').textContent = data.avatar;
    }
    
    startGame() {
        console.log('Starting game...');
        
        // Hide start screen and show game
        const startModal = document.getElementById('gameStartModal');
        const gameContainer = document.getElementById('gameContainer');
        
        if (!startModal || !gameContainer) {
            console.error('Required elements not found');
            return;
        }
        
        startModal.style.display = 'none';
        gameContainer.style.display = 'grid';
        
        // Get selected options
        const gameModeInput = document.querySelector('input[name="startGameMode"]:checked');
        const opponentInput = document.querySelector('input[name="opponent"]:checked');
        
        if (!gameModeInput || !opponentInput) {
            console.error('Game mode or opponent not selected');
            return;
        }
        
        this.gameMode = gameModeInput.value;
        this.aiDifficulty = opponentInput.value;
        
        // Initialize game
        this.gameState = 'playing';
        this.renderBoard();
        this.bindGameEvents();
        this.startTimer();
        this.updateUI();
        this.powerUpSystem = new PowerUpSystem(this);
        
        // Play boot sequence
        this.playBootSequence();
        
        // Start game message
        this.showFloatingIcon('🎮');
        setTimeout(() => {
            this.showFloatingIcon('⚔️');
        }, 1000);
        
        console.log('Game started successfully!');
    }
    
    exitGame() {
        window.location.href = 'index.html';
    }
    
    // ... [Continue with rest of the methods]
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new CyberChess();
    
    // Make game instance globally accessible for debugging
    window.cyberChess = game;
});

// Basic PowerUpSystem class
class PowerUpSystem {
    constructor(game) {
        this.game = game;
    }
}
