var STATUS_UNKNOW="unknow";
var STATUS_WAITING="waiting";
var STATUS_PLAYING="playing";
var DURACION_TURNO=1000;
var MAX_TURNOS=200;
var WIN_POINTS=50;
var FREEZE_TIME=2000;

var validActions=['N','E','S','O','P','BN','BE','BS','BO'];

var models = require("./models.js");

exports.bomberbot=function bomberbot(app){
  "use strict"
  var net = require("net");
  var playersConnected =[];
  var id=0;

  var controller = new models.gameController();

  //inicializar sockets
  app.models.User.update({}, {connected:false},{ multi: true },function(err){console.log(Date()+" "+"error updating "+err)});

  var asignarId = function(socket){
    
    socket.id= ++id;
    socket.user=undefined;
    socket.fault=0;

    socket.login = function login(usuario, token){

      app.models.User.findOne({username:usuario, _id:token},function(err, dbuser){
        if(!dbuser){
          socket.end("Usuario && token no validos\r\n");
          socket.destroy()
          return;
        }else if (dbuser.connected){
          socket.end("Usuario ya esta conectado.\r\n");
          socket.destroy()
          return;
        }
        app.models.User.update({_id:token}, {connected:true},{},function(err){console.log(Date()+" "+"error updating "+err);});
        //autenticar usuario
        socket.user= usuario;//validar y asociar
        socket.ficha=undefined;
        socket.xIndex=undefined;
        socket.yIndex=undefined;
        socket.pow=1;
        socket.limitBombs=1;
        socket.contBombs=0;
        socket.points=0;//puntos por partida
        socket.token= token;//validando 
        socket.status=STATUS_WAITING;
        socket.dbuser= dbuser;
        socket.jugo=false;
        //cargar de la base de datos        
        socket.totalPrueba=dbuser.get("totalPrueba")||0;//puntos totales en pruebas
        socket.totalProduccion=dbuser.get("totalProduccion")||0;//puntos totales en produccion
        socket.partidasJugadas=dbuser.get("partidasJugadas")||0;//cargar informacion de la base de datos

        playersConnected.push(socket);
        console.log(Date()+" "+usuario+" conectado");
      });
    };

    socket.jugar = function jugar(accion){
      if(validActions.indexOf(accion)!=-1){
        socket.accion = accion;
      }else{//no es una accion valida

      }
    };
    socket.addPuntos=function addPuntos(points){
      socket.totalPrueba+=points;
      if(socket.user=="agares" || socket.user=="julianvargasalvarez" || socket.user == "woakas" ||socket.user=="kuryaki"){
        console.log(Date()+" "+"a ustedes no los puedo salvar");
      }else{
        app.models.User.update({_id:socket.token},{totalPrueba:socket.totalPrueba},{},function(err){console.log(Date()+" "+""+err);});
      }
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
      console.log(Date()+" socket status: "+socket.status);
      console.log(Date()+" socket data for "+socket.user+" "+ info);
      switch(socket.status){
        case STATUS_UNKNOW:
          socket.login(info[0], info[1]);
        break;

        case STATUS_WAITING:
          //console.log(Date()+" "+socket.user + " mientras waiting "+info[0]);
          if(info[0]=="salir"){
            socket.end("hasta luego mano");
            socket.destroy();
          }
        break;

        case STATUS_PLAYING:
          socket.jugar(info[0].toUpperCase());
          if(!socket.jugo){
            socket.jugo=true;
            controller.moverJugador(socket);  
          }
        break;

        default:
          console.log(Date()+" "+socket.status);
          socket.write("status no valido "+(++socket.fault)+"fallas \r\n");
          if(socket.fault==3){
            socket.end("ha completado tres fallas, se ha desconectado");
            socket.destroy();
          }
        break;
      }
    });

    socket.on("end",function(){
      if(socket.status== STATUS_PLAYING){
        controller.eliminarJugador(socket);  
        socket.addPuntos(0);
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
      app.models.User.update({_id:socket.token}, {connected:false},{},function(err){console.log(Date()+" "+"error updating user "+err)});
      socket.end("se ha desconectado por inactividad");
      socket.destroy();
    });
    socket.on("error",function(){
      if(socket.status== STATUS_PLAYING){
        controller.eliminarJugador(socket);  
        socket.addPuntos(0);
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
      app.models.User.update({_id:socket.token}, {connected:false},{},function(err){console.log(Date()+" "+"error updating user "+err)});
      socket.end("se ha desconectado por inactividad");
      socket.destroy();
    });
    socket.on("close", function(){
      if(socket.status== STATUS_PLAYING){
        controller.eliminarJugador(socket);  
        socket.addPuntos(0);
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
      app.models.User.update({_id:socket.token}, {connected:false},{},function(err){console.log(Date()+" "+"error updating user "+err)});
      socket.end("se ha desconectado por inactividad");
      socket.destroy();
    });
    socket.on("timeout",function(){
      if(socket.status== STATUS_PLAYING){
        controller.eliminarJugador(socket);  
        socket.addPuntos(0);
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
      app.models.User.update({_id:socket.token}, {connected:false},{},function(err){console.log(Date()+" "+"error updating user "+err)});
      socket.end("se ha desconectado por inactividad");
      socket.destroy();
    });
  });

  var turno=0;
  var partida = [];
  var finalizoPartida=true;

  var jugarPartida = function(){
    turno++;
    for(var i=0; i<partida.jugadores;i++){
        console.log(Date()+" "+"jugador "+partida[partida.lista[i]].user+" accion: "+partida[partida.lista[i]].accion);
    }
    //algun procesamiento
    controller.actualizarMapa();
    console.log(Date()+" "+"Turno: --"+turno+"--");
    var map= controller.getMapa();
    console.log(Date()+"\n "+map);
    for(var i=partida.jugadores-1; i>=0;i--){
        var player = partida[partida.lista[i]];
        if(player.status==STATUS_WAITING){
          console.log(Date()+" "+player.user+" "+player.ficha+" muerto. total puntos: "+player.points);
          partida.lista.splice(i,1);
          partida.jugadores--;
        }else{
          if(partida.jugadores==1){
            player.addPuntos(WIN_POINTS);
            
            console.log(Date()+" "+player.user+" "+player.ficha+" gano. total puntos: "+player.points);
            finalizoPartida=true;
          }
          player.accion=undefined;
          player.write("TURNO;"+turno+";"+map+";\r\n");
          player.jugo=false;
        }
    }
    //guardar el estado de la partida
    partida.juego.push(map);

    if(turno>=MAX_TURNOS||finalizoPartida){
      finalizoPartida=true;
      console.timeEnd('duracion partida');
      
      var userA=undefined;
      var userB=undefined;
      var userC=undefined;
      var userD=undefined;
      console.log(Date()+" "+"puntuacion total: ");
      partida.sort(function(a, b){return a.points-b.points});
      for(i in partida){
        console.log(Date()+" "+partida[i].ficha+" "+ partida[i].user+" puntos: "+partida[i].points);
        if(i==0){
          partida[i].addPuntos(partida[i].points+13);
        }else if(i==1){
          partida[i].addPuntos(partida[i].points+8);
        }else if(i==2){
          partida[i].addPuntos(partida[i].points+5);
        }else if(i==3){
          partida[i].addPuntos(partida[i].points);
        }
        if(partida[i].ficha=="A"){
          userA = partida[i].user;
        }else if(partida[i].ficha=="B"){
          userB = partida[i].user;
        }else if(partida[i].ficha=="C"){ 
          userC = partida[i].user;
        }else if(partida[i].ficha=="D"){
          userD = partida[i].user;
        }
        partida[i].status=STATUS_WAITING;
      }
      var partidaStr="";
      var logFila="";
      var partidaTurno;
      for(var t=0;t<partida.juego.length;t++){
        partidaStr+=partida.juego[t];
        if(t<partida.juego.length-1){
          partidaStr+="-";
        }
        //console.log(Date()+" "+"turno "+turno)
      }

      var partidaModel = new app.models.Partida({ logPartida: partidaStr.toString(),
                                                  jugadorA:partida[0].user,
                                                  jugadorB:partida[1].user,
                                                  jugadorC:partida[2].user,
                                                  jugadorD:partida[3].user});
      partidaModel.save(function(err){console.log(Date()+" "+"error saving putio "+err)});
      console.log(Date()+" "+"se guardo")

      setTimeout(crearPartida,FREEZE_TIME);
    }else{
      setTimeout(jugarPartida,DURACION_TURNO);  
    }
  };

  var crearPartida = function(){
    if(playersConnected.length<4){
      console.log(Date()+" "+"otros 5s");
      setTimeout(crearPartida,5000);
      return undefined;
    }else{
      //iniciarPartida;
      //selecciona 4 jugadores siguiendo unas reglas
      console.log(Date()+" "+playersConnected.length);
      controller.generarMapa();
      partida = [];//almacena los jugadores asociandolos por el id
      partida.lista=[];//ids de jugadores en esta partida
      if(playersConnected.length>=4){
        partida.jugadores=4;
      }else{
        partida.jugadores= playersConnected.length;
      }
      partida.juego=[];
      playersConnected.sort(function(){
        return (Math.round(Math.random())-0.5); 
      });
      playersConnected.sort(function(a, b){
        return a.partidasJugadas-b.partidasJugadas
      });
      console.log(Date()+" "+"players connected "+playersConnected.length);
      for(var i =0; i<partida.jugadores;i++){
        partida[playersConnected[i].id]=playersConnected[i];
        partida.lista.push(playersConnected[i].id);
        controller.addPlayer(playersConnected[i]);
        app.models.User.update({_id:playersConnected[i].token},{partidasJugadas:playersConnected[i].partidasJugadas+1},{},function(err){console.log(Date()+" "+""+err);});
      }
      controller.iniciarPartida();
      turno=0;
      finalizoPartida=false;
      console.time('duracion partida');
      setTimeout(jugarPartida,DURACION_TURNO); 
    }
  };
  
  setTimeout(crearPartida,5000);

  server.listen(5000);
  console.log(Date()+" "+"bomberbot server launched");
};
