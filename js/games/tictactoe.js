// Game styles
const TICTACTOE_STYLES = `
    .game-container {
        max-width: 600px;
        margin: 0 auto;
    }

    /* Button Processing State */
    .modal-btn.processing {
        opacity: 0.7;
        background-color: #555 !important;
        cursor: not-allowed;
        position: relative;
        padding-left: 2.5rem !important;
    }
    
    .modal-btn.processing::before {
        content: '';
        position: absolute;
        left: 10px;
        top: 50%;
        width: 18px;
        height: 18px;
        margin-top: -9px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    .modal-btn.success {
        background-color: #14f195 !important;
        color: #000 !important;
        border-color: #14f195 !important;
        cursor: not-allowed;
    }

    .modal-btn.error {
        background-color: #ff4444 !important;
        cursor: not-allowed;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    /* Game End Modal Styles */
    .game-end-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    }

    .modal-content {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 0 30px rgba(153, 69, 255, 0.3);
        border: 2px solid var(--accent);
    }

    .modal-header {
        margin-bottom: 1.5rem;
    }

    .modal-title {
        font-size: 2rem;
        font-weight: bold;
        color: var(--accent);
        margin-bottom: 0.5rem;
    }

    .modal-subtitle {
        font-size: 1.2rem;
        color: var(--text-secondary);
    }

    .result-info {
        display: flex;
        justify-content: space-between;
        margin: 1.5rem 0;
        padding: 1rem;
        background: rgba(153, 69, 255, 0.1);
        border-radius: 8px;
    }

    .result-item {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .result-label {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
    }

    .result-value {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--text);
    }

    .wager-result {
        font-size: 1.2rem;
        margin: 1rem 0;
        padding: 1rem;
        border-radius: 8px;
        background: rgba(20, 241, 149, 0.1);
        color: var(--text);
    }

    .rematch-voting {
        margin: 1.5rem 0;
        padding: 1rem;
        background: rgba(153, 69, 255, 0.05);
        border-radius: 8px;
    }

    .voting-status {
        display: flex;
        justify-content: space-around;
        margin: 1rem 0;
    }

    .player-vote {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .vote-indicator {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--bg-secondary);
        border: 2px solid var(--text-secondary);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .vote-indicator.voted-yes::before {
        content: '✓';
        color: #14f195;
    }

    .vote-indicator.voted-no::before {
        content: '✗';
        color: #ff4444;
    }

    .vote-indicator.waiting {
        animation: pulse 2s infinite;
    }

    .modal-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 1.5rem;
    }

    .modal-btn {
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
        min-width: 120px;
    }

    .btn-primary {
        background: var(--accent);
        color: white;
    }

    .btn-primary:hover {
        background: var(--accent-dark);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(153, 69, 255, 0.3);
    }

    .btn-secondary {
        background: var(--bg-secondary);
        color: var(--text);
        border: 2px solid var(--accent);
    }

    .btn-secondary:hover {
        background: rgba(153, 69, 255, 0.1);
        transform: translateY(-2px);
    }

    .btn-success {
        background: #14f195;
        color: var(--bg);
    }

    .btn-success:hover {
        background: #10cc7d;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(20, 241, 149, 0.3);
    }

    .btn-danger {
        background: #ff4444;
        color: white;
    }

    .btn-danger:hover {
        background: #e03c3c;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 68, 68, 0.3);
    }

    .btn-disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
    }

    .payment-info {
        margin: 1rem 0;
        padding: 1rem;
        background: rgba(20, 241, 149, 0.1);
        border-radius: 8px;
        text-align: left;
    }

    .payment-status {
        margin-top: 0.5rem;
        font-weight: bold;
    }

    .payment-success {
        color: #14f195;
    }

    .payment-pending {
        color: #ffd700;
    }

    .payment-error {
        color: #ff4444;
    }

    .game-header {
        margin-bottom: 2rem;
        text-align: center;
    }

    .player-info {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        margin-bottom: 1rem;
    }

    .player {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        border-radius: 8px;
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }

    .player.active {
        border-color: var(--accent);
        background: rgba(153, 69, 255, 0.1);
        box-shadow: 0 0 15px rgba(153, 69, 255, 0.2);
    }

    .player-name {
        font-size: 0.9rem;
        color: var(--text-secondary);
    }

    .player-symbol {
        font-size: 2rem;
        font-weight: bold;
        margin: 0.5rem 0;
    }

    .player-score {
        font-size: 1.5rem;
        color: var(--accent);
    }

    .vs-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .vs {
        color: var(--accent);
        font-weight: bold;
        font-size: 1.2rem;
    }

    .turn-timer {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--text);
        padding: 0.5rem 1rem;
        border-radius: 4px;
        background: rgba(153, 69, 255, 0.1);
        min-width: 3rem;
        text-align: center;
    }

    .turn-timer.warning {
        color: #ffd700;
        animation: pulse 1s infinite;
    }

    .turn-timer.critical {
        color: #ff4444;
        animation: pulse 0.5s infinite;
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }

    .wager-info {
        color: var(--secondary);
        font-size: 1.2rem;
    }

    .game-status {
        text-align: center;
        margin-bottom: 2rem;
        font-size: 1.5rem;
        min-height: 2rem;
        color: var(--text);
    }

    .game-status.game-over {
        color: var(--accent);
        font-weight: bold;
        animation: fadeIn 0.5s ease;
    }

    .game-board {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        max-width: 400px;
        margin: 0 auto 2rem;
    }

    .cell {
        aspect-ratio: 1;
        background: rgba(153, 69, 255, 0.1);
        border: 2px solid var(--primary);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .cell:hover {
        background: rgba(153, 69, 255, 0.2);
        box-shadow: 0 0 15px var(--primary);
    }
    
    .cell.active-cell {
        cursor: pointer;
        position: relative;
    }
    
    .cell.active-cell:hover::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(153, 69, 255, 0.3);
        border-radius: 6px;
        animation: pulse 1.5s infinite;
    }

    .cell.x {
        color: var(--primary);
    }

    .cell.o {
        color: var(--secondary);
    }

    .cell.win {
        background: rgba(20, 241, 149, 0.2);
        border-color: var(--accent);
        animation: winPulse 1s infinite;
    }

    @keyframes winPulse {
        0% { box-shadow: 0 0 5px var(--accent); }
        50% { box-shadow: 0 0 20px var(--accent); }
        100% { box-shadow: 0 0 5px var(--accent); }
    }

    .game-controls {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

class TicTacToe {
    constructor(containerId, creator, challenger, wagerAmount, turnTimer = 30, totalRounds = 1) {
        this.container = document.getElementById(containerId);
        this.creator = creator;
        this.challenger = challenger;
        this.wagerAmount = wagerAmount;
        this.turnTime = turnTimer;
        this.totalRounds = totalRounds;
        this.currentRound = 1;
        
        this.board = Array(9).fill(null);
        this.playerTurn = creator; // Creator (X) goes first
        this.gameStarted = !!challenger; // Game starts when challenger joins
        this.scores = { [creator]: 0 };
        
        // Initialize challenger score if present
        if (challenger) {
            this.scores[challenger] = 0;
        }
        
        this.remainingTime = this.turnTime;
        this.timer = null;
        this.moves = [];
        
        // Get current wallet
        this.currentPlayer = null;
        if (typeof WalletState !== 'undefined' && WalletState.isConnected) {
            this.currentPlayer = WalletState.publicKey;
        }
        
        this.isMyTurn = false; // Will be set in init
        
        // Game end and rematch properties
        this.gameOver = false;
        this.winner = null;
        this.isDraw = false;
        this.rematchVotes = {
            [creator]: null, // null = not voted, true = yes, false = no
        };
        if (challenger) {
            this.rematchVotes[challenger] = null;
        }
        
        // Payment status
        this.paymentStatus = 'pending'; // pending, processing, complete, refunded
        this.winningsClaimable = false;
        this.centralWallet = '9DCjMQQGinUdG6S959ptFvMqw6qQGgvYXc9TqPApP4oG'; // Replace with your actual central wallet address
        
        // Add styles if not already added
        if (!document.getElementById('tictactoe-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'tictactoe-styles';
            styleEl.textContent = TICTACTOE_STYLES;
            document.head.appendChild(styleEl);
        }
        
        this.init();
    }

    init() {
        console.log('Initializing game with:', {
            creator: this.creator,
            challenger: this.challenger,
            currentPlayer: this.currentPlayer
        });
        
        // Properly determine if it's player's turn
        this.isMyTurn = this.gameStarted && this.playerTurn === this.currentPlayer;
        
        // Log turn state to debug
        console.log('Turn state:', {
            gameStarted: this.gameStarted,
            playerTurn: this.playerTurn,
            currentPlayer: this.currentPlayer,
            isMyTurn: this.isMyTurn,
            creator: this.creator
        });
        
        this.createGameHTML();
        this.setupEventListeners();
        
        if (!this.gameStarted) {
            this.updateStatus('Waiting for challenger to join...');
        } else {
            this.updateTurnStatus();
            if (this.isMyTurn) {
                this.startTimer();
            }
        }
    }

    // Set challenger (called when a challenger joins)
    setChallenger(challenger) {
        console.log('Challenger joined:', challenger);
        this.challenger = challenger;
        this.gameStarted = true;
        this.scores[challenger] = 0;
        
        // Recreate game UI with challenger
        this.createGameHTML();
        
        // Update turn status
        this.updateTurnStatus();
        
        // Start timer if it's current player's turn
        if (this.isMyTurn) {
            this.startTimer();
        }
    }
    
    // Update turn status message
    updateTurnStatus() {
        const oldIsMyTurn = this.isMyTurn;
        this.isMyTurn = this.gameStarted && this.playerTurn === this.currentPlayer;
        
        // Log when turns change
        if (oldIsMyTurn !== this.isMyTurn) {
            console.log(`Turn changed: ${oldIsMyTurn ? 'Your turn -> Opponent turn' : 'Opponent turn -> Your turn'}`);
        }
        
        if (!this.currentPlayer) {
            this.updateStatus('Connect wallet to play');
            return;
        }
        
        if (this.playerTurn === this.currentPlayer) {
            this.updateStatus('Your turn!');
        } else if (this.playerTurn === this.creator) {
            this.updateStatus(`${this.creator.slice(0, 4)}...${this.creator.slice(-4)}'s turn`);
        } else if (this.playerTurn === this.challenger) {
            this.updateStatus(`${this.challenger.slice(0, 4)}...${this.challenger.slice(-4)}'s turn`);
        }
    }

    createGameHTML() {
        const challengerDisplay = this.challenger ? 
            `${this.challenger.slice(0, 4)}...${this.challenger.slice(-4)}` : 
            'Waiting for player...';

        // Determine if we should show cancel button (only for creator before challenger joins)
        const showCancelButton = !this.challenger && this.currentPlayer === this.creator && !this.gameOver;

        this.container.innerHTML = `
            <div class="game-container">
                <div class="game-header">
                    <div class="player-info">
                        <div class="player player1 ${this.playerTurn === this.creator ? 'active' : ''}">
                            <span class="player-name">${this.creator.slice(0, 4)}...${this.creator.slice(-4)}</span>
                            <span class="player-symbol">X</span>
                            <span class="player-score">${this.scores[this.creator]}</span>
                        </div>
                        <div class="vs-container">
                            <span class="vs">VS</span>
                            <div class="turn-timer">${this.turnTime}</div>
                            <div class="round-info">Round ${this.currentRound}/${this.totalRounds}</div>
                        </div>
                        <div class="player player2 ${this.playerTurn === this.challenger ? 'active' : ''}">
                            <span class="player-name">${challengerDisplay}</span>
                            <span class="player-symbol">O</span>
                            <span class="player-score">${this.scores[this.challenger] || 0}</span>
                        </div>
                    </div>
                    <div class="wager-info">
                        <div>Wager: ${this.wagerAmount} SOL</div>
                        <div class="timer-info">Turn Timer: ${this.turnTime}s</div>
                    </div>
                </div>
                <div class="game-status" id="game-status"></div>
                <div class="game-board">
                    ${this.board.map((cell, index) => `
                        <div class="cell ${cell === 'X' ? 'x' : cell === 'O' ? 'o' : ''}" data-index="${index}">
                            ${cell || ''}
                        </div>
                    `).join('')}
                </div>
                ${showCancelButton ? `
                <div class="game-controls">
                    <button id="cancel-game" class="modal-btn btn-danger">Cancel Game & Refund Wager</button>
                </div>
                ` : ''}
            </div>
        `;
        
        // Add cancel button event listener if showing
        if (showCancelButton) {
            const cancelBtn = this.container.querySelector('#cancel-game');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', async () => {
                    // Disable the button to prevent multiple clicks
                    cancelBtn.disabled = true;
                    cancelBtn.textContent = 'Processing Cancellation...';
                    cancelBtn.classList.add('processing');
                    
                    try {
                        // Wait for the refund to complete
                        await this.cancelGameAndRefund();
                        
                        // Update button text to show success
                        cancelBtn.textContent = 'Game Cancelled Successfully';
                        cancelBtn.classList.remove('processing');
                        cancelBtn.classList.add('success');
                        
                        // Redirect to home after a delay to show the success message
                        setTimeout(() => this.redirectToHome(), 5000);
                    } catch (error) {
                        console.error('Error during game cancellation:', error);
                        
                        // Update button to show error
                        cancelBtn.textContent = 'Cancellation Failed';
                        cancelBtn.classList.remove('processing');
                        cancelBtn.classList.add('error');
                        
                        // Still redirect even if there was an error
                        setTimeout(() => this.redirectToHome(), 4000);
                    }
                });
            }
        }
    }

    setupEventListeners() {
        if (!this.container) {
            console.error('Cannot set up event listeners: container not found');
            return;
        }
        
        console.log('Setting up cell event listeners...', {
            isMyTurn: this.isMyTurn,
            currentPlayer: this.currentPlayer,
            playerTurn: this.playerTurn,
            gameStarted: this.gameStarted
        });
        
        // Add event listeners for cells
        const cells = this.container.querySelectorAll('.cell');
        console.log(`Found ${cells.length} cells to attach click events`);
        
        cells.forEach((cell, index) => {
            // Remove any existing click listeners first to avoid duplicates
            const newCell = cell.cloneNode(true);
            cell.parentNode.replaceChild(newCell, cell);
            
            // Check if this cell should be clickable (empty and if it's player's turn)
            const isEmptyCell = this.board[index] === null;
            const isPlayerTurn = this.playerTurn === this.currentPlayer;
            const isClickable = isEmptyCell && isPlayerTurn && this.gameStarted;
            
            console.log(`Cell ${index}: empty=${isEmptyCell}, playerTurn=${isPlayerTurn}, clickable=${isClickable}`);
            
            // Add the click listener to the new cell
            newCell.addEventListener('click', () => {
                console.log(`Cell ${index} clicked`, {
                    isMyTurn: this.isMyTurn,
                    currentPlayer: this.currentPlayer,
                    playerTurn: this.playerTurn
                });
                this.handleCellClick(index);
            });
            
            // Add hover effect only if it's player's turn and cell is empty
            if (isClickable) {
                newCell.classList.add('active-cell');
            }
        });
    }

    startTimer() {
        // Clear any existing timer
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.remainingTime = this.turnTime;
        this.updateTimerDisplay();
        
        // Start a new timer
        this.timer = setInterval(() => {
            this.remainingTime--;
            this.updateTimerDisplay();
            
            if (this.remainingTime <= 0) {
                this.handleTimeout();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const timerEl = this.container.querySelector('.turn-timer');
        if (!timerEl) return;
        
        timerEl.textContent = this.remainingTime;
        
        // Add warning classes based on time left
        timerEl.classList.toggle('warning', this.remainingTime <= 10);
        timerEl.classList.toggle('critical', this.remainingTime <= 5);
    }

    handleTimeout() {
        clearInterval(this.timer);
        this.timer = null;
        
        if (!this.gameStarted) return;
        
        // If it was current player's turn, they forfeit
        if (this.playerTurn === this.currentPlayer) {
            this.updateStatus('You ran out of time! You forfeit this round.');
            // Add timeout move to moves array
            this.moves.push({
                player: this.playerTurn,
                type: 'timeout',
                timestamp: Date.now()
            });
            // Switch turns
            this.playerTurn = this.playerTurn === this.creator ? this.challenger : this.creator;
            this.updatePlayerStyles();
            this.updateTurnStatus();
            this.startTimer();
            this.saveGameState();
        }
    }

    handleCellClick(index) {
        console.log('Cell clicked:', {
            index,
            isGameStarted: this.gameStarted,
            playerTurn: this.playerTurn,
            currentPlayer: this.currentPlayer,
            isMyTurn: this.isMyTurn,
            board: this.board[index]
        });
        
        // Debugging info
        console.log('Current board state:', this.board);
        console.log('Current game status:', {
            creator: this.creator,
            challenger: this.challenger,
            currentPlayer: this.currentPlayer,
            playerTurn: this.playerTurn,
            isMyTurn: this.playerTurn === this.currentPlayer
        });
        
        // Early validations to provide better feedback
        if (!this.gameStarted) {
            console.log('Game not started yet');
            this.updateStatus('Waiting for challenger to join...');
            return;
        }
        
        if (!this.currentPlayer) {
            console.log('No wallet connected');
            this.updateStatus('Connect your wallet to play');
            return;
        }
        
        // Force-check if it should be your turn
        const shouldBeMyTurn = this.playerTurn === this.currentPlayer;
        if (!shouldBeMyTurn) {
            console.log('Not your turn:', {playerTurn: this.playerTurn, currentPlayer: this.currentPlayer});
            this.updateStatus("It's not your turn");
            return;
        }
        
        if (this.board[index] !== null) {
            console.log('Cell already filled');
            return;
        }
        
        console.log('Making move at cell', index);
        
        // Stop the timer
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Make the move
        const symbol = this.playerTurn === this.creator ? 'X' : 'O';
        this.board[index] = symbol;
        
        // Add move to moves array
        this.moves.push({
            player: this.playerTurn,
            index: index,
            symbol: symbol,
            timestamp: Date.now()
        });
        
        // Update the UI after the move
        this.createGameHTML();
        this.setupEventListeners();
        
        // Check for winner or draw
        const winner = this.checkWinner();
        if (winner) {
            this.handleGameEnd(winner);
            return;
        }
        
        if (this.checkDraw()) {
            this.handleGameEnd('draw');
            return;
        }
        
        // Switch turns
        this.playerTurn = this.playerTurn === this.creator ? this.challenger : this.creator;
        this.isMyTurn = false; // Update our tracking variable
        
        // Update the display with the new player turn
        this.updateTurnStatus();
        this.updatePlayerStyles();
        
        // Save game state to Firebase
        this.saveGameState();
    }

    updatePlayerStyles() {
        const player1 = this.container.querySelector('.player1');
        const player2 = this.container.querySelector('.player2');
        
        if (!player1 || !player2) return;
        
        player1.classList.toggle('active', this.playerTurn === this.creator);
        player2.classList.toggle('active', this.playerTurn === this.challenger);
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                // Highlight winning cells
                this.highlightWinCells(pattern);
                return this.board[a] === 'X' ? this.creator : this.challenger;
            }
        }
        
        return null;
    }
    
    highlightWinCells(pattern) {
        const cells = this.container.querySelectorAll('.cell');
        pattern.forEach(index => {
            cells[index].classList.add('win');
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== null);
    }

    endGame(result) {
        this.gameStarted = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Update scores
        if (result !== 'draw') {
            this.scores[result]++;
        }
        
        // Check if all rounds have been played
        if (this.currentRound >= this.totalRounds) {
            this.gameOver = true;
            
            // Determine overall winner
            if (this.scores[this.creator] > this.scores[this.challenger]) {
                this.winner = this.creator;
            } else if (this.scores[this.challenger] > this.scores[this.creator]) {
                this.winner = this.challenger;
            } else {
                this.isDraw = true;
            }
            
            // Show game end modal
            setTimeout(() => {
                this.showGameEndModal();
            }, 1000);
            
            // Save final game state with game over status
            this.saveGameState();
        } else {
            // For round end but not game end
            const isRoundWinner = result === this.currentPlayer;
            const isRoundLoser = !isRoundWinner && result !== 'draw';
            
            // Show round end notification
            if (isRoundLoser) {
                this.showRoundEndNotification('You lost this round!', false);
            } else if (isRoundWinner) {
                this.showRoundEndNotification('You won this round!', true);
            } else {
                this.showRoundEndNotification('This round ended in a draw.', null);
            }
            
            // Setup for next round after notification
            setTimeout(() => this.resetGame(), 3000);
        }
    }
    
    // New method to show round end notification
    showRoundEndNotification(message, isWin) {
        // Create a transient notification that will automatically close
        const notification = document.createElement('div');
        notification.className = `round-notification ${isWin ? 'win' : isWin === false ? 'loss' : 'draw'}`;
        notification.innerHTML = `
            <div class="round-notification-content">
                <h3>${message}</h3>
                <p>Next round starting in 3 seconds...</p>
            </div>
        `;
        
        // Add notification styles if not already in the document
        if (!document.getElementById('round-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'round-notification-styles';
            style.textContent = `
                .round-notification {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.85);
                    padding: 1.5rem;
                    border-radius: 8px;
                    z-index: 1000;
                    text-align: center;
                    animation: fadeInOut 3s ease forwards;
                }
                
                .round-notification.win {
                    border: 2px solid #14f195;
                    box-shadow: 0 0 15px rgba(20, 241, 149, 0.5);
                }
                
                .round-notification.loss {
                    border: 2px solid #ff4444;
                    box-shadow: 0 0 15px rgba(255, 68, 68, 0.5);
                }
                
                .round-notification.draw {
                    border: 2px solid #9945FF;
                    box-shadow: 0 0 15px rgba(153, 69, 255, 0.5);
                }
                
                .round-notification-content h3 {
                    margin-top: 0;
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                    color: ${isWin ? '#14f195' : isWin === false ? '#ff4444' : '#9945FF'};
                }
                
                .round-notification-content p {
                    margin-bottom: 0;
                    color: #ffffff;
                }
                
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translate(-50%, -60%); }
                    15% { opacity: 1; transform: translate(-50%, -50%); }
                    85% { opacity: 1; transform: translate(-50%, -50%); }
                    100% { opacity: 0; transform: translate(-50%, -40%); }
    }
`;
document.head.appendChild(style);
        }
        
        // Add to page and remove after animation
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showGameEndModal() {
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'game-end-modal';
        modal.id = 'game-end-modal';
        
        let modalTitle, modalSubtitle, actionButtons;
        
        // Determine display based on game result and current player
        const isWinner = this.winner === this.currentPlayer;
        const isLoser = !isWinner && !this.isDraw && (this.currentPlayer === this.creator || this.currentPlayer === this.challenger);
        const isParticipant = this.currentPlayer === this.creator || this.currentPlayer === this.challenger;
        
        if (this.isDraw) {
            modalTitle = 'Game Ended in a Draw!';
            modalSubtitle = 'Both players performed equally well.';
        } else if (this.winner) {
            if (isWinner) {
                modalTitle = 'Congratulations, You Won!';
                modalSubtitle = 'Well played! Claim your winnings below.';
            } else if (isParticipant) {
                modalTitle = 'Game Over, You Lost';
                modalSubtitle = 'Better luck next time!';
                
                // Auto-redirect loser to homepage after 5 seconds
                if (isLoser) {
                    console.log("Setting up loser redirect to home");
                    setTimeout(() => {
                        console.log("Redirecting loser to home page");
                        this.leaveGame();
                    }, 5000);
                }
            } else {
                // Spectator view
                const winnerDisplay = `${this.winner.slice(0, 4)}...${this.winner.slice(-4)}`;
                modalTitle = `Game Over, ${winnerDisplay} Won`;
                modalSubtitle = 'Watch for the next game.';
            }
        }
        
        // Create action buttons based on player's role
        if (isParticipant) {
            if (this.isDraw) {
                actionButtons = `
                    <div class="modal-actions">
                        <button id="leave-game" class="modal-btn btn-secondary">Return to Home</button>
                    </div>
                `;
            } else if (isWinner) {
                actionButtons = `
                    <div class="modal-actions">
                        <button id="claim-winnings" class="modal-btn btn-success">Claim Winnings</button>
                        <button id="leave-game" class="modal-btn btn-secondary">Return to Home</button>
                    </div>
                `;
            } else {
                // Loser sees countdown message
                actionButtons = `
                    <div class="modal-actions">
                        <div class="redirect-message">Returning to home in 5 seconds...</div>
                        <button id="leave-game" class="modal-btn btn-secondary">Return to Home Now</button>
                    </div>
                `;
            }
        } else {
            // Spectator view
            actionButtons = `
                <div class="modal-actions">
                    <button id="leave-game" class="modal-btn btn-secondary">Back to Home</button>
                </div>
            `;
        }
        
        // Calculate total wager amount
        const totalWager = this.wagerAmount * 2;
        const fee = totalWager * 0.05; // 5% fee
        const winnings = totalWager - fee;
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">${modalTitle}</h2>
                    <p class="modal-subtitle">${modalSubtitle}</p>
                </div>
                
                <div class="result-info">
                    <div class="result-item">
                        <span class="result-label">Player 1</span>
                        <span class="result-value">${this.scores[this.creator]}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Rounds</span>
                        <span class="result-value">${this.totalRounds}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Player 2</span>
                        <span class="result-value">${this.scores[this.challenger]}</span>
                    </div>
                </div>
                
                <div class="wager-result">
                    <div>Total Wager: ${totalWager} SOL</div>
                    <div>Platform Fee (5%): ${fee.toFixed(2)} SOL</div>
                    ${this.winner ? `<div>Winner's Prize: ${winnings.toFixed(2)} SOL</div>` : ''}
                    ${this.isDraw ? '<div>Refund Amount (per player): ' + this.wagerAmount + ' SOL</div>' : ''}
                </div>
                
                ${isLoser ? `
                <div class="loser-notice">
                    <div class="countdown-timer">5</div>
                    <p>You'll be redirected to the home page...</p>
                </div>
                ` : ''}
                
                ${actionButtons}
            </div>
        `;
        
        // Add modal to page
        document.body.appendChild(modal);
        
        // Start countdown for loser
        if (isLoser) {
            this.startLoserCountdown();
        }
        
        // Add event listeners for buttons
        this.setupEndGameModalListeners();
    }
    
    // Add countdown timer for loser
    startLoserCountdown() {
        let timeLeft = 5;
        const countdownEl = document.querySelector('.countdown-timer');
        
        if (!countdownEl) return;
        
        // Add countdown styles if not already there
        if (!document.getElementById('countdown-styles')) {
            const style = document.createElement('style');
            style.id = 'countdown-styles';
            style.textContent = `
                .loser-notice {
                    background: rgba(255, 68, 68, 0.1);
                    padding: 1rem;
                    margin: 1rem 0;
                    border-radius: 8px;
                    border: 1px solid #ff4444;
                    text-align: center;
                }
                
                .countdown-timer {
                    font-size: 2.5rem;
                    font-weight: bold;
                    color: #ff4444;
                    margin-bottom: 0.5rem;
                }
            `;
            document.head.appendChild(style);
        }
        
        const countdownInterval = setInterval(() => {
            timeLeft--;
            if (countdownEl) {
                countdownEl.textContent = timeLeft;
            }
            
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);
    }
    
    setupEndGameModalListeners() {
        const modal = document.getElementById('game-end-modal');
        if (!modal) return;
        
        // Leave game button
        const leaveBtn = modal.querySelector('#leave-game');
        if (leaveBtn) {
            leaveBtn.addEventListener('click', () => {
                this.leaveGame();
            });
        }
        
        // Claim winnings button
        const claimBtn = modal.querySelector('#claim-winnings');
        if (claimBtn) {
            claimBtn.addEventListener('click', () => {
                this.claimWinnings();
                claimBtn.disabled = true;
                claimBtn.classList.add('btn-disabled');
                claimBtn.textContent = 'Processing...';
            });
        }
    }
    
    leaveGame() {
        console.log("Leaving game and redirecting to home page");
        
        // If creator is leaving and no challenger has joined, process refund
        if (this.currentPlayer === this.creator && !this.challenger && !this.gameOver) {
            console.log("Creator leaving unjoined game - processing refund");
            // Process the refund and wait for it to complete before redirecting
            this.cancelGameAndRefund()
                .then(() => {
                    // Wait 3 seconds to make sure user sees the refund confirmation
                    setTimeout(() => {
                        this.redirectToHome();
                    }, 3000);
                })
                .catch(error => {
                    console.error("Error processing refund:", error);
                    // Still redirect even if refund fails
                    setTimeout(() => {
                        this.redirectToHome();
                    }, 1000);
                });
        } else {
            // If not the creator or challenger already joined, just redirect
            this.redirectToHome();
        }
    }
    
    // New method to handle the actual redirect logic
    redirectToHome() {
        // Redirect to home page - try both versions for better compatibility
        try {
            window.location.href = '/index.html';
            // If that doesn't redirect within 1 second, try alternative paths
            setTimeout(() => {
                if (window.location.pathname.includes('game.html')) {
                    console.log('First redirect attempt failed, trying alternative paths');
                    if (window.location.origin.includes('127.0.0.1') || window.location.origin.includes('localhost')) {
                        window.location.href = '/index.html';
                    } else {
                        window.location.href = '../index.html';
                    }
                }
            }, 1000);
        } catch (error) {
            console.error('Error during redirect:', error);
            // Try an alternative method
            window.location.replace('/index.html');
        }
    }
    
    // New method to cancel game and refund the creator
    async cancelGameAndRefund() {
        // Create a promise that resolves when the refund process is complete
        return new Promise(async (resolve, reject) => {
            try {
                // Show cancellation notification
                this.showCancellationNotification();
                
                // Initialize payment handler if needed
                if (!window.paymentHandler) {
                    console.log('Initializing payment handler for refund');
                    window.paymentHandler = new SolanaPaymentHandler();
                }
                
                // Make sure payment handler is initialized
                const initialized = await window.paymentHandler.init();
                if (!initialized) {
                    throw new Error('Payment handler could not be initialized');
                }
                
                // Get room ID from URL to update Firebase status
                const urlParams = new URLSearchParams(window.location.search);
                const roomId = urlParams.get('room');
                
                if (roomId) {
                    // Update the room status in Firebase
                    try {
                        console.log('Updating room status in Firebase');
                        await firebaseManager.initialize();
                        const roomsRef = await firebaseManager.getRoomsRef();
                        await roomsRef.child(roomId).update({
                            status: 'cancelled',
                            cancelledBy: this.currentPlayer,
                            cancelledAt: Date.now()
                        });
                        console.log('Room marked as cancelled in Firebase');
                    } catch (fbError) {
                        console.error('Firebase error when cancelling room:', fbError);
                        // Continue even if Firebase update fails
                    }
                }
                
                // Process the refund
                console.log(`Processing refund of ${this.wagerAmount} SOL to ${this.currentPlayer}`);
                const refundResult = await window.paymentHandler.processCreatorRefund(this.currentPlayer, this.wagerAmount);
                
                if (refundResult && refundResult.success) {
                    console.log('Refund processed successfully:', refundResult);
                    
                    // Update notification with success
                    const notification = document.querySelector('.cancellation-notification');
                    if (notification) {
                        notification.innerHTML = `
                            <h3>Game Cancelled Successfully</h3>
                            <p>Your wager of ${this.wagerAmount} SOL has been marked as refunded.</p>
                            <p><small><i>Note: In this demo version, no actual SOL is deducted or refunded.</i></small></p>
                            <p><small>Reference ID: ${refundResult.simulatedTxId || 'N/A'}</small></p>
                        `;
                        
                        // Make notification auto-dismiss after showing success
                        setTimeout(() => {
                            notification.classList.add('fade-out');
                            setTimeout(() => notification.remove(), 5000);
                        }, 5000);
                    }
                    resolve(refundResult);
                } else if (refundResult && refundResult.error) {
                    console.error('Error processing refund:', refundResult.error);
                    // Update notification with error
                    const notification = document.querySelector('.cancellation-notification');
                    if (notification) {
                        notification.innerHTML = `
                            <h3>Refund Error</h3>
                            <p>There was an error processing your refund.</p>
                            <p>Error: ${refundResult.error}</p>
                            <p><small><i>Note: Don't worry, no actual SOL was deducted from your wallet in this demo.</i></small></p>
                        `;
                        
                        // Make notification stay longer for error messages
                        setTimeout(() => {
                            notification.classList.add('fade-out');
                            setTimeout(() => notification.remove(), 1000);
                        }, 6000);
                    }
                    reject(new Error(refundResult.error));
                } else {
                    throw new Error('Unknown error during refund');
                }
            } catch (error) {
                console.error('Error cancelling game:', error);
                // Update notification with error
                const notification = document.querySelector('.cancellation-notification');
                if (notification) {
                    notification.innerHTML = `
                        <h3>Cancellation Error</h3>
                        <p>There was an error cancelling the game.</p>
                        <p>Error: ${error.message}</p>
                        <p><small><i>Note: Don't worry, no actual SOL was affected in this demo.</i></small></p>
                    `;
                    
                    // Make notification stay longer for error messages
                    setTimeout(() => {
                        notification.classList.add('fade-out');
                        setTimeout(() => notification.remove(), 1000);
                    }, 6000);
                }
                reject(error);
            }
        });
    }
    
    // Show cancellation notification
    showCancellationNotification() {
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'cancellation-notification';
        notification.innerHTML = `
            <h3>Cancelling Game</h3>
            <p>Processing refund of ${this.wagerAmount} SOL...</p>
            <div class="refund-spinner"></div>
        `;
        
        // Add notification styles if not already in the document
        if (!document.getElementById('cancellation-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'cancellation-notification-styles';
            style.textContent = `
                .cancellation-notification {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.95);
                    padding: 1.5rem;
                    border-radius: 8px;
                    z-index: 2000;
                    text-align: center;
                    border: 2px solid #9945FF;
                    box-shadow: 0 0 20px rgba(153, 69, 255, 0.5);
                    min-width: 300px;
                }
                
                .cancellation-notification h3 {
                    margin-top: 0;
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    color: #9945FF;
                }
                
                .cancellation-notification p {
                    margin-bottom: 1rem;
                    color: #ffffff;
                }
                
                .refund-spinner {
                    margin: 0 auto;
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(153, 69, 255, 0.3);
                    border-top: 4px solid #9945FF;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .fade-out {
                    animation: fadeOut 1s forwards;
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add to page
        document.body.appendChild(notification);
    }

    updateStatus(message) {
        const statusEl = this.container.querySelector('#game-status');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    handleGameEnd(result) {
        if (result === 'draw') {
            this.updateStatus('Round ended in a draw!');
        } else {
            const isCurrentPlayerWinner = result === this.currentPlayer;
            this.updateStatus(isCurrentPlayerWinner ? 
                'You won this round!' : 
                `${result.slice(0, 4)}...${result.slice(-4)} won this round!`);
        }
        
        // Add game result to moves array
        this.moves.push({
            type: 'result',
            result: result,
            timestamp: Date.now()
        });
        
        // Save final game state
        this.saveGameState();
        
        // End the game
        this.endGame(result);
    }

    resetGame() {
        this.board = Array(9).fill(null);
        this.currentRound++;
        this.playerTurn = this.creator; // Creator always starts new rounds
        this.gameStarted = true;
        this.remainingTime = this.turnTime;
        
        // Update isMyTurn status
        this.isMyTurn = this.currentPlayer === this.creator;
        
        console.log('Game reset for next round:', {
            currentRound: this.currentRound,
            playerTurn: this.playerTurn,
            isMyTurn: this.isMyTurn
        });
        
        this.createGameHTML();
        this.setupEventListeners();
        this.updateTurnStatus();
        
        // Start timer if it's current player's turn
        if (this.isMyTurn) {
            this.startTimer();
        }
        
        // Reset moves for new round
        this.moves = [];
        
        // Save initial state for new round
        this.saveGameState();
    }

    setStatus(message) {
        this.updateStatus(message);
    }
    
    // Sync game state from Firebase
    syncGameState(gameState) {
        if (!gameState) return;
        
        console.log('Syncing full game state:', gameState);
        
        // Update board and scores
        this.board = gameState.board || Array(9).fill(null);
        this.scores = gameState.scores || { [this.creator]: 0 };
        this.currentRound = gameState.currentRound || 1;
        this.playerTurn = gameState.playerTurn || this.creator;
        
        // Update game end properties
        this.gameOver = gameState.gameOver || false;
        this.winner = gameState.winner || null;
        this.isDraw = gameState.isDraw || false;
        
        // Update rematch votes if available
        if (gameState.rematchVotes) {
            this.rematchVotes = gameState.rematchVotes;
            
            // If game is over and modal is visible, update UI
            if (this.gameOver && document.getElementById('game-end-modal')) {
                this.updateRematchVoteUI();
                this.checkRematchVotes();
            } else if (this.gameOver && !document.getElementById('game-end-modal')) {
                // If game is over but modal not shown, show it
                this.showGameEndModal();
            }
        }
        
        // Update payment status
        if (gameState.paymentStatus) {
            this.paymentStatus = gameState.paymentStatus;
        }
        
        // Sync moves if available
        if (gameState.moves && Array.isArray(gameState.moves)) {
            // Only sync if we have fewer moves locally
            if (gameState.moves.length > this.moves.length) {
                this.syncMoves(gameState.moves);
            }
        }
        
        // Update the UI
        this.createGameHTML();
        this.setupEventListeners();
        this.updateTurnStatus();
        
        // Start timer if it's our turn and game is not over
        if (!this.gameOver && this.playerTurn === this.currentPlayer) {
            this.startTimer();
        }
    }
    
    // Sync moves from Firebase
    syncMoves(moves) {
        console.log('Syncing moves:', moves);
        if (!moves || !Array.isArray(moves)) {
            console.log('No valid moves to sync');
            return;
        }
        
        // Only process if there are new moves
        if (moves.length <= this.moves.length) {
            console.log('No new moves to process');
            return;
        }
        
        // Get the new moves
        const newMoves = moves.slice(this.moves.length);
        console.log('New moves to process:', newMoves);
        
        // Stop any existing timer before processing moves
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Process each new move
        for (const move of newMoves) {
            if (move.type === 'result') {
                // Handle game result
                console.log('Processing result move:', move);
                // Don't call handleGameEnd here to avoid duplicate endGame calls
                // Just update the result
                if (move.result === 'draw') {
                    this.updateStatus('Round ended in a draw!');
                } else {
                    const isCurrentPlayerWinner = move.result === this.currentPlayer;
                    this.updateStatus(isCurrentPlayerWinner ? 
                        'You won this round!' : 
                        `${move.result.slice(0, 4)}...${move.result.slice(-4)} won this round!`);
                }
            } else if (move.type === 'timeout') {
                // Handle timeout
                console.log('Processing timeout move:', move);
                this.playerTurn = this.playerTurn === this.creator ? this.challenger : this.creator;
                this.updatePlayerStyles();
                this.updateTurnStatus();
                
                if (this.isMyTurn && !this.gameOver) {
                    this.startTimer();
                }
            } else if (move.type === 'rematch-vote') {
                // Handle rematch vote
                console.log('Processing rematch vote:', move);
                this.rematchVotes[move.player] = move.vote;
                this.updateRematchVoteUI();
                this.checkRematchVotes();
            } else if (move.index !== undefined) {
                // Handle board move
                console.log('Processing board move:', move);
                
                const symbol = move.player === this.creator ? 'X' : 'O';
                this.board[move.index] = symbol;
                
                // Update the display after applying the move
                this.createGameHTML();
                this.setupEventListeners();
                
                // Check for winner or draw after applying the move
                const winner = this.checkWinner();
                if (winner) {
                    // Don't call handleGameEnd to avoid duplicate processing
                    continue;
                }
                
                if (this.checkDraw()) {
                    // Don't call handleGameEnd to avoid duplicate processing
                    continue;
                }
                
                // Switch turns
                this.playerTurn = this.playerTurn === this.creator ? this.challenger : this.creator;
                
                // Update display
                this.updateTurnStatus();
                this.updatePlayerStyles();
                
                // Start timer if it's now current player's turn and game not over
                if (this.playerTurn === this.currentPlayer && !this.gameOver) {
                    this.isMyTurn = true;
                    this.startTimer();
                } else {
                    this.isMyTurn = false;
                }
            }
        }
        
        // Update our moves array to match Firebase
        this.moves = moves;
    }
    
    // Save game state to Firebase
    async saveGameState() {
        try {
            // Get room ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            const roomId = urlParams.get('room');
            
            if (!roomId) return;
            
            // Save game state to Firebase
            const gameState = {
                board: this.board,
                playerTurn: this.playerTurn,
                scores: this.scores,
                currentRound: this.currentRound,
                moves: this.moves,
                lastUpdated: Date.now(),
                // Add new properties
                gameOver: this.gameOver,
                winner: this.winner,
                isDraw: this.isDraw,
                rematchVotes: this.rematchVotes,
                paymentStatus: this.paymentStatus
            };
            
            const roomsRef = await firebaseManager.getRoomsRef();
            await roomsRef.child(roomId).child('gameState').set(gameState);
            console.log('Game state saved to Firebase');
        } catch (error) {
            console.error('Error saving game state:', error);
        }
    }

    async claimWinnings() {
        if (!this.currentPlayer || this.currentPlayer !== this.winner) return;
        
        try {
            // Display payment processing UI
            const modalContent = document.querySelector('.modal-content');
            if (modalContent) {
                const paymentInfo = document.createElement('div');
                paymentInfo.className = 'payment-info';
                paymentInfo.innerHTML = `
                    <h3>Payment Processing</h3>
                    <p>Processing your winnings payment...</p>
                    <div class="payment-status payment-pending">Status: Processing</div>
                `;
                
                const actions = modalContent.querySelector('.modal-actions');
                if (actions) {
                    modalContent.insertBefore(paymentInfo, actions);
                } else {
                    modalContent.appendChild(paymentInfo);
                }
                
                // Get total wager amount (both players)
                const totalWager = this.wagerAmount * 2;
                
                // Initialize payment handler if needed
                if (!window.paymentHandler) {
                    window.paymentHandler = new SolanaPaymentHandler();
                    await window.paymentHandler.init();
                }
                
                // Actually process the payment
                const paymentResult = await window.paymentHandler.distributeWinnings(this.currentPlayer, totalWager);
                
                if (paymentResult && paymentResult.success) {
                    this.paymentStatus = 'complete';
                    paymentInfo.innerHTML = `
                        <h3>Payment Complete</h3>
                        <p>Your winnings have been sent to your wallet.</p>
                        <div class="payment-status payment-success">Status: Complete</div>
                        <p>Total amount: ${paymentResult.winnerAmount.toFixed(2)} SOL</p>
                        <p>Transaction ID: ${paymentResult.simulatedTxId || paymentResult.signature || 'N/A'}</p>
                    `;
                    
                    // Disable claim button to prevent multiple claims
                    const claimBtn = modalContent.querySelector('#claim-winnings');
                    if (claimBtn) {
                        claimBtn.disabled = true;
                        claimBtn.textContent = 'Winnings Claimed';
                        claimBtn.classList.add('btn-disabled');
                    }
                    
                    // Save payment status to Firebase
                    this.saveGameState();
                } else {
                    throw new Error(paymentResult.error || 'Failed to process payment');
                }
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            
            // Display error UI
            const paymentInfo = document.querySelector('.payment-info');
            if (paymentInfo) {
                paymentInfo.innerHTML = `
                    <h3>Payment Error</h3>
                    <p>There was an error processing your payment: ${error.message}</p>
                    <div class="payment-status payment-error">Status: Failed</div>
                    <p>Please try again or contact support.</p>
                `;
                
                // Enable claim button again to retry
                const claimBtn = document.querySelector('#claim-winnings');
                if (claimBtn) {
                    claimBtn.disabled = false;
                    claimBtn.textContent = 'Retry Claim';
                    claimBtn.classList.remove('btn-disabled');
                }
            }
        }
    }
}

// Export the class for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TicTacToe;
} else {
    window.TicTacToe = TicTacToe;
}

