//База данных
const mongoClient = require("mongodb");
const mongoUrl = "mongodb://localhost:27017/";


exports.Auth = function (request, response, next) {

    //Token auth middleware

    //Этот код будет выполняться для всех методов, а затем вызывать их
    mongoClient.connect(mongoUrl, { useNewUrlParser: true }, function (err, client) {
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

                console.log("Auth failed");

                response.set("Connection", "close");                                
                return;
            }
            else {

                //Успешно
                console.log("Auth success");
                
                //Кладем найденный результат в реквест
                request.conntectionResult = result;

                console.log(request.conntectionResult)

                //Продолжаем
                next();
            }

        })
    });
}