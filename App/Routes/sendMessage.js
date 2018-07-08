const mongoClient = require("mongodb");
const mongoUrl = "mongodb://localhost:27017/";

exports.sendMessage = function (request, response) {
    if (!request.body) return response.sendStatus(400);

    mongoClient.connect(mongoUrl, {useNewUrlParser: true}, function (err, client) {
        if (err) throw err;
        let db = client.db("ezWebChat");
        let connectionInfo = {
            Token: request.body["Token"],
            Ip: request.body["Ip"]
        };
        db.collection("Connections").findOne(connectionInfo, function (err, result) {
            if (err || result == null) {
                response.send(JSON.stringify(
                    {
                        IsSent: false,
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
                            IsSent: false,
                            ErrorType: 2,
                            ErrorReason: "Wrong token record"
                        }
                    ));
                }
                let chatId = request["ChatId"];
                let messageInfo = {
                    Content: request["Content"],
                    From: userId,
                    DateTime: new Date()
                };
                if (chatId in result["Chats"]) {
                    db.collection("Chats").updateOne({_id: chatId}, {"$push": messageInfo}, function (err, result) {
                        if (err || result == null) {
                            response.send(JSON.stringify(
                                {
                                    IsSent: false,
                                    ErrorType: 3,
                                    ErrorReason: "Chat doesn't exist"
                                }
                            ))
                        }
                        else {
                            response.send(JSON.stringify(
                                {
                                    IsSent: true,
                                    ErrorType: 0,
                                    ErrorReason: null
                                }
                            ));
                        }
                    });

                } else {
                    response.send(JSON.stringify(
                        {
                            IsSent: false,
                            ErrorType: 3,
                            ErrorReason: "User isn't in chat"
                        }
                    ));
                }
            });
        });
    });
};