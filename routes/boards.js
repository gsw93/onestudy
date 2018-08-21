/**
 * Created by SW on 2018-06-21.
 */

var connectDB = require('../models/database');
var mongoose = require('mongoose');
require('../models/database');
var MasterBoardModel = mongoose.model("masterboards");
var UserModel = mongoose.model("users");
var async = require('async');

//파일업로드 multer
var multer = require('multer');
var fs = require('fs');
var Thumbnail = require('thumbnail');
var thumbnail = new Thumbnail('./public/uploads/board',  './public/uploads/boardThumb');

module.exports = function (router) {

    // 스터디에 참여한 학생들 저장하기
    // 스터디 참여하면 마이페이지로 리다이렉트 시키고 자신이 신청한 스터디 목록이 뜨게 하려고 했으나
    // 마이페이지는 대대적인 수정이 필요해보임. 그래서 일단 보류
    router.route('/process/participateStudy').post(function (req, res) {
        console.log('/process/participateStudy 호출됨.');
        console.log(req.user);
        MasterBoardModel.findById(req.query.id ,function (err, board) {
            var currentBoard = board[0];
            if(err){
                throw err;
                console.log(err);
            }
            // 아이디 중복 제거 해야합니다!!
            if(currentBoard){
                var student = {
                    "email": req.user[0].id,
                    "name": req.user[0].name,
                    "phone": req.user[0].phone,
                    "introduce": req.body.selfIntroduction
                };

                currentBoard.studentList[currentBoard.studentList.length] = student;
                currentBoard.currentNum++;
                console.log(currentBoard);
                // UserModel.findById(req.user[0].id,function(err,users){
                //   if(err){
                //       throw err;
                //       console.log(err);
                //   }
                //   var mystudy = {
                //     "studyid" : req.body.replyId,
                //     "title" : currentBoard.title,
                //     "deadline" : currentBoard.deadline,
                //     "reviewstar" : currentBoard.reviewstar
                //   }
                // })
                updateStudy(req.user[0].id,currentBoard._id,currentBoard.title,currentBoard.deadline,currentBoard.reviewstar);
                currentBoard.save(function (err) {
                    if(err) {
                        throw err;
                    }
                    res.redirect('/mypage');
                });
            }
        });
    });


    function updateStudy(id,studyid,title,date,star){
    UserModel.findOne({id:id},function(err,rawBoard){
        if (err) {
          throw err;
        }
        rawBoard.mystudy.push({studyid:studyid,title:title,deadline:date,reviewstar:star});
        rawBoard.save(function(err){
          if(err)throw err;
          console.log('마이스터디 추가');
        })
      })
    }

    router.route('/master').get(function (req, res) {
        if(req.user){
            //07_15 add by sehyeon
            if(req.user[0].location.coordinates[0])
            {
                    MasterBoardModel.find({}).sort({date:-1}).exec(function(err,rawBoards){
                    MasterBoardModel.find({location: {
                            $near : {
                                $geometry : {
                                    type: "Point",
                                    coordinates : [req.user[0].location.coordinates[0],req.user[0].location.coordinates[1]]
                                }
                            }
                        },
                        category:req.user[0].interested}).limit( 4 ).
                    exec(function (err,interBoards){
                        if(err) throw err;
                        console.log('마스터게시판 목록 출력');
                        //console.log(req.user[0]);
                        // console.log(interBoards);
                        // console.log(rawBoards);
                        //07_04 add master->master_GSH 변경
                        res.render('master_GSH',{board:rawBoards, seller:req.session.passport.user.seller, authUser: req.user[0], interboard:interBoards});
                    });
                });
            }
            else {
                MasterBoardModel.find({}).sort({date:-1}).exec(function(err,rawBoards){
                    if(err) throw err;
                    console.log('마스터게시판 목록 출력');
                    console.log('test: '+ rawBoards);
                    //console.log(req.user[0]);
                    //07_04 add master->master_GSH 변경
                    res.render('master_GSH',{board:rawBoards, seller:req.session.passport.user.seller, authUser: req.user[0], interboard:null});
                });
            }
        }  else
            res.render('login');
    });
    router.route('/master_jjy').get(function (req, res) {
        if(req.user){
            //07_15 add by sehyeon
            if(req.user[0].location.coordinates[0])
            {
                MasterBoardModel.find({}).sort({date:-1}).exec(function(err,rawBoards){
                    MasterBoardModel.find({location: {
                            $near : {
                                $geometry : {
                                    type: "Point",
                                    coordinates : [req.user[0].location.coordinates[0],req.user[0].location.coordinates[1]]
                                }
                            }
                        },
                        category:req.user[0].interested}).limit( 4 ).
                    exec(function (err,interBoards){
                        if(err) throw err;
                        console.log('마스터게시판 목록 출력');
                        //console.log(req.user[0]);
                        console.log(interBoards);
                        //07_04 add master->master_GSH 변경
                        res.render('master_JJY',{board:rawBoards, seller:req.session.passport.user.seller, authUser: req.user[0],interboard:interBoards});
                    });
                });
            }
            else {
                MasterBoardModel.find({}).sort({date:-1}).exec(function(err,rawBoards){
                    if(err) throw err;
                    console.log('마스터게시판 목록 출력');
                    //console.log(req.user[0]);
                    //07_04 add master->master_GSH 변경
                    res.render('master_GSH',{board:rawBoards, seller:req.session.passport.user.seller, authUser: req.user[0],interboard:null});
                });
            }
        }  else
            res.render('login');
    });


    router.route('/writeMaster').get(function (req, res) {
        //07_04 add writeMaster->writeMaster_GSH 변경
        res.render('writeMaster_GSH',{seller:req.session.passport.user.seller, authUser: req.user[0]});
    });
    router.route('/ModifywriteMaster').get(function (req, res) {
        //07_04 add writeMaster->writeMaster_GSH 변경
        var id = req.param('id');

        MasterBoardModel.findOne({_id:id},function(err,rawBoard){
            res.render('ModifywriteMaster_GSH',{seller:req.session.passport.user.seller, authUser: req.user[0],board:rawBoard});
        });
    });

    router.route('/masterView').get(function (req, res) {
        var id = req.param('id');

        MasterBoardModel.findOne({_id:id},function(err,rawBoard){
            if(err) throw err;
            rawBoard.count++; // 조회수 증가

            rawBoard.save(function(err){
                if(err) throw err;

                console.log('마스터 조회수 증가 및 게시글 출력');
                console.log(rawBoard);
                res.render('masterView',{board:rawBoard, seller:req.session.passport.user.seller, authUser: req.user[0]});
            });
        });
    });



    //============================ 마스터 게시글 추가 기능 시작 ============================
    //multer 미들웨어 사용 / 파일 제한 3개

    var storage = multer.diskStorage({
        destination: function (req,file, callback){
            callback(null,'public/uploads/board');
        },
        filename: function (req,file,callback){
            callback(null,Date.now()+file.originalname);
        }
    });

    var upload = multer({
        storage: storage,
        limits : {
            files :3,
            fileSize : 5 * 1024 * 1024
        }
    });

    var addMasterBoard = function (database, id, masterphoto, title, author,category,day, region, deadline, minNum, maxNum, studyTerm, price,studynum, masterInfo, studyInfo, reviewstar,path,file,locationX,locationY, siNm, callback) {

        var thumbnail_list = '';

        console.log('여기까지 나오나 ?' + path);

        thumbnail.ensureThumbnail(file.filename, 345, 200, function(err, thumb1){
            if(err) console.error(err);
            thumbnail_list = '/uploads/boardThumb/'+thumb1;

            console.log("리스트: "+thumbnail_list);
            console.log("슬라이더: "+path);

            var masterboard = new MasterBoardModel({"id": id, "masterphoto": masterphoto, "title": title, "author": author,"category":category,"day":day, "region": region, "deadline":deadline, "minNum":minNum,"maxNum":maxNum,"studyTerm":studyTerm,"price":price,"studynum":studynum,"masterInfo":masterInfo, "studyInfo": studyInfo,"reviewstar":reviewstar,"path":path,"thumbnail_list":thumbnail_list,"location":{type:'Point',coordinates:[locationX,locationY]}, "regionShort":siNm});

            console.log('#####check point#####');

            masterboard.save(function (err) {
                if(err){
                    callback(err, null);
                    return;
                }
                console.log("게시글 추가함.");
                callback(null, masterboard);
            });
        });
    };
    function modifyMasterBoard(id, masterphoto, title, author,category,day, region, deadline, minNum, maxNum, studyTerm, price,studynum, masterInfo, studyInfo, reviewstar,path,locationX,locationY, siNm){
      var myquery = {id:id};
      var newvalue = {$set : {masterphoto: masterphoto, title: title, author: author,category:category,day:day, region: region, deadline:deadline, minNum:minNum,maxNum:maxNum,studyTerm:studyTerm,price:price,studynum:studynum,masterInfo:masterInfo, studyInfo: studyInfo,reviewstar:reviewstar,path:path,location:{type:'Point',coordinates:[locationX,locationY]}, regionShort:siNm}};
      console.log(newvalue);
      MasterBoardModel.updateOne(myquery,newvalue,function(err,res){
        if(err) throw err;
        console.log('게시글 변경');
      })
    }
    function addComment(id,author,contents,star_rating){
      MasterBoardModel.findOne({_id:id},function(err,rawBoard){
        if (err) {
          throw err;
        }
        rawBoard.comments.push({id:id,author:author,contents:contents,star_rating:star_rating});
        rawBoard.save(function(err){
          if(err)throw err;
          console.log('댓글 추가');
        })
      })
    }

    function updateStar(id,reviewstar){
      var myquery = {_id:id};
      var newvalue = {$set : {reviewstar:reviewstar}};
      console.log(newvalue);
      MasterBoardModel.updateOne(myquery,newvalue,function(err,res){
        if(err) throw err;
        console.log('리뷰 별점 변경');
      })
    }
    router.route('/process/comment').post(function (req, res) {
        var reply_id=req.body.replyId;
        var author = req.user[0].nickname;
        var contents = req.body.contents;
        var star_rating=req.body.star_rating;
        var reviewstar=req.body.reviewstar;
        addComment(reply_id,author,contents,star_rating);
        updateStar(reply_id,reviewstar);

        res.redirect('/masterView?id='+req.body.replyId);
    });
    //검색기능 부탁해 세현오빠ㅎㅎㅎㅎ
    router.get('/process/search',function(req,res){
      var select_region2 = req.param('select_region2');
      var field = req.param('field');

      MasterBoardModel.find({$or:[{regionShort:select_region2},{category:field}]}).sort({date:-1}).exec(function(err,searchRegion){
        if(err) throw err;
        res.render('master_JJY',{board:searchRegion, seller:req.session.passport.user.seller, authUser: req.user[0]});
      })
    });


    router.route('/process/addboard').post(upload.array('photo',3), function (req, res) {
        console.log('/process/addboard 호출됨.');
        console.log(req.user);
        var id = req.user[0].id;
        var masterphoto = req.user[0].photo;
        var title = req.body.title;
        var author = req.body.author;
        var category = req.body.category;
        var day = req.body.day;
        var region = req.body.address;
        var deadline = req.body.deadline;
        var minNum = req.body.minNum;
        var maxNum = req.body.maxNum;
        var studyTerm = req.body.studyTerm;
        var price = req.body.price;
        var studynum = req.body.studynum;
        var masterInfo = req.body.masterInfo;
        var studyInfo = req.body.studyInfo;
        var reviewstar = req.body.reviewstar;
        // var photo = req.body.photo;
        //07_04 add by sehyeon
        //location 좌표 입력 위한 추가
        var locationX = req.body.x;
        var locationY = req.body.y;
        //07_15 add by sehyeon
        var siNm = req.body.siNm;
        var files = req.files;

        console.dir('#====업로드된 파일 정보 ====#');
        console.dir(req.files);
        console.dir('#====#');

        //현재 파일 정보를 저장할 변수 선언
        var originalname = '',
            filename = '',
            mimetype = '',
            size = 0,
            path = [{}];

        // if (Array.isArray(files)){//배열에 들어가는 경우
        //     console.log("배열에 들어있는 파일 갯수 : %d",files.length);

        var thumbnail_func = function (index) {
            thumbnail.ensureThumbnail(files[index].filename, 943, 350, function (err, thumb) {
                path[index] = '/uploads/boardThumb/' + thumb;
                console.log('현재 파일의 이미지 목록 : ' + path[index]);
            });
        };

        for (var index = 0; index < files.length; index++) {
            originalname = files[index].originalname;
            filename = files[index].filename;
            mimetype = files[index].mimetype;
            thumbnail_func(index);
            size = files[index].size;
        }

        setTimeout(function () {
            console.log('현재 파일의 이미지 목록2 : ' + path[0] + ', ' + path[1] + ', ' + path[2]);

            if (connectDB !== null) {
                addMasterBoard(connectDB, id, masterphoto, title, author, category, day, region, deadline, minNum, maxNum, studyTerm, price, studynum, masterInfo, studyInfo, reviewstar, path, files[0], locationX, locationY, siNm, function (err, result) {
                    if (err) {
                        throw err;
                    }

                    if (result) {
                        res.redirect('/master');
                    }
                    else {    // 결과 객체가 없으면 실패 응답 전송
                        res.writeHead('200', {'Content-Type': 'text/html; charset=utf8 '});
                        res.write('<h1>게시물 추가 실패</h1>');
                        res.end();
                    }
                })
            } else {    // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
                res.writeHead('200', {'Content-Type': 'text/html; charset=utf8 '});
                res.write('<h1>데이터베이스 연결 실패</h1>');
                res.end();
            }
        }, 500);
    });

    router.route('/process/ModifywriteMaster').post(upload.array('photo',3), function (req, res) {
        console.log('/process/ModifywriteMaster 호출됨.');
        // var image = new FileModel();
        // console.log(fs.readFileSync(req.files));
        // image.img.data = fs.readFileSync(req.files);
        console.log(req.user);
        var id = req.user[0].id;
        var masterphoto = req.user[0].photo;
        var title = req.body.title;
        var author = req.body.author;
        var category = req.body.category;
        var day = req.body.day;
        var region = req.body.address;
        var deadline = req.body.deadline;
        var minNum = req.body.minNum;
        var maxNum = req.body.maxNum;
        var studyTerm = req.body.studyTerm;
        var price = req.body.price;
        var studynum =req.body.studynum;
        var masterInfo = req.body.masterInfo;
        var studyInfo = req.body.studyInfo;
        var reviewstar = req.body.reviewstar;
        // var photo = req.body.photo;
        //07_04 add by sehyeon
        //location 좌표 입력 위한 추가
        var locationX=req.body.x;
        var locationY=req.body.y;
        //07_15 add by sehyeon
        var siNm = req.body.siNm;

        var files = req.files;

        console.dir('#====업로드된 첫번째 파일 정보 ====#');
        console.dir(req.files);
        console.dir('#====#');


        //현재 파일 정보를 저장할 변수 선언
        var originalname ='',
            filename ='',
            mimetype = '',
            size =0,
            path = [{}];

        if (Array.isArray(files)){//배열에 들어가는 경우
            console.log("배열에 들어있는 파일 갯수 : %d",files.length);

            for (var index = 0; index < files.length; index++){
                originalname = files[index].originalname;
                filename = files[index].filename;
                mimetype = files[index].mimetype;
                path[index] = '/uploads/board/'+filename;
                size = files[index].size;
            }
        } else {
            console.log("파일 갯수 : 1");

            originalname = files[index].originalname;
            filename = files[index].filename;
            mimetype = files[index].mimetype;
            path[0] = '/uploads/board/'+filename;
            size = files[index].size;
        }

        console.log('현재 파일의 이미지 목록 : ' + path[0] + ', ' + path[1] + ', ' + path[2]);


        if(connectDB!==null){
            modifyMasterBoard(id,masterphoto,title,author,category,day,region,deadline,minNum,maxNum,studyTerm,price,studynum, masterInfo, studyInfo,reviewstar,path,locationX,locationY,siNm, function(err, result){
                if (err) { throw err; }

                if (result) {
                    res.redirect('/master');
                }
                else {    // 결과 객체가 없으면 실패 응답 전송
                    res.writeHead('200', { 'Content-Type':'text/html; charset=utf8 '});
                    res.write('<h1>게시물 추가 실패</h1>');
                    res.end();
                }
            })
        } else {    // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
            res.writeHead('200', { 'Content-Type':'text/html; charset=utf8 '});
            res.write('<h1>데이터베이스 연결 실패</h1>');
            res.end();
        }
    });

    router.route('/payment').get(function (req, res) {
        var id = req.param('id');

        MasterBoardModel.findOne({_id:id},function(err,rawBoard){
            if(err) throw err;
            console.log(rawBoard.studentList)
            res.render('studyPay',{board:rawBoard, seller:req.session.passport.user.seller, authUser: req.user[0]});
        });

    });
    //미결제 중인 학생만 결제
    router.route('/payment3').get(function (req, res) {
        var id = req.param('id');

        MasterBoardModel.findOne({_id:id},function(err,rawBoard){
            if(err) throw err;
            console.log(rawBoard.studentList)
            res.render('studyPay2',{board:rawBoard, seller:req.session.passport.user.seller, authUser: req.user[0]});
        });

    });

    router.route('/payment2').get(function (req, res) {
        res.render('priceTable',{seller:req.session.passport.user.seller, authUser: req.user[0]});
    });

    router.route('/completeMaster').get(function (req, res) {
        res.render('completeMaster',{seller:req.session.passport.user.seller, authUser: req.user[0]});
    });

    //============================ 마스터 게시글 추가 기능 끝 ============================
};
