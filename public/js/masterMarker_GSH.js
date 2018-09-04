//07_04 add by sehyeon

var region="충청북도 청주시 서원구 충대로 1";
var x=36.6393449;
var y=127.4746804;
function findRegion(user) {
    region=user.address;
    x=user.location.coordinates[1];
    y=user.location.coordinates[0];
}

function markingMap(map){
    var checkRegion="";
    var Lat="";
    var Lng="";
    var zoom="";
    //var myCenter = new google.maps.LatLng(x, y);
    /*if(region.indexOf("세종특별")!=-1)
    {
        checkRegion="세종특별";
        Lat=36.552816;
        Lng=127.2737377;
        zoom=12;
    }
    else if(region.indexOf("청주시")!=-1)  {
        checkRegion="청주시";
        Lat=36.6393449;
        Lng=127.4746804;
        zoom=13;
    }
    else if(region.indexOf("대전광")!=-1)  {
        checkRegion="대전광역시";
        Lat=36.3718813;
        Lng=127.3295013;
        zoom=13;
    }
    else
    {
        checkRegion="천안시";
        Lat=36.8211606;
        Lng=127.1310738;
        zoom=13;
    }*/
    /*var map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(Lat, Lng),
        zoom: zoom
    });*/

    var myCenter = new google.maps.LatLng(x, y);
    var myicon = {
      url :'img/map_icon.svg',
      scaledSize: new google.maps.Size(50, 50),
      origin: new google.maps.Point(0, 0)
      // anchor: new google.maps.Point(32,65)
    };
    var marker = new google.maps.Marker({position:myCenter,animation: google.maps.Animation.DROP,icon:myicon});
    marker.addListener('click', toggleBounce);

    function toggleBounce() {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }

    map.setCenter(myCenter);
    map.setZoom(zoom);
    marker.setMap(map);
    google.maps.event.addListener(map, 'tilesloaded',function(){
        changeMap(map.getBounds());
    });
    google.maps.event.addListener(map, 'dragend',function(){
        changeMap(map.getBounds());
    });
    google.maps.event.addListener(map, 'zoom_changed',function(){
        changeMap(map.getBounds());
    });
}

var markers=[];
function changeMap(bounds) {
    var bb,ff,fb,bf;
    var bounds;

    fb = bounds.f.b;
    ff = bounds.f.f;
    bb = bounds.b.b;
    bf = bounds.b.f;
    var item={bigx:ff,smallx:fb,bigy:bf,smally:bb};
    var data=mapchange(item);
    var infoWindow = new google.maps.InfoWindow;
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
    $("#items").empty();
    $("#mapcount").empty();
    $("#mapcount").append(data.length);
    var i=0;

    Array.prototype.forEach.call(data,function (markerElem) {

        var title = markerElem.title;
        //var name = markerElem.getAttribute('name');
        var region = markerElem.regionShort;
        var day = markerElem.day;
        var category = markerElem.category;
        var boardpic = document.createElement('img');
        var masterpic = document.createElement('img');
        boardpic.className = "master_imgBackground";
        boardpic.src = markerElem.thumbnail_list;
        boardpic.style.marginBottom = "10px";
        masterpic.src = markerElem.masterphoto;
        masterpic.className = "master_img";

        var price = String(markerElem.price) + "0,000";
        var point = new google.maps.LatLng(
            parseFloat(markerElem.location.coordinates[1]),
            parseFloat(markerElem.location.coordinates[0])
        );

        // var infowincontent = document.createElement('div');
        // infowincontent.style.width = "200px";
        // infowincontent.style.height = "300px";
        // var strong = document.createElement('strong');
        // strong.textContent = title;
        // infowincontent.appendChild(strong);
        // infowincontent.appendChild(document.createElement('br'));
        // var text = document.createElement('text');
        // text.textContent = region;
        // infowincontent.appendChild(text);
        // infowincontent.appendChild(document.createElement('br'));
        // var text2 = document.createElement('text2');
        // text2.textContent = category;
        // infowincontent.appendChild(text2);
        // infowincontent.appendChild(document.createElement('br'));
        // var img = document.createElement('img');
        // img.src = markerElem.path;
        // img.style.width = "100%";
        // img.style.height = "150px";
        // infowincontent.appendChild(img);

        var infowincontent = '<a href="/masterView?id=' + markerElem._id + '">' +
            '<div id="map-content">'+
        '<div id="map-header">'+
        '<h5 style="font-weight:700;">'+title+'</h5><p style="font-size:15px;">-&nbsp;'
        +region+'<br>-&nbsp;'+category+'<br>-&nbsp;'+day+'</p></div>'+
        '<div id="map-image">'+boardpic.outerHTML+'</div></div></a>'


        var markericon = {
          url :'img/map_icon.svg',
          scaledSize: new google.maps.Size(50, 50),
          origin: new google.maps.Point(0, 0)
          // anchor: new google.maps.Point(32,65)
        };

        // var marker = new google.maps.Marker({
        //     map: map,
        //     position: point,
        //     icon :styleicon,
        //     label : {
        //       text : customLabel,
        //       color:'orange'
        //     }
        //     // label: icon.label
        // });
        var marker = new MarkerWithLabel({
            map: map,
            position: point,
            icon :markericon,
            labelContent : '<div>'+price+'<br>'+category+'</div>',
            labelAnchor: new google.maps.Point(40, 50),
            labelClass: "my-custom-class-for-label", // the CSS class for the label
            labelInBackground: true
        });

        marker.addListener('click', function () {
            infoWindow.setContent(infowincontent);
            infoWindow.open(map, marker);
        });
        var z;
        marker.addListener('mouseover', function() {
          z=marker.getZIndex();
          marker.setZIndex(150);
          marker.set('labelClass', 'my-custom-class-for-label_hover');
        });
        marker.addListener('mouseout', function() {
          marker.setZIndex(z);
          marker.set('labelClass', 'my-custom-class-for-label');
        });
        markers.push(marker);
        marker.setMap(map);


        var tmpTag = '<div class="col-lg-3 col-md-6 col-sm-6 list-item">' +
            '<a class="board_click" href="/masterView?id=' + markerElem._id + '">' +
            '<div class="block-cnt">' +
            boardpic.outerHTML +
            '<ul>' +
            '<li class="deadlineIcon" style="display:none;left:0;float:left;"></li>' +
            '<li class="studyNum" style="float:right;"></li>' +
            '</ul>' +
            '<div class="cnt">' +
            '<div class="people-img">' +
            masterpic.outerHTML +
            '</div>' +
            '<div class="cnt_text">';

        //i++;
        tmpTag = tmpTag + '<h5>' + title + '</h5>' +
            '<p>';

        for (var n = 0; n < markerElem.category.length; n++) {
            tmpTag = tmpTag + markerElem.category[n] + '&nbsp;'
        }
        tmpTag = tmpTag + '<br>' +
            markerElem.regionShort + '<br>' +
            markerElem.day + '요일 진행<br>' +
            markerElem.studyTerm + '주 진행</p>' +
            '<div class="" >' +
            '<span id="deadline[' + i + ']" style="font-size:12px;float:right;line-height:35px;"></span>' +
            '<span id="master_term"><span id="master_money">' + markerElem.price + '만원</span>&nbsp;(주&nbsp;' + markerElem.studynum + '회)</span>' +
            '</div></div></div></div></a></div>';

          $("#items").append(tmpTag);

        $('#items > .list-item').mouseover(function(){
          var n = $("#items > .list-item").index($(this));
          markers[n].setZIndex(150);
          document.getElementsByClassName('my-custom-class-for-label')[n].style.color = "#fff";
          document.getElementsByClassName('my-custom-class-for-label')[n].style.backgroundColor = "#ff6600";
        });
        $('#items > .list-item').mouseout(function(){
          var n = $("#items > .list-item").index($(this));
          markers[n].setZIndex(5-n);
          document.getElementsByClassName('my-custom-class-for-label')[n].style.color = "#ff6600";
          document.getElementsByClassName('my-custom-class-for-label')[n].style.backgroundColor = "#fff";
        });

        var max = markerElem.maxNum;

        if (max === 1) {
            var a = document.getElementsByClassName('studyNum');
            a[i].innerHTML = "1&nbsp;:&nbsp;1";
        }
        else {
            var a = document.getElementsByClassName('studyNum');
            a[i].innerHTML = markerElem.minNum + ' : ' + markerElem.maxNum;
        }
        var currentNum =markerElem.currentNum;

        var ddd = new Date(markerElem.deadline); //스터디시작 날짜
        var date = new Date(); //오늘 +7일
        var today = new Date(); //오늘
        var term = new Date(markerElem.deadline); // 스터기기간
        term.setDate(term.getDate()+(markerElem.studyTerm*7));
        date.setDate(date.getDate() + 7);
        if (today<=ddd&& ddd < date) {
            var x = document.getElementsByClassName("deadlineIcon");
            x[i].style.display = "block";
            x[i].style.fontSize = "smaller";
            x[i].style.backgroundColor = "red";
            x[i].innerHTML = "마감임박";
        }
        if(term<today||currentNum==max){
          var x = document.getElementsByClassName("deadlineIcon");
          x[i].style.display = "block";
          x[i].style.fontSize = "smaller";
          x[i].style.backgroundColor = " #a6a6a6";
          x[i].innerHTML = "종료";
        }
        if (ddd >= date) {
            var x = document.getElementsByClassName("deadlineIcon");
            x[i].style.display = "block";
            x[i].style.backgroundColor = "orange";
            x[i].innerHTML = "모집중";
        }
        if (ddd < today) {
            var x = document.getElementsByClassName("deadlineIcon");
            x[i].style.display = "block";
            x[i].style.fontSize = "smaller";
            x[i].style.backgroundColor = " #a6a6a6";
            x[i].innerHTML = "모집 종료";
        }

        //var i = new Date(markerElem.deadline);
        document.getElementById('deadline[' + i + ']').innerHTML = date_format(ddd);
        i = i + 1;
    });
};

function date_format(dateValue){
    var dd = dateValue.getDate();
    var mm = dateValue.getMonth()+1;
    var yyyy = dateValue.getFullYear();

    if(dd<10){
        dd = '0'+dd;
    }
    if(mm<10){
        mm = '0'+mm;
    }
    return mm+'/'+dd +'&nbsp;시작';
}

function mapchange(item) {
    var savedata;
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/map_change2",
        data: item,
        async:false,
        success: function (data) {
            if (data === "nothing")
                alert("nothing");
            else{
                savedata=data;
            }
        }
    });
    return savedata;
}

//https://developers.google.com/maps/documentation/javascript/examples/overlay-popup?hl=ko 여기보고 라벨 바꿀수 있어요
//현재 라벨 들어가는거 만원단위만 해놨으니 100만원 이상은 다시 처리 해줘야댈겁니다.
