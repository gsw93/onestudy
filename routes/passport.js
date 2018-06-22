/**
 * Created by SW on 2018-06-04.
 */

module.exports = function (router, passport) {
    console.log('user_passport 호출 됌.');

    //로그인 인증
    router.route('/process/login').post(passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/error',
            failureFlash: false
        })
    );

    //페이스북 인증
    router.get('/auth/facebook', passport.authenticate('facebook'));
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/');
        }
    );

};