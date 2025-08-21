import express from 'express';
import cors from 'cors';
import { connectDB } from './src/config/db.js';
import indexRouter from './src/routes/indexRoutes.js';
import http from 'http';
import { Server } from 'socket.io';
import socketManager from "./src/socketManager/SocketManager.js";
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use('/public', express.static('public'));


// router
app.use("/api", indexRouter)


// Create single HTTP server from Express
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
});

// Make Socket.IO globally accessible
global.io = io;

// Initialize socket manager
socketManager.initializeSocket(io);


// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server + Socket.IO running on port ${PORT}`);
});