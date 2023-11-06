var morgan = require('morgan');
import redisClient from "./utils/redisHelper";
import path from "path";
const config = require("config");
const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");
const cookieParser = require("cookie-parser");

import { NextFunction, Request, Response } from "express";
import eventEmitter from "./utils/event";
import corsOptions from "./utils/corsOptions";

import adminRoute from "./components/admin";
import userRoute from "./components/user";
import locationRoute from "./components/location";
import commonController from "./components/common/commonController";
import agenda from "./utils/schedule";
import { connectionHandler } from "./components/socket/SocketController";
import { Socket } from "socket.io";

/* for prevent crash */
process.on('uncaughtException', (error, origin) => {
    console.log('----- Uncaught exception -----')
    console.log(error)
    console.log('----- Exception origin -----')
    console.log(origin)
})

process.on('unhandledRejection', (reason, promise) => {
    console.log('----- Unhandled Rejection at -----')
    console.log(promise)
    console.log('----- Reason -----')
    console.log(reason)
})

express.application.prefix = express.Router.prefix = function (path: any, configure: any) {
    var router = express.Router();
    this.use(path, router);
    configure(router);
    return router;
};

const app = express()
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// app.use((req: Request, res: Response, next: NextFunction)=>{
//     console.log("enter here ->");
//     console.log("auth is -> ",req.headers.authorization);
// })

app.use(cors(corsOptions))
app.use(cookieParser());

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use('/uploads', express.static(path.join(__dirname, '../uploads/')))
// app.use('/src/uploads',express.static(path.join(__dirname,'uploads/')))

app.use(morgan('dev', { skip: (req: any, res: any) => process.env.NODE_ENV === 'production' }));
app.set('eventEmitter', eventEmitter)

/* API Routes */
app.get("/test", function (req: Request, res: Response, next: NextFunction) {
    res.send("success")
});
/* common image upload */
app.post("/uploadImage/:type", async function (req: Request, res: Response, next: NextFunction) {
    await commonController.uploadImage(req, res, next);
});
// app.post("/uploadPdf", async function (req: Request, res: Response, next: NextFunction) {
//     await commonController.uploadPdf(req, res, next);
// });

app.prefix("/admin", (route: any) => {
    adminRoute(route);
});
app.prefix("/user", (route: any) => {
    userRoute(route);
    locationRoute(route)
});

// var os = require("os");

server.listen(config.get("PORT"), () => {
    // var hostname = os.hostname();
    // console.log({hostname})
    console.log(`⚡️[NodeJs server]: Server is running at http://localhost:${config.get("PORT")}`)
    
    mongoose.connect(
        config.get("DB_CONN_STRING"),
        () => console.log('connected to mongodb.')
    );
    redisClient.on('error', (err: any) => console.log('Redis Client Error', err));
    io.on("connection", (args: Socket) => connectionHandler(io, args));
    agenda.agenda
        .start()
        .then(() => {
            console.log(`⏳ agenda is started`);
        })
        .catch(() => console.log(`🛑 agenda is not started`));
});
export { io}
//cron for user_delete 

// schedule.scheduleJob('0 0 */1 * *',async function () {
//     await adminController.userDelete();
// });
