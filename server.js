import express from 'express';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import doteve from "dotenv";
doteve.config();

// import cors from 'cors'
import { fileURLToPath } from 'url';
import session from 'express-session'
import mongoose from 'mongoose';

import mainRouter from './routes/index.js';  // master router
mongoose.connect(`${process.env.MONGO_URL}/timetablewithexpress`)
.then(()=>console.log("connected"))
// --- __dirname shim (ESM) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { Socket } from 'dgram';
const app = express();      
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"));

app.use(
  session({
    secret: "vansh004",  // session sign karne ke liye
    resave: false,            // session ko har request pe dubara save na karo
    saveUninitialized: false,  // empty session bhi save karo
    cookie: { maxAge: 24* 60 * 60 * 1000 }// 24 hours session expiry
  })
);
// 
// Middlewares 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//socket
const server = http.createServer(app);
const io = new Server(server);
io.on('connection', (Socket)=>{
     console.log("User connected");

  Socket.on('chatMessage',(msg)=>{
    Socket.broadcast.emit('chatMessage',msg); // send all to expect sender 
  });

  Socket.on('disconnect',()=>{
        console.log(`User disconnected : ${Socket.id}`);
    });

});


// Mount all routes
app.use('/', mainRouter);

server.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});


