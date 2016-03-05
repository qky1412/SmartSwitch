/**
 * Created by qky on 2016/2/20 0020.
 */
$(document).ready(function(){
    $(document).on("pageInit", "#page-home", function (e, id, page) {
        JDSMART.ready(function () {
            showButton(true);
            showLoading();
        });
        //动态配置选项卡对应页面的底部操作面板
        $("#tab-control1").click(function () {
            $("#bottom-control1").show();
            $("#bottom-control2").hide();
            $("#bottom-control3").hide();
        });
        $("#tab-control2").click(function () {
            $("#bottom-control1").hide();
            $("#bottom-control3").hide();
            $("#bottom-control2").show();
        });
        $("#tab-control3").click(function () {
            $("#bottom-control1, #bottom-control2").hide();
            $("#bottom-control3").show();
        });
        $("#tab-control4").click(function () {
            $("#bottom-control1, #bottom-control2, #bottom-control3").hide();
        });
        refreshHomeDevicesList();
        refreshOutputDeviceList();
        refreshInputDeviceList();
        refreshSceneList();
    });
    $(document).on("pageReinit", "#page-home", function (e, id, page) {
        refreshHomeDevicesList();
        refreshOutputDeviceList();
        refreshInputDeviceList();
        refreshSceneList();
    });
    $(document).on("pageInit", "#page-floor", function (e, id, page) {
        JDSMART.ready(function () {
            showButton(false);
        });
        refreshFloorList();
    });
    $(document).on("pageInit", "#page-add-home-device", function (e, id, page) {
        JDSMART.ready(function () {
            showButton(false);
        });
        initFloorSelect();
        initRelaySelect();
    });
    $(document).on("pageInit", "#page-room", function (e, id, page) {
        JDSMART.ready(function () {
            showButton(false);
        });
        refreshRoomList();
    });
    $(document).on("pageInit", "#page-add-output-device", function (e, id, page) {
        JDSMART.ready(function () {
            showButton(false);
        });
        initFloorSelect();
    });
    $(document).on("pageInit", "#page-add-input-device", function (e, id, page) {
        JDSMART.ready(function () {
            showButton(false);
        });
        initFloorSelect();
    });
    $.init();
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
            showShare: flag,
            showMore: flag,  // 更多按钮
            showTitle: flag
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

function enterPage(url) {
    window.location.href = url;
}
/**
 * 电器布局页面所需js
 */
function refreshHomeDevicesList() {
    document.getElementById("list-room").innerHTML = '';
    var floors = Database.getFloorList();
    var floorNumbers = floors.length;
    //先添加房间
    var templateRoom = document.getElementById("template-list-room");
    var templateDevice = document.getElementById("template-list-home-device");
    for (var i = 0; i < floorNumbers; i++) {
        var rooms = floors[i].rooms;
        var roomNumbers = rooms.length;
        for (var j = 0; j < roomNumbers; j++) {
            var tmpRoom = templateRoom.content.cloneNode(true);
            tmpRoom.querySelector('.card-header').innerText = floors[i].name + rooms[j].name;
            tmpRoom.querySelector('#list-device').id = "list-device" + rooms[j].id;
            document.getElementById("list-room").appendChild(tmpRoom);
            var devices = Database.getElecEquicListInRoom(rooms[j].id);
            document.getElementById("list-device" +  rooms[j].id).innerHTML = '';
            for(var k = 0, length = devices.length; k < length; k++) {
                var tmpDevice = templateDevice.content.cloneNode(true);
                tmpDevice.querySelector('#device-title').innerText = devices[k].name;
                tmpDevice.querySelector('#home-device-floor').innerText = devices[k].floor.name;
                tmpDevice.querySelector('#home-device-room').innerText = devices[k].room.name;
                document.getElementById("list-device" +  rooms[j].id).appendChild(tmpDevice);
            }
        }


    }

}

/**
 * 场景配置页面所需js
 */
function refreshSceneList() {
    var sceneList = Database.getSceneList();
    var templateScene = document.getElementById("home-config-template-config");
    var templateDevice = document.getElementById("home-config-template-device");
    for(var i = 0, length = sceneList.length; i < length; i++) {
        var scene = sceneList[i];
        var tmpScene = templateScene.content.cloneNode(true);
        tmpScene.querySelector('.card-header').innerText = scene.name;
        tmpScene.querySelector('.item-after').dataset.id = scene.id;
        tmpScene.querySelector('#home-config-ul-scene').id = "home-config-ul-scene" + scene.id
        document.getElementById("home-config-list").appendChild(tmpScene);
        for(var j = 0, length = scene.scene_steps.length; j < length; j++) {
            var sceneStep = scene.scene_steps[j];
            var tmpDevice = templateDevice.content.cloneNode(true);
            tmpDevice.querySelector('.text-title').innerText = sceneStep.elec_equi.name;
            document.getElementById("home-config-ul-scene" + scene.id).appendChild(tmpDevice);
        }
    }
}

/**
 * 智能模块页面所需js
 */
function refreshOutputDeviceList() {
    document.getElementById("home-output-module").innerHTML = '';
    var outputs = Database.getRelayList();
    var template = document.getElementById("template-output-device");
    for(var i = 0, length = outputs.length; i < length; i++) {
        var output = outputs[i];
        var tmp = template.content.cloneNode(true);
        tmp.querySelector('a').dataset.id = output.id;
        tmp.querySelector('.text-title').innerText = output.name;
        tmp.querySelector('#span-output-id').innerText = output.id;
        tmp.querySelector('#span-output-room').innerText = output.room.name;
        tmp.querySelector('#span-output-floor').innerText = output.floor.name;
        document.getElementById("home-output-module").appendChild(tmp);
    }
}

function refreshInputDeviceList() {
    document.getElementById("home-input-module").innerHTML = '';
    var inputs = Database.getCtlPanelList();
    var template = document.getElementById("template-input-device");
    for(var i = 0, length = inputs.length; i < length; i++) {
        var input = inputs[i];
        var tmp = template.content.cloneNode(true);
        tmp.querySelector('a').dataset.id = input.id;
        tmp.querySelector('.text-title').innerText = input.name;
        tmp.querySelector('#span-input-id').innerText = input.id;
        tmp.querySelector('#span-input-room').innerText = input.room.name;
        tmp.querySelector('#span-input-floor').innerText = input.floor.name;
        document.getElementById("home-input-module").appendChild(tmp);
    }
}
/**
 * 楼层页面所需js
 */
function refreshFloorList() {
    document.getElementById("list-floor").innerHTML = '';
    var floors = Database.getFloorList();
    var template = document.getElementById("template-list-floor");
    for(var i = 0, length = floors.length; i < length; i++) {
        var tmp = template.content.cloneNode(true);
        tmp.querySelector('.item-title').innerText = floors[i].name;
        tmp.querySelector('.item-edit').dataset.name = floors[i].name;
        tmp.querySelector('.item-edit').dataset.id = floors[i].id;
        tmp.querySelector('.item-delete').dataset.id = floors[i].id;
        document.getElementById("list-floor").appendChild(tmp);
    }
}

function showEditFloorName(id, previousName) {
    $.prompt('编辑楼层名称', function (value) {
        //TODO should judge if the floor's name exists already
        editFloorName(id, value);
    });
    var input = document.getElementsByClassName("modal-text-input");
    input[0].value = previousName;
}

function editFloorName(id, newName) {
    if(newName != null && newName != '') {
        var editFloor = Database.findFloorFromList(id);
        editFloor.name = newName;
        Database.updateFloorList(editFloor);
        refreshFloorList();
    }

}

function  deleteFloor(id) {
    var deleteFloor = Database.findFloorFromList(id);
    Database.deleteFloorFromList(deleteFloor);
    refreshFloorList();
}

function showAddFloor() {
    $.prompt('楼层名称', function (value) {
        //TODO should judge if the floor's name exists already
        addFloor(value);
    });
}

function addFloor(floorName) {
    //TODO new a floor by given name
    if(floorName != null && floorName != '') {
        var newFloor = new YN_Floor(floorName)
        Database.addFloorToList(newFloor);
        refreshFloorList();
    }

}
/**
 * 房间页面所需js
 */
function refreshRoomList() {
    document.getElementById("room-list-floor").innerHTML = '';
    var floors = Database.getFloorList();
    var floorCount = floors.length;
    if(floorCount > 0) {
        //先添加楼层
        var floorTpl = document.getElementById("room-template-floor");
        for(var i = 0; i < floorCount; i++) {
            var floorTmp = floorTpl.content.cloneNode(true);
            floorTmp.querySelector('.room-title').innerText = floors[i].name;
            floorTmp.querySelector('#room-list-floor-id').id = "room-list-floor-id" + floors[i].id;
            floorTmp.querySelector('.icon').dataset.floorID = floors[i].id;
            document.getElementById("room-list-floor").appendChild(floorTmp);
        }

        //再添加房间
        var roomTpl = document.getElementById("room-template-room");
        for(var i = 0; i < floorCount; i++) {
            var rooms = floors[i].rooms;
            var roomCount = rooms.length;
            if(roomCount > 0) {
                for(var j = 0; j < roomCount; j++) {
                    var roomTmp = roomTpl.content.cloneNode(true);
                    roomTmp.querySelector('.item-title').innerText = rooms[j].name;
                    roomTmp.querySelector('.item-edit').dataset.floorID = floors[i].id;
                    roomTmp.querySelector('.item-edit').dataset.roomID = rooms[j].id;
                    roomTmp.querySelector('.item-edit').dataset.roomName = rooms[j].name;
                    roomTmp.querySelector('.item-delete').dataset.floorID = floors[i].id;
                    roomTmp.querySelector('.item-delete').dataset.roomID = rooms[j].id;
                    document.getElementById("room-list-floor-id" + floors[i].id).appendChild(roomTmp);
                }
            }
        }
    }
}

function showAddRoom(floorID) {
    $.prompt('房间名称', function (value) {
        //TODO should judge if the floor's name exists already
        addRoom(floorID,value);
    });
}

function addRoom(floorID, roomName) {
    if(roomName != null && roomName != '') {
        var floors = Database.getFloorList();
        var floorCount = floors.length;
        for(var i = 0; i < floorCount; i++) {
            if(floorID == floors[i].id) {
                var newRoom = new YN_Room(roomName);
                floors[i].rooms.push(newRoom);
                Database.updateFloorList(floors[i]);
                refreshRoomList();
                break;
            }
        }
    }
}

function showEditRoom(floorID, roomID, previousName) {
    $.prompt('房间名称', function (value) {
        //TODO should judge if the floor's name exists already
        editRoom(floorID,roomID,value);
    });
    var input = document.getElementsByClassName("modal-text-input");
    input[0].value = previousName;
}

function editRoom(floorID, roomID, newName) {
    if(newName != null && newName != '') {
        var floor = Database.findFloorFromList(floorID);
        var editRoom = floor.findRoom(roomID);
        editRoom.name = newName;
        Database.updateFloorList(editRoom);
        refreshRoomList();
    }
}

function showDeleteRoom(floorID, roomID) {
    $.confirm('是否要删除该房间?', function () {
        deleteRoom(floorID, roomID);
    });
}

function deleteRoom(floorID, roomID) {
    var floors = Database.getFloorList();
    var floorCount = floors.length;
    outermost:
    for(var i = 0; i < floorCount; i++) {
        if(floorID == floors[i].id) {
            for(var j = 0, roomCount = floors[i].rooms.length; j < roomCount; j++) {
                if(roomID == floors[i].rooms[j].id) {
                    floors[i].rooms.splice(j, 1);
                    Database.updateFloorList(floors[i]);
                    refreshRoomList();
                    break outermost;
                }
            }
        }
    }
}
/**
 * 添加电器页面所需js
 */
function initFloorSelect() {
    var floors = Database.getFloorList();
    var selectFloor = document.getElementById("add-home-device-select-floor");
    selectFloor.innerHTML = "";
    for(var i = 0, length = floors.length; i < length; i++) {
        if(floors[i].rooms.length > 0) {
            var newOption = document.createElement("option");
            newOption.value = floors[i].id;
            newOption.text = floors[i].name;
            selectFloor.add(newOption);
        }
    }
    refreshRoomSelect();
}

function  refreshRoomSelect() {
    var selectFloor = document.getElementById("add-home-device-select-floor");
    var selectRoom = document.getElementById("add-home-device-select-room");
    selectRoom.innerHTML = "";
    var rooms = [];
    var floors = Database.getFloorList();
    for(var i = 0, floorCount = floors.length; i < floorCount; i++) {
        if(selectFloor.value == floors[i].id) {
            rooms = floors[i].rooms;
            break;
        }
    }
    for(var i = 0, length = rooms.length; i < length; i++) {
        var newOption = document.createElement("option");
        newOption.value = rooms[i].id;
        newOption.text = rooms[i].name;
        selectRoom.add(newOption);
    }

}

function initRelaySelect() {
    var selectRelay = document.getElementById("add-home-device-select-relay");
    selectRelay.innerHTML = '';
    var relayList = Database.getRelayList();
    for (var i = 0, length = relayList.length; i < length; i++) {
        var newOption = document.createElement("option");
        newOption.value = relayList[i].id;
        newOption.text = relayList[i].name;
        selectRelay.add(newOption);
    }
    refreshRelaySlot();
}

function refreshRelaySlot() {
    var selectRelay = document.getElementById("add-home-device-select-relay");
    var selectRelaySlot = document.getElementById("add-home-device-select-relay-slot");
    selectRelaySlot.innerHTML = '';
    var selectedRelayId = selectRelay.value;
    if(selectedRelayId != null && selectedRelayId != '') {
        var relay = Database.getRelayByid(selectedRelayId);
        if(relay != null) {
            //TODO 插槽编号待定这里假设numberOfSlots + 1
            for(var i = 0, length = relay.numberOfSlots + 1; i < length; i++) {
                var newOption = document.createElement("option");
                newOption.value = i;
                newOption.text = i + 1;
                selectRelaySlot.add(newOption);
            }
        }
    }
}

function addPanelInAddHomeDevice() {
    var existPanelNumbers = $('.li-panel').length;
    var ul = document.getElementById("add_home_device_ul_panel");
    var template = document.getElementById("add_home_device_template_panel");
    var tmp = template.content.cloneNode(true);
    tmp.querySelector('#add_home_device_li_panel').id = "add_home_device_li_panel" + existPanelNumbers;
    tmp.querySelector('.device-delete').dataset.id = existPanelNumbers;

    //TODO 给刚刚添加的开关面板增加select

    var panelList = Database.getCtlPanelList();
    for (var i = 0, length = panelList.length; i < length; i++) {
        var newOption = document.createElement("option");
        newOption.value = panelList[i].id;
        newOption.text = panelList[i].name;
        tmp.querySelector('#add-home-device-select-panel').add(newOption);
    }
    //TODO 这里没做联动，默认显示1-5的按键

    for(var i = 0; i< 5; i++) {
        var newOption = document.createElement("option");
        newOption.value = i;
        newOption.text = i + 1;
        tmp.querySelector('#add-home-device-select-panel-slot').add(newOption);
    }
    document.getElementById("add_home_device_ul_panel").appendChild(tmp);
}

function showAddHomeDeviceDeletePanel(id) {
    $.confirm('是否要删除该面板?', function () {
        deletePanelInAddHomeDevice(id);
    });
}

function deletePanelInAddHomeDevice(id) {
    $('#' + "add_home_device_li_panel" +id).remove();
}
function addNewHomeDevice() {
    var name = document.getElementById("add-home-device-input-name").value;
    var floorId = document.getElementById("add-home-device-select-floor").value;
    var roomId = document.getElementById("add-home-device-select-room").value;
    var relayId = document.getElementById("add-home-device-select-relay").value;
    var relaySlot = document.getElementById("add-home-device-select-relay-slot").value;
    if(name == null || name == "") {
        alert("名称不能为空");
        return;
    }
    if(floorId == null || floorId =="") {
        alert("楼层不能为空");
        return;
    }
    if(roomId == null || roomId =="") {
        alert("房间不能为空");
        return;
    }
    if(relayId == null || relayId =="") {
        alert("输出模块不能为空");
        return;
    }
    if(relaySlot == null || relaySlot =="") {
        alert("输出模块编号不能为空");
        return;
    }
    var floor = Database.findFloorFromList(floorId);
    if(floor == null || floor =="") {
        alert("楼层无效");
        return;
    }
    //TODO
    var room = Database.findRoomInFloor(floor, roomId);
    if(room == null || room =="") {
        alert("房间无效");
        return;
    }
    var relay = Database.getRelayByid(relayId);
    if(relay == null || relay =="") {
        alert("输出模块无效");
        return;
    }
    var relay_assoc = new YN_Relay_assoc(relay, relaySlot);
    //TODO  判断当前已添加面板个数 如果存在绑定的开关面板，则获取合法的面板数据
    //var existPanelNumbers = $('.li-panel').length;
    var selectPanels = document.getElementsByClassName("add-home-device-select-panel");
    var selectPanelSlots = document.getElementsByClassName("add-home-device-select-panel-slot");
    if(selectPanels.length > 0) {
        for(var i = 0, length = selectPanels.length; i < length; i++) {
            var selectedPanelId = selectPanels[i].value;
            if(selectedPanelId != null && selectedPanelId != '') {
                var selectedPanelSlot = selectPanelSlots[i].value;
                if(selectedPanelSlot != null && selectedPanelSlot != '') {
                    var panel = Database.getCtlPanelByid(selectedPanelId);
                    if(panel != null && panel != "") {
                        var panel_assoc = new YN_CtlPanel_assoc(panel, selectedPanelSlot);
                        var newDevice = new YN_Elec_Equi(name, floor, relay_assoc, room, panel_assoc);
                        Database.addElecEquiToList(newDevice);
                    }
                }
            }
        }
    } else {
        var newDevice = new YN_Elec_Equi(name, floor, relay_assoc, room, null);
        Database.addElecEquiToList(newDevice);
    }
    $.router.back("../html/home.html");
}

/**
 * 添加输出设备页面所需js
 */
function addNewOutputDevice() {
    var deviceId = document.getElementById("input-id").value;
    var deviceName = document.getElementById("input-name").value;
    var floorId = document.getElementById("select-floor").value;
    var roomId = document.getElementById("select-room").value;
    if(deviceId.trim() == '') {
        alert('ID不能为空');
        return;
    }
    if(deviceName.trim() == '') {
        alert('名称不能为空');
        return;
    }
    var floor = Database.findFloorFromList(floorId);
    for(var i = 0, length = floor.rooms.length; i < length; i++) {
        if(floor.rooms[i].id == roomId) {
            var newOutputDevice = new YN_Relay(deviceId, deviceName, floor, floor.rooms[i], 2);
            Database.addRelayToList(newOutputDevice);
            $.router.back("../html/home.html");

            break;
        }
    }
    //TODO 这里的findRoom有问题
    //var room = floor.findRoom(roomId);
    //TODO 不知道这里是否需要绑定继电器已接路数

}
/**
 * 添加输入设备页面所需js
 */
function addNewInputDevice() {
    var deviceId = document.getElementById("input-id").value;
    var deviceName = document.getElementById("input-name").value;
    var floorId = document.getElementById("select-floor").value;
    var roomId = document.getElementById("select-room").value;
    if(deviceId.trim() == '') {
        alert('ID不能为空');
        return;
    }
    if(deviceName.trim() == '') {
        alert('名称不能为空');
        return;
    }
    var floor = Database.findFloorFromList(floorId);
    for(var i = 0, length = floor.rooms.length; i < length; i++) {
        if(floor.rooms[i].id == roomId) {
            var newInputDevice = new YN_CtlPanel(deviceId, deviceName, floor, floor.rooms[i]);
            Database.addCtlPanelToList(newInputDevice);
            $.router.back("../html/home.html");
            break;
        }
    }
    //TODO 这里的findRoom有问题
    //var room = floor.findRoom(roomId);
    //TODO 不知道这里是否需要绑定继电器已接路数

}
/**
 * only for test
 */
function testDelete(elem,id) {
    $(elem).remove();
}
function testControl() {
    var command = {
        "command":[
            {
                "stream_id": "test",
                "current_value":"fuckme"
            },
            {
                "stream_id": "test2",
                "current_value":"shittyhead"
            }
        ]
    }
    JDSMART.io.controlDevice(  // 控制设备接口: 如开关
        command,
        function (suc) {
            alert(JSON.stringify(suc));
        },
        function (error) {
            alert(error);
        }
    );
}

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

