/**
 * Created by SW on 2018-06-21.
 */

module.exports = function (router) {
    // 홈 화면
    router.route('/').get(function (req, res) {
        if (req.user) {
            res.render('index', {authUser: req.user[0], seller: req.session.passport.user.seller});
        } else {
            console.log('비회원');
            res.render('index', {authUser: null, seller: false});
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

    //이벤트 화면
    router.route('/event').get(function (req, res) {
        if(req.user)
            res.render('event',{seller:req.session.passport.user.seller, authUser: req.user[0]});
        else
            res.render('login');
    });

    //서비스 소개 화면
    // router.route('/serviceInfo').get(function (req, res) {
    //     if(req.user)
    //         res.render('serviceInfo',{seller:req.session.passport.user.seller, authUser: req.user[0]});
    //     else
    //         res.render('serviceInfo',{authUser: null});
    // });

    // index 올리기용
    router.route('/temp').get(function (req, res) {
        if(req.user)
            res.render('temp');
        else
            res.render('temp');
    });
    router.route('/RegisterMaster').get(function (req, res) {
        res.render('RegisterMaster');
    });
    //에러 화면
    router.route('/error').get(function (req, res) {
        res.render('error');
    });

};
