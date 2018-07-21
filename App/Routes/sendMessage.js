var response,
    request,
    db;

exports.sendMessage = function (req, res) {
    if (!req.body) return res.sendStatus(400);

    console.log("=> SENDMESSAGE");

    //Инициализация полей
    response = res;
    request = req;
    db = request.db;

    var user = request.user;

    //console.log(user);

    let chatId = request.body["ChatId"];
    let messageInfo = {
        Content: request.body["Content"],
        From: user["_id"],
        FromName : user["Name"],
        DateTime: new Date(),
        ChatId: chatId
    };
    if (chatId in request.user["Chats"]) {
        //Добавляем сообщение
        db.collection("Chats").updateOne({ _id: chatId }, { "$push": { "Messages" : messageInfo} }, PushMessage);
        db.collection("Chats").updateOne({ _id: chatId }, { "$push": { "NewMessages" : messageInfo} });

    } else {

        response.send(JSON.stringify({
            Success: false,
            ErrorType: 3,
            ErrorReason: "User isn't in chat"
        }
        ));
        return response.end();
    }


}


//Добавляем сообщение
function PushMessage(err, result) {
    //Если ошибки
    if (err || result == null) {
        response.send(JSON.stringify(
            {
                Success: false,
                ErrorType: 3,
                ErrorReason: "Chat doesn't exist"
            }
        ));
        return response.end();
    }
    else {
        //Вот это финалочка. Удачный вариант
        response.send(JSON.stringify(
            {
                Success: true,
                ErrorType: 0,
                ErrorReason: null
            }
        ));

        return response.end();
    }
}