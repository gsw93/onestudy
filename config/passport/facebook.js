/**
 * Created by SW on 2018-06-01.
 */

var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model("users");

module.exports = (new FacebookStrategy({
        clientID: '1387802751354202',
        clientSecret: '7d5c0dbf8f80a20fd5e5decb608b97ab',
        callbackURL: "/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log('passport의 facebook 호출 됌.');

        UserModel.findById(profile.id, function (err, user) {
            console.log(profile);
            if (err)return done(err);

            if (user.length > 0){
                console.log('등록된 유저 확인');
                return done(null, user[0]);
            } else{
                console.log('신규 유저 생성');
                var user = new UserModel({
                    id: profile.id,
                    nickname: profile.displayName,
                    provider: 'facebook',
                    facebook: profile._json
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