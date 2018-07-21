var response,
    request,
    db;

var ChatCount;
var CurrentCount = 0;
var ContentSend = false;

exports.getNewMesseges = function (req, res) {
    if (!req.body) return res.sendStatus(400);

    console.log("=> GETnewMESSAGES");

    //Инициализация полей
    response = res;
    request = req;
    db = request.db;

    var user = request.user;
    ChatCount = request.user["Chats"].length;

    var refreshIntervalId = setInterval(function () {
        if(ContentSend) {

            request.user["Chats"].forEach(function(item, i, arr) {
                db.collection("Chats").update({ _id: item }, { $set: { "NewMessages" : [] } });
              });

            ContentSend = false;

            clearInterval(refreshIntervalId);
            return response.end();
        }
            
        CurrentCount = 0;
        request.user["Chats"].forEach(function(item, i, arr) {
            db.collection("Chats").findOne({ _id: item }, FindResult);
          });
    }, 50);
}

function FindResult(err, result)
{
    if (err || result == null || result["NewMessages"] == undefined || result["NewMessages"] == null || result["NewMessages"].length == 0) {
        CurrentCount++;
    } else {
        ContentSend = true;
        
        //Отправляем посылку
        response.write(JSON.stringify(
            {
                Success: true,
                Content: result["NewMessages"],
                ErrorType: 0,
                ErrorReason: null
            }
        ));

        CurrentCount++;
    }
    
    //if(CurrentCount == ChatCount && ContentSend)
}