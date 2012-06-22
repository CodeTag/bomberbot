var sys = require('util')

var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }
exec("git clone https://github.com/CodeTag/bomberbot.git", puts);

function clone(error, stdout, stderr){
    
}
