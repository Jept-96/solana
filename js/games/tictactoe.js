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
    constructor(roomId, wagerAmount, totalRounds = 3) {
        this.roomId = roomId;
        this.wagerAmount = wagerAmount;
        this.totalRounds = totalRounds;
        this.currentRound = 1;
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.wins = 0;
        this.losses = 0;
        this.draws = 0;
        this.moves = [];
        this.gameStarted = false;
        this.isGameActive = false;
        this.creator = null;
        this.challenger = null;
        this.currentPlayer = null;
        this.winner = null;
        this.timer = null;
        this.timerDuration = 30; // 30 seconds per turn
        
        // Game end and rematch properties
        this.gameOver = false;
        this.isDraw = false;
        this.rematchVotes = {
            [this.creator]: null, // null = not voted, true = yes, false = no
        };
        if (this.challenger) {
            this.rematchVotes[this.challenger] = null;
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
        
        this.container = document.getElementById('game-container');
        
        this.init();
    }

    async initialize(creator, challenger = null) {
        console.log('Initializing game with:', { creator, challenger });
        
        if (!this.container) {
            console.error('Game container not found');
            return false;
        }

        this.creator = creator;
        this.challenger = challenger;
        this.currentPlayer = creator; // Creator always starts first
        
        // Initialize the game state
        this.gameStarted = challenger !== null;
        this.isGameActive = challenger !== null;
        
        // Create initial game HTML
        this.createGameHTML();
        this.setupEventListeners();
        
        return true;
    }

    init() {
        console.log('Initializing game with:', {
            creator: this.creator,
            challenger: this.challenger,
            currentPlayer: this.currentPlayer
        });
        
        this.createGameHTML();
        this.setupEventListeners();
        
        if (!this.gameStarted) {
            this.updateStatus('Waiting for challenger to join...');
        } else {
            this.updateTurnStatus();
            if (this.currentPlayer === this.creator) {
                this.startTimer();
            }
        }
    }

    createGameHTML() {
        if (!this.container) {
            console.error('Cannot create game HTML: container not found');
            return;
        }

        const challengerDisplay = this.challenger ? 
            `${this.challenger.slice(0, 4)}...${this.challenger.slice(-4)}` : 
            'Waiting for player...';

        // Determine if we should show cancel button (only for creator before challenger joins)
        const showCancelButton = !this.challenger && this.creator && this.currentPlayer === this.creator && !this.gameOver;

        const creatorDisplay = this.creator ? 
            `${this.creator.slice(0, 4)}...${this.creator.slice(-4)}` : 
            'Loading...';

        this.container.innerHTML = `
            <div class="game-container">
                <div class="game-header">
                    <div class="player-info">
                        <div class="player player1 ${this.currentPlayer === this.creator ? 'active' : ''}">
                            <span class="player-name">${creatorDisplay}</span>
                            <span class="player-symbol">X</span>
                            <span class="player-score">${this.wins}</span>
                        </div>
                        <div class="vs-container">
                            <span class="vs">VS</span>
                            <div class="turn-timer">${this.timerDuration}</div>
                            <div class="round-info">Round ${this.currentRound}/${this.totalRounds}</div>
                        </div>
                        <div class="player player2 ${this.currentPlayer === this.challenger ? 'active' : ''}">
                            <span class="player-name">${challengerDisplay}</span>
                            <span class="player-symbol">O</span>
                            <span class="player-score">${this.losses}</span>
                        </div>
                    </div>
                    <div class="wager-info">
                        <div>Wager: ${this.wagerAmount} SOL</div>
                        <div class="timer-info">Turn Timer: ${this.timerDuration}s</div>
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
        
        // Update game status
        if (!this.gameStarted) {
            this.updateStatus('Waiting for challenger to join...');
        } else {
            this.updateTurnStatus();
        }
        
        // Add cancel button event listener if showing
        if (showCancelButton) {
            const cancelBtn = this.container.querySelector('#cancel-game');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', async () => {
                    await this.handleCancelGame(cancelBtn);
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
            currentPlayer: this.currentPlayer,
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
            const isEmptyCell = this.board[index] === '';
            const isPlayerTurn = this.currentPlayer === this.creator || this.currentPlayer === this.challenger;
            const isClickable = isEmptyCell && isPlayerTurn && this.gameStarted;
            
            console.log(`Cell ${index}: empty=${isEmptyCell}, playerTurn=${isPlayerTurn}, clickable=${isClickable}`);
            
            // Add the click listener to the new cell
            newCell.addEventListener('click', () => {
                console.log(`Cell ${index} clicked`, {
                    currentPlayer: this.currentPlayer,
                    gameStarted: this.gameStarted
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
        
        this.remainingTime = this.timerDuration;
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
        if (this.currentPlayer === this.creator) {
            this.updateStatus('You ran out of time! You forfeit this round.');
            // Add timeout move to moves array
            this.moves.push({
                player: this.creator,
                type: 'timeout',
                timestamp: Date.now()
            });
            // Switch turns
            this.currentPlayer = this.challenger;
            this.updatePlayerStyles();
            this.updateTurnStatus();
            this.startTimer();
            this.saveGameState();
        }
    }

    async handleCellClick(index) {
        console.log('Cell clicked:', {
            index,
            currentPlayer: this.currentPlayer,
            walletAddress: WalletState.publicKey,
            gameStarted: this.gameStarted,
            isGameActive: this.isGameActive,
            board: this.board[index]
        });

        // Check if it's a valid move
        if (this.board[index] !== '' || !this.gameStarted || !this.isGameActive) {
            console.log('Invalid move:', {
                cellEmpty: this.board[index] === '',
                gameStarted: this.gameStarted,
                isGameActive: this.isGameActive
            });
            return;
        }

        // Check if it's the player's turn
        const currentWalletAddress = WalletState.publicKey;
        const isCreator = currentWalletAddress === this.creator;
        const isChallenger = currentWalletAddress === this.challenger;
        const isCurrentTurn = currentWalletAddress === this.currentPlayer;

        console.log('Turn validation:', {
            isCreator,
            isChallenger,
            isCurrentTurn,
            currentPlayer: this.currentPlayer,
            walletAddress: currentWalletAddress
        });

        if (!isCurrentTurn) {
            this.showNotification("It's not your turn!", 'error');
            return;
        }

        // Clear any existing timer first
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        // Make the move
        const symbol = isCreator ? 'X' : 'O';
        this.board[index] = symbol;
        
        // Update UI
        const cells = document.querySelectorAll('.cell');
        if (cells[index]) {
            cells[index].textContent = symbol;
            cells[index].classList.add(symbol.toLowerCase());
        }

        // Save the move
        this.moves.push({
            player: currentWalletAddress,
            position: index,
            symbol: symbol,
            timestamp: Date.now()
        });

        // Switch turns before checking winner
        this.currentPlayer = isCreator ? this.challenger : this.creator;
        
        console.log('Switching turn to:', this.currentPlayer);
        
        // Update UI
        this.updateTurnStatus();
        this.updatePlayerStyles();

        // Save game state immediately after move
        await this.saveGameState();

        // Check for winner or draw after state is saved
        const winner = this.checkWinner();
        if (winner) {
            this.gameOver = true;
            this.winner = currentWalletAddress;
            await this.endGame(currentWalletAddress);
            return;
        }

        if (this.checkDraw()) {
            this.gameOver = true;
            this.isDraw = true;
            await this.endGame('draw');
            return;
        }
        
        // Start timer for next player if game is still active
        if (!this.gameOver && this.currentPlayer === currentWalletAddress) {
            this.startTimer();
        }
    }

    updatePlayerStyles() {
        const player1 = this.container.querySelector('.player1');
        const player2 = this.container.querySelector('.player2');
        
        if (!player1 || !player2) return;
        
        player1.classList.toggle('active', this.currentPlayer === this.creator);
        player2.classList.toggle('active', this.currentPlayer === this.challenger);
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
        return this.board.every(cell => cell !== '');
    }

    async endGame(result) {
        this.isGameActive = false;
        clearInterval(this.timer);
        
        const currentWalletAddress = WalletState.publicKey;
        const isWinner = result === currentWalletAddress;
        const isDraw = result === 'draw';
        
        // Update round statistics
        if (isDraw) {
            this.draws++;
        } else if (isWinner) {
            this.wins++;
        } else {
            this.losses++;
        }

        // Show appropriate notification
        if (isDraw) {
            this.showNotification("It's a draw!", 'info');
        } else if (isWinner) {
            this.showNotification("You won this round!", 'success');
        } else {
            this.showNotification("You lost this round!", 'error');
        }

        // Save the game state
        await this.saveGameState();

        // Check if the game is completely over
        if (this.wins + this.losses + this.draws >= this.totalRounds) {
            // Determine the final winner
            const finalWinner = this.wins > this.losses ? this.creator : this.challenger;
            
            // Show the game end modal for both players
            setTimeout(() => {
                if (currentWalletAddress === finalWinner) {
                    this.showGameEndModal('winner');
                } else {
                    this.showGameEndModal('loser');
                }
            }, 2000);
        } else {
            // Start next round after a delay
            setTimeout(() => {
                this.resetGame();
            }, 3000);
        }
    }

    showGameEndModal(role) {
        const modal = document.createElement('div');
        modal.className = 'game-end-modal';
        
        const isWinner = role === 'winner';
        const totalWager = this.wagerAmount * 2;
        const winnings = totalWager * 0.95; // 5% platform fee
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">${isWinner ? 'Congratulations!' : 'Game Over'}</h2>
                    <p class="modal-subtitle">${isWinner ? 'You won the game!' : 'Better luck next time!'}</p>
                </div>
                
                <div class="result-info">
                    <div class="result-item">
                        <span class="result-label">Wins</span>
                        <span class="result-value">${this.wins}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Losses</span>
                        <span class="result-value">${this.losses}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Draws</span>
                        <span class="result-value">${this.draws}</span>
                    </div>
                </div>
                
                ${isWinner ? `
                    <div class="wager-result">
                        <p>Total Prize Pool: ${totalWager} SOL</p>
                        <p>Your Winnings: ${winnings.toFixed(2)} SOL</p>
                        <p>(After 5% platform fee)</p>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="modal-btn btn-success" id="claim-winnings">
                            Claim Winnings
                        </button>
                        <button class="modal-btn btn-secondary" id="return-home">
                            Return to Home
                        </button>
                    </div>
                ` : `
                    <div class="wager-result">
                        <p>Total Wager Lost: ${this.wagerAmount} SOL</p>
                    </div>
                    <div class="modal-actions">
                        <button class="modal-btn btn-primary" id="return-home">
                            Return to Home
                        </button>
                    </div>
                `}
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        if (isWinner) {
            const claimButton = modal.querySelector('#claim-winnings');
            claimButton.addEventListener('click', async () => {
                claimButton.classList.add('processing');
                claimButton.disabled = true;
                
                try {
                    const result = await this.claimWinnings();
                    if (result.success) {
                        claimButton.classList.remove('processing');
                        claimButton.classList.add('success');
                        claimButton.textContent = 'Claimed Successfully!';
                        
                        // Enable return home button
                        modal.querySelector('#return-home').disabled = false;
                    } else {
                        throw new Error(result.error || 'Failed to claim winnings');
                    }
                } catch (error) {
                    console.error('Error claiming winnings:', error);
                    claimButton.classList.remove('processing');
                    claimButton.classList.add('error');
                    claimButton.textContent = 'Failed to Claim';
                }
            });
        }
        
        // Add return home button listener
        const returnHomeButton = modal.querySelector('#return-home');
        returnHomeButton.addEventListener('click', () => {
            this.redirectToHome();
        });
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

    async resetGame() {
        console.log('Resetting game for next round');
        
        // Reset local game state
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentRound++;
        this.currentPlayer = this.creator; // Creator always starts new rounds
        this.gameStarted = true;
        this.isGameActive = true;
        this.gameOver = false;
        this.winner = null;
        this.isDraw = false;
        this.moves = [];
        
        console.log('Game reset for next round:', {
            currentRound: this.currentRound,
            currentPlayer: this.currentPlayer,
            isGameActive: this.isGameActive
        });
        
        // Save the reset state to Firebase first
        await this.saveGameState();
        
        // Then update the UI
        this.createGameHTML();
        this.setupEventListeners();
        this.updateTurnStatus();
        this.updatePlayerStyles();
        
        // Start timer if it's current player's turn
        if (this.currentPlayer === WalletState.publicKey) {
            this.startTimer();
        }
    }

    setStatus(message) {
        this.updateStatus(message);
    }
    
    // Sync game state from Firebase
    syncGameState(gameState) {
        if (!gameState) {
            console.error('Invalid game state received');
            return;
        }
        
        console.log('Syncing game state:', gameState);
        
        // Store current state before update
        const previousPlayer = this.currentPlayer;
        const wasGameActive = this.isGameActive;
        
        // Clear any existing timer first
        if (this.timer) {
            console.log('Clearing existing timer');
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Update game status flags
        this.gameStarted = gameState.gameStarted;
        this.isGameActive = gameState.isGameActive;
        this.gameOver = gameState.gameOver || false;
        this.winner = gameState.winner || null;
        this.isDraw = gameState.isDraw || false;
        this.currentRound = gameState.currentRound || 1;
        
        // Update board and scores
        if (Array.isArray(gameState.board)) {
            this.board = [...gameState.board];
        }
        this.wins = gameState.wins || 0;
        this.losses = gameState.losses || 0;
        this.draws = gameState.draws || 0;
        
        // Update current player
        if (gameState.playerTurn) {
            this.currentPlayer = gameState.playerTurn;
        }
        
        console.log('Turn update:', {
            previousPlayer,
            currentPlayer: this.currentPlayer,
            localWallet: WalletState.publicKey,
            isMyTurn: this.currentPlayer === WalletState.publicKey
        });
        
        // Sync moves if available
        if (gameState.moves && Array.isArray(gameState.moves)) {
            this.moves = [...gameState.moves];
        }
        
        // Update payment status
        if (gameState.paymentStatus) {
            this.paymentStatus = gameState.paymentStatus;
        }
        
        // Update rematch votes if available
        if (gameState.rematchVotes) {
            this.rematchVotes = {...gameState.rematchVotes};
        }
        
        // Update the UI
        this.createGameHTML();
        this.setupEventListeners();
        this.updateTurnStatus();
        this.updatePlayerStyles();
        
        // Handle timer based on current game state
        const isMyTurn = this.currentPlayer === WalletState.publicKey;
        const turnChanged = previousPlayer !== this.currentPlayer;
        const gameStateChanged = wasGameActive !== this.isGameActive;
        
        console.log('Timer conditions:', {
            isMyTurn,
            turnChanged,
            gameStateChanged,
            gameOver: this.gameOver,
            isGameActive: this.isGameActive
        });
        
        // Start new timer if it's our turn and game is active
        if (isMyTurn && !this.gameOver && this.isGameActive) {
            if (turnChanged || gameStateChanged) {
                console.log('Starting new timer for current player');
                this.startTimer();
            }
        }
        
        // Show game end modal if game is over
        if (this.gameOver && !document.querySelector('.game-end-modal')) {
            console.log('Showing game end modal');
            if (this.winner === WalletState.publicKey) {
                this.showGameEndModal('winner');
            } else if (this.winner) {
                this.showGameEndModal('loser');
            }
        }
    }
    
    // Save game state to Firebase
    async saveGameState() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const roomId = urlParams.get('roomId');
            
            if (!roomId) {
                console.error('No room ID found in URL');
                return;
            }
            
            console.log('Saving game state:', {
                currentPlayer: this.currentPlayer,
                board: this.board,
                moves: this.moves,
                gameStarted: this.gameStarted,
                isGameActive: this.isGameActive,
                gameOver: this.gameOver,
                currentRound: this.currentRound
            });
            
            const gameState = {
                board: this.board,
                playerTurn: this.currentPlayer,
                wins: this.wins,
                losses: this.losses,
                draws: this.draws,
                moves: this.moves,
                lastUpdated: Date.now(),
                gameStarted: this.gameStarted,
                isGameActive: this.isGameActive,
                gameOver: this.gameOver,
                winner: this.winner,
                isDraw: this.isDraw,
                currentRound: this.currentRound,
                totalRounds: this.totalRounds,
                rematchVotes: this.rematchVotes,
                paymentStatus: this.paymentStatus
            };
            
            const roomRef = firebase.database().ref(`rooms/${roomId}`);
            await roomRef.child('gameState').update(gameState);
            console.log('Game state saved successfully');
            
        } catch (error) {
            console.error('Error saving game state:', error);
            this.showNotification('Error saving game state', 'error');
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

    updateTurnStatus() {
        if (!this.gameStarted) {
            this.updateStatus('Waiting for challenger to join...');
            return;
        }
        
        if (this.currentPlayer === this.creator) {
            this.updateStatus('Your turn!');
        } else if (this.currentPlayer === this.challenger) {
            this.updateStatus(`${this.challenger.slice(0, 4)}...${this.challenger.slice(-4)}'s turn`);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `game-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <h3>${message}</h3>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove the notification after animation
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    async handleCancelGame(cancelBtn) {
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
    }
}

// Export the class for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TicTacToe;
} else {
    window.TicTacToe = TicTacToe;
}

