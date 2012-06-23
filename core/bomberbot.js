var STATUS_UNKNOW="unknow";
var STATUS_WAITING="waiting";
var STATUS_PLAYING="playing";
var BOMB_TIME=5;

var validActions=['N','E','S','O','P','BN','BE','BS','BO'];

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

var mapGenerator= function(){
  "use strict"

  var mapa=undefined;
  var bombas= [];

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

  var cont=0;
  var players=[];
  this.addPlayer=function(socket){
    cont++;
    players.push(socket);
    switch(cont){
      case 1:
        socket.ficha='A';
        socket.xIndex=1;
        socket.yIndex=1;
      break;
      case 2:
        socket.ficha='B';
        socket.xIndex=5;
        socket.yIndex=1;
      break;
      case 3:
        socket.ficha='C';
        socket.xIndex=1;
        socket.yIndex=5;
      break;
      case 4:
        socket.ficha='D';
        socket.xIndex=5;
        socket.yIndex=5;
      break;
    }
    if(cont==4){
      for(var i=0; i<players.length;i++){
        players[i].status=STATUS_PLAYING;
        players[i].write("Empezo la partida;"+mapa.join("\n")+";"+players[i].ficha+";\r\n");
      }  
    }
  };

  this.moverJugador= function(socket){
    //no olvidar que no debe ser secuencial, sino todos al tiempo!
    //o el que primero se arrodilla primero se confiesa...
    switch(socket.accion){
      //primero movimiento
      case 'N':
        if(mapa[socket.yIndex-1][socket.xIndex]=='_'){
          mapa[socket.yIndex][socket.xIndex]='_';
          mapa[socket.yIndex-1][socket.xIndex]=socket.ficha;
          socket.yIndex--;
        }
      break;
      case 'E':
        if(mapa[socket.yIndex][socket.xIndex+1]=='_'){
          mapa[socket.yIndex][socket.xIndex]='_';
          mapa[socket.yIndex][socket.xIndex+1]=socket.ficha;
          socket.xIndex++;
        }
      break;
      case 'S':
        if(mapa[socket.yIndex+1][socket.xIndex]=='_'){
          mapa[socket.yIndex][socket.xIndex]='_';
          mapa[socket.yIndex+1][socket.xIndex]=socket.ficha;
          socket.yIndex++;
        }
      break;
      case 'O':
        if(mapa[socket.yIndex][socket.xIndex-1]=='_'){
          mapa[socket.yIndex][socket.xIndex]='_';
          mapa[socket.yIndex][socket.xIndex-1]=socket.ficha;
          socket.xIndex--;
        }
      break;
      //poniendo bombas
      case 'BN':
        if(mapa[socket.yIndex-1][socket.xIndex]=='_'){
          mapa[socket.yIndex-1][socket.xIndex]=BOMB_TIME;
          var bomba = new Bomba(socket.xIndex, socket.yIndex-1,socket.pow);
          bombas.push(bomba);
        }
      break;
      case 'BE':
        if(mapa[socket.yIndex][socket.xIndex+1]=='_'){
          mapa[socket.yIndex][socket.xIndex+1]=BOMB_TIME;
          var bomba = new Bomba(socket.xIndex+1, socket.yIndex,socket.pow);
          bombas.push(bomba);
        }
      break;
      case 'BS':
        if(mapa[socket.yIndex+1][socket.xIndex]=='_'){
          mapa[socket.yIndex+1][socket.xIndex]=BOMB_TIME;
          var bomba = new Bomba(socket.xIndex, socket.yIndex+1,socket.pow);
          bombas.push(bomba);
        }
      break;
      case 'BO':
        if(mapa[socket.yIndex][socket.xIndex-1]=='_'){
          mapa[socket.yIndex][socket.xIndex-1]=BOMB_TIME;
          var bomba = new Bomba(socket.xIndex-1, socket.yIndex,socket.pow);
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
      mapa[j][i]="_";
      return true;
    }else if(mapa[j][i]=="X"){
      return true;
    }else if(mapa[j][i]=="A"){
      console.log("A debe morir");
    }else if(mapa[j][i]=="B"){
      console.log("B debe morir");
    }else if(mapa[j][i]=="C"){
      console.log("C debe morir");
    }else if(mapa[j][i]=="D"){
      console.log("D debe morir");
    }else if(typeof(mapa[j][i])==="number"){
      //poner otra bomba para que estalle en el siguiente turno.
    }

  }
  this.actualizarMapa= function(){
    var bomba =undefined;
    for (var i = bombas.length - 1; i >= 0; i--) {
      bomba=bombas[i];
      if(bomba.decrementar()){
        //destruir!!!
        var xb=bomba.getXindex();
        var yb=bomba.getYindex()
        mapa[yb][xb]='_';

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

(function bomberbot(){
  "use strict"
  var net = require("net");
  var playersConnected =[];
  var id=0;

  var maper = new mapGenerator();
  console.log(maper);

  var asignarId = function(socket){
    
    socket.id= ++id;
    socket.user=undefined;
    socket.fault=0;

    socket.login = function login(usuario, token){
      //autenticar usuario
      socket.user= usuario;
      socket.ficha=undefined;
      socket.xIndex=undefined;
      socket.yIndex=undefined;
      socket.pow=1;
      socket.token= token;
      socket.status=STATUS_WAITING;
      playersConnected.push(socket);
    };

    socket.jugar = function jugar(accion){
      if(validActions.indexOf(accion)!=-1){
        socket.accion = accion;
        console.log("es una accion valida ");
      }else{
        console.log("no es una accion valida "+accion);
      }
    };

  };

  var server = net.createServer( function(socket){
    socket.write("*****************************************************\n"+
                 "* Bienvenido al servidor de Bomberbot\n"+
                 "* Para información del juego entrar a bomberbot.com\n"+
                 "*****************************************************\r\n");
    socket.on("connect", function(){
      asignarId(socket);
      socket.write("ingrese usuario y token:\r\n");
      socket.status=STATUS_UNKNOW;
    });

    socket.on("data", function(data){
      //process request:
      var info = data.toString().trim().split(",");

      switch(socket.status){
        case STATUS_UNKNOW:
          socket.login(info[0], info[1]);
        break;
        case STATUS_WAITING:
          console.log(socket.user + " mientras waiting "+info[0]);
          if(info[0]=="salir"){
            socket.end("hasta luego mano");
          }
          socket.pause();
          setTimeout(socket.resume(),1000);

        break;
        case STATUS_PLAYING:
          socket.jugar(info[0].toUpperCase());
          socket.pause();
          maper.moverJugador(socket);
        break;
        default:
          console.log(socket.status);
          socket.write("status no valido "+(++socket.fault)+"fallas \r\n");
          if(socket.fault==3){
            socket.end("ha completado tres fallas, se ha desconectado");
          }
        break;
      }
      
    });

    socket.on("end",function(){
      console.log("mataron al socket "+socket.id);
      //sacar al socket del juego en el que este.
      if(partida.lista != undefined){
        var index= partida.lista.indexOf(socket.id);
        partida.lista.splice(index,1);
        delete partida[socket.id];
      }
      var index= playersConnected.indexOf(socket.id);
      playersConnected.splice(index,1);

    });

  });

  var cont=0;
  var partida = [];

  var jugarPartida = function(){
    cont++;
    for(var i=0; i<partida.jugadores;i++){
        //console.log("jugador "+partida[partida.lista[i]].id+" accion: "+partida[partida.lista[i]].accion);
        if(partida[partida.lista[i]].accion==undefined){
          //deberia echarlo
          //console.log("jugador "+partida[partida.lista[i]].id+" no juega: "+partida[partida.lista[i]].accion);
        }else{
          console.log("jugador "+partida[partida.lista[i]].id+" accion: "+partida[partida.lista[i]].accion);
        }
    }
    //algun procesamiento
    maper.actualizarMapa();
    console.log("\n----");
    console.log(maper.getMapa());
    console.log("----");
    for(var i=0; i<partida.jugadores;i++){
        partida[partida.lista[i]].accion=undefined;

        partida[partida.lista[i]].write("turno;"+cont+";"+maper.getMapa()+";\r\n");
        partida[partida.lista[i]].resume();
    }
    if(cont>=200){
      console.timeEnd('duracion partida');
      for(var i=0; i<partida.jugadores;i++){
        partida[partida.lista[i]].status=STATUS_WAITING;
      }
      setTimeout(crearPartida,20000);
    }else{
      setTimeout(jugarPartida,1100);  
    }
  };

  var crearPartida = function(){
    if(playersConnected.length<4){
      console.log("otros 5s");
      setTimeout(crearPartida,5000);
      return undefined;
    }else{
      //selecciona 4 jugadores siguiendo unas reglas
      console.log(playersConnected.length);
      maper.generarMapa();
      partida = [];
      partida.lista=[];
      partida.jugadores=4;
      for(var i =0; i<partida.jugadores;i++){
        partida[playersConnected[i].id]=playersConnected[i];
        partida.lista.push(playersConnected[i].id);
        maper.addPlayer(playersConnected[i]);
      }
      
      cont=0;
      console.time('duracion partida');
      setTimeout(jugarPartida,1100); 
    }
  };
  
  setTimeout(crearPartida,5000);

  server.listen(5000);
  console.log("bomberbot server launched");
})();
