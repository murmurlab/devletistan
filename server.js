const http = require("http")
const fs =  require("fs")

let dirs,
    file,
    chars=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","r","s","t","u","v","y","z","q","w","x"]
function filitre(id) {
    console.log("in filter");
    if (!id=="") {
        console.log('not ""');
        if (id.split("").every((e)=>{return chars.some(a=>{return e==a})})){
            return true
        }
    }
}

let server = http.createServer((istek,yanıt)=>{
    
    let contentType = 'text/html'
    let ex ="html"
    dirs = fs.readdirSync("./client/")

    if (istek.method==="POST") {

        let data = JSON.parse(fs.readFileSync("users.json").toString())

        console.log(istek.method,istek.url)

        var body = "";
        istek.on("data", chunk=>{
            body += chunk;
        })


        let user = {},to,method
         
        istek.on("end", ()=>{
            
            user[body.split("&")[1].split("=")[0]]=body.split("&")[1].split("=")[1]
            user[body.split("&")[2].split("=")[0]]=body.split("&")[2].split("=")[1]
            to=body.split("&")[3].split("=")[1]
            method=body.split("&")[0].split("=")[1]
            console.log(user,method,to)
            end()
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
                if (filitre(user.id)){
                    if (data.users[user.id]) {
                        console.log("id zaten kayıtlı")
                        yanıt.end("id zaten kayıtlı")
                    }else{
                        data.users[user.id]={
                            "pass":""
                        }
                        data.users[user.id]["pass"]=user.pass
                        fs.writeFileSync("users.json",JSON.stringify(data,null,2))
                        
                        console.log("kayıt edildi")
                        yanıt.end("kayıt edildi")
                    }
                }else{
                    console.log("geçersiz id")
                    yanıt.end("geçersiz id")
                    
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

 

})
const socket = require("socket.io")(server)

socket.on("connection",client=>{
    client.on("msg",msg=>{
        socket.emit("msg",msg)
    })
})

server.listen(80,"192.168.1.101",()=>console.log("ok"))
