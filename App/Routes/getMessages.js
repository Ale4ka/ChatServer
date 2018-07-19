var response,
    request,
    db;

exports.getMessagesHistory = function (req, res) {
    if (!req.body) return res.sendStatus(400);

    console.log("=> GETMESSAGEHISTORY");

    //Инициализация полей
    response = res;
    request = req;
    db = request.db;

    var user = request.user;

    let chatId = request.body["ChatId"];
    if (chatId in user["Chats"]) {

        db.collection("Chats").findOne({ _id: chatId }, FindAllMessages);

    } else {
        //Не туда лезешь! 
        response.send(JSON.stringify(
            {
                Success: false,
                Content: null,
                ErrorType: 3,
                ErrorReason: "User isn't in chat"
            }
        ));
        return response.end();
    }
};

function FindAllMessages(err, chat) {
    if (err || chat == null) {
        //Нет чата
        response.send(JSON.stringify(
            {
                Success: false,
                Content: null,
                ErrorType: 4,
                ErrorReason: "Chat or messages doesn't exist"
            }
        ));
        return response.end();
    } else {
        //Отправляем посылку
        response.send(JSON.stringify(
            {
                Success: true,
                Content: chat["Messages"],
                ErrorType: 0,
                ErrorReason: null
            }
        ));
        return response.end();
    }
}