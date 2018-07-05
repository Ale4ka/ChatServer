const express = require('express');
const bodyParser = require('body-parser');
const app = express();


const port = 1234;
const jsonParser = bodyParser.json();

//Подключение API
const register = require('./App/Routes/register.js');
const login = require('./App/Routes/login.js');

app.get("/", function(request, response){
    response.sendfile("./App/Pages/debug.html");
});

app.get("/App/Styles/style.css", function (request, response) {
    response.sendfile("./App/Styles/style.css");
});

app.post("/login", jsonParser, login.login);
app.post("/register", jsonParser, register.register);

app.listen(port);
console.log("listen on port: ", port);


