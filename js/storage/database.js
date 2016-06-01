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

//*YN_CtlPanel_assoc对象方法
//生成YN_s_key
function CtlPanel_Assoc_to_s_key(ctlpanel) {
    //组成为: SN（id）+ 按键编号 + 按键类型
    return '' + ctlpanel.panel.id + ctlpanel.btn_index + ctlpanel.panel.type;
}


//*YN_Elec_Equi对象方法
//生成YN_s_key 关联按钮组
//参数: elec_equic电器对象
function Elec_equic_to_s_key(elec_equic) {
    var rt = '';
    for (var as_panel in elec_equic.panel_assocs) {
        rt = rt.concat(CtlPanel_Assoc_to_s_key(as_panel));
    }
    return rt;
}

//YN_s_key按钮组的长度
//参数: 电器对象
function Elec_equic_len_s_key(elec_equic) {
    return elec_equic.panel_assocs.length;
}


//生成YN_s_driver
//参数: YN_Scene_Step对象
function Scene_Step_to_s_driver(scene_step) {
    //组成驱动SN+驱动编号+3位初始状态+2位延时时间+3位结束状态+2位延时时间
    return '' + scene_step.elec_equi.relay_assoc.relay.id +
        scene_step.elec_equi.relay_assoc.slot_index +
        scene_step.action1 +
        scene_step.action1_delay +
        scene_step.action2 +
        scene_step.action2_delay;
}

//*YN_Scene对象方法
//删除指面板
//参数: scene YN_Scene对象, panel: YN_CtlPanel对象
//返回: 更新后的scene对象
function deleteCtlPanel(scene, panel) {
    scene.ctlpanel_assocs = deleteEleFromList(panel, scene.ctlpanel_assocs);
    return scene;
}


//删除指定场景里的动作
//参数: scene YN_Scene对象, sceneStep: YN_Scene_Step对象
//返回: 更新后的scene对象
function deleteSceneStep(scene, sceneStep) {
    scene.scene_steps = deleteEleFromList(sceneStep, scene.scene_steps);
    return scene;
}

//生成场景YN_s_key 场景关联按键
//参数: scene YN_Scene对象
function Scene_to_s_key(scene) {
    var rt = '';
    for (var as_panel in scene.panel_assocs) {
        rt = rt.concat(CtlPanel_Assoc_to_s_key(as_panel));
    }
    return rt;
}

//生成场景关联子设备驱动组
//参数: scene YN_Scene对象
function Scene_to_s_driver(scene) {
    var rt = '';
    for (var step in this.scene_steps) {
        rt = rt.concat(Scene_Step_to_s_driver(step));
    }
    return rt;
}

//场景中关联按键的个数
//参数: scene YN_Scene对象
function Scene_len_s_key(scene) {
    return scene.ctlpanel_assocs.length;
}

//场景中关联按键的驱动个数
//参数: scene YN_Scene对象
function Scene_len_s_driver(scene) {
    return scene.scene_steps.length;

}


//*YN_Timing_Config定时配置对象方法

//参数: YN_Timing_Config对象
//返回定时配置的时候格式,根据具体的定时配置对象类型
function Timing_Config_getdatetime(timing_config) {
    //todo 根据timing_config的类型进行
    return timing_config.datetime;

}


/** 数据库对象 **/
//参数 :gatewayid -> 网关的唯一标识
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


        /* ----------------------- */
        /* 网关相关api */
        'setGateway': function (gateway) {
            dataTables.gateway = gateway;
            writeToDb();
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
            })
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

        //生成YN_s_key 关联按钮组
        //参数: elec_equic电器对象
        'Elec_equic_to_s_key': Elec_equic_to_s_key,

        //YN_s_key按钮组的长度
        'Elec_equic_len_s_key': Elec_equic_len_s_key,


        //YN_CtlPanel_assoc对象方法
        //生成YN_s_key, 参数: ctlpanel对象
        'CtlPanel_Assoc_to_s_key': CtlPanel_Assoc_to_s_key,

        //*YN_Scene_Step对象方法
        //生成YN_s_driver
        //参数: YN_Scene_Step对象
        'Scene_Step_to_s_driver': Scene_Step_to_s_driver,


        //*YN_Scene对象方法
        //删除指面板
        //参数: scene YN_Scene对象, panel: YN_CtlPanel对象
        //返回: 更新后的scene对象
        'Scene_deleteCtlPanel': deleteCtlPanel,


        //删除指定场景里的动作
        //参数: scene YN_Scene对象, sceneStep: YN_Scene_Step对象
        //返回: 更新后的scene对象
        'Scene_deleteSceneStep': deleteSceneStep,

        //生成场景YN_s_key 场景关联按键
        //参数: scene YN_Scene对象
        'Scene_to_s_key': Scene_to_s_key,


        //生成场景关联子设备驱动组
        //参数: scene YN_Scene对象
        'Scene_to_s_driver': Scene_to_s_driver,

        //场景中关联按键的个数
        //参数: scene YN_Scene对象
        'Scene_len_s_key': Scene_len_s_key,


        //场景中关联按键的驱动个数
        //参数: scene YN_Scene对象

        'Scene_len_s_driver': Scene_len_s_driver,


        //*YN_Timing_Config定时配置对象方法

        //参数: YN_Timing_Config对象
        //返回定时配置的时候格式,根据具体的定时配置对象类型
        'Timing_Config_getdatetime': Timing_Config_getdatetime

    }

}();

/* 京东控制设备的交互命令生成

 所有的返回值为代表一个命令的json

 */

var CmdGen = function () {

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

    return {


        // 查询载波按键子设备状态（06H）,APP端查询关联载波按键子设备当前工作状态
        'queryInputDevStatus':function() {
            return to_stream_value({'keymemo':FormatArrayNumberLengthToString([{num:0x06,len:3}])});
        },


        //查询驱动子设备状态（07H）,APP端查询关联驱动子设备当前工作状态

        'queryOutputDevStatus': function() {
            return to_stream_value({'powermemo':FormatArrayNumberLengthToString([{num:0x07,len:3}])});
        },


        // 配置驱动子设备场景
        //参数: scenepid场景Pid, drivernumber驱动口号,  sceneinfo场景信息（SceneInfo类型）
        'configScene': function(scenepid, drivernumber, sceneinfo ) {
            var val = FormatArrayNumberLengthToString([{num:0x0a,len:3},{num:scenepid,len:6},{num:drivernumber,len:3}]) + FormatArrayNumberLengthToString([{num:sceneinfo.latencyBeforeaAtion,len:6},{num:sceneinfo.stateBeforeAction,len:3},
                    {num:sceneinfo.latencyAfterAction,len:6},{num:sceneinfo.stateAfterAction,len:3}]);
             return to_stream_value({
                 'powermemo':val
             });
        },



        //删除场景
        //参数: 场景pid
        'deleteScene':function(pid){
              return to_stream_value({
                  'message_id':0x0c,
                  'scene_id':pid,
              });
        },


        //场景关联载波按键子设备
        //参数: scenepid场景Pid，btnnumber按键编号,btntype按键类型
        'connectScenepidWithInputDevice':function(scenepid, btnnumber,btntype){
            var val = FormatArrayNumberLengthToString([{num:0x21,len:3},
                {num:scenepid,len:6},{num:btnnumber,len:3},{num:btntype,len:3}]);
            return to_stream_value({'keymemo':val});
        },


        // 删除驱动子设备场景, 将某个驱动口从某个场景中删除
        //参数:pid场景pid, drivernumber驱动号
        'deleteOutputDeviceFromScene':function(pid,drivernumber){
            var val = FormatArrayNumberLengthToString([{num:0x22,len:3},
                {num:pid,len:6},{num:drivernumber,len:3}]);
            return to_stream_value({'powermemo':val});
        },

        //网关获取当前时间
        'sendDatatimeToGateway':function() {
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

        //全局场景控制
        //参数: pid场景pid, exec:执行要求：0x00-关，0x7F-开，0xff-反转
        'sceneControl': function (pid, exec) {
            return to_stream_value({'message_id': FormatArrayNumberLengthToString([{num:0x99,len:3}]),
               'scene_id':FormatArrayNumberLengthToString([{num:pid,len:6}]),
                'memo':FormatArrayNumberLengthToString([{num:exec,len:3}])
            });
        },

        //独立场景控制, 单独控制一个驱动设备
        //参数:drivernumber驱动号,sceneinfo场景信息YN_SceneInfo
        'independentSceneControl': function(drivernumber,sceneinfo) {
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

        //标准控制模式 用途：APP端独立控制指定驱动子设备某个驱动子设备的端口号。
        //即对设备进行单独的控制
        //参数: drivernumber驱动设备口, exec执行要求,执行要求：0x00-关，0x7F-开，0xff-反转
        'standardControl': function(drivernumber,exec) {
            var val = FormatArrayNumberLengthToString([{num:0x96,len:3},
                {num:drivernumber,len:3},{num:exec,len:3}]);

            return to_stream_value({'powermemo':val});
        },

    };

}();


/* 用于与京东交互的api */
var CloudApi = function () {

    function contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    }

    function parseWithSnapShop(streams, keys) {
        var rt = {};
        for (var s in streams) {
            if (contains(keys, s['stream_id'])) {
                rt[s['stream_id']] = s['current_value'];
            }
        }

        return rt;
    }

    function JDIOCtl(cmdgen_f, callback, keys) {

        JDSMART.io.controlDevice(
            {"command": cmdgen_f()},
            function (suc) {
                JDSMART.io.getSnapshot(function (success) {
                    if (callback) {
                        callback(true, parseWithSnapShop(success["streams"], keys));
                    }
                }, function (error) {
                    if (callback) {
                        callback(false, error);
                    }
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


        //注册网关
        //参数: gateway网关
        'registerGateway': function (gateway, callback) {
            Database.setGateway(gateway);
            var keys = ['YN_mac', 'YN_device_id', 'YN_msg_id', 'YN_msg_id', 'YN_datetime'];
            JDIOCtl(function () {
                    return CmdGen.regGateway(gateway);
                }, callback,
                keys);

        },

        //注册按键设备
        //参数: Panel按键设备
        'registerCtlPanel': function (panel, callback) {
            var keys = ['YN_mac', 'YN_device_id', 'YN_msg_id', 'YN_subdev_id', 'YN_subdev_t', 'YN_subdev_n'];
            JDIOCtl(function () {
                    return CmdGen.regBtnSubDev(Database.gateway, panel);
                }, callback,
                keys);

        },

        //注册驱动(继电器)子设备
        'registerRelay': function (relay, callback) {

            var keys = ['YN_mac', 'YN_device_id', 'YN_msg_id', 'YN_subdev_id', 'YN_subdev_t', 'YN_subdev_n', 'YN_pid',
                'YN_subdev_s'];

            JDIOCtl(function () {
                return CmdGen.regDrvSubDev(Database.gateway, relay);
            }, callback, keys);

        },

        //删除按键设备
        'deleteCtlPanel': function (panel, callback) {
            var keys = ['YN_mac', 'YN_device_id', 'YN_msg_id', 'YN_subdev_id'];
            JDIOCtl(function () {
                return CmdGen.deleteBtnSubDev(Database.gateway, panel);

            }, callback, keys);
        },

        //删除驱动（继电器）子设备
        'deleteRelay': function (relay, callback) {
            var keys = ['YN_mac', 'YN_device_id', 'YN_msg_id', 'YN_subdev_id', 'YN_subdev_n', 'YN_pid'];
            JDIOCtl(function () {
                return CmdGen.deleteDrvSubDev(Database.gateway, relay);
            }, callback, keys);
        },

        //更换按键子设备
        //参数: old_panel 旧的控制面板, new_panel新的控制面板
        'replaceOldCtlPanel': function (old_panel, new_panel, callback) {
            var keys = ['YN_mac', 'YN_device_id', 'YN_msg_id', 'YN_subdev_id', 'YN_psubdev_id'];
            JDIOCtl(function () {
                return CmdGen.replaceBtnSubDev(Database.gateway, old_panel, new_panel);
            }, callback, keys);
        },

        //更换驱动(继电器)子设备
        //参数: old_relay旧的继电器 new_relay新的继电器
        'replaceOldRelay': function (old_relay, new_relay, callback) {
            var keys = ['YN_mac', 'YN_device_id', 'YN_msg_id', 'YN_subdev_t', 'YN_subdev_n', 'YN_subdev_s'];
            JDIOCtl(function () {
                return CmdGen.replaceDrvSubDev(Database.gateway, old_relay, new_relay);
            }, callback, keys);
        },

        //创建场景
        //参数 : scene 场景
        'createScene': function (scene, callback) {
            var keys = ['YN_mac', 'YN_device_id', 'YN_msg_id', 'YN_pid', 'YN_pid_s'];
            JDIOCtl(function () {
                return CmdGen.createScene(Database.gateway, scene);
            }, callback, keys);

        },

        //更新场景
        //参数: scene需更新的场景
        'updateScene': function (scene, callback) {
            var keys = ['YN_mac', 'YN_device_id', 'YN_msg_id', 'YN_pid', 'YN_pid_s'];
            JDIOCtl(function () {
                return CmdGen.updateScene(Database.gateway, scene);
            }, callback, keys);
        },

        //删除场景
        //参数: scene 要删除的场景;必须带有正确的pid
        'deleteScene': function (scene, callback) {
            var keys = ['YN_mac', 'YN_device_id', 'YN_msg_id', 'YN_pid'];
            JDIOCtl(function () {
                if (!scene.pid) {
                    throw "scene.pid is null";
                }
                return CmdGen.deleteScene(scene);
            }, callback, keys);
        },

        //配置单一驱动场景<其实就是为某个电器配置按钮>
        //参数 elec_equi
        'configElecEqui': function (elec_equi, callback) {
            var keys = ['YN_mac', 'YN_device_id', 'YN_msg_id', 'YN_subdev_id', 'YN_pid', 'YN_pid_s'];
            JDIOCtl(function () {
                return CmdGen.configElecEqui(Database.gateway, elec_equi);
            }, callback, keys);
        },

        //配置定时任务
        'configTimingTask': function (timing_task, callback) {
            var keys = ['YN_mac', 'YN_device_id', 'YN_msg_id', 'YN_time_n', 'YN_pid', 'YN_timer_t', 'YN_datetime', 'YN_timer_s'];
            JDIOCtl(function () {
                return CmdGen.configTiming(Database.gateway, timing_task);
            }, callback, keys);
        },


        //删除定时任务
        //参数: timer_id 定时Id,即（YN_timer_n, callback）
        'deleteTimingTask': function (timing_id, callback) {
            var keys = ['YN_mac', 'YN_device_id', 'YN_msg_id', 'YN_time_n'];
            JDIOCtl(function () {
                return CmdGen.deleteTiming(Database.gateway, timing_id);
            }, callback, keys);

        },

        //app查询所有pid状态
        //参数 : pid_b起始pid pid_e结束Pid
        'queryAllPidStatus': function (pid_b, pid_e, callback) {
            var keys = ['YN_mac', 'YN_device_id', 'YN_msg_id', 'YN_pid_b', 'YN_pid_e', 'YN_pid_s'];
            JDIOCtl(function () {
                return CmdGen.queryAllPidStatus(Database.gateway, pid_b, pid_e);
            }, callback, keys);
        },

        //查询单个pid状态
        //参数: pid 要查询的pid
        'queryPidStatus': function (pid, callback) {
            var keys = ['YN_mac', 'YN_device_id', 'YN_msg_id', 'YN_pid', 'YN_pid_s'];
            JDIOCtl(function () {
                return CmdGen.queryPidStatus(Database.gateway, pid);
            }, callback, keys);
        },

        //查询所有定时Pid状态
        //参数 : pid_b起始pid pid_e结束Pid
        'queryAllTimingPidStatus': function (pid_b, pid_e, callback) {
            var keys = ['YN_mac', 'YN_device_id', 'YN_msg_id', 'YN_pid_b', 'YN_pid_e', 'YN_pid_s'];
            JDIOCtl(function () {
                return CmdGen.queryAllTimingPidStatus(Database.gateway, pid_b, pid_e);
            }, callback, keys);
        },

        //app场景控制
        //参数: Pid 要执行的Pid,  status将要执行的动作0x7f表示执行/0x00表示停止
        'controlScene': function (pid, status, callback) {
            var keys = ['YN_mac', 'YN_device_id', 'YN_msg_id', 'YN_pid', 'YN_msgpack'];
            JDIOCtl(function () {
                return CmdGen.controlScene(Database.gateway, pid, status);

            }, callback, keys);
        },
        //为某个电器配置单次执行的任务
        //参数: step为YN_Scene_Step对象,用于描述单次配置
        'controlElecEquiOnce': function (step, callback) {
            var keys = ['YN_mac', 'YN_device_id', 'YN_msg_id', 'YN_pid', 'YN_pid_s'];
            JDIOCtl(function () {
                return CmdGen.controlElecEquiOnce(Database.gateway, step);
            }, callback, keys);
        }

    };

}();


//网关对象
function YN_Gateway(device_id, feed_id, mac) {
    this.device_id = device_id;
    this.feed_id = feed_id;
    this.mac = mac;
}


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
function YN_Elec_Equi(name, floor, relay_assoc, room, panel_assocs, iconType, timing_tasks) {
    this.id = guid(); //电器的id,作为唯的标识
    this.name = name;  // 电器的名称
    this.floor = floor; //电器所处楼层
    this.room = room; //电器所处的房间
    this.relay_assoc = relay_assoc; //关联的继电器
    this.panel_assocs = panel_assocs; //关联的多个控制面板,也可能没有关联控制面板
    this.iconType = iconType;

    this.timing_tasks = timing_tasks; //电器的定时配置任务

}

//对电器对象执行的操作, 如调光\打开\关闭\调色
function YN_Elec_Equi_Action(d1, d2, d3) {
    //d1,d2,d3的意义为:
    //当为调色: d1 d2 d3 为 r g b 三色值
    //当为调光时: d1= d2 = d3 值的范围为0-100; 0表示关 100表示开  0-100中的某个数值表示一定的亮度
    this.id = guid();
    this.d1 = d1;
    this.d2 = d2;
    this.d3 = d3;
}

//继电器对象
function YN_Relay(id, name, floor, room, numberOfSlotsUsed) {
    this.id = id; //继电器对象的id
    this.name = name; //此继电器用户所输入的名称
    this.floor = floor; //继电器所处楼层
    this.room = room; //继电器所处的房间
    this.numberOfSlots = 4; //继电器的输出路数
    this.numberOfSlotsUsed = numberOfSlotsUsed; //继电器已接路数
    this.type = null; //继电器的类型
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
    this.numberOfButtons = 5; //面板中的按钮个数
    this.type = null; //面板的类型
    this.key_type = null; //按键外接设备类型
    this.pid = null; //起始pid


}

//绑定控制面对中哪个按钮使用的数据
function YN_CtlPanel_assoc(panel, btn_index) {
    this.id = guid();
    this.panel = panel;
    this.btn_index = btn_index; //


}

//组成场景中的某一步的对象
function YN_Scene_Step(elec_equi, action1, delay1, action2, delay2) {
    this.id = guid();
    this.elec_equi = elec_equi; //相关的电器
    this.action1 = action1; //需要执行的第一个动作
    this.action1_delay = delay1; //第一个动作的相应延时
    this.action2 = action2; //需要执行的第二个动作
    this.action2_delay = delay2;  //第二个动作的相应延时
}

//场景对象
function YN_Scene(name, scene_steps, ctlpanel_assocs, timing_tasks) {
    this.id = guid();
    this.name = name; //场景的名称
    this.scene_steps = scene_steps; //场景里的相关动作
    this.ctlpanel_assocs = ctlpanel_assocs; //场景可能绑定的多个面板, 也有可能没有绑定
    this.timing_tasks = timing_tasks; //场景的定时配置列表
    this.pid = null; //场景的pid

}

//定时配置对象, 可用于电器与场景; 当于用一个场景的定时时,elec_equi_action传递为null; 当用于一个电器的定时时, elec_equi_action代表电器定时所要执行的动作
function YN_Timing_Config(type, datetime, repeatArray, status, elec_equi_action) {
    this.type = type; // 1代表单次定时,2代表每周循环
    // todo: 配置的具体格式待定
    this.datetime = datetime;
    this.repeatArray = repeatArray;
    this.status = status; //true开启false是关闭
    this.getDatetime = function () {
        return datetime;
    }

    this.elec_equi_action = elec_equi_action || null ; //YN_Elec_Equi_Action 对象; 表示当此配置用于一个电器时,电器所要执行的动作
}

//定时任务
function YN_Timing_Task(pid, timing_config) {
    this.id = String.fromCharCode(255, 255); //对应于YN_time_n,即定时任务的编号
    this.timing_config = timing_config;  //定时配置
    this.pid = pid; //定时任务针对的pid

}


//场景配置信息
//参数: latencyBeforeaAtion动作前延时, stateBeforeAction动作前状态, latencyAfterAction动作后延时,  stateAfterAction动作后状态
function YN_SceneInfo(latencyBeforeaAtion,stateBeforeAction, latencyAfterAction, stateAfterAction) {
    this.latencyBeforeaAtion = latencyBeforeaAtion;
    this.stateBeforeAction = stateBeforeAction;
    this.latencyAfterAction = latencyAfterAction;
    this.stateAfterAction = stateAfterAction;

}
