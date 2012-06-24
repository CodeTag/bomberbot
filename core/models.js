var STATUS_UNKNOW="unknow";
var STATUS_WAITING="waiting";
var STATUS_PLAYING="playing";

var BOMB_TIME=5;

var Bomba=function(xIndex,yIndex,potencia){
  "use strict"
  this.xIndex=xIndex||-1;
  this.yIndex=yIndex||-1;
  this.countDown=3;
  this.potencia=potencia||1;

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
    return potencia;
  };
};


exports.gameController= function(){
  "use strict"

  var mapa=undefined;
  var bombas= [];
  var cont=0;
  var players=[];

  this.generarMapa=function(nivel){

    mapa=[
    ['X','X','X','X','X','X','X'],
    ['X','A','_','L','_','B','X'],
    ['X','_','X','L','X','_','X'],
    ['X','L','L','L','L','L','X'],
    ['X','_','X','L','X','_','X'],
    ['X','C','_','L','_','D','X'],
    ['X','X','X','X','X','X','X'],
    ];
    return mapa;
  };
  this.getMapa= function(){
    return mapa.join("\n");
  };

  this.addPlayer=function(player){
    cont++;
    players.push(player);
    switch(cont){
      case 1:
        player.ficha='A';
        player.xIndex=1;
        player.yIndex=1;
      break;
      case 2:
        player.ficha='B';
        player.xIndex=5;
        player.yIndex=1;
      break;
      case 3:
        player.ficha='C';
        player.xIndex=1;
        player.yIndex=5;
      break;
      case 4:
        player.ficha='D';
        player.xIndex=5;
        player.yIndex=5;
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
    switch(player.accion){
      //primero movimiento
      case 'N':
        if(mapa[player.yIndex-1][player.xIndex]=='_'){
          mapa[player.yIndex][player.xIndex]='_';
          mapa[player.yIndex-1][player.xIndex]=player.ficha;
          player.yIndex--;
        }
      break;
      case 'E':
        if(mapa[player.yIndex][player.xIndex+1]=='_'){
          mapa[player.yIndex][player.xIndex]='_';
          mapa[player.yIndex][player.xIndex+1]=player.ficha;
          player.xIndex++;
        }
      break;
      case 'S':
        if(mapa[player.yIndex+1][player.xIndex]=='_'){
          mapa[player.yIndex][player.xIndex]='_';
          mapa[player.yIndex+1][player.xIndex]=player.ficha;
          player.yIndex++;
        }
      break;
      case 'O':
        if(mapa[player.yIndex][player.xIndex-1]=='_'){
          mapa[player.yIndex][player.xIndex]='_';
          mapa[player.yIndex][player.xIndex-1]=player.ficha;
          player.xIndex--;
        }
      break;
      //poniendo bombas
      case 'BN':
        if(mapa[player.yIndex-1][player.xIndex]=='_'){
          mapa[player.yIndex-1][player.xIndex]=BOMB_TIME;
          var bomba = new Bomba(player.xIndex, player.yIndex-1,player.pow);
          bombas.push(bomba);
        }
      break;
      case 'BE':
        if(mapa[player.yIndex][player.xIndex+1]=='_'){
          mapa[player.yIndex][player.xIndex+1]=BOMB_TIME;
          var bomba = new Bomba(player.xIndex+1, player.yIndex,player.pow);
          bombas.push(bomba);
        }
      break;
      case 'BS':
        if(mapa[player.yIndex+1][player.xIndex]=='_'){
          mapa[player.yIndex+1][player.xIndex]=BOMB_TIME;
          var bomba = new Bomba(player.xIndex, player.yIndex+1,player.pow);
          bombas.push(bomba);
        }
      break;
      case 'BO':
        if(mapa[player.yIndex][player.xIndex-1]=='_'){
          mapa[player.yIndex][player.xIndex-1]=BOMB_TIME;
          var bomba = new Bomba(player.xIndex-1, player.yIndex,player.pow);
          bombas.push(bomba);
        }
      break;
    }
  };

  this.destruir = function(i, j){
    if(i<0||j<0||i>=mapa[0].length||j>=mapa.length){
      return;
    }
    if(mapa[j][i]=="L"){
      mapa[j][i]="#";
      return true;
    }else if(mapa[j][i]=="X"){
      return true;
    }else if(mapa[j][i]=="A"||mapa[j][i]=="B"||mapa[j][i]=="C"||mapa[j][i]=="D"){
      var player = this.getPlayer(mapa[j][i]);
      player.write("PERDIO;\r\n");
      player.status=STATUS_WAITING;
      mapa[j][i]="#";
    }else if(typeof(mapa[j][i])==="number"){
      //poner otra bomba para que estalle en el siguiente turno.
    }
  }

  this.actualizarMapa= function(){
    //limpiar #
    for (var j = 0; j <mapa.length; j++) {
      for (var i = 0; i <mapa[0].length; i++) {
        if(mapa[j][i]=="#"){mapa[j][i]="_";}
      };
    };
    var bomba =undefined;
    for (var i = bombas.length - 1; i >= 0; i--) {
      bomba=bombas[i];
      if(bomba.decrementar()){
        //destruir!!!
        var xb=bomba.getXindex();
        var yb=bomba.getYindex()
        mapa[yb][xb]='#';

        for(var h= 1; h<=bomba.getPotencia();h++){
          if(this.destruir(xb-h,yb)){
            break;
          }
        }
        for(var h= 1; h<=bomba.getPotencia();h++){
          if(this.destruir(xb+h,yb)){
            break;
          }
        }
        for(var h= 1; h<=bomba.getPotencia();h++){
          if(this.destruir(xb,yb-h)){
            break;
          }
        }
        for(var h= 1; h<=bomba.getPotencia();h++){
          if(this.destruir(xb,yb+h)){
            break;
          }
        }
        bombas.splice(i,1);
        //delete bomba;
      }else{
        mapa[bomba.getYindex()][bomba.getXindex()]=bomba.getCountDown()+"";
      }
    }
  };
};