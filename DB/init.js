use
ezWebChat
db.Users.drop()
db.Companies.drop()
# у
каждого
юзера
свой
логин
db.Users.createIndex(
    {Login: 1},
    {unique: true}
);
db.Users.insertOne({"Login": "Elijah", "PasswordHash": "098f6bcd4621d373cade4e832627b4f6", "Name": "Elijah Kollegov"})
db.Users.insertOne({"Login": "Orfac", "PasswordHash": "098f6bcd4621d373cade4e832627b4f6", "Name": "Arseniy"})
db.Users.insertOne({"Login": "Ejok", "PasswordHash": "0098f6bcd4621d373cade4e832627b4f6", "Name": "Egor"})
db.Users.insertOne({"Login": "SmeshMike", "PasswordHash": "098f6bcd4621d373cade4e832627b4f6", "Name": "Misha"})
db.Companies.insertOne({"Name": "bowlcaketeam", "Admin": db.Users.findOne({"Login": "Elijah"})["_id"]})
