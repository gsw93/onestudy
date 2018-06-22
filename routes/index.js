/**
 * Created by SW on 2018-06-21.
 */

module.exports = function (router) {
    // 홈 화면
    router.route('/').get(function (req, res) {
        if (req.user) {
            res.render('index', {authUser: req.user[0].nickname, authMaster:req.user[0].sellercheck});
        } else {
            console.log('비회원');
            res.render('index', {authUser: null, authMaster: false});
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
            res.render('event',{authUser: req.user[0].nickname, authMaster:req.user[0].sellercheck});
        else
            res.render('login');
    });

    //서비스 소개 화면
    router.route('/serviceInfo').get(function (req, res) {
        if(req.user)
            res.render('serviceInfo',{authUser: req.user[0].nickname, authMaster:req.user[0].sellercheck});
        else
            res.render('serviceInfo',{authUser: null});
    });

    //에러 화면
    router.route('/error').get(function (req, res) {
        res.render('error');
    });

};