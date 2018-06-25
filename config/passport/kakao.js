<<<<<<< HEAD
/**
 * Created by SW on 2018-06-22.
 */

var KakaoStrategy = require('passport-kakao').Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model("users");

module.exports = (new KakaoStrategy({
            clientID: '2556ca4a34bc16cbbec37f86605283db',
            clientSecret: 'VlI9bMJv6RWSnY4DgBhlZ2761TqmSPiZ',
            callbackURL: "https://www.onestudy.co.kr/auth/kakao/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            console.log('passport의 kakao 호출 됌.');

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
                        provider: 'kakao',
                        kakao: profile._json
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
=======
/**
 * Created by SW on 2018-06-22.
 */

var KakaoStrategy = require('passport-kakao').Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model("users");

module.exports = (new KakaoStrategy({
            clientID: '2556ca4a34bc16cbbec37f86605283db',
            clientSecret: 'VlI9bMJv6RWSnY4DgBhlZ2761TqmSPiZ',
            callbackURL: "https://www.onestudy.co.kr/auth/kakao/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            console.log('passport의 kakao 호출 됌.');

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
                        provider: 'kakao',
                        kakao: profile._json
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
>>>>>>> be00d9871035b1963b63bb08b6d6414c70e413ef
);