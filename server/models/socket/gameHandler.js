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
        
        // Update room with opponent
        room.players.opponent = {
            address: playerAddress,
            connected: true,
            lastActive: new Date()
        };
        room.gameState.status = 'playing';
        room.gameState.startedAt = new Date();
        await room.save();

        io.to(roomId).emit('gameStart', { room });
    } catch (err) {
        console.error('Error joining room:', err);
        socket.emit('error', { message: 'Failed to join room' });
    }
};

const handleMove = async (data) => {
    const { roomId, playerAddress, position } = data;
    try {
        const room = await Room.findOne({ roomId });
        if (!room) {
            socket.emit('error', { message: 'Room not found' });
            return;
        }

        // Validate move
        if (room.gameState.currentTurn !== playerAddress) {
            socket.emit('error', { message: 'Not your turn' });
            return;
        }

        // Update game state
        room.gameState.board[position] = playerAddress;
        room.gameState.moves.push({
            player: playerAddress,
            position,
            timestamp: new Date()
        });

        // Switch turns
        room.gameState.currentTurn = room.gameState.currentTurn === room.players.creator.address 
            ? room.players.opponent.address 
            : room.players.creator.address;

        await room.save();
        io.to(roomId).emit('moveMade', { room });

    } catch (err) {
        console.error('Error making move:', err);
        socket.emit('error', { message: 'Failed to make move' });
    }
};

return {
    handleJoinRoom,
    handleMove
};
};

module.exports = gameHandlers;