//Конфиг
const port = 1234;
const mongoUrl = "mongodb://localhost:27017/";

//Системные подключения
const express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'), 
    jsonParser = bodyParser.json(),
    mongoClient = require("mongodb");

//Подключение API
const register = require('./App/Routes/register.js');
const login = require('./App/Routes/login.js');
const sendMessage = require('./App/Routes/sendMessage.js');
const getMessages = require('./App/Routes/getMessages.js');
const authMiddleware = require('./App/Routes/AuthMiddleware.js');
const LongPoll = require('./App/Routes/LongPoll.js');

//Приложение
const app = express();

//Вспомогательные стили
app.get("/App/Styles/style.css", function (request, response) {
    response.sendfile("./App/Styles/style.css",function(){response.end();});
});

app.use(jsonParser);
app.use(function (req, res, next) {    
    //request ip middlaware
    console.log("New request from: " + res.connection.remoteAddress);
    next();
});

//Сайт
//Отдельно, но тоже не будет работать без базы данных
app.get("/", function (request, response) {
    response.sendfile("./App/Pages/debug.html",function(){response.end();});   
});


//Сервер
mongoClient.connect(mongoUrl, { useNewUrlParser: true }, function(err, client) {
	if(err) {
		console.log('DataBase conntect error');
	} else {

        app.use(function(req, res, next) {
			req.db = client.db("ezWebChat");
			next();
        });        
        
        app.post("/login", login.login);
        app.post("/register", register.register);
        
        //Auth
        //app.use(authMiddleware.Auth);
        
        //app.post("/getHistoryMessages", getMessages.getMessages);
        //app.post("/sendMessage", sendMessage.sendMessage);
        
        //app.post("/getNewMessages", LongPoll.getNewMesseges);
        
        http.createServer(app).listen(port, function() {
        console.log("listen on port: ", port);
        });
    }
});

