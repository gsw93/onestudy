//07_04 add by sehyeon
var mongoose = require('mongoose');
require('../models/database');
var MasterBoardModel = mongoose.model("masterboards");

//주소 api 처리 부분
module.exports = function (router) {
    //get
    router.route('/jusoPopup').get(function (req, res) {
        res.render('juso_GSH',{inputYn:"",roadFullAddr:"",roadAddrPart1:"",roadAddrPart2:"",engAddr:"",jibunAddr:"",zipNo:"",addrDetail:"",admCd:"",rnMgtSn:"",
            bdMgtSn:"",detBdNmList:"",bdNm:"",bdKdcd:"",siNm:"",sggNm:"",emdNm:"",liNm:"",rn:"",udrtYn:"",buldMnnm:"",buldSlno:"",mtYn:"",lnbrMnnm:"",lnbrSlno:"",emdNo:"",entX:"",entY:"",authUser:req.user[0].nickname, authMaster:req.user[0].sellercheck});
    });
    //post
    router.route('/jusoPopup').post(function (req, res) {
        var inputYn = req.body.inputYn;
        var roadFullAddr = req.body.roadFullAddr;
        var roadAddrPart1 = req.body.roadAddrPart1;
        var roadAddrPart2 = req.body.roadAddrPart2;
        var engAddr = req.body.engAddr;
        var jibunAddr = req.body.jibunAddr;
        var zipNo = req.body.zipNo;
        var addrDetail = req.body.addrDetail;
        var admCd    = req.body.admCd;
        var rnMgtSn = req.body.rnMgtSn;
        var bdMgtSn  = req.body.bdMgtSn;
        var detBdNmList  = req.body.detBdNmList;
        var bdNm  = req.body.bdNm;
        var bdKdcd  = req.body.bdKdcd;
        var siNm  = req.body.siNm;
        var sggNm  = req.body.sggNm;
        var emdNm  = req.body.emdNm;
        var liNm  = req.body.liNm;
        var rn  = req.body.rn;
        var udrtYn  = req.body.udrtYn;
        var buldMnnm  = req.body.buldMnnm;
        var buldSlno  = req.body.buldSlno;
        var mtYn  = req.body.mtYn;
        var lnbrMnnm  = req.body.lnbrMnnm;
        var lnbrSlno  = req.body.lnbrSlno;
        var emdNo  = req.body.emdNo;
        var entX  = req.body.entX;
        var entY  = req.body.entY;
        res.render('juso_GSH',{inputYn:inputYn,roadFullAddr:roadFullAddr,roadAddrPart1:roadAddrPart1,roadAddrPart2:roadAddrPart2,engAddr:engAddr,jibunAddr:jibunAddr,zipNo:zipNo,addrDetail:addrDetail,admCd:admCd,rnMgtSn:rnMgtSn,
            bdMgtSn:bdMgtSn,detBdNmList:detBdNmList,bdNm:bdNm,bdKdcd:bdKdcd,siNm:siNm,sggNm:sggNm,emdNm:emdNm,liNm:liNm,rn:rn,udrtYn:udrtYn,buldMnnm:buldMnnm,buldSlno:buldSlno,mtYn:mtYn,lnbrMnnm:lnbrMnnm,lnbrSlno:lnbrSlno,emdNo:emdNo,entX:entX,entY:entY,authUser:req.user[0].nickname, authMaster:req.user[0].sellercheck});
    });
    router.post('/map_change',function (req,res) {
        var query=new RegExp(req.body.region);
        MasterBoardModel.find({region:query},function(err,board){
            if(err) throw err;
            console.log(query);
            if(board)
                res.send(board);
            else
                res.send("nothing");
        });
    });
};