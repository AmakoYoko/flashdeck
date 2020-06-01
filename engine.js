//Variable :
var actionidentifier; //array pour les id html des actions
var globalid; //identifiant de l'action
var id_btn;  //identifiant du bouton
var valueselect; //identifiant de l'action selectionner //page courante
var arrayforaction = []; //tableau des actions a save
document.port;
// suppression dans un json par John Resig
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};


//fonction random
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
}

//init les boutons
function button_init(){  
    for (let i = 1; i < 9; i++) {
        $("#deck").append(`<div class="col-sm">
      <div class="card_btn" onclick="openmodalto('`+i+`')">
         <center>
        <p class="text_icon" id="text_`+i+`"></p>
       </center>
       </div>
       </div>`)
     }  
}


//init des pages
function page_init(){
  $("#pageindicator").html(``)
    
    if(document.currentpage != 1){
      $("#pageindicator").append(`<span onclick="remove_page()"  class="material-icons remove_page">
      remove_circle_outline
    </span>`)
    }
    for(let i = 1; i < document.config.action.length; i++){
      $("#pageindicator").append(`<li onclick="change_page(`+i+`)" id="page_`+i+`" class="page active"></li>`)

    }
    $("#pageindicator").append(` <span onclick="add_page()" class="material-icons add_page">
    add_circle_outline
    </span>`)
    

      }
//change page
function change_page(id){
  document.currentpage = id;
  page_init()
  $(".page").removeClass("current_page")
  $("#page_"+id).addClass("current_page")
  
  read_config()
  
}
function add_page(){
var data = new Object();
document.currentpage = document.config.action.length;
document.config.action[document.currentpage] = data
change_page(document.currentpage)
$.getJSON('http://localhost:'+document.port+'/save',function(data) {
  console.log(data);
});
}

function remove_page(){ 
  document.config.action.remove(document.currentpage)
  document.currentpage = 1
  change_page(document.currentpage);
  $.getJSON('http://localhost:'+document.port+'/save',function(data) {
  console.log(data);
});
}

//Lire la config et écrire les boutons
function read_config(){
  $(".text_icon").text("");
    for(key in document.config.action[document.currentpage]){
     console.log(document.config.action[document.currentpage][key])
     $("#text_"+key).text(document.config.action[document.currentpage][key].name)
    }
 }

//INIT GLOBAL
function init(){
  document.currentpage = 1;
    $(function () {$('[data-toggle="tooltip"]').tooltip()})
    $('#waitingmobile').modal("show");
    button_init();
    page_init();
    read_config();
    change_page(document.currentpage)
}




//Ajouter une action
function addactionforbutton(){ 
    var uniqueid= id_btn + "-" + getRandomIntInclusive(1000,9999);
    actionidentifier.push(uniqueid)
    console.log()
    $("#actionframe").append(`
    <div id="`+uniqueid+`" class="input-group mb-3">
    <input type="text" readonly onclick='selectaction("`+uniqueid+`")'' id="action_`+uniqueid+`" class="form-control" placeholder="Action">
    <div class="input-group-append">
    <button class="btn btn-outline-danger" onclick="removeaction('`+uniqueid+`')" type="button" id="button-addon2"> X </button>
    </div>
    </div>
    `)
}

//retirer une action
function removeaction(id){
    $("#"+id).remove();
    console.log(id)
    actionidentifier.splice(actionidentifier.indexOf(id), 1);
}

//selectionner une action
function selectaction(id){ 
    globalid=id
    $("#exampleModal").modal("hide")
    $("#selectaction").modal("show")
}

//fermer la fenetre de selection
function closemodalselection(){   
    $("#exampleModal").modal("show")
    $("#selectaction").modal("hide")
}

//Fonction de sauvegarde pour les actions d'un bouton 
function savebutton(){
  arrayforaction = [];
    actionidentifier.forEach(function(item, index, array) {
    var temparray = [];
    temparray.push(item) 
    temparray.push($("#action_"+item).val())  
    arrayforaction.push(temparray)
    });
    save(id_btn,document.currentpage, $("#nameoftouche").val(), arrayforaction.length, arrayforaction)
}



//ouverture de la modal pour le bouton
function openmodalto(id){
  $("#actionframe").html("")
  actionidentifier = []; 
  id_btn = id;
  console.log(id)
  $('#exampleModal').modal("show")
  $("#titlemodal").text("Modifier le bouton "+id)
  $("#nameoftouche").val(document.config.action[document.currentpage][id].name);
    
  
  for (let i = 0; i < document.config.action[document.currentpage][id].action.length; i++) {
  actionidentifier.push(document.config.action[document.currentpage][id].action[i][0])
   console.log( document.config.action[document.currentpage][id].action[i])
   $("#actionframe").append(`
   <div id="`+document.config.action[document.currentpage][id].action[i][0]+`" class="input-group mb-3">
   <input type="text" readonly onclick='selectaction("`+document.config.action[document.currentpage][id].action[i][0]+`")'' id="action_`+document.config.action[document.currentpage][id].action[i][0]+`" class="form-control" value="`+document.config.action[document.currentpage][id].action[i][1]+`" placeholder="Action">
   <div class="input-group-append">
   <button class="btn btn-outline-danger" onclick="removeaction('`+document.config.action[document.currentpage][id].action[i][0]+`')" type="button" id="button-addon2"> X </button>
   </div>
   </div>
   `)
  }


}  



//selection de l'action voulu
function selectedchoose(){
    console.log("ok")
    valueselect = $("#selectewheel").val();
    if(valueselect == 0){
      $("#result").html(``)
    }
  
  
    if(valueselect == 1){
      $("#result").html(`<input type="text" class="form-control" id="action" placeholder="Suite de touche">
      <br>
      <p class="important">Certain caractère ne sont pas disponible (é,è,ù etc)</p>
      `)
    }
  
    if(valueselect == 2){
  
  
  
  $('input[type=file]').change(function (e) {
      $('#fileresult').html($(this).val());
  });
  
  
      $("#result").html(`
  <div class="input-group mb-3">
    <input type="text" id="fileresult" class="form-control" readonly>
    <div class="input-group-append">
      <button for="file-upload"onclick="document.getElementById('action').click();" id='get_file' class="btn btn-outline-secondary" type="button" id="button-addon2">Ouvrir</button>
      <input onchange="fileselect();" id="action" style="display:none" type="file"/>
    </div>
  </div>`)
    }
  
  
  
    if(valueselect == 3){
      $("#result").html(`
      
      <div class="input-group mb-3">
    <input type="text" id="fileresult" class="form-control" readonly>
    <div class="input-group-append">
      <button for="file-upload"onclick="document.getElementById('action').click();" id='get_file' class="btn btn-outline-secondary" type="button" id="button-addon2">Ouvrir</button>
      <input accept="audio/mp3" onchange="fileselect();" id="action" style="display:none" type="file"/>
    </div>
  </div>
  
      
      `)
    }
    if(valueselect == 4){
      $("#result").html(`
  <div class="btn-group" role="group" aria-label="Basic example">
    <button type="button" onclick="multimediamode('1');" class="btn btn-secondary">V+</button>
    <button type="button" onclick="multimediamode('2');"class="btn btn-secondary">V-</button>
    <button type="button" onclick="multimediamode('3');"class="btn btn-secondary">⏮️</button>
    <button type="button" onclick="multimediamode('4');"class="btn btn-secondary">⏭</button>
    <button type="button" onclick="multimediamode('5');"class="btn btn-secondary">⏯️</button>
    <button type="button" onclick="multimediamode('6');"class="btn btn-secondary">Mute</button>
  </div>
  `)
    }
  
    if(valueselect == 5){
      $("#result").html(`
      <div class="input-group mb-3">
    <input type="text" class="form-control" id="listeninput" readonly onkeydown="listenkey(event)" placeholder="Touche clavier" aria-label="Recipient's username" aria-describedby="button-addon2">
    <div class="input-group-append">
      <input class="btn btn-outline-secondary"  id="startbutton" onclick="startlisten()" type="button" value="Saisi">
  
      </div>
  </div>
  
  `)
    }


    if(valueselect == 6){
        $("#result").html(`<input type="number" class="form-control" id="action" placeholder="Delai en ms">
        
        
        `)
      }
}


//selection d'un fichier 
function fileselect() {
    console.log(document.getElementById("action").files[0].path)
      $('#fileresult').val(document.getElementById("action").files[0].path);
  }


//fonction d'écoute clavier 
var stps = 0;
var array;
function startlisten(){
  if(stps == 0){
document.querySelector('#startbutton').value = 'Arrêter';
document.querySelector("#listeninput").focus();

document.querySelector('#startbutton').classList.remove("btn-outline-secondary");
document.querySelector('#startbutton').classList.add("btn-outline-danger");
array = [];
stps = 1;
}else{
document.querySelector('#startbutton').value = 'Saisi';

document.querySelector('#startbutton').classList.remove("btn-outline-danger");
document.querySelector('#startbutton').classList.add("btn-outline-secondary");

stps = 0;
}
}
var bx;
function listenkey(event){
  var x = event.key;
  if (x != bx){
  bx=x;
  document.getElementById("listeninput").value = document.getElementById("listeninput").value + x + " - ";
  array.push(x);
  }
}

//fonction pour controle multimedia 
function multimediamode(id){
    multimediamodeid = id;
}


//fonction de validation de la selection
function validate(){
    if(valueselect == 2 || valueselect == 3){
    actionuri = $("#fileresult").val();
    }else{
      actionuri = $("#action").val()
     
    }
    if(valueselect == 0){
      actionuri = "Ne rien faire";
    }
    if(valueselect == 4){
      actionuri = multimediamodeid;
    }
    if(valueselect == 5){
      actionuri = array.toString();
    }
    $("#action_"+globalid).val(valueselect +" "+actionuri)
    $("#exampleModal").modal("show")
    $("#selectaction").modal("hide")
    return valueselect +" "+actionuri   
}



//Save 
function save(identifier,page, data_name, data_lentgh, data_action_array){     
    if(typeof document.config.action[page] === "undefined"){
        var data = new Object();
        data.name = data_name;
        data.lentgh = data_lentgh;
        data.action = data_action_array;
        var button_identifier = new Object();
        button_identifier[identifier] = data
        document.config.action[page] = button_identifier
    }else{
        var data = new Object();
        data.name = data_name;
        data.lentgh = data_lentgh;
        data.action = data_action_array;
        var button_identifier = new Object();
        button_identifier[identifier] = data
        document.config.action[page][identifier] = data
    }
    
       console.log(document.config)
       $('#exampleModal').modal("hide")
       read_config();
}

//hide modal qrcode

function hideqr(){
  $('#waitingmobile').modal("hide");
  console.log("YAY")
}