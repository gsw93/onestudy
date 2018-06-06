/**
 * Created by SW on 2018-06-01.
 */

var LocalStrategy = require('passport-local').Strategy;
var connectDB = require('../../models/database');
var UserModel = mongoose.model("users");

var addUser = function (database, id, password, nickname, salt, callback) {
    console.log('addUser 호출됨 : ' + id + ', ' + password + ', ' + nickname + ', ' + salt);

    // UserModel의 인스턴스 생성
    var user = new UserModel({"id": id, "password": password, "nickname": nickname, "salt": salt});

    // save ()로 저장
    user.save(function (err) {
        if(err) {
            callback(err, null);
            return;
        }

        console.log("사용자 데이터 추가함.");
        callback(null, user);
    });
};

// 사용자를 추가하는 함수
module.exports = new LocalStrategy(
    addUser(connectDB, id, password, nickname, salt, function (err, result) {
        if (err) { throw err;}

        // 결과 객체 확인하여 추가된 데이터 있으면 성공 응답 전송
        if (result) {
            console.dir(result);
            res.redirect('/');
        } else {    // 결과 객체가 없으면 실패 응답 전송
            res.writeHead('200', { 'Content-Type':'text/html; charset=utf8 '});
            res.write('<h1>사용자 추가 실패</h1>');
            res.end();
        }
    })
);