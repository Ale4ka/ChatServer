//Логика регистрации

//Зависимости
const mongoClient = require("mongodb").MongoClient;
const mongoUrl = "mongodb://localhost:27017/";
//Функция
exports.register = function (request, response) {
    if (!request.body) return response.sendStatus(400);

    let newUser = {
        Login: request.body["Login"].toLowerCase(),
        PasswordHash: request.body["PasswordHash"],
        Name: request.body["Name"]
    };

        let db = request.db;
        db.collection("Users").insertOne(newUser, function (err, res) {
            let registerResponse;
            if (err) {
                registerResponse = {
                    Success: false,
                    ErrorReason: "Already exists"
                };
            } else {
                registerResponse = {
                    Success: true,
                    ErrorReason: null
                };
            }
            response.send(JSON.stringify(registerResponse));
            client.close();
        });
};

