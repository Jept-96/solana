// Firebase Database Setup
class FirebaseManager {
    static instance = null;
    
    constructor() {
        this.db = null;
        this.roomsRef = null;
        this.initialized = false;
        this.initPromise = null;
    }

    static getInstance() {
        if (!FirebaseManager.instance) {
            FirebaseManager.instance = new FirebaseManager();
        }
        return FirebaseManager.instance;
    }

    async initialize() {
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = new Promise(async (resolve, reject) => {
            try {
                // Wait for Firebase SDK to be available
                let attempts = 0;
                while (typeof firebase === 'undefined' && attempts < 10) {
                    await new Promise(r => setTimeout(r, 500));
                    attempts++;
                }

                if (typeof firebase === 'undefined') {
                    throw new Error('Firebase SDK not loaded');
                }

                // Initialize Firebase if not already initialized
                if (!firebase.apps.length) {
                    firebase.initializeApp(firebaseConfig);
                }

                this.db = firebase.database();
                this.roomsRef = this.db.ref('rooms');
                this.initialized = true;

                console.log('Firebase Database initialized successfully');
                resolve();
            } catch (error) {
                console.error('Firebase initialization error:', error);
                this.initialized = false;
                this.initPromise = null;
                reject(error);
            }
        });

        return this.initPromise;
    }

    async getRoomsRef() {
        if (!this.initialized) {
            await this.initialize();
        }
        return this.roomsRef;
    }

    async addRoom(roomData) {
        const roomsRef = await this.getRoomsRef();
        const newRoomRef = roomsRef.push();
        const roomId = newRoomRef.key;
        
        const room = {
            id: roomId,
            ...roomData,
            createdAt: Date.now(),
            status: 'waiting'
        };

        await newRoomRef.set(room);
        return roomId;
    }

    async deleteRoom(roomId) {
        const roomsRef = await this.getRoomsRef();
        await roomsRef.child(roomId).remove();
    }

    async getRoom(roomId) {
        const roomsRef = await this.getRoomsRef();
        const snapshot = await roomsRef.child(roomId).once('value');
        return snapshot.val();
    }

    async getAllRooms() {
        const roomsRef = await this.getRoomsRef();
        const snapshot = await roomsRef.once('value');
        return snapshot.val() || {};
    }
}

// Initialize Firebase manager
const firebaseManager = FirebaseManager.getInstance();

// Room Management Functions
async function getAllRooms() {
    if (!roomsRef) {
        await initializeFirebase();
    }

    try {
        const snapshot = await roomsRef.once('value');
        const rooms = snapshot.val() || {};
        
        // Convert to array and filter out old rooms
        const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
        const roomsArray = Object.entries(rooms).map(([id, room]) => ({
            ...room,
            id: id // Ensure ID is included
        })).filter(room => {
            const roomAge = Date.now() - room.createdAt;
            return roomAge < twentyFourHoursAgo; // Keep rooms less than 24 hours old
        });

        return roomsArray;
    } catch (error) {
        console.error('Error getting rooms:', error);
        return [];
    }
}

async function addRoom(roomData) {
    if (!roomsRef) {
        await initializeFirebase();
    }

    try {
        const newRoomRef = roomsRef.push();
        const roomId = newRoomRef.key;
        
        const room = {
            id: roomId,
            ...roomData,
            createdAt: Date.now(),
            status: 'waiting'
        };

        await newRoomRef.set(room);
        return roomId;
    } catch (error) {
        console.error('Error adding room:', error);
        throw error;
    }
}

async function deleteRoom(roomId) {
    if (!roomsRef) {
        await initializeFirebase();
    }

    try {
        await roomsRef.child(roomId).remove();
    } catch (error) {
        console.error('Error deleting room:', error);
        throw error;
    }
}

// Update the rooms list in real-time
async function initializeRoomsList() {
    try {
        console.log('Initializing rooms list...');
        await firebaseManager.initialize();
        
        const roomsList = document.querySelector('.rooms-list');
        if (!roomsList) {
            console.error('No rooms list element found');
            return;
        }

        console.log('Setting up real-time listener for rooms...');
        const roomsRef = await firebaseManager.getRoomsRef();

        // Listen for real-time updates
        roomsRef.on('value', (snapshot) => {
            console.log('Received rooms update');
            const rooms = snapshot.val() || {};
            
            // Get filter values
            const gameFilterElem = document.getElementById('game-filter');
            const gameFilter = gameFilterElem ? gameFilterElem.value : 'all';
            const wagerFilterElem = document.getElementById('wager-filter');
            const wagerFilter = wagerFilterElem ? parseFloat(wagerFilterElem.value || '0') : 0;

            console.log('Filtering with:', { gameFilter, wagerFilter });

            // Clear existing rooms
            roomsList.innerHTML = '';

            // Convert rooms object to array and filter
            const roomsArray = Object.entries(rooms)
                .map(([id, room]) => ({ ...room, id }))
                .filter(room => {
                    const isWaiting = room.status === 'waiting';
                    const notExpired = (Date.now() - room.createdAt) < (24 * 60 * 60 * 1000);
                    
                    // For "all" game filter, show all game types
                    const matchesGame = gameFilter === 'all' || room.gameType === gameFilter;
                    
                    const matchesWager = !wagerFilter || room.wagerAmount >= wagerFilter;
                    
                    console.log('Room filtering:', {
                        id: room.id,
                        isWaiting,
                        notExpired,
                        matchesGame,
                        matchesWager,
                        status: room.status,
                        gameType: room.gameType,
                        filter: gameFilter
                    });
                    
                    return isWaiting && notExpired && matchesGame && matchesWager;
                })
                .sort((a, b) => b.createdAt - a.createdAt);

            console.log('Filtered rooms:', roomsArray.length);

            if (roomsArray.length === 0) {
                roomsList.innerHTML = '<p class="text-secondary">No active rooms found</p>';
                return;
            }

            // Add rooms to the list
            roomsArray.forEach(room => {
                const roomElement = createRoomElement(room);
                roomsList.appendChild(roomElement);
            });
        }, (error) => {
            console.error('Error listening to rooms:', error);
            roomsList.innerHTML = '<p class="text-secondary">Error loading rooms. Please refresh the page.</p>';
        });

    } catch (error) {
        console.error('Error in initializeRoomsList:', error);
        const roomsList = document.querySelector('.rooms-list');
        if (roomsList) {
            roomsList.innerHTML = '<p class="text-secondary">Error loading rooms. Please refresh the page.</p>';
        }
    }
}

// Initialize everything when the page loads
async function initializeApp() {
    try {
        // Initialize Firebase first
        await firebaseManager.initialize();
        
        // Then initialize other features
        await Promise.all([
            WalletState.initialize()
        ]);

        // Initialize rooms list if on main page
        const roomsList = document.querySelector('.rooms-list');
        if (roomsList) {
            await initializeRoomsList();
        }
        
        // Initialize game if we're on the game page
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            await initializeGameRoom();
        }

        console.log('App initialization complete');
    } catch (error) {
        console.error('Error during app initialization:', error);
        alert('Failed to initialize the application. Please refresh the page.');
    }
}

// Make functions globally available
window.getAllRooms = getAllRooms;
window.addRoom = addRoom;
window.deleteRoom = deleteRoom;

// DOM Elements
const connectWalletBtn = document.getElementById('connect-wallet');
const walletConnectedDiv = document.getElementById('wallet-connected');
const solBalanceSpan = document.getElementById('sol-balance');
const walletAddressSpan = document.getElementById('wallet-address');
const createRoomModal = document.getElementById('create-room-modal');
const createRoomForm = document.getElementById('create-room-form');
const cancelCreateBtn = document.getElementById('cancel-create');
const gameCards = document.querySelectorAll('.game-card');
const roomsList = document.querySelector('.rooms-list');
const gameFilter = document.getElementById('game-filter');
const wagerFilter = document.getElementById('wager-filter');

// UI Helper Functions - Define these first
const getGameName = (gameType) => {
    const games = {
        tictactoe: 'Tic-Tac-Toe',
        rps: 'Rock Paper Scissors',
        connect4: 'Connect Four',
        memory: 'Memory Match',
        wordrace: 'Word Race'
    };
    return games[gameType] || gameType;
};

const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
};

const closeCreateRoomModal = () => {
    const modal = document.getElementById('create-room-modal');
    if (modal) {
        modal.classList.add('hidden');
        const form = document.getElementById('create-room-form');
        if (form) form.reset();
    }
};

const showCreateRoomModal = (gameType) => {
    const modal = document.getElementById('create-room-modal');
    const gameTypeInput = document.getElementById('game-type');
    
    if (modal && gameTypeInput) {
        modal.classList.remove('hidden');
        gameTypeInput.value = gameType;
        
        // Reset form and setup preset buttons
        const form = document.getElementById('create-room-form');
        if (form) {
            form.reset();
            setupPresetButtons(); // Re-initialize preset buttons when showing modal
        }
    }
};

// Make UI helper functions globally available immediately
window.closeCreateRoomModal = closeCreateRoomModal;
window.showCreateRoomModal = showCreateRoomModal;

// State Management
let walletConnected = false;
let activeRooms = JSON.parse(localStorage.getItem('activeRooms') || '[]');
let selectedGame = null;
let currentLeaderboardTab = 'weekly';

// Sample leaderboard data (this would come from your backend in production)
const leaderboardData = {
    weekly: [
        { rank: 1, player: '8dJ4...k9Fn', wins: 15, wagered: 12.5 },
        { rank: 2, player: '3mP7...r5Yx', wins: 12, wagered: 10.2 },
        { rank: 3, player: '9nK2...h4Wz', wins: 10, wagered: 8.7 },
        { rank: 4, player: '5vB8...t6Lq', wins: 8, wagered: 7.3 },
        { rank: 5, player: '2cR5...j7Hp', wins: 7, wagered: 6.1 }
    ],
    alltime: [
        { rank: 1, player: '4xM9...p2Dn', wins: 156, wagered: 142.8 },
        { rank: 2, player: '7kL3...s8Vf', wins: 134, wagered: 121.5 },
        { rank: 3, player: '1hG6...w4Jt', wins: 98, wagered: 89.3 },
        { rank: 4, player: '6uY4...n5Bm', wins: 87, wagered: 76.9 },
        { rank: 5, player: '9aQ7...c3Ke', wins: 76, wagered: 65.4 }
    ]
};

// Solana Connection with fallback endpoints
const getConnection = () => {
    // List of devnet RPC endpoints
    const endpoints = [
        'https://api.devnet.solana.com',
        'https://solana-devnet.g.alchemy.com/v2/demo',
        'https://rpc.ankr.com/solana_devnet'
    ];

    // Try each endpoint until we find one that responds
    return new solanaWeb3.Connection(endpoints[0], {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 30000,
        wsEndpoint: endpoints[0].replace('https', 'wss')
    });
};

const connection = getConnection();

// Function to get Solana provider (Phantom wallet)
function getProvider() {
    if (typeof window === 'undefined') return null;
    
    if ('phantom' in window) {
        const provider = window.phantom?.solana;
        if (provider?.isPhantom) return provider;
    }
    
    // Check for Solana object which is also provided by Phantom
    if ('solana' in window) {
        const provider = window.solana;
        if (provider.isPhantom) return provider;
    }
    
    // No wallet detected
    console.log('Please install Phantom wallet to continue');
    return null;
}

// Wallet State Management
const WalletState = {
    isConnected: false,
    publicKey: null,
    balance: 0,
    provider: null,

    async initialize() {
        try {
            console.log('Initializing wallet state...');
        const provider = getProvider();
        if (!provider) {
                console.log('No Phantom wallet detected');
                return false;
            }
            
            this.provider = provider;
            
            // Try to restore session from localStorage first
            const savedState = this.loadSavedState();
            if (savedState && savedState.publicKey) {
                console.log('Found saved wallet state, verifying...');
                // Check if public key matches and wallet is connected
                if (await this.verifyWalletState(savedState)) {
                    console.log('Saved wallet state verified, restoring session');
                    this.isConnected = true;
                    this.publicKey = savedState.publicKey;
                    this.balance = savedState.balance;
                    await this.updateBalance(); // Refresh balance
                    updateWalletUI(this.publicKey);
                    return true;
                }
            }
            
            // Try silent connection if not restored from localStorage
            try {
                console.log('Attempting silent wallet connection...');
                const resp = await provider.connect({ onlyIfTrusted: true });
                await this.handleConnection(resp);
                return true;
            } catch (err) {
                console.log('Silent connection failed:', err.message);
                return false;
            }
        } catch (err) {
            console.error('Wallet initialization error:', err);
            return false;
        }
    },

    async connect() {
        try {
            if (!this.provider) {
                this.provider = getProvider();
                if (!this.provider) throw new Error('No wallet provider found');
            }

            const resp = await this.provider.connect();
            await this.handleConnection(resp);
            return true;
        } catch (err) {
            console.error('Wallet connection failed:', err);
            throw err;
        }
    },

    async handleConnection(resp) {
        this.isConnected = true;
        this.publicKey = resp.publicKey.toString();
        await this.updateBalance();
        updateWalletUI(this.publicKey);
        this.saveState();
        console.log('Wallet connected successfully:', this.publicKey);
    },

    async updateBalance() {
        try {
            const balance = await connection.getBalance(new solanaWeb3.PublicKey(this.publicKey));
            this.balance = balance / solanaWeb3.LAMPORTS_PER_SOL;
            if (solBalanceSpan) solBalanceSpan.textContent = `${this.balance.toFixed(2)} SOL`;
            this.saveState(); // Update saved state with new balance
            return this.balance;
        } catch (err) {
            console.error('Error fetching balance:', err);
            return 0;
        }
    },

    saveState() {
        const state = {
            isConnected: this.isConnected,
            publicKey: this.publicKey,
            balance: this.balance,
            timestamp: Date.now()
        };
        localStorage.setItem('walletState', JSON.stringify(state));
        console.log('Wallet state saved to localStorage');
    },

    loadSavedState() {
        try {
            const saved = localStorage.getItem('walletState');
            if (!saved) return null;
            
            const state = JSON.parse(saved);
            // Check if state is recent (within last 24 hours)
            if (Date.now() - state.timestamp > 24 * 3600000) {
                console.log('Saved wallet state expired');
                localStorage.removeItem('walletState');
                return null;
            }
            return state;
        } catch (err) {
            console.error('Error loading wallet state:', err);
            return null;
        }
    },

    async verifyWalletState(state) {
        try {
            const provider = getProvider();
            if (!provider) return false;
            
            // If wallet is already connected
            if (provider.isConnected && provider.publicKey) {
                const currentKey = provider.publicKey.toString();
                return currentKey === state.publicKey;
            }
            
            // Try a silent connection to verify
            try {
                const resp = await provider.connect({ onlyIfTrusted: true });
                return resp.publicKey.toString() === state.publicKey;
            } catch {
                return false;
            }
        } catch (err) {
            console.error('Error verifying wallet state:', err);
            return false;
        }
    },

    disconnect() {
        this.isConnected = false;
        this.publicKey = null;
        this.balance = 0;
        localStorage.removeItem('walletState');
        
        // Try to disconnect from provider
        if (this.provider && this.provider.disconnect) {
            try {
                this.provider.disconnect();
            } catch (err) {
                console.error('Error disconnecting from wallet provider:', err);
            }
        }
        
        if (connectWalletBtn) connectWalletBtn.classList.remove('hidden');
        if (walletConnectedDiv) walletConnectedDiv.classList.add('hidden');
    }
};

// Replace the old connectWallet function with the new one
async function connectWallet() {
    return WalletState.connect();
}

// Update wallet UI
function updateWalletUI(address) {
    const connectBtn = document.getElementById('connect-wallet');
    const walletDiv = document.getElementById('wallet-connected');
    const addressSpan = document.getElementById('wallet-address');
    
    if (connectBtn) connectBtn.classList.add('hidden');
    if (walletDiv) walletDiv.classList.remove('hidden');
    if (addressSpan) addressSpan.textContent = `${address.slice(0, 4)}...${address.slice(-4)}`;
}

// Function to create room element
function createRoomElement(room) {
    console.log('Creating room element for:', room);
    const roomElement = document.createElement('div');
    roomElement.className = 'room-item';
    roomElement.innerHTML = `
        <div class="room-info">
            <h3>${getGameName(room.gameType)}</h3>
            <p>Wager: ${room.wagerAmount} SOL</p>
            <p>Creator: ${room.creator ? `${room.creator.slice(0, 4)}...${room.creator.slice(-4)}` : 'Unknown'}</p>
            <p>Turn Timer: ${room.turnTimer}s</p>
            <p>Rounds: ${room.totalRounds}</p>
            <p class="room-time">${formatTimeAgo(room.createdAt)}</p>
        </div>
        <button class="neon-button join-game-btn" onclick="joinRoom('${room.id}')">
            Join Game
        </button>
    `;
    return roomElement;
}

// Function to check wallet connection
function isWalletConnected() {
    return WalletState.isConnected;
}

// Make functions globally available
window.createRoomElement = createRoomElement;
window.isWalletConnected = isWalletConnected;

// Update the createRoom function to validate SOL balance and process payment
async function createRoom(gameType, wagerAmount, turnTimer, totalRounds) {
    try {
        console.log('Creating room with params:', { gameType, wagerAmount, turnTimer, totalRounds });

        // Check wallet connection
        if (!WalletState.isConnected) {
            alert('Please connect your wallet first');
            return;
        }

        // Validate parameters
        if (!gameType || !wagerAmount || !turnTimer || !totalRounds) {
            console.error('Missing required parameters:', { gameType, wagerAmount, turnTimer, totalRounds });
            alert('Please fill in all required fields');
            return;
        }

        // Parse values
        const wagerAmountValue = parseFloat(wagerAmount);
        const turnTimerValue = parseInt(turnTimer);
        const totalRoundsValue = parseInt(totalRounds);

        // Validate values
        if (isNaN(wagerAmountValue) || wagerAmountValue <= 0) {
            alert('Please enter a valid wager amount');
            return;
        }

        if (isNaN(turnTimerValue) || turnTimerValue < 10) {
            alert('Please enter a valid turn timer (minimum 10 seconds)');
            return;
        }

        if (isNaN(totalRoundsValue) || totalRoundsValue < 1) {
            alert('Please enter a valid number of rounds');
            return;
        }

        // Make sure balance is up-to-date
        await WalletState.updateBalance();
        console.log('Current balance:', WalletState.balance);
        
        if (WalletState.balance < wagerAmountValue) {
            alert(`Insufficient SOL balance. You have ${WalletState.balance.toFixed(2)} SOL but need ${wagerAmountValue} SOL for this wager.`);
            return;
        }

        // Initialize Firebase if not already initialized
        console.log('Ensuring Firebase is initialized...');
        await firebaseManager.initialize();

        // Create payment handler if not already created
        console.log('Initializing payment handler...');
        if (!window.paymentHandler) {
            window.paymentHandler = new SolanaPaymentHandler();
            await window.paymentHandler.init();
        }
        
        // Show payment processing UI
        showPaymentProcessingModal(`Processing payment of ${wagerAmountValue} SOL`);
        
        // Process payment to the central wallet
        console.log('Processing payment...');
        const paymentResult = await window.paymentHandler.sendWager(wagerAmountValue, 'new-room', gameType);
        
        if (!paymentResult.success) {
            console.error('Payment failed:', paymentResult.error);
            hidePaymentProcessingModal();
            alert(`Payment failed: ${paymentResult.error || 'Unknown error'}`);
            return;
        }
        
        // Payment was successful, now create the room in Firebase
        console.log('Payment successful, creating room in Firebase...');
        const roomData = {
            gameType,
            wagerAmount: wagerAmountValue,
            turnTimer: turnTimerValue,
            totalRounds: totalRoundsValue,
            creator: WalletState.publicKey,
            createdAt: Date.now(),
            status: 'waiting',
            paymentTx: paymentResult.signature,
            payments: {
                [WalletState.publicKey]: {
                    amount: wagerAmountValue,
                    tx: paymentResult.signature,
                    timestamp: Date.now()
                }
            }
        };

        console.log('Creating room with data:', roomData);
        const roomId = await firebaseManager.addRoom(roomData);
        console.log('Room created with ID:', roomId);
        
        // Update the payment processing modal to show success
        updatePaymentProcessingModal('Payment successful! Redirecting to game...');
        
        // Close the modal after a short delay
        setTimeout(() => {
            hidePaymentProcessingModal();
            closeCreateRoomModal();
            
            // Redirect to game page
            window.location.href = `/game.html?game=${gameType}&room=${roomId}`;
        }, 1500);
    } catch (error) {
        console.error('Error creating room:', error);
        hidePaymentProcessingModal();
        alert(`Failed to create room: ${error.message}`);
    }
}

// Update the joinRoom function
const joinRoom = async (roomId) => {
    if (!WalletState.isConnected) {
        alert('Please connect your wallet first!');
        return;
    }

    try {
        // Get room data
        const roomsRef = await firebaseManager.getRoomsRef();
        const snapshot = await roomsRef.child(roomId).once('value');
        const room = snapshot.val();
        
        if (!room) {
            alert('Room not found!');
            return;
        }
        
        if (room.status !== 'waiting') {
            alert('This room is no longer available!');
            return;
        }
        
        if (room.creator === WalletState.publicKey) {
            alert('You cannot join your own room!');
            return;
        }
        
        // Update wallet balance
        await WalletState.updateBalance();
        
        // Verify player has enough SOL for wager
        if (WalletState.balance < room.wagerAmount) {
            alert('Insufficient SOL balance to match the wager!');
            return;
        }
        
        // Create payment handler if not already created
        if (!window.paymentHandler) {
            window.paymentHandler = new SolanaPaymentHandler();
            await window.paymentHandler.init();
        }
        
        // Show payment processing UI
        showPaymentProcessingModal(`Processing payment of ${room.wagerAmount} SOL`);
        
        // Process payment to the central wallet
        const paymentResult = await window.paymentHandler.sendWager(
            room.wagerAmount, 
            roomId, 
            room.gameType
        );
        
        if (!paymentResult.success) {
            hidePaymentProcessingModal();
            alert(`Payment failed: ${paymentResult.error || 'Unknown error'}`);
            return;
        }
        
        // Payment was successful, now update the room in Firebase
        const updatedPayments = room.payments || {};
        updatedPayments[WalletState.publicKey] = {
            amount: room.wagerAmount,
            tx: paymentResult.signature,
            timestamp: Date.now()
        };
        
        // Update room status
        await roomsRef.child(roomId).update({
            status: 'playing',
            challenger: WalletState.publicKey,
            joinedAt: Date.now(),
            payments: updatedPayments
        });
        
        // Update the payment processing modal to show success
        updatePaymentProcessingModal('Payment successful! Joining game...');
        
        // Redirect after a short delay
        setTimeout(() => {
            hidePaymentProcessingModal();
            // Redirect to game room
            window.location.href = `/game.html?game=${room.gameType}&room=${roomId}`;
        }, 1500);
        } catch (err) {
        console.error('Error joining room:', err);
        hidePaymentProcessingModal();
        alert('Failed to join room. Please try again.');
    }
};

// Function to cancel game
const cancelGame = async () => {
    const params = new URLSearchParams(window.location.search);
    const roomId = params.get('room');
    
    try {
        // Use firebaseManager to delete the room instead of direct roomsRef reference
        await firebaseManager.deleteRoom(roomId);
        window.location.href = 'index.html';
    } catch (err) {
        console.error('Error canceling game:', err);
        alert('Failed to cancel game. Please try again.');
    }
};

// Make functions globally available after they are defined
window.joinRoom = joinRoom;
window.createRoom = createRoom;
window.cancelGame = cancelGame;
window.updateRoomsList = initializeRoomsList;

// Event listeners
if (gameFilter) gameFilter.addEventListener('change', initializeRoomsList);
if (wagerFilter) wagerFilter.addEventListener('input', initializeRoomsList);
if (createRoomForm) {
    createRoomForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submitted');
        
        try {
            const gameType = document.getElementById('game-type').value;
            const wagerAmount = document.getElementById('wager-amount').value;
            const turnTimer = document.getElementById('turn-timer').value;
            const totalRounds = document.getElementById('total-rounds').value;
            
            console.log('Form values:', { gameType, wagerAmount, turnTimer, totalRounds });
            
            if (!gameType || !wagerAmount || !turnTimer || !totalRounds) {
                console.error('Missing form values');
                alert('Please fill in all required fields');
                return;
            }
            
            await createRoom(gameType, wagerAmount, turnTimer, totalRounds);
        } catch (error) {
            console.error('Error in form submission:', error);
            alert(`Error creating room: ${error.message}`);
        }
    });
}
if (cancelCreateBtn) cancelCreateBtn.addEventListener('click', closeCreateRoomModal);

// Update initializeGameRoom function to handle player synchronization
async function initializeGameRoom() {
    console.log('Starting game room initialization...');
    
    // Get room ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    
    if (!roomId) {
        console.error('No room ID provided');
        window.location.href = '/';
        return;
    }
    
    try {
        // Initialize wallet state
        console.log('Initializing wallet state...');
        await WalletState.initialize();
        
        // Get room data
        console.log('Getting room data for:', roomId);
        const room = await firebaseManager.getRoom(roomId);
        
        if (!room) {
            console.error('Room not found');
            window.location.href = '/';
            return;
        }
        
        console.log('Room found:', room);
        
        // Initialize game type
        console.log('Initializing game type:', room.gameType);
        const game = initializeGameType(room.gameType, room);
        
        if (!game) {
            console.error('Failed to initialize game');
            return;
        }
        
        // Initialize the game with the creator's address
        const currentWallet = WalletState.publicKey;
        const isCreator = currentWallet === room.creator;
        
        console.log('Initializing game with:', {
            creator: room.creator,
            challenger: room.challenger,
            currentWallet,
            isCreator
        });
        
        // Initialize the game with both creator and challenger (if exists)
        await game.initialize(room.creator, room.challenger);
        
        // Update game controls based on player role
        updateGameControls(game, room);
        
        // Set up real-time updates
        setupRealtimeUpdates(game, room);
        
    } catch (error) {
        console.error('Error initializing game room:', error);
        showError('Failed to initialize game room. Please try again.');
    }
}

function initializeGameType(gameType, room) {
    console.log('Initializing game type:', gameType, 'with room data:', room);
    
    switch (gameType) {
        case 'tictactoe':
            return new TicTacToe(
                room.id,
                room.wagerAmount,
                room.totalRounds || 3,
                room.turnTimer
            );
        // Add other game types here
        default:
            console.error('Unknown game type:', gameType);
            return null;
    }
}

// Function to update game controls based on game state
function updateGameControls(game, room) {
    console.log('Updating game controls with:', {
        creator: room.creator,
        challenger: room.challenger,
        currentPlayer: WalletState.publicKey,
        isCreator: room.creator === WalletState.publicKey,
        isChallenger: room.challenger === WalletState.publicKey
    });
    
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) return;
    
    // Remove existing controls
    const existingControls = document.querySelector('.game-controls');
    if (existingControls) {
        existingControls.remove();
    }
    
    // Add new controls
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'game-controls';
    
    if (!WalletState.isConnected) {
        game.setStatus('Connect wallet to play');
        controlsDiv.innerHTML = `
            <button class="neon-button" onclick="connectWallet()">Connect Wallet</button>
            <button class="neon-button-secondary" onclick="window.location.href='index.html'">Back to Home</button>
        `;
    } else if (room.creator === WalletState.publicKey) {
        if (room.challenger) {
            // Creator with challenger present
            game.setStatus('Game in progress');
            controlsDiv.innerHTML = `
                <button class="neon-button-secondary" onclick="window.location.href='index.html'">Back to Home</button>
            `;
            } else {
            // Creator waiting for challenger
            game.setStatus('Waiting for challenger to join...');
            controlsDiv.innerHTML = `
                <button class="neon-button-danger" onclick="cancelGame()">Cancel Game</button>
                <button class="neon-button-secondary" onclick="window.location.href='index.html'">Back to Home</button>
            `;
        }
    } else if (room.challenger === WalletState.publicKey) {
        // Player is challenger
        game.setStatus('Game in progress');
        controlsDiv.innerHTML = `
            <button class="neon-button-secondary" onclick="window.location.href='index.html'">Back to Home</button>
        `;
    } else if (!room.challenger) {
        // Not creator, not challenger, and no challenger yet
        game.setStatus('Join this game');
        controlsDiv.innerHTML = `
            <button class="neon-button" onclick="joinCurrentRoom()">Join Game</button>
            <button class="neon-button-secondary" onclick="window.location.href='index.html'">Back to Home</button>
        `;
    } else {
        // Spectator mode (not creator or challenger, but challenger exists)
        game.setStatus('Game in progress (spectator mode)');
        controlsDiv.innerHTML = `
            <button class="neon-button-secondary" onclick="window.location.href='index.html'">Back to Home</button>
        `;
    }
    
    gameContainer.appendChild(controlsDiv);
}

// Helper function to join the current room
async function joinCurrentRoom() {
    const params = new URLSearchParams(window.location.search);
    const roomId = params.get('room');
    if (roomId) {
        await joinRoom(roomId);
    }
}

// Make joinCurrentRoom available globally
window.joinCurrentRoom = joinCurrentRoom;

// Helper function to load game scripts
function loadGameScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
}

// Make sure TicTacToe class is loaded before initializing game
async function ensureGameScriptsLoaded() {
    try {
        console.log('Checking for game scripts...');
        if (typeof TicTacToe === 'undefined') {
            console.log('Loading TicTacToe game script...');
            await loadGameScript('js/games/tictactoe.js');
            console.log('TicTacToe game script loaded successfully');
        } else {
            console.log('TicTacToe game script already loaded');
        }
    } catch (err) {
        console.error('Error loading game scripts:', err);
        throw new Error('Failed to load required game scripts');
    }
}

// Request test SOL from devnet with fallback options
const requestTestSol = async () => {
    if (!walletConnected) {
        alert('Please connect your wallet first!');
        return;
    }

    const requestSolBtn = document.getElementById('request-sol');
    const originalText = requestSolBtn.textContent;
    requestSolBtn.textContent = 'Requesting...';
    requestSolBtn.disabled = true;

    try {
        const publicKey = window.solana.publicKey;
        let success = false;
        let attempts = 0;
        const maxAttempts = 3;

        while (!success && attempts < maxAttempts) {
            try {
                attempts++;
                requestSolBtn.textContent = `Requesting... (Attempt ${attempts}/${maxAttempts})`;

                // Try different amounts for better success rate
                const solAmount = (4 - attempts) * solanaWeb3.LAMPORTS_PER_SOL;
                const airdropSignature = await connection.requestAirdrop(
                    publicKey,
                    solAmount
                );

                // Wait for confirmation with timeout
                const confirmation = await Promise.race([
                    connection.confirmTransaction(airdropSignature),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout')), 20000)
                    )
                ]);

                if (confirmation?.value?.err) {
                    throw new Error('Transaction failed');
                }

                success = true;
                await fetchBalance(publicKey);
                
                // Calculate received amount
                const receivedAmount = (4 - attempts);
                const errorDiv = document.getElementById('airdrop-error');
                errorDiv.innerHTML = `
                    ✓ Successfully received ${receivedAmount} test SOL!<br>
                    You can request again in a few minutes.
                `;
                errorDiv.style.background = 'rgba(20, 241, 149, 0.1)';
                errorDiv.style.borderColor = 'var(--secondary)';
                errorDiv.style.color = 'var(--secondary)';
                errorDiv.classList.add('active');
                
                // Auto-hide success message after 5 seconds
                setTimeout(() => {
                    errorDiv.classList.remove('active');
                    // Reset styles
                    errorDiv.style.background = '';
                    errorDiv.style.borderColor = '';
                    errorDiv.style.color = '';
                }, 5000);
                break;
            } catch (err) {
                console.error(`Attempt ${attempts} failed:`, err);
                if (attempts === maxAttempts) {
                    throw new Error('All attempts failed');
                }
                // Wait before next attempt
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    } catch (err) {
        console.error('Error requesting test SOL:', err);
        const errorDiv = document.getElementById('airdrop-error');
        errorDiv.innerHTML = `
            Failed to request test SOL. Try these alternatives:<br>
            <a href="https://solfaucet.com" target="_blank">• Use Solana Faucet</a><br>
            <a href="https://discord.gg/solana" target="_blank">• Join Solana Discord</a><br>
            Or wait a few minutes and try again.
        `;
        errorDiv.classList.add('active');
        
        // Auto-hide error after 10 seconds
        setTimeout(() => {
            errorDiv.classList.remove('active');
        }, 10000);
    } finally {
        requestSolBtn.textContent = originalText;
        requestSolBtn.disabled = false;
    }
};

const fetchBalance = async (publicKey) => {
    try {
        const balance = await connection.getBalance(publicKey);
        solBalanceSpan.textContent = `${(balance / solanaWeb3.LAMPORTS_PER_SOL).toFixed(2)} SOL`;
    } catch (err) {
        console.error('Error fetching balance:', err);
        solBalanceSpan.textContent = '0 SOL';
    }
};

// Leaderboard Management
const updateLeaderboard = (tab = 'weekly') => {
    const data = leaderboardData[tab];
    const leaderboardList = document.querySelector(`#${tab}-leaderboard .leaderboard-list`);
    
    if (!leaderboardList) return;
    
    leaderboardList.innerHTML = data.map(item => `
        <div class="leaderboard-item">
            <span class="rank">#${item.rank}</span>
            <span class="player">${item.player}</span>
            <span class="wins">${item.wins} wins</span>
            <span class="wagered">${item.wagered} SOL</span>
        </div>
    `).join('');
};

const switchLeaderboardTab = (tab) => {
    // Update active tab button
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.toggle('active', button.dataset.tab === tab);
    });
    
    // Update active content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tab}-leaderboard`);
    });
    
    currentLeaderboardTab = tab;
    updateLeaderboard(tab);
};

// Initialize leaderboard
document.addEventListener('DOMContentLoaded', () => {
    // Set up tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            switchLeaderboardTab(button.dataset.tab);
        });
    });
    
    // Initialize with weekly data
    updateLeaderboard('weekly');
});

// Event Listeners
connectWalletBtn.addEventListener('click', connectWallet);
// Clear error when requesting again
document.getElementById('request-sol').addEventListener('click', () => {
    const errorDiv = document.getElementById('airdrop-error');
    errorDiv.classList.remove('active');
    requestTestSol();
});
cancelCreateBtn.addEventListener('click', closeCreateRoomModal);

// Help modal functionality
const helpIcon = document.querySelector('.help-icon');
const helpContent = document.querySelector('.help-content');
const closeHelpBtn = document.querySelector('.close-help');
const helpOverlay = document.querySelector('.help-overlay');

if (helpIcon && helpContent && helpOverlay) {
    let isHelpVisible = false;

    const showHelp = () => {
        isHelpVisible = true;
        helpContent.classList.add('active');
        helpOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Ensure focus is trapped in modal for accessibility
        closeHelpBtn.focus();
    };

    const hideHelp = () => {
        isHelpVisible = false;
        helpContent.classList.remove('active');
        helpOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to trigger element
        helpIcon.focus();
    };

    helpIcon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showHelp();
    });

    closeHelpBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        hideHelp();
    });

    // Keep help content visible when interacting with it
    helpContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Close help when clicking overlay
    helpOverlay.addEventListener('click', hideHelp);

    // Close help on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isHelpVisible) {
            hideHelp();
        }
    });

    // Add ARIA attributes for accessibility
    helpIcon.setAttribute('aria-label', 'Open help for getting test SOL');
    helpIcon.setAttribute('role', 'button');
    helpContent.setAttribute('role', 'dialog');
    helpContent.setAttribute('aria-modal', 'true');
    helpContent.setAttribute('aria-labelledby', 'help-title');
}

// Game card event listeners
gameCards.forEach(card => {
    const createBtn = card.querySelector('.create-btn');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            selectedGame = card.dataset.game;
            document.getElementById('game-type').value = selectedGame;
            showCreateRoomModal(selectedGame);
        });
    }
});

// Remove click handler from game cards since we now have buttons
gameCards.forEach(card => {
    card.style.cursor = 'default';
});

// CSS Styles for Room Items
const style = document.createElement('style');
style.textContent = `
    .room-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        margin-bottom: 1rem;
        background: rgba(153, 69, 255, 0.1);
        border: 1px solid var(--primary);
        border-radius: 4px;
    }
    
    .room-info h3 {
        color: var(--secondary);
        margin-bottom: 0.5rem;
    }
    
    .room-info p {
        color: var(--text-secondary);
        margin: 0.25rem 0;
    }
    
    .text-secondary {
        color: var(--text-secondary);
        text-align: center;
        padding: 2rem;
    }
`;
document.head.appendChild(style);

// Add styles for waiting screen
const waitingScreenStyles = document.createElement('style');
waitingScreenStyles.textContent = `
    .waiting-screen {
        text-align: center;
        padding: 2rem;
        max-width: 600px;
        margin: 0 auto;
    }

    .waiting-screen h2 {
        color: var(--secondary);
        margin-bottom: 1.5rem;
    }

    .game-link {
        display: flex;
        gap: 1rem;
        margin: 1.5rem 0;
        justify-content: center;
    }

    .game-link input {
        flex: 1;
        max-width: 400px;
        padding: 0.5rem;
        background: rgba(153, 69, 255, 0.1);
        border: 1px solid var(--primary);
        color: var(--text);
        border-radius: 4px;
    }

    .game-info {
        margin: 2rem 0;
        padding: 1rem;
        background: rgba(153, 69, 255, 0.1);
        border: 1px solid var(--primary);
        border-radius: 4px;
    }

    .game-info p {
        margin: 0.5rem 0;
        color: var(--text-secondary);
    }
`;
document.head.appendChild(waitingScreenStyles);

// Add styles for room items
const roomStyles = document.createElement('style');
roomStyles.textContent = `
    .room-time {
        font-size: 0.8em;
        color: var(--text-secondary);
        opacity: 0.8;
    }
`;
document.head.appendChild(roomStyles);

// Add styles for game controls
const gameControlsStyles = document.createElement('style');
gameControlsStyles.textContent = `
    .game-controls {
        display: flex;
        justify-content: center;
        margin-top: 2rem;
        gap: 1rem;
    }

    .neon-button {
        background: rgba(153, 69, 255, 0.2);
        color: #ff00ff;
        border: 1px solid #ff00ff;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
        box-shadow: 0 0 10px rgba(255, 0, 255, 0.3);
    }

    .neon-button:hover {
        background: rgba(255, 0, 255, 0.2);
        box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
        transform: translateY(-2px);
    }

    .neon-button:active {
        transform: translateY(0);
    }

    .neon-button-secondary {
        background: rgba(0, 255, 255, 0.1);
        color: #00ffff;
        border: 1px solid #00ffff;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
    }

    .neon-button-secondary:hover {
        background: rgba(0, 255, 255, 0.2);
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        transform: translateY(-2px);
    }

    .neon-button-secondary:active {
        transform: translateY(0);
    }

    .neon-button-danger {
        background: rgba(255, 0, 68, 0.1);
        color: #ff0044;
        border: 1px solid #ff0044;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
        box-shadow: 0 0 10px rgba(255, 0, 68, 0.3);
    }

    .neon-button-danger:hover {
        background: rgba(255, 0, 68, 0.2);
        box-shadow: 0 0 20px rgba(255, 0, 68, 0.5);
        transform: translateY(-2px);
    }

    .neon-button-danger:active {
        transform: translateY(0);
    }

    .neon-button:disabled,
    .neon-button-secondary:disabled,
    .neon-button-danger:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
`;
document.head.appendChild(gameControlsStyles);

// Add styles for game view and connect prompt
const gameViewStyles = document.createElement('style');
gameViewStyles.textContent = `
    .game-view {
        text-align: center;
        padding: 2rem;
        max-width: 600px;
        margin: 0 auto;
    }

    .game-view .game-header {
        margin-bottom: 2rem;
    }

    .game-view .game-header h2 {
        color: var(--secondary);
        margin-bottom: 1rem;
    }

    .game-view .game-info {
        background: rgba(153, 69, 255, 0.1);
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid var(--primary);
    }

    .game-view .game-info p {
        margin: 0.5rem 0;
        color: var(--text-secondary);
    }

    .connect-prompt {
        margin: 3rem 0;
        padding: 2rem;
        background: rgba(153, 69, 255, 0.05);
        border-radius: 8px;
        border: 1px solid var(--primary);
    }

    .connect-prompt p {
        margin-bottom: 1.5rem;
        color: var(--text);
        font-size: 1.2rem;
    }
`;
document.head.appendChild(gameViewStyles);

// CSS Styles for Game Cards
const gameCardStyles = document.createElement('style');
gameCardStyles.textContent = `
    .game-card {
        background: rgba(153, 69, 255, 0.05);
        border: 1px solid var(--primary);
        border-radius: 8px;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1rem;
        transition: all 0.3s ease;
    }

    .game-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(153, 69, 255, 0.2);
    }

    .game-card h3 {
        color: var(--secondary);
        margin: 0;
        font-size: 1.2rem;
    }

    .game-card p {
        color: var(--text-secondary);
        margin: 0.5rem 0;
        font-size: 0.9rem;
    }

    .create-btn {
        width: 100%;
        padding: 0.75rem;
        font-size: 1rem;
        margin-top: auto;
    }
`;
document.head.appendChild(gameCardStyles);

// Add modal styles to ensure visibility
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal {
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
    }

    .modal.hidden {
        display: none;
    }

    .modal-content {
        background: var(--background);
        padding: 2rem;
        border-radius: 8px;
        border: 1px solid var(--primary);
        max-width: 400px;
        width: 90%;
    }

    .modal-content h2 {
        color: var(--secondary);
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text);
    }

    .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }
`;
document.head.appendChild(modalStyles);

// Update setupPresetButtons function
function setupPresetButtons() {
    console.log('Setting up preset buttons...');
    const presetGroups = document.querySelectorAll('.preset-buttons');
    
    presetGroups.forEach(group => {
        const buttons = group.querySelectorAll('.preset-btn');
        const firstButton = buttons[0];
        const targetId = firstButton?.dataset?.target;
        const targetInput = document.getElementById(targetId);
        const customInput = group.parentElement.querySelector('.custom-input');
        
        console.log('Found preset group:', {
            targetId,
            hasTargetInput: !!targetInput,
            hasCustomInput: !!customInput,
            buttonCount: buttons.length
        });

        // Set initial state - first button active
        if (firstButton && targetInput) {
            firstButton.classList.add('active');
            targetInput.value = firstButton.dataset.value;
            if (customInput) customInput.classList.add('hidden');
        }
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Preset button clicked:', button.dataset);
                
                // Remove active class from all buttons in this group
                buttons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                if (button.classList.contains('custom-btn')) {
                    // Show custom input
                    if (customInput) {
                        customInput.classList.remove('hidden');
                        customInput.focus();
                        // Set the target input to the custom input's current value
                        if (targetInput && customInput.value) {
                            targetInput.value = customInput.value;
                        }
                    }
                } else {
                    // Hide custom input and set preset value
                    if (customInput) customInput.classList.add('hidden');
                    if (targetInput) targetInput.value = button.dataset.value;
                }
            });
        });

        // Handle custom input changes
        if (customInput && targetInput) {
            customInput.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                const min = parseInt(customInput.min) || 0;
                const max = parseInt(customInput.max) || 999;
                
                if (!isNaN(value) && value >= min && value <= max) {
                    targetInput.value = value;
                }
            });
        }
    });
}

// Update DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // ... existing initialization code ...

    // Setup preset buttons if we're on the create room page
    const createRoomModal = document.getElementById('create-room-modal');
    if (createRoomModal) {
        setupPresetButtons();
        
        // Add event listener for modal show
        document.querySelectorAll('.create-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const gameType = btn.closest('.game-card').dataset.game;
                showCreateRoomModal(gameType);
            });
        });
    }
});

// Payment processing modal functions
function showPaymentProcessingModal(message) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('payment-processing-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'payment-processing-modal';
        modal.className = 'modal payment-modal';
        modal.innerHTML = `
            <div class="modal-content payment-modal-content">
                <div class="payment-header">
                    <h2>Processing Payment</h2>
                </div>
                <div class="payment-body">
                    <div class="spinner"></div>
                    <p id="payment-message">${message}</p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add styles if not already added
        if (!document.getElementById('payment-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'payment-modal-styles';
            style.textContent = `
                .payment-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                    animation: fadeIn 0.3s ease;
                }
                
                .payment-modal-content {
                    background: var(--bg-secondary);
                    border-radius: 12px;
                    padding: 2rem;
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 0 0 30px rgba(153, 69, 255, 0.3);
                    border: 2px solid var(--accent);
                }
                
                .payment-header {
                    margin-bottom: 1.5rem;
                }
                
                .payment-header h2 {
                    color: var(--accent);
                    margin: 0;
                }
                
                .payment-body {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                }
                
                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid rgba(153, 69, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: var(--accent);
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
                
                #payment-message {
                    font-size: 1.2rem;
                    color: var(--text);
                }
            `;
            document.head.appendChild(style);
        }
    } else {
        document.getElementById('payment-message').textContent = message;
        modal.classList.remove('hidden');
    }
}

function updatePaymentProcessingModal(message) {
    const messageEl = document.getElementById('payment-message');
    if (messageEl) {
        messageEl.textContent = message;
    }
}

function hidePaymentProcessingModal() {
    const modal = document.getElementById('payment-processing-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function setupRealtimeUpdates(game, room) {
    console.log('Setting up real-time updates for room:', room.id);
    
    try {
        // Get reference to the room in Firebase
        const roomRef = firebase.database().ref(`rooms/${room.id}`);
        
        // Listen for room updates
        roomRef.on('value', (snapshot) => {
            try {
                const updatedRoom = snapshot.val();
                if (!updatedRoom) {
                    console.log('Room no longer exists');
                    window.location.href = '/';
                    return;
                }
                
                console.log('Room updated:', updatedRoom);
                
                // Handle challenger joining
                if (updatedRoom.challenger && !room.challenger) {
                    console.log('Challenger joined:', updatedRoom.challenger);
                    room.challenger = updatedRoom.challenger;
                    game.initialize(room.creator, updatedRoom.challenger);
                }
                
                // Handle game state updates
                if (updatedRoom.gameState) {
                    console.log('Updating game state:', updatedRoom.gameState);
                    
                    // Use the game's syncGameState method to handle all state updates
                    game.syncGameState(updatedRoom.gameState);
                    
                    // Update game controls if needed
                    updateGameControls(game, updatedRoom);
                }
            } catch (error) {
                console.error('Error processing room update:', error);
                alert('Error updating game state. Please refresh the page.');
            }
        }, (error) => {
            console.error('Firebase subscription error:', error);
            alert('Lost connection to the game. Please refresh the page.');
        });
    } catch (error) {
        console.error('Error setting up real-time updates:', error);
        alert('Failed to connect to the game. Please refresh the page.');
    }
}

// Helper function to show error messages
function showError(message) {
    console.error(message);
    alert(message);
}
