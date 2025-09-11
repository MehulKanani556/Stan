import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './src/config/db.js';
import indexRouter from './src/routes/indexRoutes.js';
import http from 'http';
import { Server } from 'socket.io';
import socketManager from "./src/socketManager/SocketManager.js";
// import cluster from "cluster";
// import os from "os";

// const numCPUs = os.cpus().length;

// if (cluster.isPrimary) {
//   console.log(`Master ${process.pid} is running`);
//   console.log(`Forking for ${numCPUs} CPUs`);

//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died`);
//     console.log("Starting a new worker...");
//     cluster.fork();
//   });
// } else {
//   const app = express();
const app = express();
  // Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins to access the API.
    // This function dynamically sets the Access-Control-Allow-Origin header
    // to the requesting origin, which is compatible with `credentials: true`.
    callback(null, true);
  },
  credentials: true
}));

app.use('/public', express.static('public'));

// Routes
app.use("/api", indexRouter);

// Create server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
});

// Socket manager
socketManager.initializeSocket(io);

// DB connection
connectDB();

//   const PORT = process.env.PORT || 5000;
//   server.listen(PORT, () => {
//     console.log(`Worker ${process.pid} running server + Socket.IO on port ${PORT}`);
//   });
// }
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server + Socket.IO running on port ${PORT}`);
});