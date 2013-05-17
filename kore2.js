var express     = require('express')
  , app         = require('express')()
  , server      = require('http').createServer(app)
  , io          = require('socket.io').listen(server)
  , check       = require('validator').check
  , sanitize    = require('validator').sanitize
  , proxy       = require('./proxy')
  , engine 		= require('./engine')
  , net         = require("net")
  , count       = 0
  , users       = []
  , serverSocket    = {}
  , clientSocket    = {};


function isset(variable)
{
    if(typeof variable != "undefined")
        return true;
    else
        return false;
}

io.set('log level', 1);

server.listen(1024);

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res)
{
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket)
{
    var user = {};
    
    socket.emit('connected');
    
    count++;
    io.sockets.emit('count', {count: count});

	bot = engine.createEngine(io)
    socket.on('name', function(data)
    {
        var success = true;
        
        try
        {
            check(data.name).len(1, 16).isAlphanumeric();
        }
        catch(e)
        {
            success = false;
            socket.emit('error', {message: 'Your name must be alphanumeric and no longer than 16 characters!'});
            socket.emit('connected');
        }
        
        if(success)
        {
            user.name = data.name;
            users.push(data.name);
            
            io.sockets.emit('users', {list: users});
        }
    });
    
    socket.on('chat', function(chat)
    {
        // Can't chat if you don't have a name!
        if(isset(chat.message) && chat.message
            && isset(user.name) && user.name)
        {
            var message = sanitize(chat.message).entityEncode();
            var command = message.split(' ');

            // First let's tell everyone what we did
            io.sockets.emit('chat', {user: user.name, message: message});
            
			var action = bot[command[0]];
			if(typeof(action) == "function")
			{
				console.log("Calling: " + command[0]);
				action(command.slice(1));
			} else {
				io.sockets.emit('chat', {user: 'system', message: "Command " + command[0] + " not found"});
			}
        }
    });

    socket.on('disconnect', function()
    {
        count--;
        
        // Remove user name from user list if they gave us one
        if(isset(user.name))
        {
            var index = users.indexOf(user.name);
            
            if(index != -1)
                users.splice(index, 1);
        }
        
        io.sockets.emit('count', {count: count});
        io.sockets.emit('users', {list: users});
    });
});
