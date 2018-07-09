const mongoClient = require("mongodb");
const mongoUrl = "mongodb://localhost:27017/";

exports.sendMessage = function (request, response) {
    if (!request.body) return response.sendStatus(400);

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
                return;
            }
            let userId = result["Id"];
            db.collection("Users").findOne({_id: userId}, function (err, result) {
                if (err || result == null) {
                    response.send(JSON.stringify(
                        {
                            Success: false,
                            ErrorType: 2,
                            ErrorReason: "Wrong token record"
                        }
                    ));
                    return;
                }
                let chatId = request.body["ChatId"];
                let messageInfo = {
                    Content: request.body["Content"],
                    From: userId,
                    DateTime: new Date(),
                    ChatId: chatId
                };
                if (chatId in result["Chats"]) {
                    db.collection("Chats").updateOne({_id: chatId}, {"$push": messageInfo}, function (err, result) {
                        if (err || result == null) {
                            response.send(JSON.stringify(
                                {
                                    Success: false,
                                    ErrorType: 3,
                                    ErrorReason: "Chat doesn't exist"
                                }
                            ));
                        }
                        else {
                            response.send(JSON.stringify(
                                {
                                    Success: true,
                                    ErrorType: 0,
                                    ErrorReason: null
                                }
                            ));
                        }
                    });

                } else {
                    response.send(JSON.stringify(
                        {
                            Success: false,
                            ErrorType: 3,
                            ErrorReason: "User isn't in chat"
                        }
                    ));
                }
            });
        });
    });
};