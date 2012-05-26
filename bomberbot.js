

﻿(function bomberbot(){
  "use strict"
  var net = require("net");

  var validActions=['N\r\n','E\r\n','S\r\n','O\r\n','P\r\n','BN\r\n','BE\r\n','BS\r\n','BO\r\n'];
  var playersConnected =[];
  var id=0;
  var asignarId = function(socket){
    socket.id= ++id;
    socket.user=undefined;
    socket.login = function login(usuario, token){
      console.log("hacer algo con este usuario "+usuario+" con token "+token + " para el socket "+socket.id );
      socket.user= usuario;
      socket.token= token;
      playersConnected.push(socket);
    };
  };


  var server = net.createServer( function(socket){
    socket.write("*****************************************************\n"+
                 "* Bienvenido al servidor de Bomberbot\n"+
                 "* Para información del juego entrar a bomberbot.com\n"+
                 "*****************************************************\r\n");
//    playersConnected.push(socket);

    socket.on("connect", function(){
      asignarId(socket);
      socket.write("100,ingrese usuario y token:\r\n");
    });

    socket.on("data", function(data){
      //process request:
      var info = data.toString().trim().split(",");

      switch(info[0]){
        case '101':
          console.log('loggin');
          socket.login(info[1], info[2]);
        break;
        case '102':
          console.log("");

        default:
          socket.write("a jode a otro \r\n");
      }
    });
  });

  var cont=0;
  var partida = [];
  
  var jugarPartida = function(){
    cont++;
    for(var i=0; i<4;i++){
        console.log("jugador "+partida[i].id+" accion: "+partida[i].accion);
        if(partida[i].accion==undefined){
          //deberia echarlo
          console.log("jugador "+partida[i].id+" no juega: "+partida[i].accion);
        }
    }
    //algun procesamiento
    for(var i=0; i<4;i++){
        console.log("jugador "+partida[i].id+" accion: "+partida[i].accion);
        partida[i].accion=undefined;
        partida[i].write("turno "+cont);
    }
    if(cont>=200){
      cont=0;
      setTimeout(crearPartida,10000);
    }else{
      setTimeout(jugarPartida,2100);  
    }

  }

  var crearPartida = function(){
    console.log("algo "+(++cont));
    if(playersConnected.length<4){
      console.log("otros 5s");
      setTimeout(crearPartida,5000);
      return undefined;
    }else{
      //selecciona 4 jugadores siguiendo unas reglas
      console.log(playersConnected.length);
      partida = [];
      for(var i =0; i<4;i++){
        partida.push(playersConnected[i]);
      }
      for(var i=0; i<4;i++){
        partida[i].write("empezo la partida\r\n");
      } 
      setTimeout(jugarPartida,1100); 
    }
  };
  
  setTimeout(crearPartida,5000);

  server.listen(5000);
  console.log("bomberbot server launched");
})();
