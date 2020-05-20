
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

getNetworkIP(function (error, ip) {
    console.log(ip);
    document.getElementById("qrcodeappli").src="https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=http://"+ip+":"+net_port+"/app&choe=UTF-8";
   
    document.getElementById("qrcodesub").textContent = net_port;
    
    if (error) {
        console.log('error:', error);
    }
  });
//




document.querySelector('#validatebutton').addEventListener('click', () => {   
    require('fs').writeFileSync(configDir+"\\config.json", JSON.stringify(document.config), 'utf-8');
})
var app=express();
app.get('/',function(req,res)
{
res.send('flash');
});

app.get('/connreq',function(req,res)
{
    console.log(ipcRenderer.sendSync('sync_devices', 'connexion'))
    res.send("ok")
});

app.get('/config',function(req,res)
{
data = readFileSync(configDir+"\\config.json", 'utf8')  
data = JSON.parse(data);
res.send(data);
});

app.get('/action', (req, res) => {
    data = readFileSync(configDir+"\\config.json", 'utf8')  
    data = JSON.parse(data);
    
    if(data[req.query.button].type == 1){
        
        robot.typeStringDelayed(data[req.query.button].action, 10000000000000)
    }




    if(data[req.query.button].type == 3){
      
        console.log(data[req.query.button].action)
        var executablePath = rootPath+"\\resources\\mp3.exe";
        var parameters = [data[req.query.button].action];
        exec(executablePath, parameters, function(err, data) {
            console.log(err)
            console.log(data.toString());
       });
    }
    if(data[req.query.button].type == 2){
      
        
        var executablePath = data[req.query.button].action;
        exec(executablePath, function(err, data) {
            console.log(err)
            console.log(data.toString());
       });
    }



    if(data[req.query.button].type == 4){

        if(data[req.query.button].action == 1){
            robot.keyTap("audio_vol_up")
        }
            if(data[req.query.button].action == 2){
                robot.keyTap("audio_vol_down")
        }
        if(data[req.query.button].action == 3){
            robot.keyTap("audio_prev")
        }
        if(data[req.query.button].action == 4){
            robot.keyTap("audio_next")
        }
        if(data[req.query.button].action == 5){
            if(mms == 1){
                robot.keyTap("audio_play")
            }else{
                robot.keyTap("audio_pause")
            }

            
        }
        if(data[req.query.button].action == 6){
            robot.keyTap("audio_mute")
        }    



        
    }

    if(data[req.query.button].type == 5){
        arraybutton = data[req.query.button].action.split(",");
        console.log(arraybutton)
        arraybutton.forEach(function(item, index, array) {
            console.log(item);
            robot.keyToggle(item.toLowerCase(), "down")
          });
    
          arraybutton.forEach(function(item, index, array) {
            
            robot.keyToggle(item.toLowerCase(), "up")
          });

    }


 

    res.send("ok");

    
   
})

app.use('/app', express.static(__dirname + '/mobile'));


var server=app.listen(net_port,function() {});
console.log("HTTP : "+net_port)
