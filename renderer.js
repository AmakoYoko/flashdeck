
var express = require('express');
var exec = require('child_process').execFile;
const rootPath = require('electron-root-path').rootPath;
var robot = require("robotjs");


const { readFileSync, fs } = require('fs') 

var mms = 0;
document.getElementById("app_logo").src = rootPath+"\\app.asar\\img\\logo.svg";
document.getElementById("globallink").textContent = rootPath+"\\app.asar\\";

document.querySelector('#validatebutton').addEventListener('click', () => {   
    require('fs').writeFileSync(rootPath+"\\app.asar\\config.json", JSON.stringify(document.config), 'utf-8');
})
var app=express();
app.get('/',function(req,res)
{
res.send('flash');
});

app.get('/config',function(req,res)
{
data = readFileSync(rootPath+"\\app.asar\\config.json", 'utf8')  
data = JSON.parse(data);
res.send(data);
});

app.get('/action', (req, res) => {
    data = readFileSync(rootPath+"\\app.asar\\config.json", 'utf8')  
    data = JSON.parse(data);
    
    if(data[req.query.button].type == 1){
        
        robot.typeStringDelayed(data[req.query.button].action, 10000000000000)
    }




    if(data[req.query.button].type == 3){
      
        console.log(data[req.query.button].action)
        var executablePath = rootPath+"\\app.asar\\cmdmp3.exe";
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

    res.send("ok");

    
   
})


var server=app.listen(3000,function() {});

