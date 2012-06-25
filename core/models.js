var STATUS_UNKNOW="unknow";
var STATUS_WAITING="waiting";
var STATUS_PLAYING="playing";
var BLOCK_POINTS=1; //puntos por destruir un bloque
var BOT_POINTS=10; //puntos por destruir un bot
var DEATH_POINTS=-8; //puntos por destruir un bot
var SUICIDE_POINTS =-30; //puntos por destruir un bot

var POW_POWER_PROBABILITY=5;
var BOMB_POWER_PROBABILITY=5;

var BOMB_TIME=3;

var Bomba=function(player, xIndex, yIndex){
  "use strict"
  this.xIndex=xIndex||-1;
  this.yIndex=yIndex||-1;
  this.countDown=BOMB_TIME;
  this.potencia=player.pow||1;
  this.player=player;

  this.getCountDown= function(){
    return this.countDown;
  };
  this.getXindex= function(){
    return this.xIndex;
  };
  this.getYindex= function(){
    return this.yIndex;
  };
  this.decrementar= function(){
    this.countDown--;
    return this.countDown==0;
  };
  this.getPotencia=function(){
    return this.potencia;
  };
};

var Map=function(id, map){
  this.id=id;
  this.map=map;
  this.ax=-1;
  this.ay=-1;
  this.bx=-1;
  this.by=-1;
  this.cx=-1;
  this.cy=-1;
  this.dx=-1;
  this.ay=-1;
};
var copiarMapa=function(mapaACopiar){
  var mapaNuevo= new Map(mapaACopiar.id,[]);
  mapaNuevo.map= mapaACopiar.map.valueOf().slice();
  mapaNuevo.ax=mapaACopiar.ax.valueOf();
  mapaNuevo.ay=mapaACopiar.ay.valueOf();
  mapaNuevo.bx=mapaACopiar.bx.valueOf();
  mapaNuevo.by=mapaACopiar.by.valueOf();
  mapaNuevo.cx=mapaACopiar.cx.valueOf();
  mapaNuevo.cy=mapaACopiar.cy.valueOf();
  mapaNuevo.dx=mapaACopiar.dx.valueOf();
  mapaNuevo.dy=mapaACopiar.dy.valueOf();
  console.log("se ha creado un mapa nuevop");
  return mapaNuevo;
};

var maps=[];
var fs= require("fs");
(function(){
  //var input = fs.createReadStream('core/maps.txt');
  var array = fs.readFileSync('core/maps.txt').toString().split("\n");
  var mapa=undefined;
  var map=[];
  var row=0;
  var data="";
  for(i in array) {
    data= array[i];
    if(data.indexOf("map")!=-1){
      map=[];
      mapa= new Map(parseInt(data.substr(3)),map);
      maps[mapa.id]=mapa;
      row=0;
    }else if(data.indexOf("fin")!=-1){
      console.log("carga de mapas finalizada");
    }else{
      if(data.indexOf("A")!=-1){
        mapa.ax=data.indexOf("A");
        mapa.ay=row;
      }
      if(data.indexOf("B")!=-1){
        mapa.bx=data.indexOf("B");
        mapa.by=row;
      }
      if(data.indexOf("C")!=-1){
        mapa.cx=data.indexOf("C");
        mapa.cy=row;
      }
      if(data.indexOf("D")!=-1){
        mapa.dx=data.indexOf("D");
        mapa.dy=row;
      }
      map[row]=data.split("");
      map[row].splice(map[row].length-1);
      row++;
    }
  }
})();

exports.gameController= function(){
  "use strict"

  var mapa=undefined;
  var bombas= [];
  var cont=0;
  var players=[];
  var bloquesDestruidos=[];

  this.generarMapa=function(nivel){
    cont=0;
    var mapaElegido= Math.floor(Math.random()*maps.length);
    mapa=copiarMapa(maps[1]);
    console.log("mapa "+mapa.id);
    bloquesDestruidos=[];
    players=[];
    bombas= [];
    return mapa;
  };
  this.getMapa= function(){
    return mapa.map.join("\n");
  };

  this.addPlayer=function(player){
    cont++;
    players.push(player);
    player.pow=1;
    player.limitBombs=1;
    player.points=0;
    switch(cont){
      case 1:
        player.ficha='A';
        player.xIndex=mapa.ax;
        player.yIndex=mapa.ay;
      break;
      case 2:
        player.ficha='B';
        player.xIndex=mapa.bx;
        player.yIndex=mapa.by;
      break;
      case 3:
        player.ficha='C';
        player.xIndex=mapa.cx;
        player.yIndex=mapa.cy;
      break;
      case 4:
        player.ficha='D';
        player.xIndex=mapa.dx;
        player.yIndex=mapa.dy;
        console.log("D "+player.xIndex+" "+player.yIndex)
      break;
    }
    if(cont==4){
      console.log(mapa.map);
      for(var i=0; i<players.length;i++){
        players[i].status=STATUS_PLAYING;
        players[i].write("EMPEZO;"+mapa.map.join("\n")+";"+players[i].ficha+";\r\n");
      }  
    }
  };

  this.getPlayer= function(ficha){
    for(var i=0; i<players.length; i++){
      if(players[i].ficha==ficha){
        return players[i];
      }
    }
    return undefined;
  };

  this.moverJugador= function(player){
    //no olvidar que no debe ser secuencial, sino todos al tiempo!
    //o el que primero se arrodilla primero se confiesa...
    var nextCell="";
    switch(player.accion){
      //primero movimiento
      case 'N':
        nextCell=mapa.map[player.yIndex-1][player.xIndex];
        if(nextCell=='_'||nextCell=='P'||nextCell=="V"){
          mapa.map[player.yIndex][player.xIndex]='_';
          mapa.map[player.yIndex-1][player.xIndex]=player.ficha;
          player.yIndex--;
        }
      break;
      case 'E':
        nextCell=mapa.map[player.yIndex][player.xIndex+1];
        if(nextCell=='_'||nextCell=='P'||nextCell=="V"){
          mapa.map[player.yIndex][player.xIndex]='_';
          mapa.map[player.yIndex][player.xIndex+1]=player.ficha;
          player.xIndex++;
        }
      break;
      case 'S':
        nextCell=mapa.map[player.yIndex+1][player.xIndex];
        if(nextCell=='_'||nextCell=='P'||nextCell=="V"){
          mapa.map[player.yIndex][player.xIndex]='_';
          mapa.map[player.yIndex+1][player.xIndex]=player.ficha;
          player.yIndex++;
        }
      break;
      case 'O':
        nextCell= mapa.map[player.yIndex][player.xIndex-1];
        if(nextCell=='_'||nextCell=='P'||nextCell=="V"){
          mapa.map[player.yIndex][player.xIndex]='_';
          mapa.map[player.yIndex][player.xIndex-1]=player.ficha;
          player.xIndex--;
        }
      break;
      //poniendo bombas
      case 'BN':
        if(player.contBombs<player.limitBombs&&mapa.map[player.yIndex-1][player.xIndex]=='_'){
          mapa.map[player.yIndex-1][player.xIndex]=BOMB_TIME;
          var bomba = new Bomba(player, player.xIndex, player.yIndex-1);
          bombas.push(bomba);
          player.contBombs++;
        }
      break;
      case 'BE':
        if(player.contBombs<player.limitBombs&&mapa.map[player.yIndex][player.xIndex+1]=='_'){
          mapa.map[player.yIndex][player.xIndex+1]=BOMB_TIME;
          var bomba = new Bomba(player, player.xIndex+1, player.yIndex);
          bombas.push(bomba);
          player.contBombs++;
        }
      break;
      case 'BS':
        if(player.contBombs<player.limitBombs&&mapa.map[player.yIndex+1][player.xIndex]=='_'){
          mapa.map[player.yIndex+1][player.xIndex]=BOMB_TIME;
          var bomba = new Bomba(player, player.xIndex, player.yIndex+1);
          bombas.push(bomba);
          player.contBombs++;
        }
      break;
      case 'BO':
        if(player.contBombs<player.limitBombs&&mapa.map[player.yIndex][player.xIndex-1]=='_'){
          mapa.map[player.yIndex][player.xIndex-1]=BOMB_TIME;
          var bomba = new Bomba(player, player.xIndex-1, player.yIndex);
          bombas.push(bomba);
          player.contBombs++;
        }
      break;
    }
    if(nextCell=="P"){
      player.pow++;
    }else if(nextCell=="V"){
      //otra bomba
      player.limitBombs++;
    }
  };
  this.eliminarJugador= function(player){
    mapa.map[player.yIndex][player.xIndex]="_";
    var index = players.indexOf(player);
    if(index!=-1){
      players.splice(index, 1);
    }
  };
  this.fueUnBloque=function(i, j){
    if(bloquesDestruidos[i+","+j]){
      delete bloquesDestruidos[i+","+j];
      return true;
    }
    return false;
  };
  this.agregarBloqueDestruido=function(i,j){
    bloquesDestruidos[i+","+j]=true;
  };
  this.destruir = function(i, j, points, ficha){
    if(i<0||j<0||i>=mapa.map[0].length||j>=mapa.map.length){
      return;
    }
    if(mapa.map[j][i]=="L"){
      mapa.map[j][i]="#";
      points.total+=BLOCK_POINTS;
      this.agregarBloqueDestruido(i,j);
      return true;
    }else if(mapa.map[j][i]=="X"){
      return true;
    }else if(mapa.map[j][i]=="A"||mapa.map[j][i]=="B"||mapa.map[j][i]=="C"||mapa.map[j][i]=="D"){
      var player = this.getPlayer(mapa.map[j][i]);
      if(ficha==player.ficha){
        player.points+=SUICIDE_POINTS;
        console.log(ficha +" ha cometido suicidio!");
      }else{
        points.total+=BOT_POINTS;
        player.points+=DEATH_POINTS;
        console.log(ficha +" ha destruido a "+player.ficha+" total puntos "+player.points);
      }
      player.write("PERDIO;\r\n");
      player.status=STATUS_WAITING;
      mapa.map[j][i]=player.ficha.toLowerCase();
    }else if(typeof(mapa.map[j][i])==="number"){
      //poner otra bomba para que estalle en el siguiente turno.
    }else if(mapa.map[j][i]=="_"||mapa.map[j][i]=="V"||mapa.map[j][i]=="P"){
      mapa.map[j][i]="#";
    }
  };


  this.actualizarMapa= function(){
    //limpiar #
    var cell="";
    for (var j = 0; j <mapa.map.length; j++) {
      for (var i = 0; i <mapa.map[0].length; i++) {
        cell= mapa.map[j][i];
        if(cell=="#"){
          //generar poderes aleatoriamente al romperse un bloque
          if(this.fueUnBloque(i, j)){
            var randomPower = Math.random()*100;
            if(randomPower<POW_POWER_PROBABILITY){
              mapa.map[j][i]="P";//mas poder!
            }else if(randomPower<POW_POWER_PROBABILITY+BOMB_POWER_PROBABILITY){
              mapa.map[j][i]="V";//mas bombas!
            }  
          }else{
            mapa.map[j][i]="_";
          }
        }else if(cell=="a"||cell=="b"||cell=="c"||cell=="d"){
          mapa.map[j][i]="_";
        }
      };
    };
    var bomba =undefined;
    var points=[];//encapsulamiento para obtener valor por referencia
    for (var i = bombas.length - 1; i >= 0; i--) {
      bomba=bombas[i];
      points.total=0;
      if(bomba.decrementar()){
        //destruir!!!
        var xb=bomba.getXindex();
        var yb=bomba.getYindex()
        mapa.map[yb][xb]='#';

        for(var h= 1; h<=bomba.getPotencia();h++){
          if(this.destruir(xb-h,yb, points,bomba.player.ficha)){
            break;
          }
        }
        for(var h= 1; h<=bomba.getPotencia();h++){
          if(this.destruir(xb+h,yb, points,bomba.player.ficha)){
            break;
          }
        }
        for(var h= 1; h<=bomba.getPotencia();h++){
          if(this.destruir(xb,yb-h, points,bomba.player.ficha)){
            break;
          }
        }
        for(var h= 1; h<=bomba.getPotencia();h++){
          if(this.destruir(xb,yb+h, points,bomba.player.ficha)){
            break;
          }
        }
        bomba.player.points+=points.total;
        bomba.player.contBombs--;
        bombas.splice(i,1);
        //delete bomba;
      }else{
        mapa.map[bomba.getYindex()][bomba.getXindex()]=bomba.getCountDown()+"";
      }

    }
  };
};