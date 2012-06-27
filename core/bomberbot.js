var STATUS_UNKNOW="unknow";
var STATUS_WAITING="waiting";
var STATUS_PLAYING="playing";
var DURACION_TURNO=200;
var MAX_TURNOS=200;
var WIN_POINTS=25;
var FREEZE_TIME=7000;

var validActions=['N','E','S','O','P','BN','BE','BS','BO'];

var models = require("./models.js");

exports.bomberbot=function bomberbot(app){
  "use strict"
  var net = require("net");
  var playersConnected =[];
  var id=0;

  var controller = new models.gameController();

  var asignarId = function(socket){
    
    socket.id= ++id;
    socket.user=undefined;
    socket.fault=0;

    socket.login = function login(usuario, token){
      //autenticar usuario
      socket.user= usuario;//validar y asociar
      socket.ficha=undefined;
      socket.xIndex=undefined;
      socket.yIndex=undefined;
      socket.pow=1;
      socket.limitBombs=1;
      socket.contBombs=0;
      socket.points=0;//puntos por partida
      socket.totalPrueba=0;//puntos totales en pruebas
      socket.totalProduccion=0;//puntos totales en produccion
      socket.token= token;//validando 
      socket.status=STATUS_WAITING;
      socket.partidasJugadas=0;//cargar informacion de la base de datos

      playersConnected.push(socket);
      console.log(usuario+" conectado");
    };

    socket.jugar = function jugar(accion){
      if(validActions.indexOf(accion)!=-1){
        socket.accion = accion;
      }else{//no es una accion valida

      }
    };
    socket.addPuntos=function addPuntos(points){
      socket.totalPrueba+=points;
      //socket.totalProduccion+=points;
    };

  };

  var server = net.createServer( function(socket){
    
    socket.on("connect", function(){
      asignarId(socket);
      socket.write("*******************************************************************************\n"+
                 "**       _______             _______                                         **\n"+
                 "**      |@|@|@|@|           |@|@|@|@|    Campus Party Colombia 2012          **\n"+
                 "**      |@|@|@|@|   _____   |@|@|@|@|    Torneo de IA con Bots               **\n"+
                 "**      |@|@|@|@| /\\_T_T_/\\ |@|@|@|@|    Servidor unico de Bomberbot         **\n"+
                 "**      |@|@|@|@||/\\ T T /\\||@|@|@|@|                                        **\n"+
                 "**       ~/T~~T~||~\\/~T~\\/~||~T~~T\\~     Para información del torneo         **\n" +
                 "**        \\|__|_| \\(-(O)-)/ |_|__|/      y reglas entrar a:                  **\n" +
                 "**        _| _|    \\8_8//    |_ |_       http://www.bomberbot.com            **\n"+
                 "**      |(@)]   /~~[_____]~~\\   [(@)|                                        **\n"+
                 "**        ~    (  |       |  )    ~                                          **\n"+
                 "**            [~` ]       [ '~]                                              **\n"+
                 "**            |~~|         |~~|                                              **\n"+
                 "**            |  |         |  |                                              **\n"+
                 "**           _<\\/>_       _<\\/>_                                             **\n"+
                 "**          /_====_\\     /_====_\\                                            **\n"+
                 "**                                                                           **\n"+
                 "**                                                                           **\n"+
                 "*******************************************************************************\n"+
                 "Ingrese usuario y token:\r\n");
      socket.status=STATUS_UNKNOW;
    });

    socket.on("data", function(data){
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
          controller.moverJugador(socket);
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
      if(socket.status== STATUS_PLAYING){
        controller.eliminarJugador(socket);  
        socket.points+=-15;
      }
      if(partida.lista != undefined){
        var index= partida.lista.indexOf(socket.id);
        
        if(index!=-1){
          partida.lista.splice(index,1);
          partida.jugadores--;  
        }
      }
      var index= playersConnected.indexOf(socket);
      if(index!=-1){
        playersConnected.splice(index,1);  
      }
    });
    socket.on("error", function(){
      if(socket.status== STATUS_PLAYING){
        controller.eliminarJugador(socket);  
        socket.points+=-15;
      }
      if(partida.lista != undefined){
        var index= partida.lista.indexOf(socket.id);
        
        if(index!=-1){
          partida.lista.splice(index,1);
          partida.jugadores--;  
        }
      }
      var index= playersConnected.indexOf(socket);
      if(index!=-1){
        playersConnected.splice(index,1);  
      }
    });
    socket.on("close", function(){
      if(socket.status== STATUS_PLAYING){
        controller.eliminarJugador(socket);  
        socket.points+=-15;
      }
      if(partida.lista != undefined){
        var index= partida.lista.indexOf(socket.id);
        
        if(index!=-1){
          partida.lista.splice(index,1);
          partida.jugadores--;  
        }
      }
      var index= playersConnected.indexOf(socket);
      if(index!=-1){
        playersConnected.splice(index,1);  
      }
    });
    socket.on("timeout", function(){
      if(socket.status== STATUS_PLAYING){
        controller.eliminarJugador(socket);  
        socket.points+=-15;
      }
      if(partida.lista != undefined){
        var index= partida.lista.indexOf(socket.id);
        
        if(index!=-1){
          partida.lista.splice(index,1);
          partida.jugadores--;  
        }
      }
      var index= playersConnected.indexOf(socket);
      if(index!=-1){
        playersConnected.splice(index,1);  
      }
      socket.end("se ha desconectado por inactividad");
    });
  });

  var turno=0;
  var partida = [];
  var finalizoPartida=true;

  var jugarPartida = function(){
    turno++;
    for(var i=0; i<partida.jugadores;i++){
        //console.log("jugador "+partida[partida.lista[i]].id+" accion: "+partida[partida.lista[i]].accion);
        if(partida[partida.lista[i]].accion==undefined){
          //deberia echarlo
          //console.log("jugador "+partida[partida.lista[i]].id+" no juega: "+partida[partida.lista[i]].accion);
        }else{
         // console.log("jugador "+partida[partida.lista[i]].ficha+" accion: "+partida[partida.lista[i]].accion);
        }
    }
    //algun procesamiento
    controller.actualizarMapa();
    console.log("\n--"+turno+"--");
    var map= controller.getMapa();
    console.log(map);
    console.log("----");
    for(var i=partida.jugadores-1; i>=0;i--){
        var player = partida[partida.lista[i]];
        if(player.status==STATUS_WAITING){
          console.log(player.user+" "+player.ficha+" muerto. total puntos: "+player.points);
          partida.lista.splice(i,1);
          partida.jugadores--;
        }else{
          if(partida.jugadores==1){
            player.points+=WIN_POINTS;
            console.log(player.user+" "+player.ficha+" gano. total puntos: "+player.points);
            finalizoPartida=true;
          }
          player.accion=undefined;
          player.write("TURNO;"+turno+";"+map+";\r\n");
          player.resume();
        }
    }
    //guardar el estado de la partida
    partida.juego.push(map);

    if(turno>=MAX_TURNOS||finalizoPartida){
      finalizoPartida=true;
      console.timeEnd('duracion partida');
      console.log("puntuacion total: ");
      partida.sort(function(a, b){return a.points-b.points});
      for(i in partida){
        console.log(partida[i].ficha+" "+ partida[i].user+" puntos: "+partida[i].points);
        if(i==0){
          partida[i].addPuntos(1);
        }else if(i==1){
          partida[i].addPuntos(2);
        }else if(i==2){
          partida[i].addPuntos(3);
        }else if(i==3){
          partida[i].addPuntos(5);
        }
        partida[i].status=STATUS_WAITING;
      }
      console.log("alllll");
      //guardar log de partida 
      
      var partidaStr="";
      var logFila="";
      var partidaTurno;
      for(var t=0;t<partida.juego.length;t++){
        partidaStr+=partida.juego[t];
        if(t<partida.juego.length-1){
          partidaStr+="-";
        }
        console.log("turno "+turno)
      }
      console.log("este fue el juego: "+partidaStr);
      var partidaModel = new app.models.Partida({ logPartida: partidaStr.toString(),id:0 });
      partidaModel.save();
      console.log("se guardo")

      setTimeout(crearPartida,FREEZE_TIME);
    }else{
      setTimeout(jugarPartida,DURACION_TURNO);  
    }
  };

  var crearPartida = function(){
    if(playersConnected.length<4){
      console.log("otros 5s");
      setTimeout(crearPartida,5000);
      return undefined;
    }else{
      //iniciarPartida;
      //selecciona 4 jugadores siguiendo unas reglas
      console.log(playersConnected.length);
      controller.generarMapa();
      partida = [];//almacena los jugadores asociandolos por el id
      partida.lista=[];//ids de jugadores en esta partida
      partida.jugadores=4;
      partida.juego=[];
      playersConnected.sort(function(a, b){
        return a.partidasJugadas-b.partidasJugadas
      });
      console.log("players connected "+playersConnected.length);
      for(var i =0; i<partida.jugadores;i++){
        partida[playersConnected[i].id]=playersConnected[i];
        partida.lista.push(playersConnected[i].id);
        controller.addPlayer(playersConnected[i]);
      }
      turno=0;
      finalizoPartida=false;
      console.time('duracion partida');
      setTimeout(jugarPartida,DURACION_TURNO); 
    }
  };
  
  setTimeout(crearPartida,5000);

  server.listen(5000);
  console.log("bomberbot server launched");
};