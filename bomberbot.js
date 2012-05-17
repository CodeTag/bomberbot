var net = require("net");

var validActions=['N','E','S','O','B','P','n','e','s','o','b','p'];


var server = net.createServer( function(socket){
    socket.write("welcome bomberbot server - write your username to start playing\nUsername:");

    socket.on("data", function(data){
        
        socket.write(play(data)+"\n");
        
        if (data==='Q' || data==='q'){
            socket.end("bye bye\n");
        }

    });

    function play(data){
        data = data.toString()[0];
        var ok =validActions.indexOf(data)!==-1?1:0;
        return ok;
    }

    socket.on("connect", function(){
        console.log("New Client!"+this);
    });

    }
);

server.listen(5000);
console.log("bomberbot server launched");


