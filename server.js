const http = require("http")
const https = require("https")
const fs =  require("fs")
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("179093935575-hi380bs29gd8d1nbmhnv7vkl52nigmv8.apps.googleusercontent.com");
const CLIENT_ID = "179093935575-hi380bs29gfob1nbmhnv7vkl52nigmv8.apps.googleusercontent.com"
const PORT = 80
const SPORT = 443
const LOCAL_HOST = "localhost"
const WLAN_HOST = "192.168.1.101"



const options = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem")
}

let dirs
,file
,token
,socketio = new Object


    function filitre(dt,type) {
    charsid=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","r","s","t","u","v","y","z","q","w","x"]
    charspass=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","r","s","t","u","v","y","z","q","w","x","!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "-", "=", "{", "}", "[", "]", ":", "\"", ";", "'", "<", ">", "?", ",", ".", "/", "|", "\\"]
    console.log("for pass a-z A-Z 0-9 !@#$%^&*()_+-={}[]:\";\'<>?,./|\\");
    console.log("for id a-z A-Z 0-9");
    console.log("filitre('mehmet&!#%','id')  or  filitre('ahmet%!&$','pass')");
    console.log("in filter");
    if (!dt=="") {
        console.log('not ""');
        if (type=="pass") {
            if (dt.split("").every((e)=>{return charspass.some(a=>{return e==a})})){
                return true
            }else{
                return false
            }
        }else if (type=="id") { 
            if (dt.split("").every((e)=>{return charsid.some(a=>{return e==a})})){
                return true
            }else{
                return false
            }
        }
    }
}




let users={
    "999999999999999999999":{
        "myid":"999999999999999999999",
        "oninloby":{
            "lobiname":true
            },
        "lobi":1,
        "lobiname":{"test":{}},
        "stat":1
        }
    }
,lobies={
"test":{
    "maps":{},
    "owner":"999999999999999999999",
    "members":{},
    "numofmem":0,
    "queue":{},
    "queued":0,
    "onlines":0
    }
}
,ioID={
    "ioIDs":{

    }
}


function user(id,stat) {
    this.myid=id
    this.oninloby={}
    this.lobi=0
    this.lobiname={}
    this.stat=stat
}

reqHandler = (istek,yanıt)=>{
    if (istek.method=="GET") {
        let contentType = 'text/html'
        let ex ="html"
    }
    dirs = fs.readdirSync("./client/")
    let cookies = {}

    if (istek.headers.cookie) {
        istek.headers.cookie.split("; ").forEach(eleman=>{
            cookies[eleman.split("=")[0]]=eleman.split("=")[1]
        })
    }
    
    let data = JSON.parse(fs.readFileSync("users.json").toString())

    if (istek.method==="POST") {
        console.log(istek.method,istek.url)

        let body = "";
        istek.on("data", chunk=>{
            body += chunk;
        })

        let user = {},to,method
         
        istek.on("end", ()=>{
                async function verify() {

                    console.log(body)

                    const ticket = await client.verifyIdToken({
                        idToken: cookies.usertoken,
                        audience: CLIENT_ID,  
                        // Specify the CLIENT_ID of the app that accesses the backend
                        // Or, if multiple clients access the backend:
                        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
                    })

                    const payload = ticket.getPayload()
                    const userid = payload['sub']
                    // If request specified a G Suite domain:
                    // const domain = payload['hd'];
                    console.log(payload.name,userid);

                    yanıt.writeHead(301, {
                        "Location": "/game.html",
                        'Set-Cookie': "usertoken="+cookies.usertoken,
                        'Content-Type': 'text/plain'
                        })
                    //WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWw
                    if(!data.users[payload["sub"]]){

                        data.users[payload["sub"]]={
                            "name": payload["name"]
                        }
                        fs.writeFileSync("users.json",JSON.stringify(data,null,2))
                        console.log("kayıt edildi")
                        
                        if(dirs.find(a=>{return a=="game.html"})){
                            return yanıt.end("kayıt ediliyor")
                        }else{
                            yanıt.writeHead(404, {
                                "Location": "/404.html",
                                'Set-Cookie': "usertoken="+cookies.usertoken,
                                'Content-Type': 'text/plain'
                            })
                            return yanıt.end("oyun sayfası bulunamadı")
                        }
                    }else{
                        
                        if(dirs.find(a=>{return a=="game.html"})){
                            yanıt.end("giriş yapılıyor")
                        }else{
                            yanıt.writeHead(404, {
                                "Location": "/404.html",
                                'Set-Cookie': "usertoken="+cookies.usertoken,
                                'Content-Type': 'text/plain'
                            })
                            return yanıt.end("oyun sayfası bulunamadı")
                        }
                    }
                }
                verify().catch((e)=>{
                    console.error(e)
                    yanıt.end("cant verified, wrong cookie!!!!!!!!!!!!")
                })
        })
        function end() {
            if (method=="login") {
                console.log("giriş yapılıyor");
                if(data.users[user.id]){
                if (data.users[user.id].pass==user.pass) {
                    console.log("şifreler eşleşti")
                    if (to=="game") {
                        console.log("hedef: oyun")
                        if(dirs.find(a=>a=="game.html")){
                            console.log("game.html bulundu")
                            yanıt.end(fs.readFileSync("client/game.html"))
                        }else{
                            yanıt.end(fs.readFileSync("client/404.html"))
                        }
                    }
                }else{
                    console.log("yanlış şifre")
                    yanıt.end("yanlış şifre")
                    /* if(dirs.find(a=>a=="enter.html")){
                        yanıt.end(fs.readFileSync("client/enter.html"))
                    }else{
                        yanıt.end(fs.readFileSync("client/404.html"))
                    } */
                    }
                }else{
                    console.log("kullanıcı bulunamadı")
                    yanıt.end("kullanıcı bulunamadı")
                    /* if(dirs.find(a=>a=="enter.html")){
                        yanıt.end(fs.readFileSync("client/enter.html"))
                    }else{
                        yanıt.end(fs.readFileSync("client/404.html"))
                    } */
                }
            }else{
                if (filitre(user.id,"id")&&filitre(user.pass,"pass")){
                    if (data.users[user.id]) {
                        console.log("id zaten kayıtlı")
                        yanıt.end("id zaten kayıtlı")
                    }else{
                        data.users[user.id]={
                            "pass":""
                        }
                        data.users[user.id]["pass"]=decodeURIComponent(user.pass)
                        fs.writeFileSync("users.json",JSON.stringify(data,null,2))
                        
                        console.log("kayıt edildi")
                        yanıt.end("kayıt edildi")
                    }
                }else{
                    console.log("geçersiz id veya parola")
                    yanıt.end("geçersiz id veya parola")
                    
                }
            }
        }

    }else{
        console.log(istek.method,istek.url)
    }
    if (istek.method==="GET") {
        async function get(){

            if (istek.url=="/") {
                if (cookies.usertoken && cookies.usertoken.length>1180) {
                    console.log("usertoken>1180");
                    await client.verifyIdToken({
                        idToken:cookies.usertoken,
                        audience:CLIENT_ID
                    }).then((pay)=>{
                        console.log("cookie token verivied");
                        if (!data.users[pay.payload["sub"]]) {
                            console.log("kayıtlı deil");
                            data.users[pay.payload.sub]={
                                "name": pay.payload.name
                            }
                            fs.writeFileSync("users.json",JSON.stringify(data,null,2))
                            console.log("kaydedildi res => game.html");
                            if(dirs.find(a=>{return a=="game.html"})){
                                console.log("get game.html ok,loginning");
                                return yanıt.end(fs.readFileSync("client/game.html"))
                            }else{
                                return yanıt.end(fs.readFileSync("client/404.html"))
                            }
                        }else{
                            console.log("kayıtlı");
                            if(dirs.find(a=>{return a=="game.html"})){
                                console.log("get game.html ok,loginning");
                                return yanıt.end(fs.readFileSync("client/game.html"))
                            }else{
                                return yanıt.end(fs.readFileSync("client/404.html"))
                            }
                        }
                        
                    }).catch((e)=>{
                        console.log("enter varmı hmmm ",dirs);
                        if(dirs.find(a=>{return a=="enter.html"})){
                            console.log("cant verified");
                            return yanıt.end(fs.readFileSync("client/enter.html"))
                        }else{
                            return yanıt.end(fs.readFileSync("client/404.html"))
                        }
                        
                        console.log(e);
                    })
                }else{
                    console.log("cookie not found");
                    if(dirs.find(a=>{return a=="game.html"})){
                        yanıt.writeHead(200)
                        return yanıt.end(fs.readFileSync("client/game.html"))
                    }else{
                        yanıt.writeHead(404,{
                            "Location":"404.html"
                        })
                        return yanıt.end("ok")
                    }
                }
            }
            console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",istek.url);

            file = istek.url.slice(1)
            ex = istek.url.split(".")[1]
    
            switch (ex) {
                case 'js':
                    contentType = 'text/javascript';
                    break;
                case 'css':
                    contentType = 'text/css';
                    break;
                case 'json':
                    contentType = 'application/json';
                    break;
                case 'png':
                    contentType = 'image/png';
                    break;      
                case 'jpg':
                    contentType = 'image/jpg';
                    break;
                case 'wav':
                    contentType = 'audio/wav';
                    break;
            }
        
            if(dirs.find(a=>a==file)){
                yanıt.writeHead(200,{"Content-Type": contentType})
                return yanıt.end(fs.readFileSync("client/"+file))
            }else{
                console.log(file+" file not found");
                return yanıt.end(fs.readFileSync("client/404.html"))
            }
        }
        get()
        
    }
}
const httpsServer = https.createServer(options, reqHandler)
const httpServer = http.createServer(reqHandler)
const socket = require("socket.io")(httpServer)

socket.on("connection",io=>{
    async function socketing(){
        
        console.log("user a connecting",io.id);

        if (io.handshake.headers.cookie) {
            console.log("cookie var");
            //console.log(io.handshake.headers.cookie.split("; "));
            io.handshake.headers.cookie.split("; ").forEach(element => {
                socketio[element.split("=")[0]]=element.split("=")[1]
                })
            
            await client.verifyIdToken({
                idToken:socketio["usertoken"],
                audience:CLIENT_ID
            }).then(pay=>{
                console.log("verified gtoken in io");
                if (ioID.ioIDs[pay.payload.sub]) {
                    console.log("ioID list has a this gid");
                    if (ioID.ioIDs[pay.payload.sub]==io.id) {
                        console.log("sessionid equal to gid");
                    }else{
                        console.log("başka istemciden girilemez!!!");
                    }
                    
                }else{
                    ioID.ioIDs[pay.payload.sub]=io.id
                    console.log("gid:sessionid dual adding to ioID list");
                    
                }
            }).catch(e=>{
                console.log(e);
                console.log("non verified token in io");
            })
            
        }

    }
    socketing()
    
    //console.log(socketio);
    io.on("crelob",obj=>{
        dogrula(token,)
        console.log(io.handshake.headers.cookie);
        console.log(obj);
    })
    io.on("global",msg=>{
        console.log(ioID);
        client.verifyIdToken({
            idToken:msg.token,
            audience:CLIENT_ID
        }).then(a=>{
            /* console.log(a); */


            let objServer = new Object

            objServer["msg"]=msg.msg
            objServer["username"]=a.payload.name
            socket.emit("global",objServer)

        }).catch(e=>{
            console.log(e);
        })
    })
    


})
socket.on("disconnect",()=>{
    
    console.log("user a disconnected");
})

httpServer.listen(PORT,WLAN_HOST,()=>console.log("ok http"))
httpsServer.listen(SPORT,WLAN_HOST,()=>console.log("ok https"))
