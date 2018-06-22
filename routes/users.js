/**
 * Created by SW on 2018-06-21.
 */

var mongoose = require('mongoose');
var UserModel = mongoose.model("users");
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();

module.exports = function (router, passport) {

    router.route('/mypage').get(function (req, res) {
        if (req.user)
            res.render('mypage', {authUser: req.user[0].nickname, authMaster:req.user[0].sellercheck});
        else
            res.render('login');
    });

    router.route('/apply').get(function (req, res) {
        if(req.user){
            res.render('apply');
        } else{
            res.render('login');
        }
    });

    router.route('/process/register').post(function (req, res) {
        console.log(req.body.username);
        UserModel.findById(req.body.username ,function (err, user) {
            if(err){
                throw err;
                console.log(err);
            }
            if(user.length>0){
                console.log('이미 등록된 사용자입니다.');
                res.send('이미 등록된 사용자입니다.');
            } else{
                hasher({password: req.body.password}, function (err, pass, salt, hash) {
                    var id = req.body.username;
                    var password = hash;
                    var nickname = req.body.nickname;
                    var salt = salt;

                    console.log('요청 파라미터 : ' + id + ', ' + password + ', ' + nickname + ', ' + salt);

                    var user = new UserModel({"id": id, "password": password, "nickname": nickname, "salt": salt});
                    // save ()로 저장
                    user.save(function (err) {
                        if(err) {
                            return err;
                        }
                        console.log("사용자 데이터 추가함.");
                        return res.redirect('/');
                    })
                });
            }
        });
    });

    router.route('/process/addmaster').post(function (req, res) {
        console.log('/process/addmaster 호출됨.');
        var name = req.body.name;
        var age = req.body.age;
        var gender = req.body.gender;
        var photo = req.body.photo;
        var majors = req.body.majors;
        var phone = req.body.phone;

        console.log(req.session.passport);
        UserModel.findOne({ id : req.session.passport.user.email }, function(err, member) {
            if (err) return res.status(500).json({error: err});
            if (!member) {
                return res.send('마스터 등록에 실패했습니다.');
            } else {
                console.log(member);
                member.name = name;
                member.age = age;
                member.gender = gender;
                member.photo = photo;
                member.majors = majors;
                member.phone = phone;
                member.sellercheck = true;
                member.save(function (err) {
                    if (err)
                        throw err;
                    req.session.passport.user.seller=true;
                    res.redirect('/');
                });
            }
        });
    });

};