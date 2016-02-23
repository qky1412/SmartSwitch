/**
 * Created by Administrator on 2016/2/20 0020.
 */
$(document).ready(function(){
    JDSMART.ready(function () {
        showButton(true);
        showLoading();
    });


    $("#button1").click(function(){

        $.ajax({
            type: "GET",
            cache: false,
            url: "http://api.siyee.org/activities/instant-purchase/status",
            data: {},
            dataType: "jsonp",
            //jsonp: "callback",
            jsonpCallback: "OnGetMemberSuccessByjsonp"
        });
    });

    $("#tab-control1").click(function(){
        $("#bottom-control1").show();
        $("#bottom-control2").hide();
    });
    $("#tab-control2").click(function(){
        $("#bottom-control1").hide();
        $("#bottom-control2").show();
    });
    $("#tab-control3, #tab-control4").click(function(){
        $("#bottom-control1, #bottom-control2").hide();

    });

    setTimeout(hideLoading, 3000);
});
function showLoading() {

}
function hideLoading() {

}
function showButton(flag) {

    JDSMART.app.config(		//配置导航按钮隐藏显示
        {
            showBack: true,   // 返回按钮，false是隐藏，true是 显示
            showShare: false,
            showMore: false,  // 更多按钮
            showTitle: false
        });
}

function initFloorSelect() {
    var floorArrays = ["1", "2", "3", "4"]
    $("#select-floor").innerHTML = "";
    for(var floor in floorArrays) {
        var newOption = document.createElement("option");
        newOption.value = floor;
        newOption.innerHTML = floor;
        $("#select-floor").add(newOption, null);
    }
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

