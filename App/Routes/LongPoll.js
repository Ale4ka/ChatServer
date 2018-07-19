exports.getNewMesseges = function (req, res) {

    while (GLOBAL.NewMessages.length == 0) {
        setTimeout(function (){},50);
    }

    res.send(JSON.stringify(GLOBAL.NewMessages));
    GLOBAL.NewMessages = new Array();
}