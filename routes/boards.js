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
require('../public/plugins/froala/js/plugins/image.min.js');
var FroalaEditor = require('../node_modules/wysiwyg-editor-node-sdk');

module.exports = function (router) {

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

                updateStudy(req.user[0].id,currentBoard._id,currentBoard.title,currentBoard.deadline,currentBoard.studyTerm,currentBoard.reviewstar,currentBoard.stop[0].statue);
                currentBoard.save(function (err) {
                    if(err) {
                        throw err;
                    }
                    res.redirect('/mypage');
                });
            }
        });
    });

    router.route('/process/stopstudy').post(function (req, res) {
      console.log('/process/stopstudy 호출됨.');

        var id = req.body.replyId;
        UserModel.find({},{"mystudy":[{studyid:id}]},function(err,users){
          if(err) throw err;

          for(var i =0; i< users.length;i++){
            var user = users[i];
            for(var n = 0; n < user.mystudy.length;n++){
              if(user.mystudy[n].studyid==id){
                user.mystudy[n].statue = true;
                console.log(user.id);
                console.log(user.mystudy[n]);
              }
            }
            user.save(function (err){
              if(err) throw err;
              console.log('학생 DB 스터디상태 변경');
            })
          }

        });
        MasterBoardModel.findById(req.query.id ,function (err, board) {
            var currentBoard = board[0];
            if(err){
                throw err;
                console.log(err);
            }
            // 아이디 중복 제거 해야합니다!!
            if(currentBoard){
              var stop = {
                  "statue" : true,
                  "reason": req.body.stopreason
              };
              currentBoard.stop[0] = stop;
              console.log(currentBoard.stop[0]);

              currentBoard.save(function (err) {
                  if(err) {
                      throw err;
                  }
                  res.redirect('/masterView?id='+req.query.id);
              });
            }
          });
    });

    function updateStudy(id,studyid,title,date,term,star,statue){
    UserModel.findOne({id:id},function(err,rawBoard){
        if (err) {
          throw err;
        }
        rawBoard.mystudy.push({studyid:studyid,title:title,deadline:date,studyTerm:term,reviewstar:star,statue:statue});
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
                    MasterBoardModel.find({'stop.statue':false}).sort({date:-1}).exec(function(err,rawBoards){
                    MasterBoardModel.find({location: {
                            $near : {
                                $geometry : {
                                    type: "Point",
                                    coordinates : [req.user[0].location.coordinates[0],req.user[0].location.coordinates[1]]
                                }
                            }
                        },
                        category:req.user[0].interested,'stop.statue':false}).limit( 4 ).
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
                MasterBoardModel.find({'stop.statue':false}).sort({date:-1}).exec(function(err,rawBoards){
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

    router.get('/deleteMaster', function(req, res){
        var id = req.param('id');
        MasterBoardModel.remove({_id:id}, function(err){
            res.redirect('/mypage2');
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

    router.route('/process/deleteComment').post(function (req, res) {
        var reply_id=req.body.Id;
        var commentcnt = req.body.commentcnt;

       console.log('/process/deleteComment 호출');

       MasterBoardModel.findOne({_id:reply_id},function(err,rawBoard){
         if(err) throw err;
         var commentlength = rawBoard.comments.length;
         var commenttotal = 0;

         for(var i = 0; i< rawBoard.comments.length; i++){
           commenttotal += rawBoard.comments[i].star_rating;
           if((rawBoard.comments[i].author == req.user[0].nickname) &&(rawBoard.comments[i].contents == commentcnt)){
             var commentstar = rawBoard.comments[i].star_rating;
           }
         }
         if(commentlength==1){
           var reviewstar = 0;
         }else{
            var reviewstar = Math.round((commenttotal-commentstar) / (commentlength-1));
         }

         console.log("============================");
         console.log("기존 댓글 개수 : " + commentlength);
         console.log("기존 별점 총합 : " + commenttotal);
         console.log("삭제할 댓글 별점  : " + commentstar);
         console.log("변경된 게시글 별점 : " + reviewstar);
         console.log("============================");

         MasterBoardModel.update({_id:reply_id},{$pull:{'comments':{'author':req.user[0].nickname,'contents':commentcnt}}},function(err,rawBoard){
           if(err) throw err;
           console.log(req.user[0].nickname + ' 댓글 삭제');
           updateStar(reply_id,reviewstar);
       })
     });
        res.redirect('/masterView?id='+reply_id);
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

    router.route('/upload_image').post(function (req, res) {
        // Store file.
        FroalaEditor.Image.upload(req, '/froala/images/', function (err, data) {
            // Return data.
            if (err) {
                return res.send(JSON.stringify(err));
            }
            var thishost = req.protocol + '://' + req.get('host');
            console.log("thishost = " + thishost);
            var fullurl = thishost + data.link;
            console.log("fullurl = " + fullurl);
            // update the original data.link that contained only
            // the URI to the complete URL that includes hostname
            data.link = fullurl;
            console.log("Modified data = " + JSON.stringify(data));

            console.log(data);
            res.send(data);
        });
    });

    // router.route('/upload_video').post(function (req, res) {
    //     // Store file.
    //     FroalaEditor.Video.upload(req, '/froala/videos/', function (err, data) {
    //         // Return data.
    //         if (err) {
    //             return res.send(JSON.stringify(err));
    //         }
    //         var thishost = req.protocol + '://' + req.get('host');
    //         console.log("thishost = " + thishost);
    //         var fullurl = thishost + data.link;
    //         console.log("fullurl = " + fullurl);
    //         // update the original data.link that contained only
    //         // the URI to the complete URL that includes hostname
    //         data.link = fullurl;
    //         console.log("Modified data = " + JSON.stringify(data));
    //
    //         console.log(data);
    //         res.send(data);
    //     });
    // });

    var addMasterBoard = function (database, id, masterphoto, title, author,category,day, region, deadline, minNum, maxNum, studyTerm, price,studynum, masterInfo, studyInfo, reviewstar,path,filename,originalname,locationX,locationY, siNm, callback) {

        var thumbnail_list = '';

        thumbnail.ensureThumbnail(filename, 345, 200, function(err, thumb1){
            if(err) console.error(err);
            thumbnail_list = '/uploads/boardThumb/'+thumb1;

            var masterboard = new MasterBoardModel({"id": id, "masterphoto": masterphoto, "title": title, "author": author,"category":category,"day":day, "region": region, "deadline":deadline, "minNum":minNum,"maxNum":maxNum,"studyTerm":studyTerm,"price":price,"studynum":studynum,"masterInfo":masterInfo, "studyInfo": studyInfo,"reviewstar":reviewstar,"path":path,"originalname":originalname,"thumbnail_list":thumbnail_list,"stop":[{statue:false}],"location":{type:'Point',coordinates:[locationX,locationY]}, "regionShort":siNm});

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

    router.route('/process/addboard').post(upload.array('photo',3), function (req, res) {
        console.log('/process/addboard 호출됨.');
        console.log(req.user);
        var board_id = req.query.id;
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

        //현재 파일 정보를 저장할 변수 선언
        var originalname = [{}],
            filename = [{}],
            mimetype = '',
            size = 0,
            boardthumb = [{}],
            path = [{}];

        if (board_id) {
            var newvalue;
            var myquery = {_id:board_id};

            console.log("파일파일파일######: " + files);

            if( files == "" || files == null || files == undefined || ( files != null && typeof files == "object" && !Object.keys(files).length ) ){
                newvalue = {
                    $set: {
                        masterphoto: masterphoto,
                        title: title,
                        author: author,
                        category: category,
                        day: day,
                        region: region,
                        deadline: deadline,
                        minNum: minNum,
                        maxNum: maxNum,
                        studyTerm: studyTerm,
                        price: price,
                        studynum: studynum,
                        masterInfo: masterInfo,
                        studyInfo: studyInfo,
                        reviewstar: reviewstar,
                        stop : [{statue:false}],
                        location: {type: 'Point', coordinates: [locationX, locationY]},
                        regionShort: siNm
                    }
                };
            } else {

                var thumbnail_func = function (index) {
                    thumbnail.ensureThumbnail(files[index].filename, 943, 350, function (err, thumb) {
                        path[index] = '/uploads/boardThumb/' + thumb;
                        if(index===0){
                            thumbnail.ensureThumbnail(files[0].filename, 345, 200, function(err, thumb1) {
                                if (err) console.error(err);
                                boardthumb[0] = '/uploads/boardThumb/' + thumb1;
                            });
                        }
                    });
                };

                for (var index = 0; index < files.length; index++) {
                    originalname[index] = files[index].originalname;
                    filename[index] = files[index].filename;
                    mimetype = files[index].mimetype;
                    thumbnail_func(index);
                    size = files[index].size;
                }

                console.log(boardthumb);

                newvalue = {
                    $set: {
                        masterphoto: masterphoto,
                        title: title,
                        author: author,
                        category: category,
                        day: day,
                        region: region,
                        deadline: deadline,
                        minNum: minNum,
                        maxNum: maxNum,
                        studyTerm: studyTerm,
                        price: price,
                        studynum: studynum,
                        masterInfo: masterInfo,
                        studyInfo: studyInfo,
                        reviewstar: reviewstar,
                        path: path,
                        location: {type: 'Point', coordinates: [locationX, locationY]},
                        regionShort: siNm,
                        thumbnail_list: boardthumb,
                        originalname: originalname
                    }
                };
            }
            console.log(newvalue);
            setTimeout(function () {
                MasterBoardModel.updateOne(myquery, newvalue, function (err, res) {
                    if (err) throw err;
                    console.log('게시글 변경');
                });
                res.redirect('/master')
            }, 500);
        } else {

            var thumbnail_func = function (index) {
                thumbnail.ensureThumbnail(files[index].filename, 943, 350, function (err, thumb) {
                    path[index] = '/uploads/boardThumb/' + thumb;
                });
            };

            for (var index = 0; index < files.length; index++) {
                originalname[index] = files[index].originalname;
                filename[index] = files[index].filename;
                mimetype = files[index].mimetype;
                thumbnail_func(index);
                size = files[index].size;
            }

            setTimeout(function () {
                if (connectDB !== null) {
                    addMasterBoard(connectDB, id, masterphoto, title, author, category, day, region, deadline, minNum, maxNum, studyTerm, price, studynum, masterInfo, studyInfo, reviewstar, path, filename[0], originalname, locationX, locationY, siNm, function (err, result) {
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
        }
    });

    //결제완료
    router.route('/process/pay').post(function (req, res) {
        console.log('/process/pay 호출됨.');
        var id = req.body.id;
        var stdent_id = req.user[0].id;


        MasterBoardModel.findOne({_id:id},function(err,rawBoard){
            if(err) throw err;
            if(rawBoard.studentList.length){
              for(var i =0 ;i<rawBoard.studentList.length ; i++){
                if(!rawBoard.studentList[i].statue){
                  rawBoard.studentList[i].statue = true;
                  console.log (rawBoard.studentList[i].email+'학생 결제완료');
                }else{
                  console.log ('결제할 학생이 없습니다.');
                }
              }
            }else{
              console.log ('결제할 학생이 없습니다.');
            }
            rawBoard.save(function(err){
                if(err) throw err;

                console.log('결제완료');
                console.log(rawBoard);
                res.redirect('/payment?id='+id);
            });
        });
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
