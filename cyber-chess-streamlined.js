// Cyber Chess Game Logic - Streamlined for Game Start
class CyberChess {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.gameState = 'waiting';
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.gameTimer = { white: 600, black: 600 };
        this.timerInterval = null;
        this.hackerMoveUsed = false;
        this.glitchModeActive = false;
        this.aiDifficulty = 'strategist';
        this.gameMode = 'blitz';
        
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
        console.log('Initializing Cyber Chess...');
        this.bindStartScreenEvents();
        this.showStartScreen();
        this.initializeEffects();
    }
    
    bindStartScreenEvents() {
        console.log('Binding start screen events...');
        const startBtn = document.getElementById('startGameBtn');
        const backBtn = document.getElementById('backToMenuBtn');
        
        if (!startBtn || !backBtn) {
            console.error('Start screen buttons not found!');
            return;
        }
        
        startBtn.addEventListener('click', (e) => {
            console.log('Start game button clicked');
            e.preventDefault();
            this.startGame();
        });
        
        backBtn.addEventListener('click', (e) => {
            console.log('Back button clicked');
            e.preventDefault();
            this.exitGame();
        });
        
        document.querySelectorAll('input[name="startGameMode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.gameMode = e.target.value;
                this.updateTimerForMode();
            });
        });
        
        document.querySelectorAll('input[name="opponent"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.aiDifficulty = e.target.value;
                this.updateOpponentDisplay();
            });
        });
    }
    
    showStartScreen() {
        console.log('Showing start screen...');
        document.getElementById('gameStartModal').style.display = 'flex';
        document.getElementById('gameContainer').style.display = 'none';
        
        document.querySelector('input[name="startGameMode"][value="blitz"]').checked = true;
        document.querySelector('input[name="opponent"][value="strategist"]').checked = true;
        
        this.updateTimerForMode();
        this.updateOpponentDisplay();
    }
    
    updateTimerForMode() {
        const modeInput = document.querySelector('input[name="startGameMode"]:checked');
        if (!modeInput) return;
        
        const mode = modeInput.value;
        const timeSettings = {
            bullet: { white: 60, black: 60 },
            blitz: { white: 600, black: 600 },
            rapid: { white: 1800, black: 1800 }
        };
        
        this.gameTimer = timeSettings[mode];
        const gameModeElement = document.getElementById('gameMode');
        if (gameModeElement) {
            gameModeElement.textContent = {
                bullet: 'Bullet 1+0',
                blitz: 'Blitz 10+0', 
                rapid: 'Rapid 30+0'
            }[mode];
        }
    }
    
    updateOpponentDisplay() {
        const opponentInput = document.querySelector('input[name="opponent"]:checked');
        if (!opponentInput) return;
        
        const opponent = opponentInput.value;
        const opponentData = {
            novice: { name: 'The Novice', rating: '1200', avatar: '🤖' },
            hacker: { name: 'The Hacker', rating: '1500', avatar: '👨‍💻' },
            strategist: { name: 'The Strategist', rating: '1850', avatar: '🧠' },
            matrix: { name: 'The Matrix', rating: '2200', avatar: '🤖' }
        };
        
        const data = opponentData[opponent];
        const nameElement = document.getElementById('opponentName');
        const ratingElement = document.getElementById('opponentRating');
        const avatarElement = document.querySelector('.opponent .avatar-image');
        
        if (nameElement) nameElement.textContent = data.name;
        if (ratingElement) ratingElement.textContent = data.rating;
        if (avatarElement) avatarElement.textContent = data.avatar;
    }
    
    startGame() {
        console.log('Starting game...');
        
        const startModal = document.getElementById('gameStartModal');
        const gameContainer = document.getElementById('gameContainer');
        
        if (!startModal || !gameContainer) {
            console.error('Required elements not found');
            return;
        }
        
        startModal.style.display = 'none';
        gameContainer.style.display = 'grid';
        
        const gameModeInput = document.querySelector('input[name="startGameMode"]:checked');
        const opponentInput = document.querySelector('input[name="opponent"]:checked');
        
        if (!gameModeInput || !opponentInput) {
            console.error('Game mode or opponent not selected');
            return;
        }
        
        this.gameMode = gameModeInput.value;
        this.aiDifficulty = opponentInput.value;
        
        this.gameState = 'playing';
        this.renderBoard();
        this.bindGameEvents();
        
        // Show success message
        this.showFloatingIcon('🎮');
        setTimeout(() => this.showFloatingIcon('⚔️'), 1000);
        
        console.log('Game started successfully!');
    }
    
    initializeBoard() {
        const board = Array(8).fill().map(() => Array(8).fill(null));
        const pieceOrder = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
        
        for (let i = 0; i < 8; i++) {
            board[0][i] = { type: pieceOrder[i], color: 'black' };
            board[1][i] = { type: 'pawn', color: 'black' };
            board[6][i] = { type: 'pawn', color: 'white' };
            board[7][i] = { type: pieceOrder[i], color: 'white' };
        }
        
        return board;
    }
    
    renderBoard() {
        const boardElement = document.getElementById('chessBoard');
        if (!boardElement) {
            console.error('Chess board element not found');
            return;
        }
        
        boardElement.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `chess-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                const piece = this.board[row][col];
                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = `chess-piece ${piece.color}`;
                    pieceElement.textContent = this.pieceSymbols[piece.color][piece.type];
                    pieceElement.draggable = piece.color === this.currentPlayer;
                    square.appendChild(pieceElement);
                }
                
                boardElement.appendChild(square);
            }
        }
        
        console.log('Board rendered successfully');
    }
    
    bindGameEvents() {
        const board = document.getElementById('chessBoard');
        if (!board) return;
        
        board.addEventListener('click', (e) => {
            const square = e.target.closest('.chess-square');
            if (square) {
                this.handleSquareClick(square);
            }
        });
        
        console.log('Game events bound successfully');
    }
    
    handleSquareClick(square) {
        console.log('Square clicked:', square.dataset.row, square.dataset.col);
        // Basic click handling - can be expanded later
    }
    
    exitGame() {
        window.location.href = 'index.html';
    }
    
    showFloatingIcon(icon) {
        const floatingIcon = document.createElement('div');
        floatingIcon.className = 'floating-icon';
        floatingIcon.textContent = icon;
        floatingIcon.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            font-size: 2rem;
            z-index: 1000;
            animation: floatUp 2s ease-out forwards;
            pointer-events: none;
            color: var(--neon-green);
            text-shadow: 0 0 10px var(--neon-green);
        `;
        
        document.body.appendChild(floatingIcon);
        
        setTimeout(() => {
            floatingIcon.remove();
        }, 2000);
    }
    
    initializeEffects() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUp {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(-50px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    const game = new CyberChess();
    window.cyberChess = game;
});

// Basic PowerUpSystem class
class PowerUpSystem {
    constructor(game) {
        this.game = game;
    }
}
