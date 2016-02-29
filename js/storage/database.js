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


    function addEleToList(ele, list) {
        list.unshift(ele);
        return list;
    }

    function updateEleInList(ele, list) {
        var i = indexOfItemInArray(list, ele, function (ele, ary_ele) {
            return ele.id.equals(ary_ele.id);
        });

        if (i != -1) {
            list[i] = ele;
        }
        return list;
    }

    function deleteEleFromList(ele, list) {
        var i = indexOfItemInArray(list, ele, function (ele, ary_ele) {
            return ele.id.equals(ary_ele.id);
        });
        if (i != -1) {
            list.splice(i, 1);
        }
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


        /* ----------------------- */
        /* 网关相关api */
        'setGateway': function (gateway) {
            dataTables.gateway = gateway;
        }

    }

}();

/* 京东控制设备的交互命令生成

 所有的返回值为代表一个命令的json

 */

var CmdGen = function () {

    Date.prototype.format = function(fmt)
    { //author: meizz
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    }

    function datetime() {
        return new Date().format("yyyyMMddhhmmss");
    }

    return {
        //添加网关后进行初始化（app注册网关）
        //参数:网关对象
        'regGateway': function (gateway) {
            return {
                'YN_msg_id': String.fromCharCode(0),
                'YN_device_id': gateway.device_id,
                'YN_feed_id': gateway.feed_id,
                'YN_mac':String.fromCharCode(255,255,255,255,255,255),
                'YN_datetime': datetime()
            }
        },

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

        //注册按键子设备
        //参数 : gateway 网关, ctlpanel: 控制面板
        'regBtnSubDev': function(gateway, ctlpanel) {
            return {
                'YN_msg_id': String.fromCharCode(2),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_subdev_id': ctlpanel.id,
                'YN_subdev_t':  ctlpanel.type,  //返回
                'YN_subdev_n': ctlpanel.numberOfButtons,  //返回
                'YN_subdev_s': "", //返回
                'YN_key_type': ctlpanel.key_type,
                'YN_pid': "" //返回值


            }

        },

        //注册驱动子设备
        //参数: gateway 网关, relay: 继电器
        'regDrvSubDev': function(gateway, relay) {
            return {
                'YN_msg_id':String.fromCharCode(3),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_subdev_id': relay.id,
                'YN_subdev_n': "", //返回
                'YN_subdev_s': "" ,// 返回
                'YN_subdev_t': "", //返回
                'YN_pid': ""//返回

            }
        },

        //删除按键子设备
        //参数 : gateway 网关,panel按钮
        'deleteBtnSubDev': function (gateway, ctlpanel) {
            return {
                'YN_msg_id':String.fromCharCode(4),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_subdev_id': ctlpanel.id,

            }
        },

        //删除驱动子设备
        //参数: gateway 网关, relay: 继电器
        'deleteDrvSubDev': function (gateway, relay) {
            return {
                'YN_msg_id':String.fromCharCode(5),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_subdev_id': relay.id,
                'YN_pid': "", //返回
                'YN_subdev_n': '',// 返回

            }
        },


        //更换按键子设备:
        //参数: gateway 网关, old_ctlpanel 旧的控制面板, new_ctlpanel 新的控制面板
        'replaceBtnSubDev': function(gateway, old_ctlpanel, new_ctlpanel) {
            return {
                'YN_msg_id':String.fromCharCode(8),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_subdev_id': new_ctlpanel.id,
                'YN_psubdev_id': old_ctlpanel.id,
                'YN_msgpack': "" //??

            }
        },

        //更换驱动子设备
        //参数: gateway 网关, old_relay旧的驱动子设备  new_relay 新的驱动子设备
        'replaceDrvSubDev' : function (gateway, old_relay, new_relay) {
            return {
                'YN_msg_id':String.fromCharCode(9),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_subdev_id': new_relay.id,
                'YN_psubdev_id': old_relay.id,
                'YN_pid_b': old_relay.pid,
                'YN_msgpack': "" //??
            }
        },

        //创建场景
        //参数: gateway网关, scene 要创建的场景
        'createScene' : function (gateway, scene) {
            return {
                'YN_msg_id':String.fromCharCode(10),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_pid':"", //pid编号,返回
                'YN_pid_s': "", //Pid的状态,返回
                'YN_s_key': scene.to_s_key(),
                'YN_s_key_n': scene.len_s_key(),//按键组数
                'YN_s_driver': scene.to_s_driver(),//关联驱动组
                'YN_s_driver_n': scene.len_s_driver() //驱动组数
            }
        },

        //更新场景
        //参数 gateway网关, scene: 要更新的场景
        'updateScene' :function (gateway, scene) {
            return {
                'YN_msg_id':String.fromCharCode(11),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_pid':scene.pid, //pid编号
                'YN_pid_s': "", //Pid的状态,返回
                'YN_s_key': scene.to_s_key(),
                'YN_s_key_n': scene.len_s_key(),//按键组数
                'YN_s_driver': scene.to_s_driver(),//关联驱动组
                'YN_s_driver_n': scene.len_s_driver() //驱动组数
            }
        },

        //删除场景
        //参数 gateway 网关 scene: 要删除的场景
        'deleteScene' : function (gateway, scene) {
            return {
                'YN_msg_id':String.fromCharCode(12),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_pid': scene.pid
            }
        },

        //配置单一驱动场景<其实就是为某个电器配置按钮>

        'configElecEqui': function (gateway, elec_equi) {
            return {
                'YN_msg_id':String.fromCharCode(13),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_s_key': elec_equi.to_s_key(),
                'YN_s_key_n': elec_equi.len_s_key(),
                'YN_subdev_id':elec_equi.relay_assoc.relay.id,
                'YN_pid': elec_equi.relay_assoc.relay.pid,
                'YN_pid_s': "" //返回
            }
        },

        //配置定时任务
        //参数: gateway网关, pid 要定时的Pid，timing 定时配置对象
        'configTiming': function (gateway, pid, timing) {

            return {
                'YN_msg_id':String.fromCharCode(14),
                'YN_device_id': gateway.device_id,
                'YN_mac': gateway.mac,
                'YN_time_n': timing.id,
                'YN_pid':pid,
                'YN_timer_t': timing.type,
                'YN_datetime': timing.datetime,
                'YN_time_s': "", //定时的任务状态 ??

            }
        },



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
    function addRoom(room) {
        this.rooms.push(room);
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
    function  to_s_key () {

    }

    //YN_s_key按钮组的长度
    function len_s_key() {

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
    this.type = undefined; //继电器的类型
    this.pid = undefined; //起始pid
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
    this.type = undefined; //面板的类型
    this.key_type = undefined; //按键外接设备类型
    this.pid = undefined; //起始pid


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
function YN_Scene(name, scene_steps, ctlpanel_assocs, timings) {
    this.id = guid();
    this.name = name; //场景的名称
    this.scene_steps = scene_steps; //场景里的相关动作
    this.ctlpanel_assocs = ctlpanel_assocs; //场景可能绑定的多个面板, 也有可能没有绑定
    this.timings = timings; //场景的定时配置列表
    this.pid = undefined; //场景的pid

    //删除指面板
    function deleteCtlPanel(panel) {
        this.ctlpanel_assocs = deleteEleFromList(panel, this.ctlpanel_assocs);
    }

    //删除指定场景里的动作
    function deleteSceneStep(sceneStep) {
        this.scene_steps = deleteEleFromList(sceneStep, this.scene_steps);
    }

    //生成场景YN_s_key 场景关联按键
    function to_s_key() {}
    //生成场景关联子设备驱动组
    function to_s_driver() {

    }
    //场景中关联按键的个数
    function len_s_key() {

    }
    //场景中关联按键的驱动个数
    function len_s_driver() {}
}

//场景的定时
function YN_Scene_Timing(scene, timeing) {
    this.id = guid();
    this.scene = scene; //相对应的场景
    this.timing = timeing; //定时的配置
}


//定时对象
function YN_Timing(type, datetime) {
    this.id = 'FFFF'; //对应于YN_time_n
    this.type = type ; // 01代表单次定时,02代表每周循环
    this.datetime = datetime; //YYYYMMDDhhmmss ,当类型为02时,DD 代表每周中哪几天响应定时,Bit0~Bit6 分别对应星期日~星期六
}

