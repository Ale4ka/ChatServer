var response,
    request,
    db;

exports.Auth = function (req, res, next) {

    console.log("=> AUTH");

    //Инициализация полей
    response = res;
    request = req;
    db = request.db;

    let connectionInfo = {
        Token: request.body["AccessToken"]
    };

    //Ищем токен в подключениях
    db.collection("Connections").findOne(connectionInfo, function (err, result) {
        if (err || result == null) {
            //Не найден => выкидываем
            response.send(JSON.stringify(
                {
                    Success: false,
                    ErrorType: 1,
                    ErrorReason: "Wrong token"
                }
            ));

            console.log("Auth failed #1");
            return response.end();
        }
        else {
            //Нашли коннекшн, проверяем пользователя
            let userId = result["Id"];

            db.collection("Users").findOne({ _id: userId }, function (err, user) {
                if (err || user == null) {
                    //Не нашли
                    response.send(JSON.stringify(
                        {
                            Success: false,
                            ErrorType: 2,
                            ErrorReason: "Wrong token record"
                        }
                    ));
                    console.log("Auth failed #2");
                    return response.end();
                }

                else {

                    //Добавляем пользователя
                    request.user = user;

                    //TODO: выпилить после дебага
                    //console.log(req.user);
                    //Успешно
                    console.log("Auth success");
                    //Продолжаем
                    next();
                }
            });
        }
    })
}