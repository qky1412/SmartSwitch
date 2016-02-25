/**
 * Created by Administrator on 2016/2/20 0020.
 */
$(document).ready(function(){
    JDSMART.ready(function () {
        showButton(true);
        showLoading();
    });


    //$("#button1").click(function(){
    //
    //    $.ajax({
    //        type: "GET",
    //        cache: false,
    //        url: "http://api.siyee.org/activities/instant-purchase/status",
    //        data: {},
    //        dataType: "jsonp",
    //        //jsonp: "callback",
    //        jsonpCallback: "OnGetMemberSuccessByjsonp"
    //    });
    //});
   // setTimeout(hideLoading, 3000);
});
/**
 * 通用js代码
 */
function showLoading() {

}
function hideLoading() {

}
function showButton(flag) {

    JDSMART.app.config(		//配置导航按钮隐藏显示
        {
            showBack: true,   // 返回按钮，false是隐藏，true是 显示
            showShare: false,
            showMore: false,  // 更多按钮
            showTitle: false
        });
}
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
/**
 * 电器布局页面所需js
 */
function renderHomeDevicesList() {
    //TODO
    var template = document.getElementById("template-list-home-device");
    for(var i = 0; i < 4; i++) {
        var tmp = template.content.cloneNode(true);
        tmp.querySelector('#device-title').innerText = "fuckingTitle" + i;
        tmp.querySelector('#list-item-home-device').dataset.id = i;
        document.getElementById("list-home-device").appendChild(tmp);
    }
}

function testDelete(elem,id) {
    $(elem).remove();
}
/**
 * 添加电器页面所需js
 */
function initFloorSelect() {
    //TODO the floorArrays here should be fetched through local storage
    var floorArrays = ["1层", "2层", "3层", "4层"]
    var selectFloor = document.getElementById("select-floor");
    selectFloor.innerHTML = "";
    var length = floorArrays.length;
    for(var i=0; i < length; i++) {
        var newOption = document.createElement("option");
        newOption.value = i;
        newOption.text = floorArrays[i];
        selectFloor.add(newOption);
    }
}

function  refreshRoomSelect() {
    var selectFloor = document.getElementById("select-floor");
    var selectRoom = document.getElementById("select-room");
    selectRoom.innerHTML = "";
    var roomArrays;
    //TODO here we should match the real data

    switch(selectFloor.value) {
        case "0":
            roomArrays = ["大厅", "厨房", "储物间"];
            break;
        case "1":
            alert("selectFloor.value=" + selectFloor.value)
            roomArrays = ["主卧", "主卧2"];
            break;
        case "2":
            roomArrays = ["客房1", "客房2", "书房", "娱乐室"];
            break;
        case "3":
            roomArrays = ["阳台"];
            break;
        default:
            roomArrays = ["error"];
    }
    var length = roomArrays.length;
    for(var i=0; i < length; i++) {
        var newOption = document.createElement("option");
        newOption.value = roomArrays[i];
        newOption.text = roomArrays[i];
        selectRoom.add(newOption);
    }
}

function addNewHomeDevice() {
    var homeDeviceName = document.getElementById("input-name");
    var storage = window.localStorage;
    storage.setItem("current_home_device", homeDeviceName);
}
/**
 * only for test
 */
function OnGetMemberSuccessByjsonp(data) {
    alert(JSON.stringify(data));
}

function testStringLength() {
    var testString = "adbg";
    var user =
    {
        "username":"andy",
        "age":20,
        "info": { "tel": "123456", "cellphone": "98765"},
        "address":
            [
                {"city":"beijing","postcode":"222333"},
                {"city":"newyork","postcode":"555666"}
            ]
    }
    var jsonStr = JSON.stringify(user);

    JDSMART.io.controlDevice( //
        {
            "command": [{
                "stream_id": "test",
                "current_value": jsonStr
            }]
        },
        function (suc) {
            // 执行成功的回调
            JDSMART.io.getSnapshot( //
                function (suc) {
                    // 执行成功的回调
                    var result = JSON.parse(suc);
                    var currentValue = result.streams[0].current_value;
                    var user1 = JSON.parse(currentValue);
                    alert("currentValue =" + user1.username);
                },
                function (error) {
                    // 执行失败的回调
                    alert("getSnapshot error");
                }
            );
        },
        function (error) {
            // 执行失败的回调
            alert("error");
        }
    );
}

