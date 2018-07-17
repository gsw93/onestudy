/**
 * Created by SW on 2018-05-10.
 */

//============================ 데이터베이스에 연결 시작 ============================

var mongoose = require('mongoose');
var user_Schema = require('./userSchema');
var masterboard_Schema = require('./masterboardSchema');


module.exports = function connectDB() { // mongoose db

    var database;
    // 데이터베이스 연결 정보
    var databaseUrl = "mongodb://35.189.135.181:27017/db";

    // 데이터베이스 연결
    console.log('데이터베이스 연결을 시도합니다.');
    mongoose.Promise = global.Promise; // node의 promise를 js의 promise로 바꿈
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    database.on('error', console.error.bind(console, 'mongoose connection error.'));
    database.on('open', function () {
        console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);

        var user = new user_Schema();
        console.log('UserModel 정의함.');
        var masterboard = new masterboard_Schema();
        console.log('MasterBoardModel 정의함.');

        return database;
    });

    // 연결 끊어졌을 때 5초 후 재연결
    database.on('disconnected', function () {
        console.log('연결이 끊어졌습니다. 5초 후 다시 연결합니다.');
        setInterval(connectDB(), 5000);
    });
};
//============================ 데이터베이스에 연결 끝 ============================
