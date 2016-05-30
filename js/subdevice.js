
$(document).ready(function() {
    $(document).on("pageInit", "#page_subdevice_output", function (e, id, page) {
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
            //refreshSubDeviceInitData(suc);
            //alert("子设备初始化" + JSON.stringify(suc));
            alert("模拟子设备H5的数据共享:" + JSON.stringify(Database.getFloorList()));
        });
}
