/**
 * Created by SW on 2018-06-22.
 */

var NaverStrategy = require('passport-naver').Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model("users");

module.exports = (new NaverStrategy({
        clientID: 'cCdRfBjCIIIPqOXYOyLq',
        clientSecret: 'AEDh4B0iGW',
        callbackURL: "https://www.onestudy.co.kr/auth/naver/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log('passport의 naver 호출 됌.');

        UserModel.findById(profile.id, function (err, user) {
            console.log(profile);
            if (err)return done(err);

            if (user.length > 0){
                console.log('등록된 유저 확인');
                return done(null, user[0]);
            } else{
                var location={type:'Point',coordinates:[0,0]};
                console.log('신규 유저 생성');
                var user = new UserModel({
                    "id": profile.id,
                    "nickname": profile.displayName,
                    "location":location,
                    "provider": 'naver',
                    "naver": profile._json
                });

                user.save(function (err) {
                    if(err) {
                        console.log(err);
                        throw err;
                    }
                    UserModel.findById(profile.id, function (err, user) {
                        if (user.length <= 0)return done(err);
                        return done(err, user[0]);
                    });
                });
            }
        });
    })
);