import express from 'express';
import http from 'http';
import {Server} from 'socket.io';

import restRoutes from "./routes/rest.routes";

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: process.env.BASE_URL, // replace with your Angular app's domain
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

app.use(function (req, res,next){
    res.setHeader('Access-Control-Allow-Origin',process.env.BASE_URL);

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    res.setHeader('Access-Control-Allow-Credentials', 1);

    next();
});

app.use('/', restRoutes);