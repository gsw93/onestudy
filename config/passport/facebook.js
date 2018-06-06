/**
 * Created by SW on 2018-06-01.
 */

var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var MasterModel = mongoose.model("masters");
var UserModel = mongoose.model("users");

module.exports = (new FacebookStrategy({
        clientID: '1387802751354202',
        clientSecret: '7d5c0dbf8f80a20fd5e5decb608b97ab',
        callbackURL: "/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log('passport의 facebook 호출 됌.');
        console.log(profile);

        UserModel.findById(profile.id, function (err, user) {
            if (err)return done(err);

            if (user.length <= 0) {
                MasterModel.findById(profile.id, function (err, user) {
                    if (err){
                        return done(err);
                    }
                    if (user.length <= 0) {
                        var myuser = new UserModel({
                            id: profile.id,
                            password: profile.password,
                            nickname: profile.displayName,
                            provider: 'facebook',
                            facebook: profile._json
                        });

                        myuser.save(function (err) {
                            if (err) console.log(err);
                            UserModel.findById(profile.id, function (err, user) {
                                if (user.length <= 0)return done(err);
                                return done(err, user);
                            });
                        });
                    } else {
                        return done(err, user);
                    }
                });
            } else {
                return done(err, user);
            }
        })
    })
);