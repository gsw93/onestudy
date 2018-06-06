/**
 * Created by SW on 2018-05-10.
 */

var local_login = require('./passport/local_login');
var facebook = require('./passport/facebook');
var mongoose = require('mongoose');
var MasterModel = mongoose.model("masters");
var UserModel = mongoose.model("users");

//============================ 로그인 기능 시작 ============================
module.exports = function(app, passport){

    console.log('config/passport 호출 됌.');

    passport.serializeUser(function(user, done){
        console.log('serializeUser', user[0].id);
        return done(null, {email: user[0].id, seller: user[0].sellercheck});
    });

    passport.deserializeUser(function(user, done){
        console.log('deserializeUser', user.email);
        if(user.seller){
            MasterModel.findById(user.email, function (err, user) {
                if(err) {
                    return done(err, null);
                }
                console.log("마스터");
                return done(null, user);
            });
        } else {
            UserModel.findById(user.email, function (err, user) {
                if (err) {
                    return done(err, null);
                }
                console.log("유저");
                return done(null, user);
            });
        }
    });

    passport.use(local_login);
    passport.use(facebook);

};
//============================ 로그인 기능 끝 ============================