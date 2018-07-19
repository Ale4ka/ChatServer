var response,
    request,
    db,
    token;

exports.login = function (req, res) {
    if (!req.body) return res.sendStatus(400);

    //Инициализация полей
    response = res;
    request = req;
    db = request.db;

    let AuthInfo = {
        Login: request.body["Login"].toLowerCase(),
        PasswordHash: request.body["PasswordHash"]
    };

    db.collection("Users").findOne(AuthInfo, UserCallBack);
};

function UserCallBack(err, result) {
    if (err || result == null) {
        response.send(JSON.stringify(
            {
                Token: null,
                Success: false,
                ErrorType: 1,
                ErrorReason: "Wrong login/password"
            }
        ));
        return response.end();

    }

    token = generateToken(16);
    let newIpConnection = {
        Token: token,
        Id: result["_id"]
    };

    db.collection("Connections").insertOne(newIpConnection, ConnectionCallBack);
}

function ConnectionCallBack(err, result) {
    if (err) {
        response.send(JSON.stringify(
            {
                Token: null,
                Success: false,
                ErrorType: 1,
                ErrorReason: "Error at adding to connections"
            }
        ));
        return response.end();
    }

    response.send(JSON.stringify({
        Token: token,
        Success: true,
        ErrorType: 0,
        ErrorReason: null
    }))

    return response.end();
}


function generateToken(length) {
    let symbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'l', 'm', 'n'];
    let token = "";
    for (let i = 0; i < length; i++) {
        let index = Math.trunc(Math.random() * symbols.length);
        token += symbols[index];
    }
    return token;
}