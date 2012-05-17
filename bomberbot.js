net = require("net")

var validActions=['N','E','S','O','B','P','n','e','s','o','b','p'];

var server = net.createServer( function(socket){
        socket.write("welcome bomberbot server\n");
        socket.on("data", function(data){
            data = data.toString()[0];
            var ok =validActions.indexOf(data)!==-1?1:0;
            socket.write(ok+"\n");
            
            if (data==='Q' || data==='q'){
                socket.end("bye bye\n");
            }

        });
       
    }
);

server.listen(5000);
console.log("bomberbot server launched");


