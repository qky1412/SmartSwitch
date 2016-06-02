/**
 * Created by tonychen on 16/2/24.
 */




//format int

function FormatNumberLength(num, length) {
    function reverse(s) {
        return s.split("").reverse().join("");
    }
    if(length === 6) {
        var hex = num.toString(16);
        var reversehex = reverse(hex);
        var pieces = reversehex.match(/.{1,2}/g).reverse();
        return pieces.map(function(currentValue){
            var val = reverse(currentValue);
            return FormatNumberLength(parseInt(val,16),3);
        }).reduce(function(total, currentValue){
            return total + currentValue;
        },"");

    } else if (length ===3) {
        var r = "" + num;
        while (r.length < length) {
            r = "0" + r;
        }
        return r;
    }
}


function FormatArrayNumberLengthToString(arrayNumberLength) {
    arrayNumberLength.map(function (currentValue) {
        return FormatNumberLength(currentValue.num, currentValue.len)
            .reduce(function(total, currentValue){
                return total + currentValue;
            },"");
    });
}



function StringArrayToInt(strArray) {
    var hexStr = strArray.map(function(currentVal){
        return parseInt(currentVal,10).toString(16);
    }).join("");

    return parseInt(hexStr,16);
}





//----------------------------------------------------//


function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function indexOfItemInArray(ary, ele, filter_func) {
    var i = 0;
    for (i = 0; i < ary.length; ++i) {
        if (filter_func(ele, ary[i])) {
            break;
        }
    }
    if (i < ary.length) {
        return i;
    }
    return -1;
}


function findEleWithId(id, list) {
    var i = indexOfItemInArray(list, {'id': id}, function (ele, ary_ele) {
        return ele.id === ary_ele.id;
    });

    if (i !== -1) {
        return list[i];
    }
    return null;
}

function addEleToList(ele, list) {
    list.push(ele);
    return list;
}

function updateEleInList(ele, list) {
    var i = indexOfItemInArray(list, ele, function (ele, ary_ele) {
        return ele.id === ary_ele.id;
    });

    if (i !== -1) {
        list[i] = ele;
    }
    return list;
}

function deleteEleFromList(ele, list) {
    var i = indexOfItemInArray(list, ele, function (ele, ary_ele) {
        return ele.id === ary_ele.id;
    });
    if (i !== -1) {
        list.splice(i, 1);
    }
    return list;
}


/* ------------------------- */
//一些对象方法


//*YN_Scene对象方法

//删除指定场景里的动作
//参数: scene YN_Scene对象, sceneStep: YN_Scene_Step对象
//返回: 更新后的scene对象
function deleteSceneStep(scene, sceneStep) {
    scene.scene_steps = deleteEleFromList(sceneStep, scene.scene_steps);
    return scene;
}


/** 数据库对象 **/
//参数 :gatewayid -> 网关的唯一标识


//!! ready完以后要调用
var Database = function (gatewayid) {

    var dataTables = {
        'elec_equi_list': [],  //电器列表
        'relay_list': [],  //继电器列表
        'ctlpanel_list': [],  //控制面板列表
        'scene_list': [],  //场景列表
        'floor_list': [], //楼层列表
        'gateway': undefined, //网关对象
        'default_scene': undefined, //默认场景
    }

    function writeToDb() {
        for (var key_table in dataTables) {
            Lockr.set(key_table+gatewayid, dataTables[key_table]);
        }
    }


    function readFromDb() {
        for (var key_table in dataTables) {
            key_table = key_table+gatewayid;
            var defaultscene = 'default_scene'+gatewayid;
            if (key_table === defaultscene) {
                continue;
            }
            dataTables[key_table] = Lockr.get(key_table) || [];
        }

        //获取默认场景
        dataTables[defaultscene] = Lockr.get('default_scene') || createDefaultScene();

    }
    //创建一个默认场景
    function createDefaultScene() {
        return new YN_Scene("默认场景",null, null, null, 0);
    }


    function addEleToListDb(ele, list) {
        list.push(ele);
        writeToDb();
        return list;
    }

    function updateEleInListDb(ele, list) {
        var i = indexOfItemInArray(list, ele, function (ele, ary_ele) {
            return ele.id === ary_ele.id;
        });

        if (i !== -1) {
            list[i] = ele;
        }
        writeToDb();
        return list;
    }

    function deleteEleFromListDb(ele, list) {
        var i = indexOfItemInArray(list, ele, function (ele, ary_ele) {
            return ele.id === ary_ele.id;
        });
        if (i !== -1) {
            list.splice(i, 1);
        }
        writeToDb();
        return list;
    }


    //初始化动作
    readFromDb();

    return {
        /* ------------------------------------ */
        /* 电器相关api */

        //获取指定Id的电器对象
        //返回: 电器对象 or null
        'getElecEquiByid': function (id) {
            return findEleWithId(id, dataTables.elec_equi_list);
        },

        //获取电器列表
        'getElecEquiList': function () {
            return dataTables.elec_equi_list;
        },

        //参数: 需新增的电器
        //返回: 新的电器列表
        'addElecEquiToList': function (elec_equi) {
            return addEleToListDb(elec_equi, dataTables.elec_equi_list);
        },

        //参数: 待更新的电器
        //返回: 新的电器列表
        'updateElecEqui': function (elec_equi) {
            return updateEleInListDb(elec_equi, dataTables.elec_equi_list);
        },

        //参数: 待删除的电器
        //返回: 新的电器列表
        'deleteElecEquiFromList': function (elec_equi) {
            return deleteEleFromListDb(elec_equi, dataTables.elec_equi_list);
        },

        /* ------------------------------------ */
        /* 继电器相关的api */

        //获取指定Id的继电器对象
        //返回: 继电器对象 or null
        'getRelayByid': function (id) {
            return findEleWithId(id, dataTables.relay_list);
        },

        //获取继电器列表
        'getRelayList': function () {
            return dataTables.relay_list;
        },

        //参数: 需新增的继电器
        //返回: 新的继电器列表
        'addRelayToList': function (relay) {
            return addEleToListDb(relay, dataTables.relay_list);
        },

        //参数: 待更新的继电器
        //返回: 新的继电器列表
        'updateRelayList': function (relay) {
            return updateEleInListDb(relay, dataTables.relay_list);
        },

        //参数: 待删除的继电器
        //返回: 新的继电器列表
        'deleteRelayFromList': function (relay) {
            deleteEleFromListDb(relay, dataTables.relay_list);
        },

        /* ------------------------------------ */
        /* 控制面板相关api */

        //获取指定Id的控制面板对象
        //返回: 控制面板对象 or null

        'getCtlPanelByid': function (id) {
            return findEleWithId(id, dataTables.ctlpanel_list);
        },


        //获取控制面板列表
        'getCtlPanelList': function () {
            return dataTables.ctlpanel_list;
        },

        //参数: 需新增的控制面板
        //返回: 新的控制面板列表
        'addCtlPanelToList': function (panel) {
            return addEleToListDb(panel, dataTables.ctlpanel_list);
        },

        //参数: 待更新的控制面板
        //返回: 新的控制面板列表
        'updateCtlPanelList': function (panel) {
            return updateEleInListDb(panel, dataTables.ctlpanel_list);
        },

        //参数: 待删除的控制面板
        //返回: 新的控制面板列表
        'deleteCtlPanelFromList': function (panel) {
            deleteEleFromListDb(panel, dataTables.ctlpanel_list);
        },

        /* -------------------------------- */
        /* 场景相关api */

        //获取指定Id的场景对象
        //返回: 场景对象 or null

        'getSceneByid': function (id) {
            return findEleWithId(id, dataTables.scene_list);
        },

        //获取场景列表
        'getSceneList': function () {
            return dataTables.scene_list;
        },

        //参数: 需新增的场景
        //返回: 新的场景列表
        'addSceneToList': function (scene) {
            return addEleToListDb(scene, dataTables.scene_list);
        },

        //参数: 待更新的场景
        //返回: 新的场景列表
        'updateSceneList': function (scene) {
            return updateEleInListDb(scene, dataTables.scene_list);
        },

        //参数: 待删除的场景
        //返回: 新的场景列表
        'deleteSceneFromList': function (scene) {
            deleteEleFromListDb(scene, dataTables.scene_list);
        },


        /* --------------------------------- */
        /* 楼层相关api */

        //获取指定Id的楼层对象
        //返回: 楼层对象 or null

        'getFloorByid': function (id) {
            return findEleWithId(id, dataTables.floor_list);
        },

        //获取楼层列表
        'getFloorList': function () {
            return dataTables.floor_list;
        },

        //参数: 需新增的楼层
        //返回: 新的楼层列表
        'addFloorToList': function (floor) {
            return addEleToListDb(floor, dataTables.floor_list);
        },


        //参数: 待更新的楼层
        //返回: 新的楼层列表
        'updateFloorList': function (floor) {
            return updateEleInListDb(floor, dataTables.floor_list);

        },

        //参数: 待删除的楼层
        //返回: 新的楼层列表

        'deleteFloorFromList': function (floor) {
            deleteEleFromListDb(floor, dataTables.floor_list);
        },

        //参数楼层id
        //返回: 楼层对象或null
        'findFloorFromList': function (id) {
            return findEleWithId(id, dataTables.floor_list);
        },



        /* ------------------------ */
        /* 一些定制的api */

        //参数: 房间id
        //返回: 该房间下所有的电器, 如果一个电器都没,则返回空列表([])
        'getElecEquicListInRoom': function (roomid) {

            return dataTables.elec_equi_list.filter(function (elec_equi) {
                return elec_equi.room.id === roomid;
            });

        },

        //参数:房间id
        //返回: 该房间下所有的继电器,若无则返回[]
        'getRelayListInRoom': function (roomid) {
            return dataTables.relay_list.filter(function (relay) {
                return relay.room.id === roomid;
            });
        },

        //参数: 房间id
        //返回: 该房间下所有的控制面板, 若无则返回[]
        'getCtlPanelListInRoom': function (roomid) {
            return dataTables.ctlpanel_list.filter(function (ctlpanel) {
                return ctlpanel.room.id === roomid;
            });
        },


        /* --------------------------------- */
        //楼层对象的方法

        //向楼层添加一个房间
        //参数: floor 楼层对象, room 房间
        //返回: 无
        'addRoomToFloor': function (floor, room) {
            floor.rooms.push(room);
        },

        //查找楼层下特定id的房间
        //参数 floor 楼层对象, roomid 房间Id
        'findRoomInFloor': function (floor, roomid) {
            return findEleWithId(roomid, floor.rooms);
        },

        //电器对象方法


        //删除指定场景里的动作
        //参数: scene YN_Scene对象, sceneStep: YN_Scene_Step对象
        //返回: 更新后的scene对象
        'Scene_deleteSceneStep': deleteSceneStep

    };

}();

/* 京东控制设备的交互命令生成

 所有的返回值为代表一个命令的json

 */

var CmdParserGen = function () {

    Date.prototype.format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1,                 //月份
            "d+": this.getDate(),                    //日
            "h+": this.getHours(),                   //小时
            "m+": this.getMinutes(),                 //分
            "s+": this.getSeconds(),                 //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    function datetime() {
        return new Date().format("yyyyMMddhhmmss");
    }

    function to_stream_value(kv) {
        var cmds = []
        for (var key in kv) {
            cmds.push({
                "stream_id": key,
                "current_value": kv[key]
            });
        }

        return cmds;
    }

    function getValueOfKey(streams, key) {
        for (var s in streams) {
            if (s['stream_id']===key) {
                return s['current_value'];
            }
        }

        return "";
    }

    return {


        // 查询载波按键子设备状态（06H）,APP端查询关联载波按键子设备当前工作状态
        'queryInputDevStatus':{
            'cmdgen':function() {
            return to_stream_value({'keymemo':FormatArrayNumberLengthToString([{num:0x06,len:3}])});
        },
            //callback:function({cmdCode,btnStates}) cmdCode:命令字,btnStates:按键状态集合;工作状态，0x00-关，0x7F-开，0xff是反转，默认为0x00-关
        'parsergen':function(streams, callback){
            var val = getValueOfKey(streams,'mac');
            var ary = val.match(/.{1,6}/g);
            var cmdCode = parseInt(ary[0],10);
            var btnStates = ary.shift().map(function(currentVal){
                return parseInt(currentVal,10);
            });
            callback({'cmdCode':cmdCode, 'btnStates':btnStates});

        }},


        //查询驱动子设备状态（07H）,APP端查询关联驱动子设备当前工作状态

        'queryOutputDevStatus':{
            'cmdgen': function() {
                return to_stream_value({'powermemo':FormatArrayNumberLengthToString([{num:0x07,len:3}])});
            },
            //callback:function(cmdCode,numberOfDrivers,driverStates,subdevpid)
            //cmdCode:命令字, numberOfDrivers:有效驱动数,driverStates:驱动状态集合,subdevpid子设备pid
            //驱动 状态:
            //bit7:为1时，有新触发信号时反转整个字节；为0时，依据bit6~bit0数值执行；
            //bit6~bit0:当前驱动口输出灰度，x1111111-最大输出（最亮），x0000000-最小输出（不亮），
            //    中间值对应不同的灰度（亮度）。

            'parsergen':function(streams, callback){
                var val = getValueOfKey(streams, 'powermemo');
                var ary = val.match(/.{1,6}/g);
                var cmdCode = parseInt(ary[0],10);
                var numberOfDrivers = parseInt(ary[1],16);
                var driverStates = ary.slice(2,ary.length-2).map(function(currentVal){
                    return parseInt(currentVal,10);
                });

                var pid = StringArrayToInt(ary.slice(ary.length-2,ary.length));
                callback({'cmdCode':cmdCode,'numberOfDrivers': numberOfDrivers,'driverStates':driverStates, 'subdevpid':pid});


            }
        },


        // 配置驱动子设备场景
        //参数: scenepid场景Pid, drivernumber驱动口号,  sceneinfo场景信息（SceneInfo类型）
        'configScene':{
            'cmdgen': function(scenepid, drivernumber, sceneinfo ) {
                var val = FormatArrayNumberLengthToString([{num:0x0a,len:3},{num:scenepid,len:6},{num:drivernumber,len:3}]) + FormatArrayNumberLengthToString([{num:sceneinfo.latencyBeforeaAtion,len:6},{num:sceneinfo.stateBeforeAction,len:3},
                        {num:sceneinfo.latencyAfterAction,len:6},{num:sceneinfo.stateAfterAction,len:3}]);
                return to_stream_value({
                    'powermemo':val
                });
            },
            //callback:function({cmdCode, scenepid, drivernumber})
            //参数:cmdCode命令字, scenepid场景pid,drivernumber驱动口号
            'parsergen':function(streams, callback) {
                var val = getValueOfKey(streams, 'mac');
                var cmdCode = parseInt(val[0],10);
                var scenepid = StringArrayToInt(val.slice(1,1+2));
                var drivernumber = parseInt(val[val.length-1],16);
                callback({'cmdCode':cmdCode, 'scenepid':scenepid, 'drivernumber':drivernumber});

            }
        },



        //删除场景
        //参数: 场景pid
        'deleteScene':{
            'cmdgen':function(pid){
                return to_stream_value({
                    'message_id':0x0c,
                    'scene_id':pid,
                });
            },
            //callback:function({cmdCode,scenepid})
            //参数cmdCode命令字, scenepid场景pid
            'parsergen':function(streams, callback){
                var val = getValueOfKey(streams, 'mac');
                var cmdCode = parseInt(val[0],10);
                var scenepid = StringArrayToInt(val.slice(1,val.length));
                callback({'cmdCode':cmdCode, 'scenepid':scenepid});

            }
        },


        //场景关联载波按键子设备
        //参数: scenepid场景Pid，btnnumber按键编号,btntype按键类型
        'connectScenepidWithInputDevice':{
            'cmdgen':function(scenepid, btnnumber,btntype){
                var val = FormatArrayNumberLengthToString([{num:0x21,len:3},
                    {num:scenepid,len:6},{num:btnnumber,len:3},{num:btntype,len:3}]);
                return to_stream_value({'keymemo':val});
            },
            //callback:function({cmdCode,scenepid,btnNumber,btnStates})
            'parsergen':function(streams,callback){
                var val = getValueOfKey(streams, 'keymemo');
                var cmdCode = parseInt(val[0],10);
                var scenepid = StringArrayToInt(val.slice(1,1+2));
                var btnNumber = parseInt(val[3],10);
                var btnStates = val.slice(4,val.length).map(function(currentVal){
                    return parseInt(currentVal,10);
                });

                callback({'cmdCode':cmdCode,'scenepid': scenepid,'btnNumber': btnNumber,'btnStates': btnStates});
            }

        },


        // 删除驱动子设备场景, 将某个驱动口从某个场景中删除
        //参数:pid场景pid, drivernumber驱动号
        'deleteOutputDeviceFromScene':{
            'cmdgen':function(pid,drivernumber){
                var val = FormatArrayNumberLengthToString([{num:0x22,len:3},
                    {num:pid,len:6},{num:drivernumber,len:3}]);
                return to_stream_value({'powermemo':val});
            },
            //callback:function({cmdCode,scenepid,drivernumber})
            //drivernumber:驱动口号
            'parsergen':function(streams, callback){
                var val = getValueOfKey(streams, 'mac');
                var cmdcode = parseInt(val[0],10);
                var scenepid = StringArrayToInt(val.slice(1,1+2));
                var drivernumber = parseInt(val[val.length-1],10);
                callback({'cmdCode':cmdcode,'scenepid':scenepid, 'drivernumber':drivernumber});

            }
        },

        //网关获取当前时间
        'sendDatatimeToGateway':{
            'cmdgen':function() {
                var now = new Date();
                var val = FormatArrayNumberLengthToString([
                    {num:now.getFullYear(),len:6},
                    {num:now.getMonth()+1,len:3},
                    {num:now.getDate(),len:3},
                    {num:now.getHours()+1,len:3},
                    {num:now.getMinutes(),len:3},
                    {num:now.get.getSeconds(),len:3}
                ]);
                return to_stream_value({'message_id':0x25,
                    'memo':val});
            },
            //callback:function(success)
            //success="success"字串
            'parsercmd':function(streams,callback) {
                callback("success");
            }
        },

        //全局场景控制
        //参数: pid场景pid, exec:执行要求：0x00-关，0x7F-开，0xff-反转
        'sceneControl': {
            'cmdgen':function (pid, exec) {
                return to_stream_value({'message_id': FormatArrayNumberLengthToString([{num:0x99,len:3}]),
                    'scene_id':FormatArrayNumberLengthToString([{num:pid,len:6}]),
                    'memo':FormatArrayNumberLengthToString([{num:exec,len:3}])
                });
            },
            //callback:function({cmdcode,scenepid,exec_result})
            //exec_result:执行结果： 0x7F -场景打开成功 ， 0 -场景打开失败
            'parsergen':function(streams,callback){
                var val = getValueOfKey(streams, 'mac');
                var cmdcode = parseInt(val[0],10);
                var scenepid = StringArrayToInt(val.slice(1,1+2));
                var execresult = parseInt(val[val.length-1],10);
                callback({'cmdcode':cmdcode,'scenepid':scenepid,'exec_result':execresult});
            }
        },
        //独立场景控制, 单独控制一个驱动设备
        //参数:drivernumber驱动号,sceneinfo场景信息YN_SceneInfo
        'independentSceneControl': {
            'cmdgen':function(drivernumber,sceneinfo) {
                var val = FormatArrayNumberLengthToString([
                    {num:0x98,len:3},
                    {num:drivernumber,len:3},
                    {num:sceneinfo.latencyBeforeaAtion,len:6},
                    {num:sceneinfo.stateBeforeAction,len:3},
                    {num:sceneinfo.latencyAfterAction,len:6},
                    {num:sceneinfo.stateAfterAction,len:3}
                ]);
                return to_stream_value({
                    'powermemo':val
                });
            },
            //callback:function({cmdcode,subdevtype, numberofdrivers,driverStates})
            //参数:cmdcode命令字, subdevtype子设备类型,numberofdrivers有效驱动数量, driverStates驱动状态集合
            'parsergen':function(streams,callback){
                var val = getValueOfKey(streams, 'mac');
                var cmdcode = parseInt(val[0],10);
                var subdevtype = parseInt(val[1],10);
                var numberofdrivers = parseInt(val[2],10);
                var driverStates = val.slice(3,val.length).map(function(currentVal){
                    return parseInt(currentVal,10);
                });

                callback({'cmdcode':cmdcode,'subdevtype':subdevtype, 'numberofdrivers':numberofdrivers, 'driverStates':driverStates});

            }
        },

        //标准控制模式 用途：APP端独立控制指定驱动子设备某个驱动子设备的端口号。
        //即对设备进行单独的控制
        //参数: drivernumber驱动设备口, exec执行要求,执行要求：0x00-关，0x7F-开，0xff-反转
        'standardControl':{
            'cmdgen': function(drivernumber,exec) {
                var val = FormatArrayNumberLengthToString([{num:0x96,len:3},
                    {num:drivernumber,len:3},{num:exec,len:3}]);

                return to_stream_value({'powermemo':val});
            },
            //callback:function({cmdCode,exec_result})
            //参数cmdcode:命令字,exec_result:执行结果
            //注：0x7F-成功，0x00-失败
            'parsergen':function(streams,callback){
                var val = getValueOfKey(streams, 'mac');
                var cmdcode = parseInt(val[0],10);
                var execresult = parseInt(val[1],10);
                callback({'cmdCode':cmdcode, 'exec_result':execresult});
            }
        }

    };

}();


/* 用于与京东交互的api */
var CloudApi = function () {


    function JDIOCtl(cmdgen_f, parser_f, callback) {

        JDSMART.io.controlDevice(
            {"command": cmdgen_f()},
            function (suc) {
                parser_f(suc.streams,function(resultobject){
                    callback(true, resultobject);
                });
            },
            function (err) {
                if (callback) {
                    callback(false, err);
                }
            }
        );
    }


    return {

        // 查询载波按键子设备状态（06H）,APP端查询关联载波按键子设备当前工作状态
        //business_cb:function(true,{cmdCode,btnStates})
        //      or function(false,err);
        'queryInputDevStatus':function(business_cb) {
            JDIOCtl(CmdParserGen.queryInputDevStatus.cmdgen,
                CmdParserGen.queryInputDevStatus.parsergen,
                business_cb
            );

        },

        //查询驱动子设备状态（07H）,APP端查询关联驱动子设备当前工作状态
        //business_cb:function(true,{cmdCode,numberOfDrivers,driverStates,subdevpid})
        //cmdCode:命令字, numberOfDrivers:有效驱动数,driverStates:驱动状态集合,subdevpid子设备pid
        //      or function(false,err);
        //驱动 状态:
        //bit7:为1时，有新触发信号时反转整个字节；为0时，依据bit6~bit0数值执行；
        //bit6~bit0:当前驱动口输出灰度，x1111111-最大输出（最亮），x0000000-最小输出（不亮），
        //    中间值对应不同的灰度（亮度）。
        'queryOutputDevStatus':function(business_cb) {
            JDIOCtl(CmdParserGen.queryOutputDevStatus.cmdgen,
                CmdParserGen.queryOutputDevStatus.parsergen,
                business_cb
            );
        },


        // 配置驱动子设备场景
        //business_cb:function(true,{cmdCode, scenepid, drivernumber})
        //  or function(false,err)
        'configScene':function(business_cb){
            JDIOCtl(CmdParserGen.configScene.cmdgen,
                CmdParserGen.configScene.parsergen,
                business_cb
            );
        },

        //删除场景
        //business_cb:function(true,{cmdCode,scenepid})
        //  or function(false,err)
        'deleteScene':function(business_cb){
            JDIOCtl(CmdParserGen.deleteScene.cmdgen,
                CmdParserGen.deleteScene.parsergen,
                business_cb
            );
        },


        //场景关联载波按键子设备
        //business_cb:function(true,{cmdCode,scenepid,btnNumber,btnStates})
        //      or function(false,err)
        'connectScenepidWithInputDevice':function(business_cb){
            JDIOCtl(CmdParserGen.connectScenepidWithInputDevice.cmdgen,
                CmdParserGen.connectScenepidWithInputDevice.parsergen,
                business_cb
            );
        },

        // 删除驱动子设备场景, 将某个驱动口从某个场景中删除
        //business_cb:function(true,{cmdCode,scenepid,drivernumber})
        //      or function(false,err)

        'deleteOutputDeviceFromScene':function(business_cb){
            JDIOCtl(CmdParserGen.deleteOutputDeviceFromScene.cmdgen,
                CmdParserGen.deleteOutputDeviceFromScene.parsergen,
                business_cb
            );
        },


        //网关获取当前时间
        //business_cb:function(true, success)  sucess=="success"
        //  or function(false,err)

        'sendDatatimeToGateway':function(business_cb){
            JDIOCtl(CmdParserGen.sendDatatimeToGateway.cmdgen,
              CmdParserGen.sendDatatimeToGateway.parsergen,
              business_cb
             );
        },

        //全局场景控制
        //business_cb:function(true,{cmdcode,scenepid,exec_result})
        //  or function(false,err);

        'sceneControl':function(business_cb) {
            JDIOCtl(CmdParserGen.sceneControl.cmdgen,
                CmdParserGen.sceneControl.parsergen,
                business_cb
            );
        },

        //独立场景控制, 单独控制一个驱动设备
        //callback:function(true,{cmdcode,subdevtype, numberofdrivers,driverStates})
        //  or function(false,err)
        'independentSceneControl':function(business_cb) {
            JDIOCtl(CmdParserGen.independentSceneControl.cmdgen,
                CmdParserGen.independentSceneControl.parsergen,
                business_cb
            );
        },

        //标准控制模式 用途：APP端独立控制指定驱动子设备某个驱动子设备的端口号。
        //business_cb:function(true, {cmdCode,exec_result})
        //  or function(false,err)

        'standardControl':function(business_cb) {
            JDIOCtl(CmdParserGen.standardControl.cmdgen,
                CmdParserGen.standardControl.parsergen,
                business_cb
            );
        }

    };

}();



//楼层对象
function YN_Floor(name) {
    this.name = name; //楼层名称, 如一层/地下室等
    this.id = guid();
    this.rooms = [];

}


//房间对象
function YN_Room(name) {
    this.name = name; //房间名称; 如客厅\厨房等
    this.id = guid();
}

//电器对象
function YN_Elec_Equi(name, floor, relay_assoc, room, iconType) {
    this.id = guid(); //电器的id,作为唯的标识
    this.name = name;  // 电器的名称
    this.floor = floor; //电器所处楼层
    this.room = room; //电器所处的房间
    this.relay_assoc = relay_assoc; //关联的继电器
    this.iconType = iconType;

}


//继电器对象
function YN_Relay(id, name, floor, room) {
    this.id = id; //继电器对象的id
    this.name = name; //此继电器用户所输入的名称
    this.floor = floor; //继电器所处楼层
    this.room = room; //继电器所处的房间
    this.numberOfSlots = 7; //继电器的输出路数
    this.slotStates = []; //继电器的当前状态
    this.type = null; //继电器的类型, not used
    this.pid = null; //起始pid
}
//用于绑定某个继电器的某一路使用的数据结构
function YN_Relay_assoc(relay, slot_index) {
    this.id = guid();
    this.relay = relay; //继电器对象
    this.slot_index = slot_index; //继电器的哪一路
}

//控制面板对象
function YN_CtlPanel(id, name, floor, room) {
    this.id = id; // 面板id
    this.name = name; //面板名称
    this.floor = floor; // 面板所处楼层
    this.room = room; // 面板所处房间
    this.numberOfButtons = 4; //面板中的按钮个数
    this.btnStates = []; //面板中的按钮状态
    this.type = null; //面板的类型, not used
    this.pid = null; //起始pid


}

//绑定控制面对中哪个按钮使用的数据
function YN_CtlPanel_assoc(panel, btn_index) {
    this.id = guid();
    this.panel = panel;
    this.btn_index = btn_index;


}


//场景配置信息
//参数: latencyBeforeaAtion动作前延时, stateBeforeAction动作前状态, latencyAfterAction动作后延时,  stateAfterAction动作后状态
function YN_SceneInfo(latencyBeforeaAtion,stateBeforeAction, latencyAfterAction, stateAfterAction) {
    this.latencyBeforeaAtion = latencyBeforeaAtion;
    this.stateBeforeAction = stateBeforeAction;
    this.latencyAfterAction = latencyAfterAction;
    this.stateAfterAction = stateAfterAction;

}


//组成场景中的某一步的对象
function YN_Scene_Step(elec_equi, sceneinfo) {
    this.id = guid();
    this.sceneinfo = sceneinfo;//对该电器在此步场景中的配置
    this.elec_equi = elec_equi; //相关的电器
}

//场景对象
function YN_Scene(name, scene_steps) {
    this.id = guid();
    this.name = name; //场景的名称
    this.scene_steps = scene_steps; //场景里的相关动作
    this.pid = 0xff; //场景的pid

}

