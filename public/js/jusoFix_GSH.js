//07_04 add by sehyeon

function goPopup(){
    // 호출된 페이지(jusopopup.jsp)에서 실제 주소검색URL(http://www.juso.go.kr/addrlink/addrLinkUrl.do)를 호출하게 됩니다.
    var pop = window.open("/jusoPopup","pop","width=570,height=420, scrollbars=yes, resizable=yes");
}
function jusoCallBack(roadFullAddr, roadAddrPart1, addrDetail, roadAddrPart2, engAddr, jibunAddr, zipNo, admCd, rnMgtSn, bdMgtSn
    , detBdNmList, bdNm, bdKdcd, siNm, sggNm, emdNm, liNm, rn, udrtYn, buldMnnm, buldSlno, mtYn, lnbrMnnm, lnbrSlno
    , emdNo, entX, entY) {

    //$("#address").val(roadFullAddr).change();
    //$("#siNm").val(siNm+' '+sggNm).change();
    Proj4js.reportError = function (msg) {
        alert(msg);
    };

    Proj4js.defs['UTM-K'] = "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs"; // from
    Proj4js.defs['WG84'] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
    var si=siNm+' '+sggNm;
    var utmk = new Proj4js.Proj('UTM-K');
    var wg84 = new Proj4js.Proj('WG84');
    var p = new Proj4js.Point(entX, entY);
    Proj4js.transform(utmk, wg84, p);
    //$("#entX").val(p.x).change();
    //$("#entY").val(p.y).change();
    var item={x:p.x,y:p.y,address:roadFullAddr,siNm:si};
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/address_fix",
        data: item,
        async:false,
        success: function (data) {
            if (data === "clear")
            {
                $("#add").empty();
                $("#add").append(si);
            }
            else{
                alert("fail");
            }
        }
    });
}
