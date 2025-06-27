// Cyber Chess Game Logic - Complete Version
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
        this.powerUpSystem = null;
        
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
        const startBtn = document.getElementById('startGameBtn');
        const backBtn = document.getElementById('backToMenuBtn');
        
        if (!startBtn || !backBtn) {
            console.error('Start screen buttons not found!');
            return;
        }
        
        startBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.startGame();
        });
        
        backBtn.addEventListener('click', (e) => {
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
        document.getElementById('gameStartModal').style.display = 'flex';
        document.getElementById('gameContainer').style.display = 'none';
        
        document.querySelector('input[name="startGameMode"][value="blitz"]').checked = true;
        document.querySelector('input[name="opponent"][value="strategist"]').checked = true;
        
        this.updateTimerForMode();
        this.updateOpponentDisplay();
    }
    
    updateTimerForMode() {
        const mode = document.querySelector('input[name="startGameMode"]:checked').value;
        const timeSettings = {
            bullet: { white: 60, black: 60 },
            blitz: { white: 600, black: 600 },
            rapid: { white: 1800, black: 1800 }
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
        this.startTimer();
        this.updateUI();
        this.powerUpSystem = new PowerUpSystem(this);
        
        this.playBootSequence();
        this.showFloatingIcon('🎮');
        setTimeout(() => this.showFloatingIcon('⚔️'), 1000);
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
    }
    
    bindGameEvents() {
        const board = document.getElementById('chessBoard');
        
        board.addEventListener('click', (e) => {
            const square = e.target.closest('.chess-square');
            if (square) {
                this.handleSquareClick(square);
            }
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseGame());
        document.getElementById('undoBtn').addEventListener('click', () => this.undoMove());
        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
        document.getElementById('hackerMoveBtn').addEventListener('click', () => this.activateHackerMove());
        
        document.getElementById('playAgainBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('exitGameBtn').addEventListener('click', () => this.exitGame());
        
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'playing') {
                if (e.key === 'Escape') this.pauseGame();
                if (e.key === 'h' || e.key === 'H') this.showHint();
                if (e.key === 'u' || e.key === 'U') this.undoMove();
            }
        });
    }
    
    handleSquareClick(square) {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        
        if (this.selectedSquare) {
            const fromRow = parseInt(this.selectedSquare.dataset.row);
            const fromCol = parseInt(this.selectedSquare.dataset.col);
            
            if (this.isValidMove(fromRow, fromCol, row, col)) {
                this.makeMove(fromRow, fromCol, row, col);
                this.clearSelection();
            } else {
                this.clearSelection();
                const piece = this.board[row][col];
                if (piece && piece.color === this.currentPlayer) {
                    this.selectSquare(square);
                }
            }
        } else {
            const piece = this.board[row][col];
            if (piece && piece.color === this.currentPlayer) {
                this.selectSquare(square);
            }
        }
    }
    
    selectSquare(square) {
        this.clearSelection();
        this.selectedSquare = square;
        square.classList.add('selected');
        this.showValidMoves(square);
    }
    
    clearSelection() {
        document.querySelectorAll('.chess-square').forEach(sq => {
            sq.classList.remove('selected', 'valid-move', 'valid-capture');
        });
        this.selectedSquare = null;
    }
    
    showValidMoves(square) {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const validMoves = this.getValidMoves(row, col);
        
        validMoves.forEach(([moveRow, moveCol]) => {
            const targetSquare = document.querySelector(`[data-row="${moveRow}"][data-col="${moveCol}"]`);
            if (targetSquare) {
                targetSquare.classList.add('valid-move');
                if (this.board[moveRow][moveCol]) {
                    targetSquare.classList.add('has-piece');
                }
            }
        });
    }
    
    isValidMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        if (!piece || piece.color !== this.currentPlayer) return false;
        
        const validMoves = this.getValidMoves(fromRow, fromCol);
        return validMoves.some(([row, col]) => row === toRow && col === toCol);
    }
    
    getValidMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece) return [];
        
        let moves = [];
        
        switch (piece.type) {
            case 'pawn':
                moves = this.getPawnMoves(row, col, piece.color);
                break;
            case 'rook':
                moves = this.getRookMoves(row, col);
                break;
            case 'knight':
                moves = this.getKnightMoves(row, col);
                break;
            case 'bishop':
                moves = this.getBishopMoves(row, col);
                break;
            case 'queen':
                moves = [...this.getRookMoves(row, col), ...this.getBishopMoves(row, col)];
                break;
            case 'king':
                moves = this.getKingMoves(row, col);
                break;
        }
        
        return moves.filter(([toRow, toCol]) => {
            return !this.wouldMovePutKingInCheck(row, col, toRow, toCol);
        });
    }
    
    getPawnMoves(row, col, color) {
        const moves = [];
        const direction = color === 'white' ? -1 : 1;
        const startRow = color === 'white' ? 6 : 1;
        
        if (this.isValidSquare(row + direction, col) && !this.board[row + direction][col]) {
            moves.push([row + direction, col]);
            
            if (row === startRow && !this.board[row + 2 * direction][col]) {
                moves.push([row + 2 * direction, col]);
            }
        }
        
        [-1, 1].forEach(offset => {
            const newRow = row + direction;
            const newCol = col + offset;
            if (this.isValidSquare(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (target && target.color !== color) {
                    moves.push([newRow, newCol]);
                }
            }
        });
        
        return moves;
    }
    
    getRookMoves(row, col) {
        const moves = [];
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        
        directions.forEach(([dRow, dCol]) => {
            for (let i = 1; i < 8; i++) {
                const newRow = row + i * dRow;
                const newCol = col + i * dCol;
                
                if (!this.isValidSquare(newRow, newCol)) break;
                
                const target = this.board[newRow][newCol];
                if (!target) {
                    moves.push([newRow, newCol]);
                } else {
                    if (target.color !== this.board[row][col].color) {
                        moves.push([newRow, newCol]);
                    }
                    break;
                }
            }
        });
        
        return moves;
    }
    
    getKnightMoves(row, col) {
        const moves = [];
        const knightMoves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        
        knightMoves.forEach(([dRow, dCol]) => {
            const newRow = row + dRow;
            const newCol = col + dCol;
            
            if (this.isValidSquare(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (!target || target.color !== this.board[row][col].color) {
                    moves.push([newRow, newCol]);
                }
            }
        });
        
        return moves;
    }
    
    getBishopMoves(row, col) {
        const moves = [];
        const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        
        directions.forEach(([dRow, dCol]) => {
            for (let i = 1; i < 8; i++) {
                const newRow = row + i * dRow;
                const newCol = col + i * dCol;
                
                if (!this.isValidSquare(newRow, newCol)) break;
                
                const target = this.board[newRow][newCol];
                if (!target) {
                    moves.push([newRow, newCol]);
                } else {
                    if (target.color !== this.board[row][col].color) {
                        moves.push([newRow, newCol]);
                    }
                    break;
                }
            }
        });
        
        return moves;
    }
    
    getKingMoves(row, col) {
        const moves = [];
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        
        directions.forEach(([dRow, dCol]) => {
            const newRow = row + dRow;
            const newCol = col + dCol;
            
            if (this.isValidSquare(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (!target || target.color !== this.board[row][col].color) {
                    moves.push([newRow, newCol]);
                }
            }
        });
        
        return moves;
    }
    
    isValidSquare(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
    
    wouldMovePutKingInCheck(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const captured = this.board[toRow][toCol];
        
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        const isInCheck = this.isKingInCheck(piece.color);
        
        this.board[fromRow][fromCol] = piece;
        this.board[toRow][toCol] = captured;
        
        return isInCheck;
    }
    
    isKingInCheck(color) {
        const king = this.findKing(color);
        if (!king) return false;
        
        const [kingRow, kingCol] = king;
        const opponentColor = color === 'white' ? 'black' : 'white';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === opponentColor) {
                    const moves = this.getPieceMoves(row, col, piece);
                    if (moves.some(([r, c]) => r === kingRow && c === kingCol)) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    getPieceMoves(row, col, piece) {
        switch (piece.type) {
            case 'pawn':
                return this.getPawnMoves(row, col, piece.color);
            case 'rook':
                return this.getRookMoves(row, col);
            case 'knight':
                return this.getKnightMoves(row, col);
            case 'bishop':
                return this.getBishopMoves(row, col);
            case 'queen':
                return [...this.getRookMoves(row, col), ...this.getBishopMoves(row, col)];
            case 'king':
                return this.getKingMoves(row, col);
            default:
                return [];
        }
    }
    
    findKing(color) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.type === 'king' && piece.color === color) {
                    return [row, col];
                }
            }
        }
        return null;
    }
    
    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const captured = this.board[toRow][toCol];
        
        const move = {
            from: [fromRow, fromCol],
            to: [toRow, toCol],
            piece: piece,
            captured: captured,
            timestamp: Date.now()
        };
        
        this.moveHistory.push(move);
        
        if (captured) {
            this.capturedPieces[captured.color].push(captured);
        }
        
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
            this.board[toRow][toCol] = { type: 'queen', color: piece.color };
        }
        
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.checkGameState();
        this.renderBoard();
        this.updateMoveHistory();
        this.updateUI();
        
        if (this.moveHistory.length >= 10 && !this.hackerMoveUsed) {
            document.getElementById('hackerMoveBtn').disabled = false;
        }
        
        if (this.currentPlayer === 'black' && this.gameState === 'playing') {
            const isAIInCheck = this.isKingInCheck('black');
            const delay = isAIInCheck ? 300 : 1000;
            setTimeout(() => this.makeAIMove(), delay);
        }
    }
    
    checkGameState() {
        const isInCheck = this.isKingInCheck(this.currentPlayer);
        
        if (isInCheck) {
            this.gameState = 'check';
            this.highlightKingInCheck();
            
            if (this.isCheckmate()) {
                this.gameState = 'checkmate';
                this.endGame(`${this.currentPlayer === 'white' ? 'Black' : 'White'} wins by checkmate!`);
                return;
            }
            
            if (this.currentPlayer === 'black') {
                setTimeout(() => {
                    if (this.gameState === 'check' && this.currentPlayer === 'black') {
                        this.makeAIMove();
                    }
                }, 200);
            }
        } else {
            this.gameState = 'playing';
            this.clearCheckHighlight();
            
            if (this.isStalemate()) {
                this.gameState = 'stalemate';
                this.endGame('Draw by stalemate!');
                return;
            }
        }
    }
    
    isCheckmate() {
        return this.isKingInCheck(this.currentPlayer) && this.hasNoValidMoves();
    }
    
    isStalemate() {
        return !this.isKingInCheck(this.currentPlayer) && this.hasNoValidMoves();
    }
    
    hasNoValidMoves() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === this.currentPlayer) {
                    const validMoves = this.getValidMoves(row, col);
                    if (validMoves.length > 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    highlightKingInCheck() {
        const king = this.findKing(this.currentPlayer);
        if (king) {
            const [row, col] = king;
            const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (square) {
                square.classList.add('in-check');
            }
        }
    }
    
    clearCheckHighlight() {
        document.querySelectorAll('.in-check').forEach(square => {
            square.classList.remove('in-check');
        });
    }
    
    makeAIMove() {
        const allMoves = [];
        const isCurrentPlayerInCheck = this.isKingInCheck(this.currentPlayer);
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === 'black') {
                    const validMoves = this.getValidMoves(row, col);
                    validMoves.forEach(([toRow, toCol]) => {
                        allMoves.push({
                            from: [row, col],
                            to: [toRow, toCol],
                            piece: piece,
                            score: this.evaluateMove(row, col, toRow, toCol, isCurrentPlayerInCheck)
                        });
                    });
                }
            }
        }
        
        if (allMoves.length === 0) return;
        
        if (isCurrentPlayerInCheck) {
            const escapeMoves = allMoves.filter(move => {
                const originalPiece = this.board[move.from[0]][move.from[1]];
                const capturedPiece = this.board[move.to[0]][move.to[1]];
                
                this.board[move.to[0]][move.to[1]] = originalPiece;
                this.board[move.from[0]][move.from[1]] = null;
                
                const stillInCheck = this.isKingInCheck('black');
                
                this.board[move.from[0]][move.from[1]] = originalPiece;
                this.board[move.to[0]][move.to[1]] = capturedPiece;
                
                return !stillInCheck;
            });
            
            if (escapeMoves.length > 0) {
                escapeMoves.sort((a, b) => b.score - a.score);
                const bestEscape = escapeMoves[0];
                this.makeMove(
                    bestEscape.from[0], bestEscape.from[1],
                    bestEscape.to[0], bestEscape.to[1]
                );
                return;
            }
        }
        
        allMoves.sort((a, b) => b.score - a.score);
        const randomFactor = isCurrentPlayerInCheck ? 1 : Math.min(3, allMoves.length);
        const topMoves = allMoves.slice(0, randomFactor);
        const selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];
        
        this.makeMove(
            selectedMove.from[0], selectedMove.from[1],
            selectedMove.to[0], selectedMove.to[1]
        );
    }
    
    evaluateMove(fromRow, fromCol, toRow, toCol, isInCheck = false) {
        let score = 0;
        const piece = this.board[fromRow][fromCol];
        const target = this.board[toRow][toCol];
        
        if (isInCheck) {
            const originalPiece = this.board[fromRow][fromCol];
            const capturedPiece = this.board[toRow][toCol];
            
            this.board[toRow][toCol] = originalPiece;
            this.board[fromRow][fromCol] = null;
            
            const stillInCheck = this.isKingInCheck(piece.color);
            
            this.board[fromRow][fromCol] = originalPiece;
            this.board[toRow][toCol] = capturedPiece;
            
            if (!stillInCheck) {
                score += 1000;
            } else {
                score -= 500;
            }
        }
        
        if (target) {
            const pieceValues = {
                pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0
            };
            score += pieceValues[target.type] * 10;
        }
        
        if (toRow >= 3 && toRow <= 4 && toCol >= 3 && toCol <= 4) {
            score += 2;
        }
        
        if (piece.type === 'king' && !isInCheck) {
            score -= 5;
        }
        
        score += Math.random() * (isInCheck ? 1 : 2);
        return score;
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.gameState === 'playing') {
                this.gameTimer[this.currentPlayer]--;
                
                if (this.gameTimer[this.currentPlayer] <= 0) {
                    this.endGame(`${this.currentPlayer === 'white' ? 'Black' : 'White'} wins on time!`);
                    return;
                }
                
                this.updateTimerDisplay();
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        ['white', 'black'].forEach(color => {
            const timerId = color === 'white' ? 'playerTimer' : 'opponentTimer';
            const fillId = color === 'white' ? 'playerTimerFill' : 'opponentTimerFill';
            
            const minutes = Math.floor(this.gameTimer[color] / 60);
            const seconds = this.gameTimer[color] % 60;
            
            document.getElementById(timerId).textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            const fillPercent = (this.gameTimer[color] / 600) * 100;
            document.getElementById(fillId).style.width = `${fillPercent}%`;
        });
    }
    
    updateMoveHistory() {
        const historyList = document.getElementById('moveHistoryList');
        historyList.innerHTML = '';
        
        this.moveHistory.forEach((move, index) => {
            const moveElement = document.createElement('div');
            moveElement.className = 'move-entry';
            
            const fromSquare = String.fromCharCode(97 + move.from[1]) + (8 - move.from[0]);
            const toSquare = String.fromCharCode(97 + move.to[1]) + (8 - move.to[0]);
            
            moveElement.textContent = `${index + 1}. ${fromSquare}→${toSquare}`;
            if (move.captured) {
                moveElement.textContent += ' x';
            }
            
            historyList.appendChild(moveElement);
        });
        
        historyList.scrollTop = historyList.scrollHeight;
    }
    
    updateUI() {
        document.getElementById('currentTurn').textContent = 
            this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1);
        
        document.querySelectorAll('.timer').forEach(timer => {
            timer.classList.remove('active');
        });
        document.querySelectorAll('.timer-fill').forEach(fill => {
            fill.classList.remove('active');
        });
        
        const activeTimer = this.currentPlayer === 'white' ? 'playerTimer' : 'opponentTimer';
        const activeFill = this.currentPlayer === 'white' ? 'playerTimerFill' : 'opponentTimerFill';
        
        document.getElementById(activeTimer).classList.add('active');
        document.getElementById(activeFill).classList.add('active');
        
        document.getElementById('undoBtn').disabled = this.moveHistory.length === 0;
    }
    
    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            clearInterval(this.timerInterval);
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.startTimer();
        }
    }
    
    undoMove() {
        if (this.moveHistory.length === 0) return;
        
        const lastMove = this.moveHistory.pop();
        
        this.board[lastMove.from[0]][lastMove.from[1]] = lastMove.piece;
        this.board[lastMove.to[0]][lastMove.to[1]] = lastMove.captured;
        
        if (lastMove.captured) {
            const capturedArray = this.capturedPieces[lastMove.captured.color];
            const index = capturedArray.indexOf(lastMove.captured);
            if (index > -1) {
                capturedArray.splice(index, 1);
            }
        }
        
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        
        this.renderBoard();
        this.updateMoveHistory();
        this.updateUI();
        this.checkGameState();
    }
    
    showHint() {
        const allMoves = [];
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === this.currentPlayer) {
                    const validMoves = this.getValidMoves(row, col);
                    validMoves.forEach(([toRow, toCol]) => {
                        allMoves.push({
                            from: [row, col],
                            to: [toRow, toCol],
                            score: this.evaluateMove(row, col, toRow, toCol)
                        });
                    });
                }
            }
        }
        
        if (allMoves.length === 0) return;
        
        const bestMove = allMoves.reduce((best, move) => 
            move.score > best.score ? move : best
        );
        
        const fromSquare = document.querySelector(`[data-row="${bestMove.from[0]}"][data-col="${bestMove.from[1]}"]`);
        const toSquare = document.querySelector(`[data-row="${bestMove.to[0]}"][data-col="${bestMove.to[1]}"]`);
        
        if (fromSquare && toSquare) {
            fromSquare.style.boxShadow = '0 0 20px var(--neon-green)';
            toSquare.style.boxShadow = '0 0 20px var(--neon-green)';
            
            setTimeout(() => {
                fromSquare.style.boxShadow = '';
                toSquare.style.boxShadow = '';
            }, 2000);
        }
    }
    
    activateHackerMove() {
        if (this.hackerMoveUsed) return;
        
        this.hackerMoveUsed = true;
        document.getElementById('hackerMoveBtn').disabled = true;
        
        // Basic implementation - can be enhanced
        this.showFloatingIcon('⚡');
    }
    
    endGame(message) {
        this.gameState = 'ended';
        clearInterval(this.timerInterval);
        
        const modal = document.getElementById('gameOverModal');
        const resultTitle = document.getElementById('gameResult');
        const resultIcon = document.getElementById('resultIcon');
        
        resultTitle.textContent = message;
        resultIcon.textContent = message.includes('wins') ? '👑' : '🤝';
        
        modal.classList.add('show');
    }
    
    resetGame() {
        clearInterval(this.timerInterval);
        
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.gameState = 'waiting';
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.hackerMoveUsed = false;
        
        document.getElementById('gameOverModal').classList.remove('show');
        this.showStartScreen();
    }
    
    exitGame() {
        window.location.href = 'index.html';
    }
    
    playBootSequence() {
        this.showFloatingIcon('🤖');
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
    const game = new CyberChess();
    window.cyberChess = game;
});

// Power-up system
class PowerUpSystem {
    constructor(game) {
        this.game = game;
        this.powerUps = {
            glitchScan: { cooldown: 0, maxCooldown: 5 },
            digitalFog: { cooldown: 0, maxCooldown: 10 },
            timeHack: { cooldown: 0, maxCooldown: 15 }
        };
    }
}
