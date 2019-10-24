var mongoose = require('mongoose');
const config = require('./config');

var conn = mongoose.connection;

try {
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://192.168.16.188/testdb", { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });

    conn.once("open", function () {
        console.log("DB is connected");
    });

} catch (error) {
    console.log("DB Error: " + error);
}

module.exports = conn;