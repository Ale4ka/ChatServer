use
ezWebChat
db.Users.drop()
db.Companies.drop()
db.Connections.drop()
db.Chats.drop()
db.Users.createIndex(
    {Login: 1},
    {unique: true}
);
db.Users.insertOne({
    "Login": "Elijah",
    "PasswordHash": "098f6bcd4621d373cade4e832627b4f6",
    "Name": "Elijah Kollegov",
    "Chats": [0, 1, 2]
})
db.Users.insertOne({
    "Login": "Orfac",
    "PasswordHash": "098f6bcd4621d373cade4e832627b4f6",
    "Name": "Arseniy",
    "Chats": [0, 1, 2]
})
db.Users.insertOne({
    "Login": "Ejok",
    "PasswordHash": "0098f6bcd4621d373cade4e832627b4f6",
    "Name": "Egor",
    "Chats": [0, 1, 2]
})
db.Users.insertOne({
    "Login": "SmeshMike",
    "PasswordHash": "098f6bcd4621d373cade4e832627b4f6",
    "Name": "Misha",
    "Chats": [0, 1, 2]
})
db.Companies.insertOne({"_id": 0, "Name": "BowlCakeTeam", "Admin": db.Users.findOne({"Login": "Elijah"})["_id"]})
db.Chats.insertOne({"_id": 0, "name": "BowlCakeTeamChat", "Messages": []})
