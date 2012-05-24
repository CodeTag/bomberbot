(function bomberbot(){
  "use strict"
  net = require("net");

  var validActions=['N\r\n','E\r\n','S\r\n','O\r\n','P\r\n','BN\r\n','BE\r\n','BS\r\n','BO\r\n'];
  var playersConnected =[];
  var ponerEnSalaEspera = function(socket){
    console.log("un nuevo player conectado");
  };
  var server = net.createServer( function(socket){
    socket.write("*****************************************\n"+
    "* Bienvenido al servidor de Bomberbot\n"+
    "* Para información del juego entrar a bomberbot.com\n"+
    "****************************************\n");
    playersConnected.push(socket);
    ponerEnSalaEspera(socket);
    socket.on("data", function(data){
      data = data.toString().toUpperCase();
      console.log(data);
      var ok =validActions.indexOf(data)!==-1?1:0;
      if(ok){
        socket.write("bingo\r\n");
        for(var i = 0; i<playersConnected.length; i++){
          if(socket!==playersConnected[i]){
            playersConnected[i].write("otro lo hizo\r\n");
          }
        }
      }
    });
  });

  server.listen(5000);
  console.log("bomberbot server launched");
})();