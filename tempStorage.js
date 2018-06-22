/**
 * Created by SW on 2018-06-21.
 */

// tempStorage.js 파일은 그냥 코드 보관용입니다 무시하세요 !!
// tempStorage.js 파일은 그냥 코드 보관용입니다 무시하세요 !!
// tempStorage.js 파일은 그냥 코드 보관용입니다 무시하세요 !!
// tempStorage.js 파일은 그냥 코드 보관용입니다 무시하세요 !!
// tempStorage.js 파일은 그냥 코드 보관용입니다 무시하세요 !!
// tempStorage.js 파일은 그냥 코드 보관용입니다 무시하세요 !!
// tempStorage.js 파일은 그냥 코드 보관용입니다 무시하세요 !!
// tempStorage.js 파일은 그냥 코드 보관용입니다 무시하세요 !!
// tempStorage.js 파일은 그냥 코드 보관용입니다 무시하세요 !!
// tempStorage.js 파일은 그냥 코드 보관용입니다 무시하세요 !!
// tempStorage.js 파일은 그냥 코드 보관용입니다 무시하세요 !!
// tempStorage.js 파일은 그냥 코드 보관용입니다 무시하세요 !!
// tempStorage.js 파일은 그냥 코드 보관용입니다 무시하세요 !!
// tempStorage.js 파일은 그냥 코드 보관용입니다 무시하세요 !!
// tempStorage.js 파일은 그냥 코드 보관용입니다 무시하세요 !!
// tempStorage.js 파일은 그냥 코드 보관용입니다 무시하세요 !!

/**
 * Created by SW on 2018-06-21.
 */

//============================ 스터디,학생 라우터 ============================

// app.get('/study', function (req, res) {
//         if(req.user){
//             StudyBoardModel.find({}).sort({date:-1}).exec(function(err,rawBoards){
//                 if(err) throw err;
//                 console.log('스터디게시판 목록 출력');
//                 res.render('study',{board:rawBoards, authUser: req.user[0].nickname});
//             });
//         } else{
//             // res.render('study',{board:rawBoards, seller:false});
//             res.render('login');
//         }
//     });
//
//     app.get('/studyView',function(req,res){
//         var id = req.param('id');
//
//         StudyBoardModel.findOne({_id:id},function(err,rawBoard){
//             if(err) throw err;
//             rawBoard.count += 1; // 조회수 증가
//
//             rawBoard.save(function(err){
//                 if(err) throw err;
//
//                 console.log('스터디 조회수 증가 및 게시글 출력');
//                 res.render('studyView',{board:rawBoard, authUser:req.user[0].nickname});
//             });
//         });
//     });
//
//     app.get('/writeStudent',function (req,res){
//         res.render('writeStudent',{authUser:req.user[0].nickname});
//     });
//
//     app.get('/student', function (req, res) {
//         if(req.user){
//             StudentModel.find({}).sort({date:-1}).exec(function(err,rawStudent){
//                 if(err) throw err;
//                 console.log('학생게시판 목록 출력');
//                 res.render('student',{student:rawStudent, authUser: req.user[0].nickname});
//             });
//         } else{
//             // res.render('study',{board:rawBoards, seller:false});
//             res.render('login');
//         }
//     });
//
//     app.get('/studentView',function(req,res){
//         var id = req.param('id');
//
//         StudentModel.findOne({_id:id},function(err,rawStudent){
//             if(err) throw err;
//             rawStudent.count += 1; // 조회수 증가
//
//             rawStudent.save(function(err){
//                 if(err) throw err;
//
//                 console.log('학생 조회수 증가 및 게시글 출력');
//                 res.render('studentView',{student:rawStudent, authUser:req.user[0].nickname});
//             });
//         });
//     });
//
//         app.get('/writeStudy', function (req, res) {
//         res.render('writeStudy', {authUser: req.user[0].nickname});
//     });
//

//============================ 스터디 게시글 추가 기능 시작 ============================
// var addStudyBoard = function (database,title,author,category,region,deadline,minNum,maxNum, studyTerm, studyInfo, callback) {
//
//     var board = new StudyBoardModel({"title":title,"author":author,"category":category,"region":region,"deadline":deadline,"minNum":minNum,"maxNum":maxNum, "studyTerm":studyTerm, "studyInfo":studyInfo});
//
//     board.save(function (err) {
//         if(err){
//             callback(err, null);
//             return;
//         }
//
//         console.log("게시글 추가함.");
//         callback(null, board);
//     })
//
// };
//
// app.post('/process/addstudyboard', function (req, res) {
//     console.log('/process/addstudyboard 호출됨.');
//
//     var title = req.body.title;
//     var author = req.body.author;
//     var category = req.body.category;
//     var region = req.body.region;
//     var deadline = req.body.deadline;
//     var minNum = req.body.minNum;
//     var maxNum = req.body.maxNum;
//     var studyTerm = req.body.studyTerm;
//     var studyInfo = req.body.studyInfo;
//
//
//     if(connectDB!==null){
//         addStudyBoard(connectDB,title,author,category,region,deadline,minNum,maxNum, studyTerm, studyInfo, function(err, result){
//             if (err) { throw err; }
//
//             if (result) {
//                 res.redirect('/study');
//             } else {    // 결과 객체가 없으면 실패 응답 전송
//                 res.writeHead('200', { 'Content-Type':'text/html; charset=utf8 '});
//                 res.write('<h1>게시물 추가 실패</h1>');
//                 res.end();
//             }
//         });
//     } else {    // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
//         res.writeHead('200', { 'Content-Type':'text/html; charset=utf8 '});
//         res.write('<h1>데이터베이스 연결 실패</h1>');
//         res.end();
//     }
// });

//============================ 스터디 게시글 추가 기능 끝 ============================


//============================ 학생 게시글 추가 기능 시작 ============================
// var addStudent = function (database,name,age,category,region_do,region_si,region_gu,gender,studentInfo, grade, callback) {
//
//     var student = new StudentModel({"name":name,"age":age,"category":category,"region_do":region_do,"region_si":region_si,"region_gu":region_gu,"gender":gender,"studentInfo":studentInfo,"grade":grade});
//
//     student.save(function (err) {
//         if(err){
//             callback(err, null);
//             return;
//         }
//
//         console.log("학생 추가함.");
//         callback(null, student);
//     })
//
// };
//
// app.post('/process/addstudent', function (req, res) {
//     console.log('/process/addstudent 호출됨.');
//
//     var name = req.body.name;
//     var age = req.body.age;
//     var category = req.body.category;
//     var region_do = req.body.region_do;
//     var region_si = req.body.region_si;
//     var region_gu = req.body.region_gu;
//     var gender = req.body.gender;
//     var studentInfo = req.body.studentInfo;
//     var grade = req.grade;
//
//     if(age==11){
//         grade = "초등학교 4학년";
//     }
//     if(age==12){
//         grade = "초등학교 5학년";
//     }
//     if(age==13){
//         grade = "초등학교 6학년";
//     }
//     if(age==14){
//         grade = "중학교 1학년";
//     }
//     if(age==15){
//         grade = "중학교 2학년";
//     }
//     if(age==16){
//         grade = "중학교 3학년";
//     }
//     if(age==17){
//         grade = "고등학교 1학년";
//     }
//     if(age==18){
//         grade = "고등학교 2학년";
//     }
//     if(age==19){
//         grade = "고등학교 3학년";
//     }
//
//
//     if(connectDB!==null){
//         addStudent(connectDB,name,age,category,region_do,region_si,region_gu,gender,studentInfo,grade, function(err, result){
//             if (err) { throw err; }
//
//             if (result) {
//                 res.redirect('/student');
//             } else {    // 결과 객체가 없으면 실패 응답 전송
//                 res.writeHead('200', { 'Content-Type':'text/html; charset=utf8 '});
//                 res.write('<h1>학생 추가 실패</h1>');
//                 res.end();
//             }
//         });
//     } else {    // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
//         res.writeHead('200', { 'Content-Type':'text/html; charset=utf8 '});
//         res.write('<h1>데이터베이스 연결 실패</h1>');
//         res.end();
//     }
// });

//============================ 학생 게시글 추가 기능 끝 ============================

