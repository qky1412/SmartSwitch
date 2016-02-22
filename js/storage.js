/**
 * Created by Administrator on 2016/2/20 0020.
 */
window.onload = function() {
    alert("hehe")
    localStorage.setItem("fuse", "-");
    while(true) {
        try {
            var fuse = localStorage.getItem("fuse");
            localStorage.setItem("fuse", fuse + fuse);
        } catch (e) {
            alert("blew up at " + fuse.length + " with exception " + e);
            break;

        }
    }
    localStorage.removeItem("fuse");
    alert("end of func");
    localStorage.setItem("hello","world");
    alert(localStorage.getItem("hello"));
    localStorage.removeItem("hello");
}