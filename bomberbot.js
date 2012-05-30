(function bomberbot(){
  "use strict"
  var net = require("net");

  var STATUS_UNKNOW="unknow";
  var STATUS_WAITING="waiting";
  var STATUS_PLAYING="playing";

  var validActions=['N\r\n','E\r\n','S\r\n','O\r\n','P\r\n','BN\r\n','BE\r\n','BS\r\n','BO\r\n'];
  var playersConnected =[];
  var id=0;

  var asignarId = function(socket){
    socket.id= ++id;
    socket.user=undefined;
    socket.fault=0;
    socket.login = function login(usuario, token){
      console.log("hacer algo con este usuario "+usuario+" con token "+token + " para el socket "+socket.id );
      socket.user= usuario;
      socket.token= token;
      socket.status='STATUS_WAITING';
      playersConnected.push(socket);
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
          console.log("");
        break;
        case STATUS_PLAYING:
          socket.accion=info[0];
        break;
        default:
          socket.write("mensaje no valido "+(++socket.fault)+"fallas \r\n");
          if(socket.fault==3){
            socket.end("ha completado tres fallas, se ha desconectado");
          }
        break;
      }

      socket.on("end",function(){
        console.log("mataron al socket "+socket.id);
        //sacar al socket del juego en el que este.
        var index= partida.lista.indexOf(socket.id);
        partida.lista.splice(index,1);
        delete partida[socket.id];
      });

      console.log("do something "+info);
      //console.log(socket);
      socket.pause();
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
    for(var i=0; i<partida.jugadores;i++){
        //console.log("jugador "+partida[partida.lista[i]].id+" accion: "+partida[partida.lista[i]].accion);
        partida[partida.lista[i]].accion=undefined;
        partida[partida.lista[i]].write(" <turno "+cont+" >");
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
      partida = [];
      partida.lista=[];
      partida.jugadores=4;
      for(var i =0; i<partida.jugadores;i++){
        partida[playersConnected[i].id]=playersConnected[i];
        partida.lista.push(playersConnected[i].id);
      }
      for(var i=0; i<partida.jugadores;i++){
        partida[partida.lista[i]].status=STATUS_PLAYING;
        partida[partida.lista[i]].write("empezo la partida\r\n");
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
