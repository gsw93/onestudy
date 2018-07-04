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
    map.setZoom(zoom);
    map.setCenter(myCenter);
    marker.setMap(map);
    var data=mapchange({region:checkRegion});
    var infoWindow = new google.maps.InfoWindow;
    Array.prototype.forEach.call(data,function (markerElem) {

        var title = markerElem.title;
        //var name = markerElem.getAttribute('name');
        var region = markerElem.region;
        var price = String(markerElem.price)+"0,000";
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
        marker.addListener('click', function() {
            infoWindow.setContent(infowincontent);
            infoWindow.open(map, marker);
        });
        marker.setMap(map);
    });
}

function mapchange(item) {
    var savedata;
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/map_change",
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