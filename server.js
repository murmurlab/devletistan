const http = require("http")
const https = require("https")
const fs =  require("fs")
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("179093935575-hi380bs29g8ob1nbmhnv7vkl52nigmv8.apps.googleusercontent.com");
const CLIENT_ID = "179093935575-hi380bs29g8ob1nbmhnv7vkl52nigmv8.apps.googleusercontent.com"
const PORT = 80
const SPORT = 443
const LOCAL_HOST = "localhost"
const WLAN_HOST = "192.168.1.101"



const options = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem")
}

let dirs,
    file,
    token

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

reqHandler = (istek,yanıt)=>{
    
    let contentType = 'text/html'
    let ex ="html"
    dirs = fs.readdirSync("./client/")

    if (istek.method==="POST") {
        let cookies = {},coki
        
        let data = JSON.parse(fs.readFileSync("users.json").toString())

        console.log(istek.method,istek.url)

        let body = "";
        istek.on("data", chunk=>{
            body += chunk;
        })


        let user = {},to,method
         
        istek.on("end", ()=>{
            if (body.split("&").length==4) {
                if (body.split("&")[0].split("=").length==2) {
                    if (body.split("&")[0].split("=")[0]=="method") {
                        if (body.split("&")[1].split("=").length==2) {
                            if (body.split("&")[1].split("=")[0]=="id") {
                                if (body.split("&")[2].split("=").length==2) {
                                    if (body.split("&")[2].split("=")[0]=="pass") {
                                        if (body.split("&")[3].split("=").length==2) {
                                            if (body.split("&")[3].split("=")[0]=="where") {
                                                console.log(body)
                                                console.log("decoded   ",decodeURIComponent(body))
                                                user[body.split("&")[1].split("=")[0]]=body.split("&")[1].split("=")[1]
                                                user[body.split("&")[2].split("=")[0]]=body.split("&")[2].split("=")[1]
                                                to=body.split("&")[3].split("=")[1]
                                                method=body.split("&")[0].split("=")[1]
                                                console.log(user,method,to)
                                                end()
                                            }else{
                                                console.log("en az => method=&id=&pass=&where=");
                                            }
                                        }else{
                                            console.log("en az => method=&id=&pass=&x=");
                                        }
                                    }else{
                                        console.log("en az => method=&id=&pass=&");
                                    }
                                }else{
                                    console.log("en az => method=&id=&x=&");
                                }
                            }else{
                                console.log("en az => method=&id=&&");
                            }
                        }else{
                            console.log("en az => method=&x=&&");
                        }
                    }else{
                        console.log("en az => method=&&&");
                    }
                }else{
                    console.log("en az => x=&&&");
                }
            }else{
                    istek.headers.cookie.split(";").forEach(element => {
                    cookies[element.split("=")[0]]=element.split("=")[1]
                });
                //console.log(cookies);

                async function verify() {

                    //console.log(body)
                    token=body.split("=")[1]
                    //console.log(token)

                    const ticket = await client.verifyIdToken({
                        idToken: token,
                        audience: CLIENT_ID,  
                        // Specify the CLIENT_ID of the app that accesses the backend
                        // Or, if multiple clients access the backend:
                        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
                    })

                    const payload = ticket.getPayload()
                    const userid = payload['sub']
                    // If request specified a G Suite domain:
                    // const domain = payload['hd'];
                    console.log(payload,userid);

                    yanıt.writeHead(200, {
                        'Set-Cookie': "usertoken="+token,
                        'Content-Type': 'text/plain'
                        })
                    //WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWw
                    if(!data.users[token]){

                    data.users[token]={
                        "name": payload["name"]
                    }
                    fs.writeFileSync("users.json",JSON.stringify(data,null,2))
                    console.log("kayıt edildi")
                    
                    if(dirs.find(a=>a=="game.html")){
                        return yanıt.end(fs.readFileSync("client/game.html"))
                        }else{

                        }

                        }else{
                            if(dirs.find(a=>a=="game.html")){
                                //get isteğind ehtml response edemiyon
                                yanıt.end(fs.readFileSync("client/game.html"))
                                }else{
    
                            }
                        }
                    }
                    verify().catch((e)=>{
                        console.error(e)
                        yanıt.end("cant verified, wrong cookie!!!!!!!!!!!!")
                    })
                    
                  
                
            }
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
        
        if (istek.url=="/") {
            if(dirs.find(a=>a=="enter.html")){
                return yanıt.end(fs.readFileSync("client/enter.html"))
            }
        }
           
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
            return yanıt.end(fs.readFileSync("client/404.html"))
        }
    

    }

 

}
const httpsServer = https.createServer(options, reqHandler)
const httpServer = http.createServer(reqHandler)
const socket = require("socket.io")(httpsServer)

socket.on("connection",client=>{
    client.on("msg",msg=>{
        socket.emit("msg",msg)
    })
})

httpServer.listen(PORT,WLAN_HOST,()=>console.log("ok http"))
httpsServer.listen(SPORT,WLAN_HOST,()=>console.log("ok https"))
