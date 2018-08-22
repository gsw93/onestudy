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
// passport
var passport = require('passport');
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

    // uri: 'mongodb://35.189.135.181/db',
    // uri: 'mongodb://localhost:27017/db',
    uri: 'mongodb://35.189.135.181/db',
    databaseName: 'db',
    collection: 'sessions'
});
var options = {
    ca: fs.readFileSync('./gogetssl/onestudyca.pem'),
    key: fs.readFileSync('./gogetssl/onestudykey.pem'),
    cert: fs.readFileSync('./gogetssl/onestudycrt.pem')
};
//public 폴더를 static으로 오픈
app.use(serveStatic(path.join(__dirname, './public')));
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
// app.set('port', process.env.PORT || 3000);
app.set('port', process.env.PORT || 443);
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

var connectDB = require('./models/database');
//============================ 데이터베이스에 연결 끝 ============================

var configPassport = require('./config/controller');
configPassport(app, passport);
//============================ 로그인 기능 끝 ============================

var indexRoute = require('./routes/index_KSW');
var passportRoute = require('./routes/passport');
var usersRoute = require('./routes/users');
var boardsRoute = require('./routes/boards');
//07_04 add by sehyeon
var jusoRoute = require('./routes/juso_GSH');

indexRoute(app);
boardsRoute(app);
usersRoute(app, passport);
passportRoute(app, passport);
//07_04 add by sehyeon
jusoRoute(app);
//============================ 라우터 끝 ============================

var httpsServer = https.createServer(options, app);
var httpServer = http.createServer(app);

// var httpPort = 3001;
var httpPort = 80;

httpServer.listen(httpPort, function () {
    console.log('http 서버가 시작되었습니다. 포트 : ' + httpPort);
    connectDB();
});
httpsServer.listen(app.get('port'), function () {
    console.log('https 서버가 시작되었습니다. 포트 : ' + app.get('port'));
});
