const mongoClient = require("mongodb");
const mongoUrl = "mongodb://localhost:27017/";
const Crypto = require("crypto");

exports.login = function (request, response) {
    if (!request.body) return response.sendStatus(400);

    mongoClient.connect(mongoUrl, {useNewUrlParser: true}, function (err, client) {
        if (err) throw err;
        let db = client.db("ezWebChat");
        let AuthInfo = {
            Login: request.body["Login"],
            PasswordHash: request.body["PasswordHash"]
        };
        let ip = request.body["Ip"];
        db.collection("Users").findOne({}, {AuthInfo}, function (err, result) {
            if (err || result == null || result["Login"] == null) {
                response.send(JSON.stringify(
                    {
                        Token: null,
                        IsAuthorized: false,
                        ErrorType: 1,
                        ErrorReason: "Wrong login/password"
                    }
                ));
                return;
            }
            let token = Crypto.randomBytes(16);
            let newIpConnection = {
                Token: token,
                Ip: ip,
                Login: AuthInfo["Login"]
            };
            db.collection("Connections").insertOne(newIpConnection, function (err, result) {
                if (err) {
                    response.send(JSON.stringify(
                        {
                            Token: null,
                            IsAuthorized: false,
                            ErrorType: 1,
                            ErrorReason: "Error at adding to connections"
                        }
                    ));
                }

                response.send(JSON.stringify({
                    Token: token,
                    IsAuthorised: true,
                    ErrorType: 0,
                    ErrorReason: null
                }))
            });


        });
    })
};


