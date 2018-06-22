/**
 * Created by SW on 2018-05-10.
 */

var localLogin = require('./passport/localLogin');
var facebook = require('./passport/facebook');
var mongoose = require('mongoose');
var UserModel = mongoose.model("users");

//============================ 로그인 기능 시작 ============================
module.exports = function(app, passport){

    console.log('config/passport 호출 됌.');

    passport.serializeUser(function(user, done){
        console.log('serializeUser', user.id);
        return done(null, {email: user.id, seller: user.sellercheck});
    });

    passport.deserializeUser(function(user, done){
        console.log('deserializeUser', user.email);
        UserModel.findById(user.email, function (err, user) {
            if (err) {
                return done(err, null);
            }
            if(user[0].sellercheck){console.log("마스터");}
            else{console.log("유저");}
            return done(null, user);
        });
    });

    passport.use(localLogin);
    passport.use(facebook);

};
//============================ 로그인 기능 끝 ============================