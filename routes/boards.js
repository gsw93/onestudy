/**
 * Created by SW on 2018-06-21.
 */

var connectDB = require('../models/database');
var mongoose = require('mongoose');
require('../models/database');
var MasterBoardModel = mongoose.model("masterboards");

//파일업로드 multer
var multer = require('multer');
var fs = require('fs');

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
                console.log(currentBoard);
                currentBoard.save(function (err) {
                    if(err) {
                        throw err;
                    }
                    res.redirect('/mypage');
                });
            }
        });
    });

    router.route('/master').get(function (req, res) {
        if(req.user){
            MasterBoardModel.find({}).sort({date:-1}).exec(function(err,rawBoards){
                if(err) throw err;
                console.log('마스터게시판 목록 출력');
                res.render('master',{board:rawBoards, seller:req.session.passport.user.seller, authUser: req.user[0]});
            })
        }  else
            res.render('login');
    });

    router.route('/writeMaster').get(function (req, res) {
        res.render('writeMaster',{seller:req.session.passport.user.seller, authUser: req.user[0]});
    });

    router.route('/masterView').get(function (req, res) {
        var id = req.param('id');

        MasterBoardModel.findOne({_id:id},function(err,rawBoard){
            if(err) throw err;
            rawBoard.count += 1; // 조회수 증가

            rawBoard.save(function(err){
                if(err) throw err;

                console.log('마스터 조회수 증가 및 게시글 출력');
                res.render('masterView',{board:rawBoard, seller:req.session.passport.user.seller, authUser: req.user[0]});
            });
        });
    });

    //============================ 마스터 게시글 추가 기능 시작 ============================
    //multer 미들웨어 사용 / 파일 제한 5개

    var storage = multer.diskStorage({
        destination: function (req,file, callback){
            callback(null,'uploads')
        },
        filename: function (req,file,callback){
            callback(null,file.originalname + Date.now())
        }
    });

    var upload = multer({
        storage: storage,
        limits : {
            files :5,
            fileSize : 1024 * 1024 * 1024
        }
    });

    var addMasterBoard = function (database, id, title, author,category, region, deadline, minNum, maxNum, studyTerm, price, masterInfo, studyInfo, masterReview,path, callback) {
        var masterboard = new MasterBoardModel({"id": id, "title": title, "author": author,"category":category, "region": region, "deadline":deadline, "minNum":minNum,"maxNum":maxNum,"studyTerm":studyTerm,"price":price,"masterInfo":masterInfo, "studyInfo": studyInfo,"masterReview":masterReview,"path":path});

        masterboard.save(function (err) {
            if(err){
                callback(err, null);
                return;
            }

            console.log("게시글 추가함.");
            callback(null, masterboard);
        })

    };

    router.route('/process/addboard').post(upload.array('photo',1), function (req, res) {
        console.log('/process/addboard 호출됨.');
        // var image = new FileModel();
        // console.log(fs.readFileSync(req.files));
        // image.img.data = fs.readFileSync(req.files);
        console.log(req.user);
        var id = req.user[0].id;
        var title = req.body.title;
        var author = req.body.author;
        var category = req.body.category;
        var region = req.body.region;
        var deadline = req.body.deadline;
        var minNum = req.body.minNum;
        var maxNum = req.body.maxNum;
        var studyTerm = req.body.studyTerm;
        // var major = req.body.major;
        // var career = req.body.career;
        // var review_cnt = req.body.review_cnt;
        var price = req.body.price;
        var masterInfo = req.body.masterInfo;
        var studyInfo = req.body.studyInfo;
        var masterReview = req.body.masterReview;
        // var photo = req.body.photo;

        var files = req.files;

        console.dir('#====업로드된 첫번째 파일 정보 ====#');
        console.dir(req.files[0]);
        console.dir('#====#');


        //현재 파일 정보를 저장할 변수 선언
        var originalname ='',
            filename ='',
            mimetype = '',
            size =0,
            path ='';

        if (Array.isArray(files)){//배열에 들어가는 경우
            console.log("배열에 들어있는 파일 갯수 : %d",files.length);

            for (var index = 0; index < files.length; index++){
                originalname = files[index].originalname;
                filename = files[index].filename;
                mimetype = files[index].mimetype;
                path = files[index].path;
                size = files[index].size;
            }
        } else {
            console.log("파일 갯수 : 1");

            originalname = files[index].originalname;
            filename = files[index].filename;
            mimetype = files[index].mimetype;
            path = files[index].path;
            size = files[index].size;
        }

        console.log('현재 파일 정보 : ' + originalname + ', ' + filename + ', ' + mimetype + ', ' + size + ', ' + path);


        if(connectDB!==null){
            addMasterBoard(connectDB,id,title,author,category,region,deadline,minNum,maxNum,studyTerm,price, masterInfo, studyInfo,masterReview,path, function(err, result){
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
    //============================ 마스터 게시글 추가 기능 끝 ============================
};