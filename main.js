const express = require('express');
const bodyParser = require('body-parser');
const app = express();


const port = 1234;
const jsonParser = bodyParser.json();

//Подключение API
const register = require('./App/Routes/register.js');
const login = require('./App/Routes/login.js');
const sendMessage = require('./App/Routes/sendMessage.js');
const getMessages = require('./App/Routes/getMessages.js');

app.use(function f(req,res, next) {
    console.log("New request from: " + res.connection.remoteAddress);
    next();
});

app.get("/", function(request, response){
    response.sendfile("./App/Pages/debug.html");
});

app.get("/App/Styles/style.css", function (request, response) {
    response.sendfile("./App/Styles/style.css");
});

app.post("/login", jsonParser, login.login);
app.post("/register", jsonParser, register.register);
app.post("/getMessages", jsonParser, getMessages.getMessages);
app.post("/sendMessage", jsonParser, sendMessage.sendMessage);

app.listen(port);
console.log("listen on port: ", port);


