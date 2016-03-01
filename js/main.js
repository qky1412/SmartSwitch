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
    });
    $(document).on("pageReinit", "#page-home", function (e, id, page) {
        refreshHomeDevicesList();
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
        refreshRoomSelect();
    });
    $(document).on("pageInit", "#page-room", function (e, id, page) {
        JDSMART.ready(function () {
            showButton(false);
        });
        refreshRoomList();
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
    if(floorNumbers > 0) {
        //先添加房间
        var template = document.getElementById("template-list-room");
        for(var i = 0; i < floorNumbers; i++) {
            var rooms = floors[i].rooms;
            var roomNumbers = rooms.length;
            if(roomNumbers > 0) {
                for(var j = 0; j < roomNumbers; j++) {
                    var tmp = template.content.cloneNode(true);
                    tmp.querySelector('.card-header').innerText = floors[i].name + rooms[j].name;
                    tmp.querySelector('#list-room-id').id = "list-room-id" + rooms[j].id;
                    document.getElementById("list-room").appendChild(tmp);
                }
            }

        }

        //TODO 然后添加电器
    }
}

function testDelete(elem,id) {
    $(elem).remove();
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
        tmp.querySelector('ul').id = "floor" + floors[i].id;
        tmp.querySelector('ul').dataset.id = floors[i].id;
        tmp.querySelector('ul').dataset.name = floors[i].name;
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
    //$('.modal-text-input').val(previousName);
}

function editFloorName(id, newName) {
    var editFloor = new YN_Floor(newName);
    alert(typeof id);
    editFloor.id = id;
    Database.updateFloorList(editFloor);
    refreshFloorList();
}

function  deleteFloor(id) {
    var deleteFloor = new YN_Floor("fake");
    deleteFloor.id = id;
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
        var newFloor = Database.addFloorToList(new YN_Floor(floorName));
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
        var floors = Database.getFloorList();
        var floorCount = floors.length;
        for(var i = 0; i < floorCount; i++) {
            if(floorID == floors[i].id) {
                for(var j = 0, roomCount = floors[i].rooms.length; j < roomCount; j ++) {
                    if(roomID == floors[i].rooms[j].id) {
                        floors[i].rooms[j].name = newName;
                        Database.updateFloorList(floors[i]);
                        refreshRoomList();
                        break;
                    }
                }
            }
        }

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
   alert('addNewHomeDevice');
}
/**
 * only for test
 */
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

