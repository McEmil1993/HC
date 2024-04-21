
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust as per your client's origin for security in production
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join specific ticket room
  socket.on('joinRoom', (ticketId) => {
    console.log(`User ${socket.id} joined ticket: ${ticketId}`);
    socket.join(ticketId);
  });

  // Admin sends a reply
  socket.on('adminReply', (data) => {
    console.log('Admin reply:', data);
    io.to(data.ticketId).emit('updateTicketAdmin', data); // Emit to a specific ticket room
  });

  // Customer sends a reply
  socket.on('customerReply', (data) => {
    console.log('Customer reply:', data);
    io.to(data.ticketId).emit('updateTicketCustomer', data); // Emit to a specific ticket room
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://195.35.9.171:${PORT}`);
});