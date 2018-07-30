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
    if(region.indexOf("세종특별")!=-1)
    {
        checkRegion="세종특별";
        Lat=36.552816;
        Lng=127.2737377;
        zoom=12;
    }
    else  {
        checkRegion="청주시";
        Lat=36.6393449;
        Lng=127.4746804;
        zoom=13;
    }
    /*var map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(Lat, Lng),
        zoom: zoom
    });*/

    var myCenter = new google.maps.LatLng(x, y);
    var marker = new google.maps.Marker({position:myCenter});

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
    var infoWindow = new google.maps.InfoWindow
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
    $("#items").empty();
    var i=0;

    Array.prototype.forEach.call(data,function (markerElem) {
        var title = markerElem.title;
        //var name = markerElem.getAttribute('name');
        var region = markerElem.regionShort;
        var price = String(markerElem.price) + "0,000";
        var point = new google.maps.LatLng(
            parseFloat(markerElem.location.coordinates[1]),
            parseFloat(markerElem.location.coordinates[0])
        );
        var infowincontent = document.createElement('div');
        var strong = document.createElement('strong');
        strong.textContent = title;
        infowincontent.appendChild(strong);
        infowincontent.appendChild(document.createElement('br'));
        var text = document.createElement('text');
        text.textContent = region;
        infowincontent.appendChild(text);
        var customLabel = {
            price: {
                label: price
            }
        };
        var icon = customLabel['price'] || {};
        var marker = new google.maps.Marker({
            map: map,
            position: point,
            label: icon.label
        });
        marker.addListener('click', function () {
            infoWindow.setContent(infowincontent);
            infoWindow.open(map, marker);
        });
        markers.push(marker);
        marker.setMap(map);


        var tmpTag = '<div class="col-lg-3 col-md-6 col-sm-6 list-item">' +
            '<div class="block-cnt">' +
            '<img src="https://static.pexels.com/photos/301920/pexels-photo-301920.jpeg" width="100%" style="margin-bottom:10px;">' +
            '<ul>' +
            '<li class="deadlineIcon" style="display:none;left:0;float:left;"></li>' +
            '<li class="studyNum" style="float:right;"></li>' +
            '</ul>' +
            '<div class="cnt">' +
            '<div class="people-img">' +
            '<img src="http://alivecampus.com/wp-content/uploads/2013/06/shhhhh-quiet-everyone-study-wallpaper.jpg" style="width: 90%; ">' +
            '</div>' +
            '<div class="cnt_text">';
        //i++;
        tmpTag = tmpTag + '<h5><a href="/masterView?id=' + markerElem._id + '">' + title + '</a></h5>' +
            '<p>';
        for (var n = 0; n < markerElem.category.length; n++) {
            tmpTag = tmpTag + markerElem.category[n] + '&nbsp;'
        }
        tmpTag = tmpTag + '<br>' +
            markerElem.regionShort + '<br>' +
            markerElem.studyTerm + '주 진행</p>' +
            '<div class="" >' +
            '<span id="deadline[' + i + ']" style="font-size:12px;float:right;line-height:35px;"></span>' +
            '<span id="master_term"><span id="master_money">' + markerElem.price + '만원</span>&nbsp;(주&nbsp;' + markerElem.studynum + '회)</span>' +
            '</div></div></div></div></div>';
        $("#items").append(tmpTag);

        var ddd = new Date(markerElem.deadline);
        var date = new Date();
        date.setDate(date.getDate() + 7);
        if (ddd < date) {
            var x = document.getElementsByClassName("deadlineIcon");
            x[i].style.display = "block";
            x[i].style.fontSize = "smaller";
            x[i].style.backgroundColor = "red";
            x[i].innerHTML = "마감임박";
        }
        else if (ddd >= date) {
            var x = document.getElementsByClassName("deadlineIcon");
            x[i].style.display = "block";
            x[i].style.backgroundColor = "orange";
            x[i].innerHTML = "모집중";
        }
        var max = markerElem.maxNum;

        if (max === 1) {
            var a = document.getElementsByClassName('studyNum');
            a[i].innerHTML = "1&nbsp;:&nbsp;1";
        }
        else {
            var a = document.getElementsByClassName('studyNum');
            a[i].innerHTML = '1 : ' + markerElem.maxNum + '';
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