const mongoClient = require("mongodb");
const mongoUrl = "mongodb://localhost:27017/";
exports.login = function (request, response) {
    if (!request.body) return response.sendStatus(400);

    mongoClient.connect(mongoUrl, {useNewUrlParser: true}, function (err, client) {
        if (err) throw err;
        let db = client.db("ezWebChat");
        let AuthInfo = {
            Login: request.query["Login"],
            PasswordHash: request.query["PasswordHash"]
        };
        let ip = request.query["Ip"];
        db.collection("Users").findOne({AuthInfo}, function (err, result) {
            if (err) {
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
            console.log(result);

            db.collection["Ip"].insertOne({Token: random(), Ip: ip, Login: AuthInfo["Login"]}, function (err, result) {
                if (err) {
                    response.send(JSON.stringify(
                        {
                            Token: null,
                            IsAuthorized: false,
                            ErrorType: 1,
                            ErrorReason: "Wrong login/password"
                        }
                    ));
                }

                response.send(JSON.stringify({
                    Token: random(),
                    IsAuthorised: true,
                    ErrorType: 0,
                    ErrorReason: null
                }))
            });


        });
    })
};
