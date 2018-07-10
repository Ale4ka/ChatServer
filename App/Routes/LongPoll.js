exports.getNewMesseges = function(req,res) {

var millisecondsToWait = 10000;
setTimeout(function() {
    req.send("KEK!");
}, millisecondsToWait);

}