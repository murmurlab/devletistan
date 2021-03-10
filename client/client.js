/*captcha yerine:
hesap açıldığında, hesabın onaylanması gerekir
hesabın onaylanması için hesap 30lvl olması lazım 
*/
function scrollToBottom (id) {
    let div = document.getElementById(id);
    div.scrollTop = div.scrollHeight/*- div.clientHeight;*/;
 }
scrollToBottom("chat")

function send (msg){
    document.getElementById("msg-box").value=""
    z=document.createElement("dl")
    x=document.createElement("dt")
    b=document.createElement("br")
    x.textContent="adsdsa"
    z.appendChild(x)
    document.getElementById("messages").appendChild(z)
    document.getElementById("messages").appendChild(b)
    scrollToBottom("messages")
}

document.getElementById("send").addEventListener("click",send)

let socket = io()

socket.on("msg",msg=>{
    
})