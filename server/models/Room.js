const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
roomId: {
type: String,
required: true,
unique: true
},
gameType: {
type: String,
required: true,
enum: ['tictactoe', 'rps', 'connect4', 'memory', 'wordrace']
},
gameConfig: {
boardSize: {
type: Number,
default: 3  // 3x3 for tic-tac-toe, configurable for other games
},
moveTimer: {
type: Number,
required: true,
enum: [10, 15, 20]  // seconds per move
}
},
wager: {
amount: {
type: Number,
required: true,
min: 0
},
escrowAddress: String,
locked: { type: Boolean, default: false },
transactionId: String
},
players: {
creator: {
address: String,
connected: { type: Boolean, default: true },
lastActive: { type: Date, default: Date.now }
},
opponent: {
address: String,
connected: { type: Boolean, default: false },
lastActive: Date
}
},
gameState: {
status: {
type: String,
enum: ['waiting', 'playing', 'finished', 'cancelled'],
default: 'waiting'
},
board: [String],
currentTurn: String,
moves: [{
player: String,
position: Number,
timestamp: Date
}],
winner: String,
startedAt: Date,
endedAt: Date
},
chat: [{
sender: String,
message: String,
timestamp: { type: Date, default: Date.now }
}],
createdAt: { type: Date, default: Date.now }
});

// Limit chat history to 50 messages
RoomSchema.pre('save', function(next) {
if (this.chat.length > 50) {
this.chat = this.chat.slice(this.chat.length - 50);
}
next();
});

module.exports = mongoose.model('Room', RoomSchema);