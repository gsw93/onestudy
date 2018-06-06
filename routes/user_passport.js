/**
 * Created by SW on 2018-06-04.
 */

module.exports = function (router, passport) {
    console.log('user_passport 호출 됌.');

    // 홈 화면
    router.route('/').get(function (req, res) {

        console.log(req.user);
        if (req.user) {
            console.log(req.user[0]);
            res.render('index', {authUser: req.user[0].nickname});
        } else {
            console.log('비회원');
            res.render('index', {authUser: null});
        }

    });

    // 로그인 화면
    router.route('/login').get(function (req, res) {
        res.render('login');
    });

    //회원가입 화면
    router.route('/register').get(function (req, res) {
        res.render('register');
    });

    //로그아웃
    router.route('/logout').get(function (req, res) {
        req.logout();
        res.redirect('/');
    });

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