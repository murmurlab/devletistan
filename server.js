const http = require("http")
const fs =  require("fs")
const socket = require("socket.io")

let dirs,
    file,
    contentType = 'text/html';
http.createServer((istek,yanıt)=>{

    console.log(istek.url);
    dirs = fs.readdirSync("./")

    if (istek.url=="/") {
        if(dirs.find(a=>a=="main.html")){
            return yanıt.end(fs.readFileSync("main.html"))
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
        return yanıt.end(fs.readFileSync(file))
    }else{
        return yanıt.end(fs.readFileSync("404.html"))
    }

}).listen(80,"192.168.1.101",()=>console.log("ok"))
