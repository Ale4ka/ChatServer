const mongoClient = require("mongodb");
const mongoUrl = "mongodb://localhost:27017/";

exports.getMessages = function (request, response) {
    if (!request.body) return response.sendStatus(400);

    mongoClient.connect(mongoUrl, {useNewUrlParser: true}, function (err, client) {
        if (err) throw err;
        let db = client.db("ezWebChat");
        let connectionInfo = {
            Token: request.body["Token"]
        };
        db.collection("Connections").findOne(connectionInfo, function (err, result) {
            if (err || result == null) {
                response.send(JSON.stringify(
                    {
                        Success: false,
                        Content: null,
                        ErrorType: 1,
                        ErrorReason: "Wrong token"
                    }
                ));
            }
            let userId = result["_id"];
            db.collection("Users").findOne({_id: userId}, function (err, result) {
                if (err || result == null) {
                    response.send(JSON.stringify(
                        {
                            Success: false,
                            Content: null,
                            ErrorType: 2,
                            ErrorReason: "Wrong token record"
                        }
                    ));
                }
                let chatId = request["ChatId"];
                if (chatId in result["Chats"]) {
                    db.collection("Messages").find({ChatId: chatId}, function (err, result) {
                        if (err || result == null) {
                            response.send(JSON.stringify(
                                {
                                    Success: false,
                                    Content: null,
                                    ErrorType: 4,
                                    ErrorReason: "Chat or messages doesn't exist"
                                }
                            ));
                        } else {

                            response.send(JSON.stringify(
                                {
                                    Success: true,
                                    // Content: messages,
                                    ErrorType: 0,
                                    ErrorReason: "Chat or messages doesn't exist"
                                }
                            ));
                        }
                    });
                } else {
                    response.send(JSON.stringify(
                        {
                            Success: false,
                            Content: null,
                            ErrorType: 3,
                            ErrorReason: "User isn't in chat"
                        }
                    ));
                }
            });
        });
    });
};