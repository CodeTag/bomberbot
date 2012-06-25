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


exports.gameController= function(){
  "use strict"

  var mapa=undefined;
  var bombas= [];
  var cont=0;
  var players=[];
  var bloquesDestruidos=[];

  this.generarMapa=function(nivel){
    cont=0;
    mapa=[
    ['X','X','X','X','X','X','X','X','X','X','X'],
    ['X','A','_','L','L','L','L','L','_','B','X'],
    ['X','_','L','L','X','L','X','L','X','_','X'],
    ['X','L','L','L','_','_','_','L','L','L','X'],
    ['X','L','L','_','X','L','X','_','X','L','X'],
    ['X','L','L','_','L','L','L','_','L','L','X'],
    ['X','L','L','_','X','L','X','_','X','L','X'],
    ['X','L','L','L','_','_','_','L','L','L','X'],
    ['X','_','L','L','X','L','X','L','X','_','X'],
    ['X','C','_','L','L','L','L','L','_','D','X'],
    ['X','X','X','X','X','X','X','X','X','X','X']
    ];
    bloquesDestruidos=[];
    players=[];
    bombas= [];
    return mapa;
  };
  this.getMapa= function(){
    return mapa.join("\n");
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
        player.xIndex=1;
        player.yIndex=1;
      break;
      case 2:
        player.ficha='B';
        player.xIndex=9;
        player.yIndex=1;
      break;
      case 3:
        player.ficha='C';
        player.xIndex=1;
        player.yIndex=9;
      break;
      case 4:
        player.ficha='D';
        player.xIndex=9;
        player.yIndex=9;
      break;
    }
    if(cont==4){
      for(var i=0; i<players.length;i++){
        players[i].status=STATUS_PLAYING;
        players[i].write("EMPEZO;"+mapa.join("\n")+";"+players[i].ficha+";\r\n");
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
        nextCell=mapa[player.yIndex-1][player.xIndex];
        if(nextCell=='_'||nextCell=='P'||nextCell=="V"){
          mapa[player.yIndex][player.xIndex]='_';
          mapa[player.yIndex-1][player.xIndex]=player.ficha;
          player.yIndex--;
        }
      break;
      case 'E':
        nextCell=mapa[player.yIndex][player.xIndex+1];
        if(nextCell=='_'||nextCell=='P'||nextCell=="V"){
          mapa[player.yIndex][player.xIndex]='_';
          mapa[player.yIndex][player.xIndex+1]=player.ficha;
          player.xIndex++;
        }
      break;
      case 'S':
        nextCell=mapa[player.yIndex+1][player.xIndex];
        if(nextCell=='_'||nextCell=='P'||nextCell=="V"){
          mapa[player.yIndex][player.xIndex]='_';
          mapa[player.yIndex+1][player.xIndex]=player.ficha;
          player.yIndex++;
        }
      break;
      case 'O':
        nextCell= mapa[player.yIndex][player.xIndex-1];
        if(nextCell=='_'||nextCell=='P'||nextCell=="V"){
          mapa[player.yIndex][player.xIndex]='_';
          mapa[player.yIndex][player.xIndex-1]=player.ficha;
          player.xIndex--;
        }
      break;
      //poniendo bombas
      case 'BN':
        if(player.contBombs<player.limitBombs&&mapa[player.yIndex-1][player.xIndex]=='_'){
          mapa[player.yIndex-1][player.xIndex]=BOMB_TIME;
          var bomba = new Bomba(player, player.xIndex, player.yIndex-1);
          bombas.push(bomba);
          player.contBombs++;
        }
      break;
      case 'BE':
        if(player.contBombs<player.limitBombs&&mapa[player.yIndex][player.xIndex+1]=='_'){
          mapa[player.yIndex][player.xIndex+1]=BOMB_TIME;
          var bomba = new Bomba(player, player.xIndex+1, player.yIndex);
          bombas.push(bomba);
          player.contBombs++;
        }
      break;
      case 'BS':
        if(player.contBombs<player.limitBombs&&mapa[player.yIndex+1][player.xIndex]=='_'){
          mapa[player.yIndex+1][player.xIndex]=BOMB_TIME;
          var bomba = new Bomba(player, player.xIndex, player.yIndex+1);
          bombas.push(bomba);
          player.contBombs++;
        }
      break;
      case 'BO':
        if(player.contBombs<player.limitBombs&&mapa[player.yIndex][player.xIndex-1]=='_'){
          mapa[player.yIndex][player.xIndex-1]=BOMB_TIME;
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
    mapa[player.yIndex][player.xIndex]="_";
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
    if(i<0||j<0||i>=mapa[0].length||j>=mapa.length){
      return;
    }
    if(mapa[j][i]=="L"){
      mapa[j][i]="#";
      points.total+=BLOCK_POINTS;
      this.agregarBloqueDestruido(i,j);
      return true;
    }else if(mapa[j][i]=="X"){
      return true;
    }else if(mapa[j][i]=="A"||mapa[j][i]=="B"||mapa[j][i]=="C"||mapa[j][i]=="D"){
      var player = this.getPlayer(mapa[j][i]);
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
      mapa[j][i]=player.ficha.toLowerCase();
    }else if(typeof(mapa[j][i])==="number"){
      //poner otra bomba para que estalle en el siguiente turno.
    }else if(mapa[j][i]=="_"||mapa[j][i]=="V"||mapa[j][i]=="P"){
      mapa[j][i]="#";
    }
  };


  this.actualizarMapa= function(){
    //limpiar #
    var cell="";
    for (var j = 0; j <mapa.length; j++) {
      for (var i = 0; i <mapa[0].length; i++) {
        cell= mapa[j][i];
        if(cell=="#"){
          //generar poderes aleatoriamente al romperse un bloque
          if(this.fueUnBloque(i, j)){
            var randomPower = Math.random()*100;
            if(randomPower<POW_POWER_PROBABILITY){
              mapa[j][i]="P";//mas poder!
            }else if(randomPower<POW_POWER_PROBABILITY+BOMB_POWER_PROBABILITY){
              mapa[j][i]="V";//mas bombas!
            }  
          }else{
            mapa[j][i]="_";
          }
        }else if(cell=="a"||cell=="b"||cell=="c"||cell=="d"){
          mapa[j][i]="_";
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
        mapa[yb][xb]='#';

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
        mapa[bomba.getYindex()][bomba.getXindex()]=bomba.getCountDown()+"";
      }

    }
  };
};