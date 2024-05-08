import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './Routers/auth.routes.js'
import connectToMongoDB from './db/connectToMongoDB.js';
import messageRoutes from './Routers/message.routes.js';
import userRoutes from './Routers/user.routes.js';
import cookieParser from 'cookie-parser';
import {app, server} from './socket/socket.js';
import path from 'path'

const port = process.env.PORT || 5000
const __dirname = path.resolve();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

// app.get('/' , (req,res) => {
//     res.send('HEllo World');
// })

app.use('/api/auth' , authRoutes);
app.use('/api/messages' , messageRoutes);
app.use('/api/user' , userRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get('*' , (req, res) => {
    res.sendFile(path.join(__dirname , "frontend" , "dist" , "index.html"));
})


server.listen(port, () => {
    connectToMongoDB();
    console.log(`App is running on port ${port}`);
})