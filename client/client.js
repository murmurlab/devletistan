
/*captcha yerine:
hesap açıldığında, hesabın onaylanması gerekir
hesabın onaylanması için hesap 30lvl olması lazım 
*/
let cookies = new Object
,eleme = document.getElementById("messages")

document.cookie.split(";").forEach(element => {
    cookies[element.split("=")[0]]=element.split("=")[1]
    })

let obj = {
    "token":cookies[" usertoken"]
}
,obj2={
    "token":cookies[" usertoken"]
}

gapi.load('auth2', function() {
    gapi.auth2.init();
})
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
        document.cookie="usertoken="
    });
    }




function scrollToBottom (id) {
    let div = document.getElementById(id);
    div.scrollTop = div.scrollHeight/*- div.clientHeight;*/;
 }
scrollToBottom("chat")


let socket = io()

function send (){
    let msg=document.getElementById("msg-box").value
    document.getElementById("msg-box").value=""
    console.log(msg," is sending");

    document.getElementById("msg-box").focus()

    obj["msg"]=msg
    socket.emit("global",obj)
    console.log("sended");
}

function crelob(){
    let lname = document.getElementById("lobyname").value
    document.getElementById("lobyname").value=""
    obj2["lname"]=lname
    socket.emit("crelob",obj2)
}

document.getElementById("send").addEventListener("click",send)
document.getElementById("cre").addEventListener("click",crelob)
document.getElementById("msg-box").addEventListener("keydown",(key)=>{if (key.code=="Enter") {
    send()
}})

socket.on("global",msg=>{
    if (eleme.childElementCount>20) {
        eleme.firstElementChild.remove()
        eleme.firstElementChild.remove()
    }
    console.log(msg," is received");
    z=document.createElement("dl")
    x=document.createElement("dt")
    y=document.createElement("dd")
    b=document.createElement("br")
    x.textContent=msg.username
    y.textContent=msg.msg
    z.appendChild(x)
    z.appendChild(y)
    document.getElementById("messages").appendChild(z)
    document.getElementById("messages").appendChild(b)
    
    scrollToBottom("messages")
})