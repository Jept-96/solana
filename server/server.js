require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const gameHandlers = require('./socket/gameHandler');

// Initialize Express app and Socket.io
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
cors: {
origin: "*", // Update this in production
methods: ["GET", "POST"]
}
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
useNewUrlParser: true,
useUnifiedTopology: true
}).then(() => {
console.log('Connected to MongoDB');
}).catch(err => {
console.error('MongoDB connection error:', err);
});

// Socket.IO Connection Handler
io.on('connection', (socket) => {
console.log('User connected:', socket.id);
    
    // Initialize game handlers
    gameHandlers(io, socket);

    // Chat Message handler
    socket.on('sendMessage', (data) => {
        const { roomId, message, sender } = data;
        io.to(roomId).emit('newMessage', { message, sender });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Basic Routes
app.get('/health', (req, res) => {
res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
