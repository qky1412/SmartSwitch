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
            alert("子设备初始化" + JSON.stringify(suc));
            refreshData();
        });
}
//刷新输入设备各个插槽数据
function refreshData() {

}