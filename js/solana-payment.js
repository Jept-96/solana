/**
 * Solana Arcade Payment Handler
 * 
 * This module handles all payments for the Solana Arcade platform including:
 * - Sending wagers to the central wallet when creating/joining rooms
 * - Distributing winnings when games end
 * - Handling refunds for draws or game cancellations
 */

class SolanaPaymentHandler {
    constructor() {
        // The central wallet for holding wagers
        this.centralWalletAddress = '3KMUwSbdvYJEPEd9DQZpdqRh89yzdYgftFtU5KJ5K5oa'; // Replace with your actual wallet address
        this.FEE_PERCENTAGE = 0.05; // 5% platform fee
        
        // Track processed transactions to prevent duplicates
        this.processedTransactions = new Set();
        
        // Initialize Solana connection for Devnet
        if (window.solanaWeb3) {
            this.connection = new window.solanaWeb3.Connection(
                'https://api.devnet.solana.com',
                'confirmed'
            );
            // Make it available globally
            window.solanaConnection = this.connection;
        }
    }

    /**
     * Initialize the payment handler
     */
    async init() {
        console.log('Initializing Solana Payment Handler');
        if (!window.solana || !window.solana.isPhantom) {
            console.error('Phantom wallet not found');
            return false;
        }

        try {
            // Check if wallet is connected
            if (!WalletState.isConnected) {
                console.warn('Wallet not connected');
                return false;
            }
            
            // Ensure connection is initialized
            if (!this.connection && window.solanaWeb3) {
                this.connection = new window.solanaWeb3.Connection(
                    'https://api.devnet.solana.com',
                    'confirmed'
                );
                window.solanaConnection = this.connection;
            }
            
            console.log('Solana Payment Handler initialized');
            return true;
        } catch (error) {
            console.error('Error initializing payment handler:', error);
            return false;
        }
    }

    /**
     * Send a wager to the central wallet
     * @param {number} amount - The amount in SOL to wager
     * @param {string} roomId - The ID of the game room
     * @param {string} gameType - The type of game
     * @returns {Promise<object>} Result object with success status and transaction details
     */
    async sendWager(amount, roomId, gameType) {
        if (!window.solana || !window.solana.isPhantom) {
            return { success: false, error: 'Phantom wallet not found' };
        }

        // Generate a unique transaction ID to prevent duplicates
        const transactionId = `${WalletState.publicKey}-${roomId}-${Date.now()}`;
        
        // Check if this transaction was already processed
        if (this.processedTransactions.has(transactionId)) {
            console.log('Transaction already processed, preventing duplicate');
            return { success: true, isDuplicate: true };
        }
        
        try {
            // Verify connection
            if (!this.connection) {
                if (window.solanaWeb3) {
                    this.connection = new window.solanaWeb3.Connection(
                        'https://api.devnet.solana.com',
                        'confirmed'
                    );
                    window.solanaConnection = this.connection;
                } else {
                    return { success: false, error: 'Solana Web3 not initialized' };
                }
            }
            
            // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
            const lamports = amount * 1000000000;
            
            // Create the transaction
            const transaction = new window.solanaWeb3.Transaction().add(
                window.solanaWeb3.SystemProgram.transfer({
                    fromPubkey: new window.solanaWeb3.PublicKey(WalletState.publicKey),
                    toPubkey: new window.solanaWeb3.PublicKey(this.centralWalletAddress),
                    lamports: lamports
                })
            );
            
            // Add metadata to transaction
            const metadataInstruction = new window.solanaWeb3.TransactionInstruction({
                keys: [
                    { pubkey: new window.solanaWeb3.PublicKey(WalletState.publicKey), isSigner: true, isWritable: true }
                ],
                programId: new window.solanaWeb3.PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
                data: new TextEncoder().encode(`solana-arcade:wager:${roomId}:${gameType}:${transactionId}`)
            });
            transaction.add(metadataInstruction);
            
            // Send the transaction
            const { blockhash } = await this.connection.getRecentBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = new window.solanaWeb3.PublicKey(WalletState.publicKey);
            
            // Sign the transaction
            let signed = await window.solana.signTransaction(transaction);
            
            // Send the transaction
            const signature = await this.connection.sendRawTransaction(signed.serialize());
            
            // Mark this transaction as processed
            this.processedTransactions.add(transactionId);
            
            // Wait for confirmation
            await this.connection.confirmTransaction(signature);
            
            console.log('Wager sent successfully:', signature);
            
            // Return success
            return {
                success: true,
                signature,
                amount,
                roomId,
                gameType,
                transactionId
            };
        } catch (error) {
            console.error('Error sending wager:', error);
            
            // If the error is about a duplicate transaction, mark as success but with isDuplicate flag
            if (error.message && error.message.includes('already been processed')) {
                console.log('Transaction already processed on chain');
                this.processedTransactions.add(transactionId);
                return { 
                    success: true,
                    isDuplicate: true,
                    error: error.message
                };
            }
            
            return { success: false, error: error.message };
        }
    }

    /**
     * Distribute winnings to the winner
     * @param {string} winnerAddress - The wallet address of the winner
     * @param {number} amount - The total wager amount (both players combined)
     * @returns {Promise<object>} Result object with success status and transaction details
     */
    async distributeWinnings(winnerAddress, amount) {
        console.log(`Distributing winnings of ${amount} SOL to ${winnerAddress}`);
        
        // Calculate winner's amount after fee
        const fee = amount * this.FEE_PERCENTAGE;
        const winnerAmount = amount - fee;
        
        // In a production environment, this would be handled server-side
        // where you have access to the central wallet's private key
        // For this demo, send funds from the connected wallet
        
        try {
            // Ensure connection is initialized
            if (!this.connection) {
                if (window.solanaWeb3) {
                    this.connection = new window.solanaWeb3.Connection(
                        'https://api.devnet.solana.com',
                        'confirmed'
                    );
                    window.solanaConnection = this.connection;
                } else {
                    return { success: false, error: 'Solana Web3 not initialized' };
                }
            }
            
            // Make sure wallet is connected
            if (!WalletState.isConnected) {
                return { success: false, error: 'Wallet not connected' };
            }
            
            // Generate a unique transaction ID
            const transactionId = `payout-${winnerAddress}-${Date.now()}`;
            
            // Check if this transaction was already processed
            if (this.processedTransactions.has(transactionId)) {
                console.log('Payout transaction already processed, preventing duplicate');
                return { 
                    success: true, 
                    isDuplicate: true,
                    winnerAmount: winnerAmount
                };
            }
            
            console.log(`Creating transaction to send ${winnerAmount} SOL from ${WalletState.publicKey} to ${winnerAddress}`);
            
            // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
            const lamports = Math.floor(winnerAmount * 1000000000);
            
            // Create a transaction to send the winnings
            const transaction = new window.solanaWeb3.Transaction().add(
                window.solanaWeb3.SystemProgram.transfer({
                    fromPubkey: new window.solanaWeb3.PublicKey(WalletState.publicKey),
                    toPubkey: new window.solanaWeb3.PublicKey(winnerAddress),
                    lamports: lamports
                })
            );
            
            // Add metadata to transaction
            const metadataInstruction = new window.solanaWeb3.TransactionInstruction({
                keys: [
                    { pubkey: new window.solanaWeb3.PublicKey(WalletState.publicKey), isSigner: true, isWritable: true }
                ],
                programId: new window.solanaWeb3.PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
                data: new TextEncoder().encode(`solana-arcade:winnings:${transactionId}`)
            });
            transaction.add(metadataInstruction);
            
            // Get recent blockhash
            console.log('Getting recent blockhash');
            const { blockhash } = await this.connection.getRecentBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = new window.solanaWeb3.PublicKey(WalletState.publicKey);
            
            // Sign the transaction
            console.log('Requesting user to sign transaction');
            let signed = await window.solana.signTransaction(transaction);
            
            // Send the transaction
            console.log('Sending raw transaction to network');
            const signature = await this.connection.sendRawTransaction(signed.serialize());
            
            // Mark this transaction as processed
            this.processedTransactions.add(transactionId);
            
            // Wait for confirmation
            console.log('Waiting for transaction confirmation');
            const confirmation = await this.connection.confirmTransaction(signature);
            console.log('Transaction confirmed:', confirmation);
            
            console.log('Winnings sent successfully:', signature);
            
            return {
                success: true,
                signature,
                winnerAmount,
                feeAmount: fee,
                transactionId
            };
        } catch (error) {
            console.error('Error distributing winnings:', error);
            
            // If the error is about a duplicate transaction, mark as success
            if (error.message && error.message.includes('already been processed')) {
                return { 
                    success: true, 
                    isDuplicate: true,
                    winnerAmount: winnerAmount,
                    error: error.message
                };
            }
            
            return { success: false, error: error.message };
        }
    }

    /**
     * Process refunds for both players in case of a draw
     * @param {string} player1 - Wallet address of player 1
     * @param {string} player2 - Wallet address of player 2
     * @param {number} amount - The amount each player wagered
     * @returns {Promise<object>} Result object with success status
     */
    async processRefunds(player1, player2, amount) {
        // This would typically be done on the server side
        // For this example, we'll simulate the process
        
        console.log(`Processing refunds of ${amount} SOL to ${player1} and ${player2}`);
        
        // Simulating success for now
        return {
            success: true,
            refundedPlayers: [player1, player2],
            refundAmount: amount,
            simulatedTxIds: [
                Array.from({length: 32}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
                Array.from({length: 32}, () => Math.floor(Math.random() * 16).toString(16)).join('')
            ]
        };
    }

    /**
     * Check if a player has sufficient balance for a wager
     * @param {number} amount - The amount to check
     * @returns {Promise<boolean>} Whether the player has sufficient balance
     */
    async checkSufficientBalance(amount) {
        if (!window.solana || !window.solana.isPhantom || !WalletState.isConnected) {
            return false;
        }

        try {
            // Ensure connection is initialized
            if (!this.connection) {
                if (window.solanaWeb3) {
                    this.connection = new window.solanaWeb3.Connection(
                        'https://api.devnet.solana.com',
                        'confirmed'
                    );
                    window.solanaConnection = this.connection;
                } else {
                    return false;
                }
            }
            
            // Get account info to check balance
            const publicKey = new window.solanaWeb3.PublicKey(WalletState.publicKey);
            const account = await this.connection.getAccountInfo(publicKey);
            
            // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
            const lamports = amount * 1000000000;
            
            // Check if balance is sufficient
            return account.lamports >= lamports;
        } catch (error) {
            console.error('Error checking balance:', error);
            return false;
        }
    }

    /**
     * Process a refund for a creator who cancels a game before anyone joins
     * @param {string} creatorAddress - The wallet address of the creator
     * @param {number} amount - The amount wagered that needs to be refunded
     * @returns {Promise<object>} Result object with success status and transaction details
     */
    async processCreatorRefund(creatorAddress, amount) {
        console.log(`Processing refund of ${amount} SOL to ${creatorAddress}`);
        
        try {
            // Ensure connection is initialized
            if (!this.connection) {
                if (window.solanaWeb3) {
                    this.connection = new window.solanaWeb3.Connection(
                        'https://api.devnet.solana.com',
                        'confirmed'
                    );
                    window.solanaConnection = this.connection;
                } else {
                    return { success: false, error: 'Solana Web3 not initialized' };
                }
            }
            
            // Make sure wallet is connected
            if (!WalletState.isConnected) {
                return { success: false, error: 'Wallet not connected' };
            }
            
            // Generate a unique transaction ID
            const transactionId = `refund-${creatorAddress}-${Date.now()}`;
            
            // Check if this transaction was already processed
            if (this.processedTransactions.has(transactionId)) {
                console.log('Refund transaction already processed, preventing duplicate');
                return { 
                    success: true, 
                    isDuplicate: true,
                    refundAmount: amount
                };
            }
            
            console.log(`Simulating refund of ${amount} SOL to ${creatorAddress}`);
            
            // IMPORTANT FIX: In the real system, this would be a transaction FROM the central wallet TO the user
            // For this demo, we're just simulating the refund
            // Normally this would require a server-side component with the central wallet's private key
            
            // Generate a simulated transaction ID to track the refund
            const simulatedTxId = `sim-refund-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
            
            // Mark this transaction as processed
            this.processedTransactions.add(transactionId);
            
            // In a production system, update database to record the refund
            console.log('Refund simulated successfully with ID:', simulatedTxId);
            
            // Simulate a short delay for processing
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            return {
                success: true,
                simulatedTxId: simulatedTxId,
                refundAmount: amount,
                transactionId
            };
        } catch (error) {
            console.error('Error processing refund:', error);
            
            return { success: false, error: error.message };
        }
    }
}

// Export the class for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SolanaPaymentHandler;
} else {
    window.SolanaPaymentHandler = SolanaPaymentHandler;
} 