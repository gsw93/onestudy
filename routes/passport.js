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

    //네이버 인증
    router.get('/auth/naver', passport.authenticate('naver'));
    router.get('/auth/naver/callback',
        passport.authenticate('naver', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/');
        }
    );

    //카카오 인증
    router.get('/auth/kakao', passport.authenticate('kakao'));
    router.get('/auth/kakao/callback',
        passport.authenticate('kakao', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/');
        }
    );

};