/**
 * Created by Administrator on 2016/2/20 0020.
 */
$(document).ready(function(){
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

    $("#tab22").click(function(){
        alert("tab2 is selected");
    });
});

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

