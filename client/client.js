
/*captcha yerine:
hesap açıldığında, hesabın onaylanması gerekir
hesabın onaylanması için hesap 30lvl olması lazım 
*/
let cookies = new Object
,eleme = document.getElementById("messages")

function renderButton() {
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}
function onSuccess(googleUser) {
    console.log("logining");
    var id_token = googleUser.getAuthResponse().id_token;
    var profile = googleUser.getBasicProfile();
    console.log(profile);
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    document.cookie="usertoken="+id_token
    let req1 = new XMLHttpRequest()
    req1.open("POST", window.location.origin)
    
    req1.onload = function() {
        console.log(req1);
        window.location.replace(req1.responseURL);
        //console.log('response: ' + req1.responseURL);
        
    }
    
    req1.send("cookie okunsun diye post");
    console.log("cookie okunsun diye post");
}
function onFailure(error) {
    console.log(error);
    }

const openModalButtons = document.querySelectorAll("[data-modal-target]")
,closeModalButtons = document.querySelectorAll("[data-close-button]")
,overlay=document.getElementById("overlay")
openModalButtons.forEach(button=>{
    button.addEventListener("click",()=>{
        const modal =document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

overlay.addEventListener("click",()=>{
    const modals = document.querySelectorAll(".modal.active")
    modals.forEach(modal =>{
        closeModal(modal)
    })
})

closeModalButtons.forEach(button=>{
    button.addEventListener("click",()=>{
        const modal = button.closest(".modal")
        closeModal(modal)
    })
})

function openModal(modal){
    if (modal == null) return
    modal.classList.add("active")
    overlay.classList.add("active")

}

function closeModal(modal){
    if (modal == null) return
    modal.classList.remove("active")
    overlay.classList.remove("active")
    
}

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