const Room = require('../models/Room');

const gameHandlers = (io, socket) => {
    const handleJoinRoom = async (data) => {
        const { roomId, playerAddress } = data;
        try {
            const room = await Room.findOne({ roomId });
            if (!room) {
                socket.emit('error', { message: 'Room not found' });
                return;
            }

            if (room.gameState.status !== 'waiting') {
                socket.emit('error', { message: 'Game already started' });
                return;
            }

            socket.join(roomId);
            
            room.players.opponent = {
                address: playerAddress,
                connected: true,
                socketId: socket.id,
                lastActive: new Date()
            };
            room.gameState.status = 'playing';
            room.gameState.startedAt = new Date();
            room.gameState.currentTurn = room.players.creator.address;
            await room.save();

            io.to(roomId).emit('gameStart', { room });
            io.emit('roomsList', await Room.find({ 'gameState.status': 'waiting' }));
        } catch (err) {
            console.error('Error joining room:', err);
            socket.emit('error', { message: 'Failed to join room' });
        }
    };

    const handleMove = async (data) => {
        const { roomId, move, playerAddress } = data;
        try {
            const room = await Room.findOne({ roomId });
            if (!room) {
                socket.emit('error', { message: 'Room not found' });
                return;
            }

            if (room.gameState.status !== 'playing') {
                socket.emit('error', { message: 'Game not in progress' });
                return;
            }

            if (room.gameState.currentTurn !== playerAddress) {
                socket.emit('error', { message: 'Not your turn' });
                return;
            }

            // Update game state with the move
            room.gameState.moves.push({
                player: playerAddress,
                position: move.position,
                timestamp: new Date()
            });

            // Update board state
            if (!room.gameState.board) {
                room.gameState.board = Array(9).fill('');
            }
            room.gameState.board[move.position] = playerAddress;

            // Switch turns
            room.gameState.currentTurn = 
                room.gameState.currentTurn === room.players.creator.address 
                    ? room.players.opponent.address 
                    : room.players.creator.address;

            await room.save();
            io.to(roomId).emit('moveMade', { room });
        } catch (err) {
            console.error('Error processing move:', err);
            socket.emit('error', { message: 'Failed to process move' });
        }
    };

    // Initialize socket event listeners
    socket.on('joinRoom', handleJoinRoom);
    socket.on('makeMove', handleMove);

    return {
        handleJoinRoom,
        handleMove
    };
};

module.exports = gameHandlers;
