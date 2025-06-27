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
        this.movesWithoutCapture = 0;
        this.kingOnlyMoves = 0;
        this.isKingOnlyPosition = false;
        
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
        this.startTimer();
        this.updateUI();
        
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
        
        // Bind control buttons
        const pauseBtn = document.getElementById('pauseBtn');
        const undoBtn = document.getElementById('undoBtn');
        const hintBtn = document.getElementById('hintBtn');
        const hackerMoveBtn = document.getElementById('hackerMoveBtn');
        
        if (pauseBtn) pauseBtn.addEventListener('click', () => this.pauseGame());
        if (undoBtn) undoBtn.addEventListener('click', () => this.undoMove());
        if (hintBtn) hintBtn.addEventListener('click', () => this.showHint());
        if (hackerMoveBtn) hackerMoveBtn.addEventListener('click', () => this.activateHackerMove());
        
        console.log('Game events bound successfully');
    }
    
    handleSquareClick(square) {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        
        if (this.selectedSquare) {
            // Try to make a move
            const fromRow = parseInt(this.selectedSquare.dataset.row);
            const fromCol = parseInt(this.selectedSquare.dataset.col);
            
            if (this.isValidMove(fromRow, fromCol, row, col)) {
                this.makeMove(fromRow, fromCol, row, col);
                this.clearSelection();
            } else {
                this.clearSelection();
                // Select new piece if it belongs to current player
                const piece = this.board[row][col];
                if (piece && piece.color === this.currentPlayer) {
                    this.selectSquare(square);
                }
            }
        } else {
            // Select a piece
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
            const targetSquare = document.querySelector(
                `[data-row="${moveRow}"][data-col="${moveCol}"]`
            );
            if (targetSquare) {
                targetSquare.classList.add('valid-move');
                if (this.board[moveRow][moveCol]) {
                    targetSquare.classList.add('valid-capture');
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
        
        // Forward move
        if (this.isValidSquare(row + direction, col) && !this.board[row + direction][col]) {
            moves.push([row + direction, col]);
            
            // Double move from starting position
            if (row === startRow && !this.board[row + 2 * direction][col]) {
                moves.push([row + 2 * direction, col]);
            }
        }
        
        // Captures
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
    
    isOnlyKingsLeft() {
        let whitePieces = 0;
        let blackPieces = 0;
        let whiteKing = false;
        let blackKing = false;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    if (piece.color === 'white') {
                        whitePieces++;
                        if (piece.type === 'king') whiteKing = true;
                    } else {
                        blackPieces++;
                        if (piece.type === 'king') blackKing = true;
                    }
                }
            }
        }
        
        return whitePieces === 1 && blackPieces === 1 && whiteKing && blackKing;
    }
    
    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const captured = this.board[toRow][toCol];
        
        // Record the move
        const move = {
            from: [fromRow, fromCol],
            to: [toRow, toCol],
            piece: piece,
            captured: captured,
            timestamp: Date.now()
        };
        
        this.moveHistory.push(move);
        
        // Handle capture
        if (captured) {
            this.capturedPieces[captured.color].push(captured);
            this.movesWithoutCapture = 0; // Reset counter on capture
        } else {
            this.movesWithoutCapture++;
        }
        
        // Check if only kings are left
        if (this.isOnlyKingsLeft()) {
            if (!this.isKingOnlyPosition) {
                this.isKingOnlyPosition = true;
                this.kingOnlyMoves = 0;
                this.showGameStatus('⚠️ Only kings left - 16 moves until draw');
            } else {
                this.kingOnlyMoves++;
                const movesLeft = 16 - this.kingOnlyMoves;
                if (movesLeft > 0) {
                    this.showGameStatus(`⚠️ ${movesLeft} moves until draw`);
                }
            }
        } else {
            this.isKingOnlyPosition = false;
            this.kingOnlyMoves = 0;
        }
        
        // Make the move
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        // Handle pawn promotion
        if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
            this.board[toRow][toCol] = { type: 'queen', color: piece.color };
        }
        
        // Switch turns
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.checkGameState();
        this.renderBoard();
        this.updateUI();
        
        // AI move if playing against computer
        if (this.currentPlayer === 'black' && this.gameState === 'playing') {
            setTimeout(() => this.makeAIMove(), 1000);
        }
    }
    
    checkGameState() {
        const isInCheck = this.isKingInCheck(this.currentPlayer);
        
        if (isInCheck) {
            this.gameState = 'check';
            this.showGameStatus(`${this.currentPlayer.toUpperCase()} is in CHECK!`);
            
            // Check for checkmate
            if (this.isCheckmate()) {
                this.gameState = 'checkmate';
                const winner = this.currentPlayer === 'white' ? 'Black' : 'White';
                this.showGameStatus(`${winner.toUpperCase()} WINS by checkmate!`);
                this.endGame(`${winner} wins by checkmate!`);
                return;
            }
            
            // If AI is in check, make immediate move
            if (this.currentPlayer === 'black') {
                setTimeout(() => {
                    if (this.gameState === 'check' && this.currentPlayer === 'black') {
                        this.makeAIMove();
                    }
                }, 300); // Quick response when in check
            }
        } else {
            this.gameState = 'playing';
            
            // Check for stalemate
            if (this.isStalemate()) {
                this.gameState = 'stalemate';
                this.showGameStatus('DRAW by stalemate!');
                this.endGame('Draw by stalemate!');
                return;
            }
            
            // Check for king-only draw rule (16 moves)
            if (this.isKingOnlyPosition && this.kingOnlyMoves >= 16) {
                this.gameState = 'draw';
                this.showGameStatus('DRAW - Only kings left for 16 moves!');
                this.endGame('Draw - Only kings left for 16 moves!');
                return;
            }
            
            // Check for 50-move rule (no captures or pawn moves)
            if (this.movesWithoutCapture >= 100) { // 50 moves = 100 half-moves
                this.gameState = 'draw';
                this.showGameStatus('DRAW by 50-move rule!');
                this.endGame('Draw by 50-move rule!');
                return;
            }
            
            // Show current player's turn
            this.showGameStatus(`${this.currentPlayer.toUpperCase()}'s turn`);
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
    
    makeAIMove() {
        const allMoves = [];
        const isCurrentPlayerInCheck = this.isKingInCheck(this.currentPlayer);
        
        // Get all possible moves for AI
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
        
        // If in check, prioritize moves that get out of check
        if (isCurrentPlayerInCheck) {
            const escapeMoves = allMoves.filter(move => {
                // Simulate the move to see if it gets out of check
                const originalPiece = this.board[move.from[0]][move.from[1]];
                const capturedPiece = this.board[move.to[0]][move.to[1]];
                
                // Make temporary move
                this.board[move.to[0]][move.to[1]] = originalPiece;
                this.board[move.from[0]][move.from[1]] = null;
                
                const stillInCheck = this.isKingInCheck('black');
                
                // Undo temporary move
                this.board[move.from[0]][move.from[1]] = originalPiece;
                this.board[move.to[0]][move.to[1]] = capturedPiece;
                
                return !stillInCheck;
            });
            
            if (escapeMoves.length > 0) {
                // Choose the best escape move
                escapeMoves.sort((a, b) => b.score - a.score);
                const bestEscape = escapeMoves[0];
                this.makeMove(
                    bestEscape.from[0], bestEscape.from[1],
                    bestEscape.to[0], bestEscape.to[1]
                );
                return;
            }
        }
        
        // Sort moves by score and add some randomness
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
        
        // If in check, heavily prioritize moves that get out of check
        if (isInCheck) {
            // Test if this move gets out of check
            const originalPiece = this.board[fromRow][fromCol];
            const capturedPiece = this.board[toRow][toCol];
            
            // Make temporary move
            this.board[toRow][toCol] = originalPiece;
            this.board[fromRow][fromCol] = null;
            
            const stillInCheck = this.isKingInCheck(piece.color);
            
            // Undo temporary move
            this.board[fromRow][fromCol] = originalPiece;
            this.board[toRow][toCol] = capturedPiece;
            
            if (!stillInCheck) {
                score += 1000; // Massive bonus for getting out of check
            } else {
                score -= 500; // Penalty for moves that don't resolve check
            }
        }
        
        // Capture bonus
        if (target) {
            const pieceValues = {
                pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0
            };
            score += pieceValues[target.type] * 10;
        }
        
        // Center control bonus
        if (toRow >= 3 && toRow <= 4 && toCol >= 3 && toCol <= 4) {
            score += 2;
        }
        
        // King safety - discourage king moves unless necessary
        if (piece.type === 'king' && !isInCheck) {
            score -= 5;
        }
        
        // Check if this move puts opponent in check (bonus)
        const originalPiece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];
        
        // Make temporary move
        this.board[toRow][toCol] = originalPiece;
        this.board[fromRow][fromCol] = null;
        
        const opponentColor = piece.color === 'white' ? 'black' : 'white';
        if (this.isKingInCheck(opponentColor)) {
            score += 50; // Bonus for putting opponent in check
        }
        
        // Undo temporary move
        this.board[fromRow][fromCol] = originalPiece;
        this.board[toRow][toCol] = capturedPiece;
        
        // Random factor (reduced when in check)
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
            
            const timerElement = document.getElementById(timerId);
            const fillElement = document.getElementById(fillId);
            
            if (timerElement) {
                timerElement.textContent = 
                    `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            
            if (fillElement) {
                const fillPercent = (this.gameTimer[color] / 600) * 100;
                fillElement.style.width = `${fillPercent}%`;
            }
        });
    }
    
    updateUI() {
        // Update turn indicator
        const currentTurnElement = document.getElementById('currentTurn');
        if (currentTurnElement) {
            currentTurnElement.textContent = 
                this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1);
        }
        
        // Update timer highlights
        document.querySelectorAll('.timer').forEach(timer => {
            timer.classList.remove('active');
        });
        document.querySelectorAll('.timer-fill').forEach(fill => {
            fill.classList.remove('active');
        });
        
        const activeTimer = this.currentPlayer === 'white' ? 'playerTimer' : 'opponentTimer';
        const activeFill = this.currentPlayer === 'white' ? 'playerTimerFill' : 'opponentTimerFill';
        
        const activeTimerElement = document.getElementById(activeTimer);
        const activeFillElement = document.getElementById(activeFill);
        
        if (activeTimerElement) activeTimerElement.classList.add('active');
        if (activeFillElement) activeFillElement.classList.add('active');
        
        // Update button states
        const undoBtn = document.getElementById('undoBtn');
        if (undoBtn) {
            undoBtn.disabled = this.moveHistory.length === 0 || this.currentPlayer === 'black';
        }
        
        const hackerMoveBtn = document.getElementById('hackerMoveBtn');
        if (hackerMoveBtn && this.moveHistory.length >= 5 && !this.hackerMoveUsed) {
            hackerMoveBtn.disabled = false;
            hackerMoveBtn.classList.add('available');
        }
        
        // Update move history if element exists
        const historyList = document.getElementById('moveHistoryList');
        if (historyList) {
            historyList.innerHTML = '';
            this.moveHistory.forEach((move, index) => {
                const moveElement = document.createElement('div');
                moveElement.className = 'move-entry';
                const fromSquare = String.fromCharCode(97 + move.from[1]) + (8 - move.from[0]);
                const toSquare = String.fromCharCode(97 + move.to[1]) + (8 - move.to[0]);
                moveElement.textContent = `${Math.floor(index/2) + 1}. ${fromSquare}→${toSquare}`;
                if (move.captured) {
                    moveElement.textContent += ' x';
                }
                historyList.appendChild(moveElement);
            });
            historyList.scrollTop = historyList.scrollHeight;
        }
        
        // Show current game status
        if (this.gameState === 'playing') {
            this.showGameStatus(`${this.currentPlayer.toUpperCase()}'s turn`);
        }
    }
    
    showHint() {
        if (this.currentPlayer !== 'white') return; // Only show hints for human player
        
        const allMoves = [];
        
        // Get all possible moves for current player
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
        
        // Get the best move
        const bestMove = allMoves.reduce((best, move) => 
            move.score > best.score ? move : best
        );
        
        // Highlight the best move
        const fromSquare = document.querySelector(
            `[data-row="${bestMove.from[0]}"][data-col="${bestMove.from[1]}"]`
        );
        const toSquare = document.querySelector(
            `[data-row="${bestMove.to[0]}"][data-col="${bestMove.to[1]}"]`
        );
        
        if (fromSquare && toSquare) {
            fromSquare.style.boxShadow = '0 0 20px var(--neon-green)';
            toSquare.style.boxShadow = '0 0 20px var(--neon-blue)';
            
            setTimeout(() => {
                fromSquare.style.boxShadow = '';
                toSquare.style.boxShadow = '';
            }, 3000);
        }
        
        this.showGameStatus('💡 Hint: Check the highlighted squares!');
    }
    
    undoMove() {
        if (this.moveHistory.length === 0) return;
        if (this.currentPlayer === 'black') return; // Don't allow undo during AI turn
        
        // Undo the last move (and AI move if it exists)
        const lastMove = this.moveHistory.pop();
        
        // Restore the piece
        this.board[lastMove.from[0]][lastMove.from[1]] = lastMove.piece;
        this.board[lastMove.to[0]][lastMove.to[1]] = lastMove.captured;
        
        // Restore captured piece
        if (lastMove.captured) {
            const capturedArray = this.capturedPieces[lastMove.captured.color];
            const index = capturedArray.indexOf(lastMove.captured);
            if (index > -1) {
                capturedArray.splice(index, 1);
            }
        }
        
        // Switch turn back
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        
        // If we're now on AI turn, undo the AI move too
        if (this.currentPlayer === 'black' && this.moveHistory.length > 0) {
            const aiMove = this.moveHistory.pop();
            this.board[aiMove.from[0]][aiMove.from[1]] = aiMove.piece;
            this.board[aiMove.to[0]][aiMove.to[1]] = aiMove.captured;
            
            if (aiMove.captured) {
                const capturedArray = this.capturedPieces[aiMove.captured.color];
                const index = capturedArray.indexOf(aiMove.captured);
                if (index > -1) {
                    capturedArray.splice(index, 1);
                }
            }
            
            this.currentPlayer = 'white';
        }
        
        // Recalculate king-only status
        this.isKingOnlyPosition = this.isOnlyKingsLeft();
        if (this.isKingOnlyPosition) {
            this.kingOnlyMoves = Math.max(0, this.kingOnlyMoves - 2); // Subtract 2 moves (player + AI)
        } else {
            this.kingOnlyMoves = 0;
        }
        
        // Recalculate moves without capture
        this.movesWithoutCapture = Math.max(0, this.movesWithoutCapture - 2);
        
        this.renderBoard();
        this.updateUI();
        this.checkGameState();
        this.showGameStatus('Move undone');
    }
    
    pauseGame() {
        if (this.gameState === 'playing' || this.gameState === 'check') {
            this.gameState = 'paused';
            clearInterval(this.timerInterval);
            this.showPauseOverlay();
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.startTimer();
            this.hidePauseOverlay();
            this.showGameStatus(`${this.currentPlayer.toUpperCase()}'s turn`);
        }
    }
    
    showPauseOverlay() {
        // Remove existing overlay if any
        this.hidePauseOverlay();
        
        const overlay = document.createElement('div');
        overlay.id = 'pauseOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.92);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            font-family: 'Orbitron', monospace;
            backdrop-filter: blur(8px);
            animation: pauseOverlayFadeIn 0.4s ease-out;
        `;
        
        const pauseContent = document.createElement('div');
        pauseContent.style.cssText = `
            background: linear-gradient(135deg, 
                rgba(17, 24, 39, 0.95), 
                rgba(31, 41, 55, 0.95));
            border: 1px solid rgba(0, 212, 255, 0.6);
            border-radius: 16px;
            padding: 50px 60px;
            text-align: center;
            box-shadow: 
                0 20px 40px rgba(0, 0, 0, 0.8),
                0 0 60px rgba(0, 212, 255, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            position: relative;
            min-width: 380px;
            transform: scale(0.9);
            animation: pauseContentSlideIn 0.5s ease-out 0.1s forwards;
        `;
        
        // Add subtle corner accents
        const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        corners.forEach(corner => {
            const accent = document.createElement('div');
            accent.style.cssText = `
                position: absolute;
                width: 16px;
                height: 16px;
                border: 1px solid rgba(0, 212, 255, 0.8);
                ${corner.includes('top') ? 'top: 12px;' : 'bottom: 12px;'}
                ${corner.includes('left') ? 'left: 12px;' : 'right: 12px;'}
                ${corner.includes('top') && corner.includes('left') ? 'border-right: none; border-bottom: none;' : ''}
                ${corner.includes('top') && corner.includes('right') ? 'border-left: none; border-bottom: none;' : ''}
                ${corner.includes('bottom') && corner.includes('left') ? 'border-right: none; border-top: none;' : ''}
                ${corner.includes('bottom') && corner.includes('right') ? 'border-left: none; border-top: none;' : ''}
                opacity: 0.7;
            `;
            pauseContent.appendChild(accent);
        });
        
        const pauseIcon = document.createElement('div');
        pauseIcon.style.cssText = `
            width: 60px;
            height: 60px;
            margin: 0 auto 25px;
            border: 3px solid rgba(0, 212, 255, 0.8);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 212, 255, 0.05);
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
        `;
        pauseIcon.innerHTML = `
            <div style="
                width: 6px; 
                height: 24px; 
                background: #00d4ff; 
                margin-right: 4px;
                border-radius: 2px;
                box-shadow: 0 0 8px rgba(0, 212, 255, 0.6);
            "></div>
            <div style="
                width: 6px; 
                height: 24px; 
                background: #00d4ff;
                border-radius: 2px;
                box-shadow: 0 0 8px rgba(0, 212, 255, 0.6);
            "></div>
        `;
        
        const pauseTitle = document.createElement('h2');
        pauseTitle.textContent = 'GAME PAUSED';
        pauseTitle.style.cssText = `
            color: #ffffff;
            font-size: 2.2rem;
            margin-bottom: 12px;
            text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
            font-weight: 700;
            letter-spacing: 2px;
            line-height: 1.2;
        `;
        
        const pauseSubtitle = document.createElement('div');
        pauseSubtitle.style.cssText = `
            color: rgba(160, 174, 192, 0.9);
            font-size: 0.95rem;
            margin-bottom: 35px;
            font-weight: 400;
            letter-spacing: 0.5px;
        `;
        pauseSubtitle.textContent = 'Choose an option to continue';
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 20px;
            margin-top: 10px;
            justify-content: center;
        `;
        
        const resumeBtn = document.createElement('button');
        resumeBtn.innerHTML = '<span style="margin-right: 8px;">▶</span>RESUME';
        resumeBtn.style.cssText = `
            padding: 16px 32px;
            background: rgba(0, 212, 255, 0.08);
            color: #00d4ff;
            border: 1px solid rgba(0, 212, 255, 0.6);
            border-radius: 8px;
            font-family: 'Orbitron', monospace;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.25s ease;
            min-width: 140px;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            overflow: hidden;
        `;
        
        const newGameBtn = document.createElement('button');
        newGameBtn.innerHTML = '<span style="margin-right: 8px;">↻</span>NEW GAME';
        newGameBtn.style.cssText = `
            padding: 16px 32px;
            background: rgba(160, 174, 192, 0.08);
            color: rgba(160, 174, 192, 0.9);
            border: 1px solid rgba(160, 174, 192, 0.4);
            border-radius: 8px;
            font-family: 'Orbitron', monospace;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.25s ease;
            min-width: 140px;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            overflow: hidden;
        `;
        
        // Professional hover effects
        resumeBtn.addEventListener('mouseenter', () => {
            resumeBtn.style.background = 'rgba(0, 212, 255, 0.15)';
            resumeBtn.style.borderColor = 'rgba(0, 212, 255, 0.8)';
            resumeBtn.style.transform = 'translateY(-1px)';
            resumeBtn.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)';
        });
        
        resumeBtn.addEventListener('mouseleave', () => {
            resumeBtn.style.background = 'rgba(0, 212, 255, 0.08)';
            resumeBtn.style.borderColor = 'rgba(0, 212, 255, 0.6)';
            resumeBtn.style.transform = 'translateY(0)';
            resumeBtn.style.boxShadow = 'none';
        });
        
        newGameBtn.addEventListener('mouseenter', () => {
            newGameBtn.style.background = 'rgba(160, 174, 192, 0.15)';
            newGameBtn.style.borderColor = 'rgba(160, 174, 192, 0.6)';
            newGameBtn.style.color = 'rgba(160, 174, 192, 1)';
            newGameBtn.style.transform = 'translateY(-1px)';
            newGameBtn.style.boxShadow = '0 4px 15px rgba(160, 174, 192, 0.2)';
        });
        
        newGameBtn.addEventListener('mouseleave', () => {
            newGameBtn.style.background = 'rgba(160, 174, 192, 0.08)';
            newGameBtn.style.borderColor = 'rgba(160, 174, 192, 0.4)';
            newGameBtn.style.color = 'rgba(160, 174, 192, 0.9)';
            newGameBtn.style.transform = 'translateY(0)';
            newGameBtn.style.boxShadow = 'none';
        });
        
        // Button event listeners
        resumeBtn.addEventListener('click', () => {
            this.pauseGame(); // This will resume the game
        });
        
        newGameBtn.addEventListener('click', () => {
            this.resetGame();
        });
        
        buttonContainer.appendChild(resumeBtn);
        buttonContainer.appendChild(newGameBtn);
        
        pauseContent.appendChild(pauseIcon);
        pauseContent.appendChild(pauseTitle);
        pauseContent.appendChild(pauseSubtitle);
        pauseContent.appendChild(buttonContainer);
        overlay.appendChild(pauseContent);
        
        document.body.appendChild(overlay);
        
        // Add refined animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pauseOverlayFadeIn {
                0% { 
                    opacity: 0;
                }
                100% { 
                    opacity: 1;
                }
            }
            
            @keyframes pauseContentSlideIn {
                0% { 
                    transform: scale(0.9) translateY(20px);
                    opacity: 0;
                }
                100% { 
                    transform: scale(1) translateY(0);
                    opacity: 1;
                }
            }
            
            #pauseOverlay button:active {
                transform: translateY(0px) !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    hidePauseOverlay() {
        const overlay = document.getElementById('pauseOverlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    resetGame() {
        // Clear any intervals
        clearInterval(this.timerInterval);
        
        // Hide pause overlay
        this.hidePauseOverlay();
        
        // Reset all game variables
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.gameState = 'waiting';
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.hackerMoveUsed = false;
        this.movesWithoutCapture = 0;
        this.kingOnlyMoves = 0;
        this.isKingOnlyPosition = false;
        this.gameTimer = { white: 600, black: 600 };
        
        // Reset UI
        const gameStatus = document.getElementById('gameStatus');
        if (gameStatus) gameStatus.remove();
        
        // Show start screen
        this.showStartScreen();
    }
    
    activateHackerMove() {
        if (this.hackerMoveUsed) return;
        
        this.hackerMoveUsed = true;
        const hackerMoveBtn = document.getElementById('hackerMoveBtn');
        if (hackerMoveBtn) {
            hackerMoveBtn.disabled = true;
            hackerMoveBtn.textContent = 'USED';
        }
        
        // Teleport a random player piece
        const playerPieces = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === this.currentPlayer && piece.type !== 'king') {
                    playerPieces.push([row, col]);
                }
            }
        }
        
        if (playerPieces.length === 0) return;
        
        const randomPiece = playerPieces[Math.floor(Math.random() * playerPieces.length)];
        const [fromRow, fromCol] = randomPiece;
        
        // Find valid teleport locations
        const validTeleports = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (!this.board[row][col] && (row !== fromRow || col !== fromCol)) {
                    validTeleports.push([row, col]);
                }
            }
        }
        
        if (validTeleports.length === 0) return;
        
        const randomDestination = validTeleports[Math.floor(Math.random() * validTeleports.length)];
        const [toRow, toCol] = randomDestination;
        
        // Perform the teleport with visual effects
        this.showFloatingIcon('⚡');
        setTimeout(() => {
            const piece = this.board[fromRow][fromCol];
            this.board[toRow][toCol] = piece;
            this.board[fromRow][fromCol] = null;
            this.renderBoard();
            this.showGameStatus('⚡ HACKER MOVE ACTIVATED!');
        }, 300);
    }
    
    showGameStatus(message) {
        // Try to find a status element, create one if it doesn't exist
        let statusElement = document.getElementById('gameStatus');
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.id = 'gameStatus';
            statusElement.style.cssText = `
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: var(--neon-green);
                padding: 10px 20px;
                border-radius: 5px;
                border: 1px solid var(--neon-green);
                z-index: 1000;
                font-family: 'Orbitron', monospace;
                font-weight: bold;
                text-shadow: 0 0 10px var(--neon-green);
            `;
            document.body.appendChild(statusElement);
        }
        
        statusElement.textContent = message;
        statusElement.style.opacity = '1';
        
        // Auto-hide status after 3 seconds unless it's a permanent status
        if (!message.includes('turn') && !message.includes('CHECK') && !message.includes('WINS')) {
            setTimeout(() => {
                statusElement.style.opacity = '0.7';
            }, 3000);
        }
    }
    
    endGame(message) {
        this.gameState = 'ended';
        clearInterval(this.timerInterval);
        alert(message);
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