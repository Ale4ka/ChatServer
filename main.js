const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//База данных
const mongoClient = require("mongodb");
const mongoUrl = "mongodb://localhost:27017/";


const port = 1234;
const jsonParser = bodyParser.json();

//Подключение API
const register = require('./App/Routes/register.js');
const login = require('./App/Routes/login.js');
const sendMessage = require('./App/Routes/sendMessage.js');
const getMessages = require('./App/Routes/getMessages.js');


app.post("/login", jsonParser, login.login);
app.post("/register", jsonParser, register.register);

app.use(function f(req,res, next) {

    //request ip middlaware

    console.log("New request from: " + res.connection.remoteAddress);
    next();
});

app.use(function f(request,response, next) {

    //Token auth middleware

    //Этот код будет выполняться для всех методов, а затем вызывать их
    mongoClient.connect(mongoUrl, {useNewUrlParser: true}, function (err, client) {
        if (err) throw err;
        let db = client.db("ezWebChat");
        let connectionInfo = {
            Token: request.body["AccessToken"]
        };
        db.collection("Connections").findOne(connectionInfo, function (err, result) {
            if (err || result == null) {
                response.send(JSON.stringify(
                    {
                        Success: false,
                        ErrorType: 1,
                        ErrorReason: "Wrong token"
                    }
                ));

                console.log("Auth failed");
                return;
            }

            //Успешно
            console.log("Auth success");

            //Кладем найденный результат в реквест
            request.root = result;

        })
    });
    //Продолжаем
    next();
});



app.get("/", function(request, response){
    response.sendfile("./App/Pages/debug.html");
});

app.get("/App/Styles/style.css", function (request, response) {
    response.sendfile("./App/Styles/style.css");
});

app.post("/getMessages", jsonParser, getMessages.getMessages);
app.post("/sendMessage", jsonParser, sendMessage.sendMessage);

app.listen(port);
console.log("listen on port: ", port);


