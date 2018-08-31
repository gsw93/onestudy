
/**
 * Created by SW on 2018-06-21.
 */

var mongoose = require('mongoose');
var UserModel = mongoose.model("users");
var MasterBoardModel = mongoose.model("masterboards");
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/uploads/user');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now()+file.originalname);
    }
});
var upload = multer({ storage: storage });
var Thumbnail = require('thumbnail');
var thumbnail = new Thumbnail('./public/uploads/user',  './public/uploads/userThumb');

module.exports = function (router, passport) {

    // 학생 마이페이지
    router.route('/mypage').get(function (req, res) {
      if(req.user){
        var user = req.user[0];

        //나의 스터디 관리
        var page = req.param('page');
        if(page==null){page=1;};

        var skipSize = (page-1)*5;
        var limitSize = 5;
        var pageNum = 1;

        //스터디 평가하기
        var page2 = req.param('page2');
        if(page2==null){page2=1;};

        var skipSize2 = (page2-1)*5;
        var pageNum2 = 1;

        var totalCount = req.user[0].mystudy.length;
        pageNum = Math.ceil(totalCount/limitSize); // 나의스터디 관리 페이지
        pageNum2 = Math.ceil(totalCount/limitSize); // 스터디평가하기 페이지

        //나의 스터디 관리 페이징
        UserModel.aggregate([
          {$match:{'id':req.user[0].id}},
          {$unwind:'$mystudy'},
          {$project:{_id:'$mystudy._id',deadline:'$mystudy.deadline',studyid:'$mystudy.studyid',
          title:'$mystudy.title',studyTerm:'$mystudy.studyTerm',reviewstar:'$mystudy.reviewstar',statue:'$mystudy.statue'}}
        ]).sort({date:-1}).skip(skipSize).limit(limitSize).exec(function(err,user){

            //스터디 평가하기 페이징
            UserModel.aggregate([
              {$match:{'id':req.user[0].id}},
              {$unwind:'$mystudy'},
              {$project:{_id:'$mystudy._id',deadline:'$mystudy.deadline',studyid:'$mystudy.studyid',
              title:'$mystudy.title',studyTerm:'$mystudy.studyTerm',reviewstar:'$mystudy.reviewstar',statue:'$mystudy.statue'}}
            ]).sort({date:-1}).skip(skipSize2).limit(limitSize).exec(function(err,user2){
              if (err) throw err;
              res.render('mypage_student',{user:user,user2:user2,pagination:pageNum,skipSize:skipSize,pagination2:pageNum2,skipSize2:skipSize2,seller:req.session.passport.user.seller, authUser: req.user[0]});
            })
        })
      } else{
          res.render('login');
      }
    });

    // 마스터 마이페이지
    router.route('/mypage2').get(function (req, res) {
      if(req.user){
        var id = req.user[0].id;

        //후기관리
        var page = req.param('page');
        if(page==null){page=1;};

        var skipSize = (page-1)*5;
        var limitSize = 5;
        var pageNum = 1;

        //스터디관리
        var page2 = req.param('page2');
        if(page2==null){page2=1;};

        var skipSize2 = (page2-1)*5;
        var pageNum2 = 1;

        MasterBoardModel.count({id:id},function(err,totalCount){
          if(err) throw err;

          pageNum = Math.ceil(totalCount/limitSize);
          pageNum2 = Math.ceil(totalCount/limitSize);

          //후기관리 페이징
          MasterBoardModel.find({id:id}).sort({date:-1}).skip(skipSize).limit(limitSize).exec(function(err,rawBoard){
            //스터디관리 페이징
            MasterBoardModel.find({id:id}).sort({date:-1}).skip(skipSize2).limit(limitSize).exec(function(err,rawBoard2){
              if(err) throw err;
              res.render('mypage_master',{board:rawBoard,board2:rawBoard2,pagination:pageNum,skipSize:skipSize,pagination2:pageNum2,skipSize2:skipSize2, seller:req.session.passport.user.seller, authUser: req.user[0]});
            })
          });
        })
      } else{
          res.render('login');
      }
    });

    // 카테고리 변경 프로세스
    router.route('/process/categoryModify').post(function(req,res){
      var id = req.user[0].id;
      var interested = req.body.check_c;
      console.log(interested);
      UserModel.findOne({id:id},function(err,rawBoard){
        if(err) throw err;
        var myquery = {id:id};
        var newvalue =  {$set : {interested:interested}};
        UserModel.updateOne(myquery,newvalue,function(err,res){
          if(err) throw err;
          console.log('카테고리 변경');
        })
        res.redirect('/mypage');
      })
    })

    router.route('/masterapply').get(function (req, res) {
        if(req.user){
            res.render('masterapply', {seller:req.session.passport.user.seller, authUser: req.user[0]});
        } else{
            res.render('login');
        }
    });

    router.route('/studentapply').get(function (req, res) {
        if(req.user){
            //07_04 add studentapply->studentapply_GSH 변경
            res.render('studentapply_GSH', {seller:req.session.passport.user.seller, authUser: req.user[0]});
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
                    var location={type:'Point',coordinates:[0,0]};
                    var salt = salt;

                    console.log('요청 파라미터 : ' + id + ', ' + password + ', ' + nickname + ', ' + salt);

                    var user = new UserModel({"id": id, "password": password, "nickname": nickname, "salt": salt, "provider": 'onestudy', "location":location});
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
    router.route('/process/profileModify').post(upload.single('userfile'), function (req, res) {
        console.log('/process/profileModify 호출됨.');
        console.log(req.file);
        var file = req.file;

        console.log(req.session.passport);
        UserModel.findOne({ id : req.session.passport.user.email }, function(err, member) {
            if (err) return res.status(500).json({error: err});
            if (!member) {
                return res.send('사진 등록에 실패했습니다.');
            } else {
                thumbnail.ensureThumbnail(file.filename, 130, 130, function(err, thumb2){
                    console.log('########### : ' + member.photo);
                    member.photo = '/uploads/userThumb/'+thumb2;
                    console.log('########### : ' + member.photo);
                    member.save(function (err) {
                        if (err)
                            throw err;
                        req.session.passport.user.seller=true;
                        res.redirect('/mypage');
                    });
                })
            }
        });
        MasterBoardModel.findOne({ id : req.session.passport.user.email }, function(err, board) {
            if (err) return res.status(500).json({error: err});
            if (!board) {
                console.log('변경할 마스터의 게시글이 없습니다.');
            } else {
                thumbnail.ensureThumbnail(file.filename, 130, 130, function(err, thumb2){
                    console.log('########### : ' + board.masterphoto);
                    board.masterphoto = '/uploads/userThumb/'+thumb2;
                    console.log('########### : ' + board.masterphoto);
                    board.save(function (err) {
                        if (err)
                            throw err;
                    });
                })
            }
        });

    });
    router.route('/process/addmaster').post(upload.single('userfile'), function (req, res) {
        console.log('/process/addmaster 호출됨.');
        console.log(req.file);
        var name = req.body.name;
        var age = req.body.age;
        var gender = req.body.gender;
        var phone = req.body.phoneNumber;
        var file = req.file;

        console.log(req.session.passport);
        UserModel.findOne({ id : req.session.passport.user.email }, function(err, member) {
            if (err) return res.status(500).json({error: err});
            if (!member) {
                return res.send('마스터 등록에 실패했습니다.');
            } else {
                console.log(member);
                if(member.name){
                  member.name = member.name;
                }
                else{
                  member.name = name;
                }
                member.age = age;
                member.gender = gender;
                member.phone = phone;
                member.phoneAuthCheck = true;
                member.sellercheck = true;

                if(  file == "" ||  file == null || file == undefined || ( file != null && typeof file == "object" && !Object.keys(file).length ) ){
                    member.photo = '/img/home/main_i_05.png';
                    member.save(function (err) {
                        if (err)
                            throw err;
                        req.session.passport.user.seller=true;
                        res.redirect('/completeMaster');
                    });
                } else{
                    thumbnail.ensureThumbnail(file.filename, 130, 130, function(err, thumb2){
                        member.photo = '/uploads/userThumb/'+thumb2;
                        console.log('########### : ' + member.photo);
                        member.save(function (err) {
                            if (err)
                                throw err;
                            req.session.passport.user.seller=true;
                            res.redirect('/completeMaster');
                        });
                    })
                }
            }
        });
    });
    //07_04 add by sehyeon
    //student submit part
    router.route('/process/addstudent').post(function (req, res) {
        console.log('/process/addstudent 호출됨.');
        var name = req.body.name;
        // var age = req.body.age;
        // var gender = req.body.gender;
        var phone = req.body.phoneNumber;
        var address=req.body.address;
        var locationX=req.body.x;
        var locationY=req.body.y;
        var interest = req.body.interest;
        // var level = req.body.level;
        var addressShort=req.body.siNm;
        console.log(req.session.passport);
        UserModel.findOne({ id : req.session.passport.user.email }, function(err, member) {
            if (err) return res.status(500).json({error: err});
            if (!member) {
                return res.send('학생 등록에 실패했습니다.');
            } else {
                console.log(member);
                if(member.name){
                  member.name = member.name;
                }
                else{
                  member.name = name;
                }
                // member.age = age;
                member.phone = phone;
                // member.gender = gender;
                member.address=address;
                member.interested = interest;
                // member.level = level;

                member.addressShort=addressShort;
                member.location={type:'Point',coordinates:[locationX,locationY]};
                member.phoneAuthCheck = true;
                member.save(function (err) {
                    if (err)
                        throw err;
                    res.redirect('/master');
                });
            }
        });
    });


    //정식 오픈 전까지 마스터 받는 라우터입니다. 임시용입니다.by 순우
    router.route('/process/earlymaster').post(function (req, res) {
        console.log('/process/earlymaster 호출됨.');

        UserModel.findById(req.body.email, function (err, user) {
            if (err) {
                throw err;
                console.log(err);
            }
            if (user.length > 0) {
                console.log('이미 등록된 사용자입니다.');
                res.send('이미 등록된 사용자입니다.');
            } else {
                hasher({password: req.body.password}, function (err, pass, salt, hash) {
                    var name = req.body.name;
                    var email = req.body.email;
                    var password = hash;
                    var age = req.body.age;
                    var gender = req.body.gender;
                    var phone = req.body.phoneNumber;
                    var salt = salt;
                    var location={type:'Point',coordinates:[0,0]};

                    var user = new UserModel({
                        "id": email,
                        "password": password,
                        "nickname": name,
                        "age": age,
                        "gender": gender,
                        "phone": phone,
                        "salt": salt,
                        "sellercheck": true,
                        "provider": 'onestudy(earlyMaster)',
                        "location": location
                    });
                    // save ()로 저장
                    user.save(function (err) {
                        if (err) {
                            return err;
                        }
                        console.log("사용자 데이터 추가함.");
                        return res.redirect('/RegisterMaster2');
                    })
                });
            }
        });
    });
};
