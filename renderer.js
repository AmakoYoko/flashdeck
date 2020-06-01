
var express = require('express');
const { ipcRenderer } = require('electron')
var exec = require('child_process').execFile;
const rootPath = require('electron-root-path').rootPath;
var robot = require("robotjs");
const electron = require('electron');
var net = require('net');

const configDir =  (electron.app || electron.remote.app).getPath('userData');

const { readFileSync, fs } = require('fs') 

var mms = 0;

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
  }
  function getNetworkIP(callback) {
    var socket = net.createConnection(80, 'google.com');
    socket.on('connect', function() {
      callback(undefined, socket.address().address);
      socket.end();
    });
    socket.on('error', function(e) {
      callback(e, 'error');
    });
  }
var net_port = getRandomIntInclusive(1000,9999);
//var net_port = 8080;
document.port = net_port
getNetworkIP(function (error, ip) {
    console.log(ip);
    document.getElementById("qrcodeappli").src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://"+ip+":"+net_port+"/app";
   
    document.getElementById("qrcodesub").textContent = net_port;
    
    if (error) {
        console.log('error:', error);
    }
  });
//





document.getElementById('validatebuttonsave').addEventListener('click', () => {  
    console.log("WRITE CONFIG") 
    require('fs').writeFileSync(configDir+"\\config.json", JSON.stringify(document.config), 'utf-8');
})



var app=express();
app.get('/',function(req,res)
{
res.send('flash');
});


app.get('/save',function(req,res)
{
    require('fs').writeFileSync(configDir+"\\config.json", JSON.stringify(document.config), 'utf-8');
    res.send("ok")
});



app.get('/connreq',function(req,res)
{
ipcRenderer.sendSync('sync_devices', 'connexion')
    res.send("ok")
});

app.get('/config',function(req,res)
{

data = readFileSync(configDir+"\\config.json", 'utf8')  
data = JSON.parse(data);
if(!data.action[document.currentpage]){
    res.send(`{
        "blank":1
        }`);
}else{
res.send(data.action[document.currentpage]);
}
});

app.get('/action', async (req, res) => {
    console.log("Action recu")
    data = readFileSync(configDir+"\\config.json", 'utf8')  
    data = JSON.parse(data);
    console.log(data.action[document.currentpage][req.query.button].action)
    for (let i = 0; i < data.action[document.currentpage][req.query.button].action.length; i++) {
        var idcommand = data.action[document.currentpage][req.query.button].action[i][1].substr(0, 1)
        var actioncommand = data.action[document.currentpage][req.query.button].action[i][1].substr(2)
        console.log(idcommand)
        if(idcommand == 6){
            console.log("ici")
            await new Promise(resolve => setTimeout(resolve, actioncommand));
            console.log("ok")
    
    }
        if(idcommand == 1){      
            robot.typeStringDelayed(actioncommand, 10000000000000)
        }

        if(idcommand == 2){
      
        
            var executablePath = actioncommand;
            exec(executablePath, function(err, data) {
                console.log(err)
                console.log(data.toString());
           });
        }
        if(idcommand == 3){
            
            
            var executablePath = rootPath+"\\resources\\mp3.exe";
            var parameters = actioncommand;
            console.log(executablePath)
            exec(executablePath, [actioncommand])
            
        }  
        if(idcommand == 4){

            if(actioncommand == 1){
                robot.keyTap("audio_vol_up")
            }
                if(actioncommand == 2){
                    robot.keyTap("audio_vol_down")
            }
            if(actioncommand == 3){
                robot.keyTap("audio_prev")
            }
            if(actioncommand == 4){
                robot.keyTap("audio_next")
            }
            if(actioncommand == 5){
                if(mms == 1){
                    robot.keyTap("audio_play")
                }else{
                    robot.keyTap("audio_pause")
                }
    
                
            }
            if(actioncommand == 6){
                robot.keyTap("audio_mute")
            }    
    
    
    
            
        }
        if(idcommand == 5){
            arraybutton = actioncommand.split(",");
            console.log(arraybutton)
            arraybutton.forEach(function(item, index, array) {
                console.log(item);
                robot.keyToggle(item.toLowerCase(), "down")
              });
        
              arraybutton.forEach(function(item, index, array) {
                
                robot.keyToggle(item.toLowerCase(), "up")
              });
    
        }

    }

    res.send("ok");

    
   
})

app.use('/app', express.static(__dirname + '/mobile'));


var server=app.listen(net_port,function() {});
console.log("HTTP : "+net_port)
