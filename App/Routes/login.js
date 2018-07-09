const mongoClient = require("mongodb");
const mongoUrl = "mongodb://localhost:27017/";

exports.login = function (request, response) {
    if (!request.body) return response.sendStatus(400);

    mongoClient.connect(mongoUrl, {useNewUrlParser: true}, function (err, client) {
        if (err) throw err;
        let db = client.db("ezWebChat");
        let AuthInfo = {
            Login: request.body["Login"],
            PasswordHash: request.body["PasswordHash"]
        };
        db.collection("Users").findOne(AuthInfo, function (err, result) {
            if (err || result == null) {
                response.send(JSON.stringify(
                    {
                        Token: null,
                        Success: false,
                        ErrorType: 1,
                        ErrorReason: "Wrong login/password"
                    }
                ));
                return;
            }

            let token = generateToken(16);
            let newIpConnection = {
                Token: token,
                Id: result["_id"]
            };
            db.collection("Connections").insertOne(newIpConnection, function (err, result) {
                if (err) {
                    response.send(JSON.stringify(
                        {
                            Token: null,
                            Success: false,
                            ErrorType: 1,
                            ErrorReason: "Error at adding to connections"
                        }
                    ));
                }

                response.send(JSON.stringify({
                    Token: token,
                    Success: true,
                    ErrorType: 0,
                    ErrorReason: null
                }))
            });


        });
    })
};


function generateToken(length) {
    let symbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'l', 'm', 'n'];
    let token = "";
    for (let i = 0; i < length; i++) {
        let index = Math.trunc(Math.random() * symbols.length);
        token += symbols[index];
    }
    return token;
}