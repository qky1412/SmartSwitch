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


var Database = function () {

    var dataTables = {
        'elec_equi_list' : [],  //电器列表
        'relay_list' : [],  //继电器列表
        'ctlpanel_list' : [],  //控制面板列表
        'scene_list' : [],  //场景列表
        'floor_list': [] //楼层列表
    }

    function writeToDb() {
        for(key_table in dataTables) {
            Lockr.set(key_table, dataTables[key_table]);
        }
    }

    function readFromDb() {
        for(key_table in dataTables) {
            dataTables[key_table] = Lockr.get(key_table) || [];
        }
    }

    function indexOfItemInArray(ary, ele, filter_func) {
        var i = 0;
        for(i =0;i<ary.length; ++i) {
            if (filter_func(ele, ary[i])) {
                break;
            }
        }
        if(i < ary.length) {
            return i;
        }
        return -1;
    }


    function addEleToList(ele, list) {
        list.unshift(ele);
        return list;
    }

    function updateEleInList(ele, list) {
        var i = indexOfItemInArray(list, ele, function(ele, ary_ele) {
            return ele.id.equals(ary_ele.id);
        });

        if(i != -1) {
            list[i] = ele;
        }
        return list;
    }

    function deleteEleFromList(ele, list) {
        var i = indexOfItemInArray(list, ele, function(ele, ary_ele) {
            return ele.id.equals(ary_ele.id);
        });
        if (i != -1) {
            list.splice(i,1);
        }
        return list;
    }


    //初始化动作
    readFromDb();

    return {
        /* ------------------------------------ */
        /* 电器相关api */

        //获取电器列表
        'getElecEquiList': function() {
            return dataTables.elec_equi_list;
        },

        //参数: 需新增的电器
        //返回: 新的电器列表
        'addElecEquiToList': function (elec_equi) {
            return addEleToList(elec_equi, dataTables.elec_equi_list);
        },

        //参数: 待更新的电器
        //返回: 新的电器列表
        'updateElecEqui': function(elec_equi) {
            return updateEleInList(elec_equi, dataTables.elec_equi_list);
        },

        //参数: 待删除的电器
        //返回: 新的电器列表
        'deleteElecEquiFromList' : function(elec_equi) {
            return deleteEleFromList(elec_equi, dataTables.elec_equi_list);
        },

        /* ------------------------------------ */
        /* 继电器相关的api */

        //获取继电器列表
        'getRelayList' : function() {
            return dataTables.relay_list;
        },

        //参数: 需新增的继电器
        //返回: 新的继电器列表
        'addRelayToList' : function(relay) {
            return addEleToList(relay, dataTables.relay_list);
        },

        //参数: 待更新的继电器
        //返回: 新的继电器列表
        'updateRelayList' : function(relay) {
            return updateEleInList(relay, dataTables.relay_list);
        },

        //参数: 待删除的继电器
        //返回: 新的继电器列表
        'deleteRelayFromList': function(relay) {
            deleteEleFromList(relay, dataTables.relay_list);
        },

        /* ------------------------------------ */
        /* 控制面板相关api */

        //获取控制面板列表
        'getCtlPanelList' : function() {
            return dataTables.ctlpanel_list;
        },

        //参数: 需新增的控制面板
        //返回: 新的控制面板列表
        'addCtlPanelToList' : function(panel) {
            return addEleToList(panel, dataTables.ctlpanel_list);
        },

        //参数: 待更新的控制面板
        //返回: 新的控制面板列表
        'updateCtlPanelList' : function(panel) {
            return updateEleInList(panel, dataTables.ctlpanel_list);
        },

        //参数: 待删除的控制面板
        //返回: 新的控制面板列表
        'deleteCtlPanelFromList': function(panel) {
            deleteEleFromList(panel, dataTables.ctlpanel_list);
        },

        /* -------------------------------- */
        /* 场景相关api */


        //获取场景列表
        'getSceneList' : function() {
            return dataTables.scene_list;
        },

        //参数: 需新增的场景
        //返回: 新的场景列表
        'addCtlPanelToList' : function(scene) {
            return addEleToList(scene, dataTables.scene_list);
        },

        //参数: 待更新的场景
        //返回: 新的场景列表
        'updateCtlPanelList' : function(scene) {
            return updateEleInList(scene, dataTables.scene_list);
        },

        //参数: 待删除的场景
        //返回: 新的场景列表
        'deleteSceneFromList': function(scene) {
            deleteEleFromList(scene, dataTables.scene_list);
        },


        /* --------------------------------- */
        /* 楼层相关api */

        //获取楼层列表
        'getFloorList' : function () {
            return dataTables.floor_list;
        },

        //参数: 需新增的楼层
        //返回: 新的楼层列表
        'addFloorToList': function(floor) {
            return addEleToList(floor, dataTables.floor_list);
        },


        //参数: 待更新的楼层
        //返回: 新的楼层列表
        'updateFloorList' : function (floor) {
            return updateEleInList(floor, dataTables.floor_list);

        },

        //参数: 待删除的楼层
        //返回: 新的楼层列表

        'deleteFloorFromList' : function (floor) {
            deleteEleFromList(floor, dataTables.floor_list);
        }

    }

}();



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

    //删除指面板
    function deleteCtlPanel(panel) {
        this.ctlpanel_assocs = deleteEleFromList(panel, this.ctlpanel_assocs);
    }

    //删除指定场景里的动作
    function deleteSceneStep(sceneStep) {
        this.scene_steps = deleteEleFromList(sceneStep, this.scene_steps);
    }
}

//场景的定时
function YN_Scene_Timing(scene, timeing) {
    this.id = guid();
    this.scene = scene; //相对应的场景
    this.timing = timeing; //定时的配置
}


