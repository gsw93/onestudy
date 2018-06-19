/**
 * Created by SW on 2018-05-25.
 */

//============================ 모듈 설정 시작 ============================
// Express 기본 모듈 불러오기
var express = require('express')
    , http = require('http')
    , https = require('https')
    , path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    , serveStatic = require('serve-static');

// Mongoose
var mongoose = require('mongoose');

// 암호화
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();

// passport
var passport = require('passport');

// local 인증
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// Session 미들웨어 불러오기
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

// Express 객체 생성
var app = express();

//파일업로드 multer
var multer = require('multer');
var fs = require('fs');

//세션 설정
var store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/db',
    databaseName: 'db',
    collection: 'sessions'
});

var options = {
    ca: fs.readFileSync('./gogetssl/onestudyca.pem'),
    key: fs.readFileSync('./gogetssl/onestudykey.pem'),
    cert: fs.readFileSync('./gogetssl/onestudycrt.pem')
};

//public 폴더를 static으로 오픈
app.use(serveStatic(path.join(__dirname, 'public')));

app.use(require('express-session')({
    secret: 'sad@*!lsd42scc',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 //1week
    },
    store: store,
    resave: true,
    savaUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    if(!req.secure){
        return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    next();
});
// 라우터 객체 참조
var router = express.Router();

// 기본 속성 설정
app.set('port', process.env.PORT || 80);

// view engine 설정
app.set('view engine', 'ejs');

// views 폴더 위치 설정
app.set('views', './views');

// 라우터 객체를 app 객체에 등록
app.use('/', router);

// body-parser를 사용해 application.x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }));

// body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());

// cookie-parser 설정
app.use(cookieParser());

//============================ 모듈 설정 끝 ============================

//============================ 데이터베이스에 연결 시작 ============================
var connectDB = require('./models/database');
var UserModel = mongoose.model("users");
var MasterBoardModel = mongoose.model("masterboards");
var StudyBoardModel = mongoose.model("studyboards");
var MasterModel = mongoose.model("masters");
var StudentModel = mongoose.model("students");
// var FileModel = mongoose.model("images");
//============================ 데이터베이스에 연결 끝 ============================

//============================ 로그인 기능 시작 ============================

var configPassport = require('./config/controller');
configPassport(app, passport);

//============================ 로그인 기능 끝 ============================

//============================ 회원가입 기능 시작 ============================
// 사용자를 추가하는 함수
var addUser = function (database, id, password, nickname, salt, callback) {
    console.log('addUser 호출됨 : ' + id + ', ' + password + ', ' + nickname + ', ' + salt);

    // UserModel의 인스턴스 생성
    var user = new UserModel({"id": id, "password": password, "nickname": nickname, "salt": salt});

    // save ()로 저장
    user.save(function (err) {
        if(err) {
            callback(err, null);
            return;
        }

        console.log("사용자 데이터 추가함.");
        callback(null, user);
    });
};

// 사용자 추가 라우팅 함수 - 클라이언트에서 보내온 데이터를 이용해 데이터베이스에 추가
app.post('/process/adduser', function (req, res) {
    console.log('/process/adduser 호출됨.');

    hasher({password:req.body.password}, function (err, pass, salt, hash) {
        var id = req.body.username;
        var password = hash;
        var nickname = req.body.nickname;
        var salt = salt;

        console.log('요청 파라미터 : ' + id + ', ' + password + ', ' + nickname + ', ' + salt);

        // 데이터베이스 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
        if(connectDB!==null) {
            addUser(connectDB, id, password, nickname, salt, function (err, result) {
                if (err) { throw err;}

                // 결과 객체 확인하여 추가된 데이터 있으면 성공 응답 전송
                if (result) {
                    console.dir(result);
                    res.redirect('/');
                } else {    // 결과 객체가 없으면 실패 응답 전송
                    res.writeHead('200', { 'Content-Type':'text/html; charset=utf8 '});
                    res.write('<h1>사용자 추가 실패</h1>');
                    res.end();
                }
            });
        } else {    // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
            res.writeHead('200', { 'Content-Type':'text/html; charset=utf8 '});
            res.write('<h1>데이터베이스 연결 실패</h1>');
            res.end();
        }
    });
});
//============================ 회원가입 기능 끝 ============================
//============================ 마스터 추가 기능 시작 ============================

var addMaster = function (database, name, age, gender, photo, majors, phone, currentuser, callback) {

    UserModel.findById(currentuser._doc.id, function (err, tank) {
        if (err) {
            return done(err);
        }
        console.log("아이디 [%s]로 사용자 검색 결과", tank[0].id);

        if(tank.length > 0) {
            console.log('아이디 [%s]가 일치하는 사용자 찾음.', tank[0].id);

            var master = new MasterModel({"id": tank[0].id, "password": tank[0].password, "nickname": tank[0].nickname, "salt": tank[0].salt, "name": name, "age": age, "gender": gender, "photo": photo, "majors": majors, "phone": phone});

            master.save(function (err) {
                if(err) {
                    callback(err, null);
                    return;
                }
                console.log('마스터 정보 추가 완료.');
                console.log('유저 정보 삭제 완료');
                tank[0].remove();
                callback(null, master);
            });

        } else {
            console.log("일치하는 사용자를 찾지 못함.");
            done(null, false);
        }
    });
};

app.post('/process/addmaster', function (req, res) {
    console.log('/process/addmaster 호출됨.');
    var name = req.body.name;
    var age = req.body.age;
    var gender = req.body.gender;
    var photo = req.body.photo;
    var majors = req.body.majors;
    var phone = req.body.phone;
    var currentuser = req.user[0];

    if(connectDB!==null){
        addMaster(connectDB, name, age, gender, photo, majors, phone, currentuser, function(err, result){
            if (err) { throw err; }

            if (result) {
                req.session.passport.user.seller=true;
                res.redirect('/');
            } else {    // 결과 객체가 없으면 실패 응답 전송
                res.writeHead('200', { 'Content-Type':'text/html; charset=utf8 '});
                res.write('<h1>마스터 등록 실패</h1>');
                res.end();
            }
        });
    } else {    // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        res.writeHead('200', { 'Content-Type':'text/html; charset=utf8 '});
        res.write('<h1>데이터베이스 연결 실패</h1>');
        res.end();
    }
});
//============================ 마스터 추가 기능 끝 ============================


//============================ 학생 게시글 추가 기능 시작 ============================
var addStudent = function (database,name,age,category,region_do,region_si,region_gu,gender,studentInfo, grade, callback) {

    var student = new StudentModel({"name":name,"age":age,"category":category,"region_do":region_do,"region_si":region_si,"region_gu":region_gu,"gender":gender,"studentInfo":studentInfo,"grade":grade});

    student.save(function (err) {
        if(err){
            callback(err, null);
            return;
        }

        console.log("학생 추가함.");
        callback(null, student);
    })

};

app.post('/process/addstudent', function (req, res) {
   console.log('/process/addstudent 호출됨.');

   var name = req.body.name;
   var age = req.body.age;
   var category = req.body.category;
   var region_do = req.body.region_do;
   var region_si = req.body.region_si;
   var region_gu = req.body.region_gu;
   var gender = req.body.gender;
   var studentInfo = req.body.studentInfo;
   var grade = req.grade;

   if(age==11){
     grade = "초등학교 4학년";
   }
   if(age==12){
     grade = "초등학교 5학년";
   }
   if(age==13){
     grade = "초등학교 6학년";
   }
   if(age==14){
     grade = "중학교 1학년";
   }
   if(age==15){
     grade = "중학교 2학년";
   }
   if(age==16){
     grade = "중학교 3학년";
   }
   if(age==17){
     grade = "고등학교 1학년";
   }
   if(age==18){
     grade = "고등학교 2학년";
   }
   if(age==19){
     grade = "고등학교 3학년";
   }


   if(connectDB!==null){
       addStudent(connectDB,name,age,category,region_do,region_si,region_gu,gender,studentInfo,grade, function(err, result){
           if (err) { throw err; }

           if (result) {
               res.redirect('/student');
           } else {    // 결과 객체가 없으면 실패 응답 전송
               res.writeHead('200', { 'Content-Type':'text/html; charset=utf8 '});
               res.write('<h1>학생 추가 실패</h1>');
               res.end();
           }
       });
   } else {    // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
       res.writeHead('200', { 'Content-Type':'text/html; charset=utf8 '});
       res.write('<h1>데이터베이스 연결 실패</h1>');
       res.end();
   }
});

//============================ 학생 게시글 추가 기능 끝 ============================


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

var addMasterBoard = function (database,title, author,category, region, deadline, minNum, maxNum, studyTerm, price, masterInfo, studyInfo, masterReview,path, callback) {
    var masterboard = new MasterBoardModel({"title": title, "author": author,"category":category, "region": region, "deadline":deadline, "minNum":minNum,"maxNum":maxNum,"studyTerm":studyTerm,"price":price,"masterInfo":masterInfo, "studyInfo": studyInfo,"masterReview":masterReview,"path":path});

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
        addMasterBoard(connectDB,title,author,category,region,deadline,minNum,maxNum,studyTerm,price, masterInfo, studyInfo,masterReview,path, function(err, result){
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

//============================ 스터디 게시글 추가 기능 시작 ============================
var addStudyBoard = function (database,title,author,category,region,deadline,minNum,maxNum, studyTerm, studyInfo, callback) {

    var board = new StudyBoardModel({"title":title,"author":author,"category":category,"region":region,"deadline":deadline,"minNum":minNum,"maxNum":maxNum, "studyTerm":studyTerm, "studyInfo":studyInfo});

    board.save(function (err) {
        if(err){
            callback(err, null);
            return;
        }

        console.log("게시글 추가함.");
        callback(null, board);
    })

};

app.post('/process/addstudyboard', function (req, res) {
   console.log('/process/addstudyboard 호출됨.');

   var title = req.body.title;
   var author = req.body.author;
   var category = req.body.category;
   var region = req.body.region;
   var deadline = req.body.deadline;
   var minNum = req.body.minNum;
   var maxNum = req.body.maxNum;
   var studyTerm = req.body.studyTerm;
   var studyInfo = req.body.studyInfo;


   if(connectDB!==null){
       addStudyBoard(connectDB,title,author,category,region,deadline,minNum,maxNum, studyTerm, studyInfo, function(err, result){
           if (err) { throw err; }

           if (result) {
               res.redirect('/study');
           } else {    // 결과 객체가 없으면 실패 응답 전송
               res.writeHead('200', { 'Content-Type':'text/html; charset=utf8 '});
               res.write('<h1>게시물 추가 실패</h1>');
               res.end();
           }
       });
   } else {    // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
       res.writeHead('200', { 'Content-Type':'text/html; charset=utf8 '});
       res.write('<h1>데이터베이스 연결 실패</h1>');
       res.end();
   }
});

//============================ 스터디 게시글 추가 기능 끝 ============================


//============================ 라우터 시작 ============================

var userPassport = require('./routes/user_passport');
userPassport(app, passport);

app.get('/apply', function (req, res) {
    if(req.user){
        res.render('apply');
    } else{
        res.render('login');
    }
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.get('/error', function (req, res) {
    res.render('error');
});

// 글쓰기 라우터
app.get('/writeStudy', function (req, res) {
        res.render('writeStudy', {authUser: req.user[0].nickname});
});

app.get('/master', function (req, res) {
    if(req.user){
      MasterBoardModel.find({}).sort({date:-1}).exec(function(err,rawBoards){
        if(err) throw err;
        console.log('마스터게시판 목록 출력');
        res.render('master',{board:rawBoards,seller:req.session.passport.user.seller, authUser: req.user[0].nickname});
      })
    }  else
        res.render('login');
});

app.get('/writeMaster',function (req,res){
  res.render('writeMaster',{authUser:req.user[0].nickname});
});

app.get('/masterView',function(req,res){
    var id = req.param('id');

    MasterBoardModel.findOne({_id:id},function(err,rawBoard){
        if(err) throw err;
        rawBoard.count += 1; // 조회수 증가

        rawBoard.save(function(err){
            if(err) throw err;

            console.log('마스터 조회수 증가 및 게시글 출력');
            res.render('masterView',{board:rawBoard, authUser:req.user[0].nickname});
        });
    });
});

app.get('/study', function (req, res) {
    if(req.user){
        StudyBoardModel.find({}).sort({date:-1}).exec(function(err,rawBoards){
            if(err) throw err;
            console.log('스터디게시판 목록 출력');
            res.render('study',{board:rawBoards, authUser: req.user[0].nickname});
        });
    } else{
            // res.render('study',{board:rawBoards, seller:false});
        res.render('login');
    }
});

app.get('/studyView',function(req,res){
    var id = req.param('id');

    StudyBoardModel.findOne({_id:id},function(err,rawBoard){
        if(err) throw err;
        rawBoard.count += 1; // 조회수 증가

        rawBoard.save(function(err){
            if(err) throw err;

            console.log('스터디 조회수 증가 및 게시글 출력');
            res.render('studyView',{board:rawBoard, authUser:req.user[0].nickname});
        });
    });
});
app.get('/mypage', function (req, res) {
    if(req.user)
        res.render('mypage',{authUser: req.user[0].nickname});
    else
        res.render('login');
});

app.get('/writeStudent',function (req,res){
  res.render('writeStudent',{authUser:req.user[0].nickname});
});

app.get('/student', function (req, res) {
  if(req.user){
      StudentModel.find({}).sort({date:-1}).exec(function(err,rawStudent){
          if(err) throw err;
          console.log('학생게시판 목록 출력');
          res.render('student',{student:rawStudent, authUser: req.user[0].nickname});
      });
  } else{
          // res.render('study',{board:rawBoards, seller:false});
      res.render('login');
  }
});

app.get('/studentView',function(req,res){
    var id = req.param('id');

    StudentModel.findOne({_id:id},function(err,rawStudent){
        if(err) throw err;
        rawStudent.count += 1; // 조회수 증가

        rawStudent.save(function(err){
            if(err) throw err;

            console.log('학생 조회수 증가 및 게시글 출력');
            res.render('studentView',{student:rawStudent, authUser:req.user[0].nickname});
        });
    });
});

app.get('/event', function (req, res) {
    if(req.user)
        res.render('event',{authUser: req.user[0].nickname});
    else
        res.render('login');
});

app.get('/serviceInfo', function (req, res) {
    if(req.user)
        res.render('serviceInfo',{authUser: req.user[0].nickname});
    else
        res.render('serviceInfo',{authUser: null});
});

//============================ 라우터 끝 ============================

//============================ 서버 시작 ============================

var server = https.createServer(options, app);
var port = 3001;
server.listen(port, function () {
    console.log('https 서버가 시작되었습니다. 포트 : ' + port );
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('http 서버가 시작되었습니다. 포트 : ' + app.get('port'));
    connectDB();
});
