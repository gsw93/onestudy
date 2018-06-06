/**
 * Created by SW on 2018-06-01.
 */

var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model("users");
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();

module.exports = new LocalStrategy(
    function (username, password, done) {
        UserModel.findById(username, function (err, user) {
            if (err) {
                return done(err);
            }
            console.log("아이디 [%s]로 사용자 검색 결과", username);

            if(user.length > 0) {
                console.log('아이디 [%s]가 일치하는 사용자 찾음.', username);
                return hasher({password:password, salt:user[0]._doc.salt}, function (err, pass, salt, hash) {
                    if(hash === user[0]._doc.password) {
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                })
            } else {
                console.log("일치하는 사용자를 찾지 못함.");
                done(null, false);
            }
        })
    }
);