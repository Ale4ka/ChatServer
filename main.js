const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoClient = require("mongodb");
const mongoUrl = "mongodb://localhost:27017/";

const port = 1234;
const jsonParser = bodyParser.json();

//Подключение API
const register = require('./App/Routes/register.js');
const login = require('./App/Routes/login.js');
const sendMessage = require('./App/Routes/sendMessage.js');
const getMessages = require('./App/Routes/getMessages.js');
const authMiddleware = require('./App/Routes/AuthMiddleware.js');
const LongPoll = require('./App/Routes/LongPoll.js');

app.use(function (req, res, next) {
        //request ip middlaware

    console.log("New request from: " + res.connection.remoteAddress);
    next();
});

app.get("/", function (request, response) {
    response.sendfile("./App/Pages/debug.html");
});

app.get("/App/Styles/style.css", function (request, response) {
    response.sendfile("./App/Styles/style.css");
});

app.post("/login", jsonParser, login.login);
app.post("/register", jsonParser, register.register);

//Auth
app.use(jsonParser, authMiddleware.Auth);

app.post("/getHistoryMessages", jsonParser, getMessages.getMessages);
app.post("/sendMessage", jsonParser, sendMessage.sendMessage);

app.post("/getNewMessages", jsonParser, LongPoll.getNewMesseges);

app.listen(port);
console.log("listen on port: ", port);


