/**
 * Created by tonychen on 16/2/24.
 */

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
        return ele.id == ary_ele.id;
    });

    if (i != -1) {
        return list[i];
    }
    return null;
}


/** 数据库对象 **/
var Database = function () {

    var dataTables = {
        'elec_equi_list': [],  //电器列表
        'relay_list': [],  //继电器列表
        'ctlpanel_list': [],  //控制面板列表
        'scene_list': [],  //场景列表
        'floor_list': [], //楼层列表
        'gateway': undefined, //网关对象
    }

    function writeToDb() {
        for (key_table in dataTables) {
            Lockr.set(key_table, dataTables[key_table]);
        }
    }


    function readFromDb() {
        for (key_table in dataTables) {
            dataTables[key_table] = Lockr.get(key_table) || [];
        }
    }


    function addEleToList(ele, list) {
        list.unshift(ele);
        writeToDb();
        return list;
    }

    function updateEleInList(ele, list) {
        var i = indexOfItemInArray(list, ele, function (ele, ary_ele) {
            return ele.id == ary_ele.id;
        });

        if (i != -1) {
            list[i] = ele;
        }
        writeToDb();
        return list;
    }

    function deleteEleFromList(ele, list) {
        var i = indexOfItemInArray(list, ele, function (ele, ary_ele) {
            return ele.id == ary_ele.id;
        });
        if (i != -1) {
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

        //获取电器列表
        'getElecEquiList': function () {
            return dataTables.elec_equi_list;
        },

        //参数: 需新增的电器
        //返回: 新的电器列表
        'addElecEquiToList': function (elec_equi) {
            return addEleToList(elec_equi, dataTables.elec_equi_list);
        },

        //参数: 待更新的电器
        //返回: 新的电器列表
        'updateElecEqui': function (elec_equi) {
            return updateEleInList(elec_equi, dataTables.elec_equi_list);
        },

        //参数: 待删除的电器
        //返回: 新的电器列表
        'deleteElecEquiFromList': function (elec_equi) {
            return deleteEleFromList(elec_equi, dataTables.elec_equi_list);
        },

        /* ------------------------------------ */
        /* 继电器相关的api */

        //获取继电器列表
        'getRelayList': function () {
            return dataTables.relay_list;
        },

        //参数: 需新增的继电器
        //返回: 新的继电器列表
        'addRelayToList': function (relay) {
            return addEleToList(relay, dataTables.relay_list);
        },

        //参数: 待更新的继电器
        //返回: 新的继电器列表
        'updateRelayList': function (relay) {
            return updateEleInList(relay, dataTables.relay_list);
        },

        //参数: 待删除的继电器
        //返回: 新的继电器列表
        'deleteRelayFromList': function (relay) {
            deleteEleFromList(relay, dataTables.relay_list);
        },

        /* ------------------------------------ */
        /* 控制面板相关api */

        //获取控制面板列表
        'getCtlPanelList': function () {
            return dataTables.ctlpanel_list;
        },

        //参数: 需新增的控制面板
        //返回: 新的控制面板列表
        'addCtlPanelToList': function (panel) {
            return addEleToList(panel, dataTables.ctlpanel_list);
        },

        //参数: 待更新的控制面板
        //返回: 新的控制面板列表
        'updateCtlPanelList': function (panel) {
            return updateEleInList(panel, dataTables.ctlpanel_list);
        },

        //参数: 待删除的控制面板
        //返回: 新的控制面板列表
        'deleteCtlPanelFromList': function (panel) {
            deleteEleFromList(panel, dataTables.ctlpanel_list);
        },

        /* -------------------------------- */
        /* 场景相关api */


        //获取场景列表
        'getSceneList': function () {
            return dataTables.scene_list;
        },

        //参数: 需新增的场景
        //返回: 新的场景列表
        'addCtlPanelToList': function (scene) {
            return addEleToList(scene, dataTables.scene_list);
        },

        //参数: 待更新的场景
        //返回: 新的场景列表
        'updateCtlPanelList': function (scene) {
            return updateEleInList(scene, dataTables.scene_list);
        },

        //参数: 待删除的场景
        //返回: 新的场景列表
        'deleteSceneFromList': function (scene) {
            deleteEleFromList(scene, dataTables.scene_list);
        },


        /* --------------------------------- */
        /* 楼层相关api */

        //获取楼层列表
        'getFloorList': function () {
            return dataTables.floor_list;
        },

        //参数: 需新增的楼层
        //返回: 新的楼层列表
        'addFloorToList': function (floor) {
            return addEleToList(floor, dataTables.floor_list);
        },


        //参数: 待更新的楼层
        //返回: 新的楼层列表
        'updateFloorList': function (floor) {
            return updateEleInList(floor, dataTables.floor_list);

        },

        //参数: 待删除的楼层
        //返回: 新的楼层列表

        'deleteFloorFromList': function (floor) {
            deleteEleFromList(floor, dataTables.floor_list);
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
        }

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
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    function datetime() {
        return new Date().format("yyyyMMddhhmmss");
    }

    function to_stream_value(kv) {
        var cmds = []
        for (key in kv) {
            cmds.push({
                "stream_id": key,
                "current_value": kv[key]
            });
        }

        return cmds;
    }

    return {
        //添加网关后进行初始化（app注册网关）
        //参数:网关对象
        'regGateway': function (gateway) {
            return to_stream_value({
                'YN_msg_id': String.fromCharCode(0),
                'YN_device_id': gateway.device_id,
                'YN_feed_id': gateway.feed_id,
                'YN_mac': String.fromCharCode(255, 255, 255, 255, 255, 255),
                'YN_datetime': datetime()
            });
        },

        /*
         //更换网关:
         'updateGateway': function(old_gateway, new_gateway) {
         return {
         'YN_msg_id:': String.fromCharCode(1),
         'YN_device_id': new_gateway.device_id,
         'YN_mac': 'FFFFFFFF',
         'YN_dev_id_p': old_gateway.device_id,
         'YN_mac_p': old_gateway.mac,
         'YN_feed_id_p': old_gateway.feed_id,
         'YN_msgpack': "" //??
         }
         },

         */


        //注册按键子设备
        //参数 : gateway 网关, ctlpanel: 控制面板
        'regBtnSubDev': function (gateway, ctlpanel) {
            return to_stream_value({
                'YN_msg_id': String.fromCharCode(2),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_subdev_id': ctlpanel.id,
                'YN_subdev_t': ctlpanel.type,  //返回
                'YN_subdev_n': ctlpanel.numberOfButtons,  //返回
                'YN_subdev_s': "", //返回
                'YN_key_type': ctlpanel.key_type,
                'YN_pid': "" //返回值


            });

        },

        //注册驱动子设备
        //参数: gateway 网关, relay: 继电器
        'regDrvSubDev': function (gateway, relay) {
            return to_stream_value({
                'YN_msg_id': String.fromCharCode(3),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_subdev_id': relay.id,
                'YN_subdev_n': "", //返回
                'YN_subdev_s': "",// 返回
                'YN_subdev_t': "", //返回
                'YN_pid': ""//返回

            });
        },

        //删除按键子设备
        //参数 : gateway 网关,panel按钮
        'deleteBtnSubDev': function (gateway, ctlpanel) {
            return to_stream_value({
                'YN_msg_id': String.fromCharCode(4),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_subdev_id': ctlpanel.id,

            });
        },

        //删除驱动子设备
        //参数: gateway 网关, relay: 继电器
        'deleteDrvSubDev': function (gateway, relay) {
            return to_stream_value({
                'YN_msg_id': String.fromCharCode(5),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_subdev_id': relay.id,
                'YN_pid': "", //返回
                'YN_subdev_n': '',// 返回

            });
        },


        //更换按键子设备:
        //参数: gateway 网关, old_ctlpanel 旧的控制面板, new_ctlpanel 新的控制面板
        'replaceBtnSubDev': function (gateway, old_ctlpanel, new_ctlpanel) {
            return to_stream_value({
                'YN_msg_id': String.fromCharCode(8),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_subdev_id': new_ctlpanel.id,
                'YN_psubdev_id': old_ctlpanel.id,
                'YN_msgpack': "" //??

            });
        },

        //更换驱动子设备
        //参数: gateway 网关, old_relay旧的驱动子设备  new_relay 新的驱动子设备
        'replaceDrvSubDev': function (gateway, old_relay, new_relay) {
            return to_stream_value({
                'YN_msg_id': String.fromCharCode(9),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_subdev_id': new_relay.id,
                'YN_psubdev_id': old_relay.id,
                'YN_pid_b': old_relay.pid,
                'YN_msgpack': "" //??
            });
        },

        //创建场景
        //参数: gateway网关, scene 要创建的场景
        'createScene': function (gateway, scene) {
            return to_stream_value({
                'YN_msg_id': String.fromCharCode(10),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_pid': "", //pid编号,返回
                'YN_pid_s': "", //Pid的状态,返回
                'YN_s_key': scene.to_s_key(),
                'YN_s_key_n': scene.len_s_key(),//按键组数
                'YN_s_driver': scene.to_s_driver(),//关联驱动组
                'YN_s_driver_n': scene.len_s_driver() //驱动组数
            });
        },

        //更新场景
        //参数 gateway网关, scene: 要更新的场景
        'updateScene': function (gateway, scene) {
            return to_stream_value({
                'YN_msg_id': String.fromCharCode(11),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_pid': scene.pid, //pid编号
                'YN_pid_s': "", //Pid的状态,返回
                'YN_s_key': scene.to_s_key(),
                'YN_s_key_n': scene.len_s_key(),//按键组数
                'YN_s_driver': scene.to_s_driver(),//关联驱动组
                'YN_s_driver_n': scene.len_s_driver() //驱动组数
            });
        },

        //删除场景
        //参数 gateway 网关 scene: 要删除的场景
        'deleteScene': function (gateway, scene) {
            return to_stream_value({
                'YN_msg_id': String.fromCharCode(12),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_pid': scene.pid
            });
        },

        //配置单一驱动场景<其实就是为某个电器配置按钮>

        'configElecEqui': function (gateway, elec_equi) {
            return to_stream_value({
                'YN_msg_id': String.fromCharCode(13),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_s_key': elec_equi.to_s_key(),
                'YN_s_key_n': elec_equi.len_s_key(),
                'YN_subdev_id': elec_equi.relay_assoc.relay.id,
                'YN_pid': elec_equi.relay_assoc.relay.pid,
                'YN_pid_s': "" //返回
            });
        },

        //配置定时任务
        //参数: gateway网关, pid 要定时的Pid，timing 定时任务对象
        'configTiming': function (gateway, timing_task) {

            return to_stream_value({
                'YN_msg_id': String.fromCharCode(14),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_time_n': timing_task.id,
                'YN_pid': timing_task.pid,
                'YN_timer_t': timing_task.timing_config,
                'YN_datetime': timing.timing_config.getDatetime(),
                'YN_time_s': timing.timing_config.status, //定时的任务状态 ??

            });
        },

        //删除定时任务
        //参数: gateway网关, timer_id 定时Id,即（YN_timer_n）
        'deleteTiming': function (gateway, timer_id) {
            return to_stream_value({
                'YN_msg_id': String.fromCharCode(0x0f),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_time_n': timer_id
            });
        },

        //app查询所有pid状态
        //参数: gateway网关, pid_b起始pid pid_e结束Pid
        'queryAllPidStatus': function (gateway, pid_b, pid_e) {

            return to_stream_value({
                'YN_msg_id': String.fromCharCode(0x10),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_pid_b': pid_b,
                'YN_pid_e': pid_e,
                'YN_pid_s': '' //返回, 所有的Pid状态,每个状态占用1字节
            });
        },

        //app查询单个pid状态
        //参数: gateway网关, pid
        'queryPidStatus': function (gateway, pid) {
            return to_stream_value({
                'YN_msg_id': String.fromCharCode(0x11),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_pid': pid,
                'YN_pid_s': '' //返回,1字节pid状态
            });
        },

        //查询所有定时Pid状态
        //参数: gateway网关, pid_b起始pid pid_e结束Pid
        'queryAllTimingPidStatus': function (gateway, pid_b, pid_e) {
            return to_stream_value({
                'YN_msg_id': String.fromCharCode(0x12),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_pid_b': pid_b,
                'YN_pid_e': pid_e,
                'YN_pid_s': '' //返回, 所有的Pid状态,每个状态占用1字节
            });
        },

        //app场景控制
        //参数: gateway网关, Pid 要执行的Pid,  status将要执行的动作0x7f表示执行/0x00表示停止
        'controlScene': function (gateway, pid, status) {
            return to_stream_value({
                'YN_msg_id': String.fromCharCode(0x99),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_pid': pid,
                'YN_pid_s': status,
                'YN_msgpack': '' //返回  ??
            });
        },

        //为某个电器配置单次执行的任务
        //参数  gateway网关, step为YN_Scene_Step对象,用于描述单次配置
        'controlElecEquiOnce': function (gateway, step) {
            return to_stream_value({
                'YN_msg_id': String.fromCharCode(0x98),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_s_driver': step.to_s_driver(),
                'YN_pid': '', //返回 ?
                'YN_pid_s': '', //返回, 执行后的状态
            });
        }


        //没有查询了??

        //查询按键子设备
        //参数: gateway 网关, relay: 继电器

        /*
         'queryBtnSubDev' : function(gateway, ctlpanel){
         return {
         'YN_msg_id':'06',
         'YN_device_id': gateway.device_id,
         'YN_feed_id': gateway.feed_id,
         'YN_mac': gateway.mac,
         'YN_subdev_id': ctlpanel.id,
         'YN_subdev_n': "" ,//返回
         'YN_subdev_s': "" ,// 返回
         'YN_subdev_t': "", //返回
         }
         },

         //查询驱动子设备
         //参数: gateway 网关, relay: 继电器

         'queryDrvSubDev' : function (gateway, relay) {
         return {
         'YN_msg_id':'07',
         'YN_device_id': gateway.device_id,
         'YN_mac': gateway.mac,
         'YN_subdev_id': relay.id,
         'YN_subdev_n': "" ,//返回
         'YN_subdev_s': "" ,// 返回
         'YN_subdev_t': "", //返回
         }
         },

         */

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
        for (s in streams) {
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
                        callback(false, err);
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

    }

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

    //向本楼层添加一个房间
    this.addRoom = function (room) {
        this.rooms.push(room);
    }

    //查找该楼层下特定id的房间
    //返回: 房间对象或null
    this.findRoom = function (id) {
        return findEleWithId(id, this.rooms);

    }
}


//房间对象
function YN_Room(name) {
    this.name = name; //房间名称; 如客厅\厨房等
    this.id = guid();
}

//电器对象
function YN_Elec_Equi(name, floor, relay_assocs, room, panel_assoc) {
    this.id = guid(); //电器的id,作为唯的标识
    this.name = name;  // 电器的名称
    this.floor = floor; //电器所处楼层
    this.room = room; //电器所处的房间
    this.relay_assoc = relay_assoc; //关联的继电器
    this.panel_assocs = panel_assocs; //关联的多个控制面板,也可能没有关联控制面板

    //生成YN_s_key 关联按钮组
    this.to_s_key = function () {
        var rt = '';
        for (as_panel in this.panel_assocs) {
            rt = rt.concat(as_panel.to_s_key());
        }
        return rt;
    }

    //YN_s_key按钮组的长度
    this.len_s_key = function () {
        this.panel_assocs.length;
    }
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
    this.numberOfSlots = 0; //继电器的输出路数
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

    this.to_s_key = function () {
        //组成为: SN（id）+ 按键编号 + 按键类型
        return '' + this.panel.id + btn_index + this.panel.type;
    }

}

//组成场景中的某一步的对象
function YN_Scene_Step(elec_equi, action1, delay1, action2, delay2) {
    this.id = guid();
    this.elec_equi = elec_equi; //相关的电器
    this.action1 = action1; //需要执行的第一个动作
    this.action1_delay = delay1; //第一个动作的相应延时
    this.action2 = action2; //需要执行的第二个动作
    this.action2_delay = delay2;  //第二个动作的相应延时


    this.to_s_driver = function () {
        //组成驱动SN+驱动编号+3位初始状态+2位延时时间+3位结束状态+2位延时时间
        return '' + this.elec_equi.relay_assoc.relay.id +
            this.elec_equi.relay_assoc.slot_index +
            this.action1 +
            this.action1_delay +
            this.action2 +
            this.action2_delay;
    }
}

//场景对象
function YN_Scene(name, scene_steps, ctlpanel_assocs, timing_tasks) {
    this.id = guid();
    this.name = name; //场景的名称
    this.scene_steps = scene_steps; //场景里的相关动作
    this.ctlpanel_assocs = ctlpanel_assocs; //场景可能绑定的多个面板, 也有可能没有绑定
    this.timing_tasks = timing_tasks; //场景的定时配置列表
    this.pid = null; //场景的pid

    //删除指面板
    this.deleteCtlPanel = function (panel) {
        this.ctlpanel_assocs = deleteEleFromList(panel, this.ctlpanel_assocs);
    }

    //删除指定场景里的动作
    this.deleteSceneStep = function (sceneStep) {
        this.scene_steps = deleteEleFromList(sceneStep, this.scene_steps);
    }

    //生成场景YN_s_key 场景关联按键
    this.to_s_key = function () {
        var rt = '';
        for (as_panel in this.panel_assocs) {
            rt = rt.concat(as_panel.to_s_key());
        }
        return rt;
    }

    //生成场景关联子设备驱动组
    this.to_s_driver = function () {
        var rt = '';
        for (step in this.scene_steps) {
            rt = rt.concat(step.to_s_driver());
        }
        return rt;
    }

    //场景中关联按键的个数
    this.len_s_key = function () {
        return this.ctlpanel_assocs.length;
    }

    //场景中关联按键的驱动个数
    this.len_s_driver = function () {
        return this.scene_steps.length;
    }
}

//定时配置对象
function YN_Timing_Config(type, datetime, status) {
    this.type = type; // 01代表单次定时,02代表每周循环
    // todo: 配置的具体格式待定
    this.datetime = datetime;
    this.status = status; //开启或是关闭

    this.getDatetime = function () {
        return datetime;
    }

}

//定时任务
function YN_Timing_Task(pid, timing_config) {
    this.id = String.fromCharCode(255, 255); //对应于YN_time_n,即定时任务的编号
    this.timing_config = timing_config;  //定时配置
    this.pid = pid; //定时任务针对的pid

}
