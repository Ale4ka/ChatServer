//Логика регистрации

//Зависимости
const mongoClient = require("mongodb").MongoClient;
const mongoUrl = "mongodb://localhost:27017/";
//Функция
exports.register = function (request, response) {
    if (!request.body) return response.sendStatus(400);

    let newUser = {
        Login: request.query["Login"],
        PasswordHash: request.query["PasswordHash"],
        Name: request.query["Name"]
    };


    mongoClient.connect(mongoUrl, {useNewUrlParser: true}, function (err, client) {
        if (err) throw err;
        let db = client.db("ezWebChat");
        db.collection("Users").insertOne(newUser, function (err, res) {
            let registerResponse;
            if (err) {
                registerResponse = {
                    IsRegistered: false,
                    ErrorReason: "Already exists"
                };
            } else {
                registerResponse = {
                    IsRegistered: true,
                    ErrorReason: null
                };
            }
            response.send(JSON.stringify(registerResponse));
            client.close();
        });

    });

};

