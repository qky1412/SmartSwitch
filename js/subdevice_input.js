$(document).ready(function() {
    $(document).on("pageInit", "#page_subdevice_input", function (e, id, page) {
        JDSMART.ready(function () {
            initData();
        });
    });
    $.init();
});

function initData() {
    JDSMART.io.initDeviceData(
        function (suc) {
            // 执行初始化的回调
            alert("输入子设备初始化" + JSON.stringify(suc));
            refreshInputDeviceData();
        });
}
//刷新输出设备各个插槽数据
function refreshInputDeviceData() {
    //查询驱动子设备状态（07H）,APP端查询关联驱动子设备当前工作状态
    //business_cb:function(true,{cmdCode,numberOfDrivers,driverStates,subdevpid})
    //cmdCode:命令字, numberOfDrivers:有效驱动数,driverStates:驱动状态集合,subdevpid子设备pid
    //      or function(false,err);
    //驱动 状态:
    //bit7:为1时，有新触发信号时反转整个字节；为0时，依据bit6~bit0数值执行；
    //bit6~bit0:当前驱动口输出灰度，x1111111-最大输出（最亮），x0000000-最小输出（不亮），
    //    中间值对应不同的灰度（亮度）。
    CloudApi.queryInputDevStatus(function(result, data) {
        if(result) {
            alert("查询输入设备状态成功" + JSON.stringify(data));
        }else {
            alert("查询输入设备状态失败");
        }
    });
}