const http = require("http")
const fs =  require("fs")
const socket = require("socket.io")

let dirs,file
http.createServer((istek,yanıt)=>{

    console.log(istek.url);
    dirs = fs.readdirSync("./")

    if (istek.url=="/") {
        if(dirs.find(a=>a=="main.html")){
            return yanıt.end(fs.readFileSync("main.html"))
        }
    }
    
    file = istek.url.slice(1)
    if(dirs.find(a=>a==file)){
        return yanıt.end(fs.readFileSync(file))
    }else{
        return yanıt.end(fs.readFileSync("404.html"))
    }

}).listen(80,"192.168.1.101",()=>console.log("ok"))
