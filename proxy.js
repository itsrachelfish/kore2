var net = require("net");
var hexy = require("hexy");

function startProxy(serviceSocket, serviceHost, servicePort, io)
{
    // We don't need to proxy to other ports...
    var proxyPort = servicePort;

    net.createServer(function (proxySocket)
    {
        var connected = false;
        var buffers = new Array();
        serviceSocket.connect(parseInt(servicePort), serviceHost, function()
        {
            connected = true;
            if (buffers.length > 0) 
            {
                for (i = 0; i < buffers.length; i++) 
                {
                    console.log(buffers[i]);
                    serviceSocket.write(buffers[i]);
                }
            }
        });
        
        proxySocket.on("error", function (e)
        {
            serviceSocket.end();
        });
        
        serviceSocket.on("error", function (e)
        {
            console.log("Could not connect to service at host "
            + serviceHost + ', port ' + servicePort);
            proxySocket.end();
        });
        
        proxySocket.on("data", function (data)
        {
            if(connected)
            {
                var prettyHex = hexy.hexy(data);
                var plainHex = hexy.hexy(data, {numbering: 'none', format: 'none', annotate: 'none'});

                console.log('Client sent: \n' + prettyHex);
                io.sockets.emit('packet', {source: 'client', data: plainHex});

                serviceSocket.write(data);
            } 
            else
            {
                buffers[buffers.length] = data;
            }
        });

        serviceSocket.on("data", function(data)
        {
            var prettyHex = hexy.hexy(data);
            var plainHex = hexy.hexy(data, {numbering: 'none', format: 'none', annotate: 'none'});

            console.log('Server sent: \n' + prettyHex);
            io.sockets.emit('packet', {source: 'server', host: serviceHost, port: servicePort, data: plainHex});
            
            proxySocket.write(data);
        });

        proxySocket.on("close", function(had_error)
        {
            serviceSocket.end();
        });
       
        serviceSocket.on("close", function(had_error)
        {
            proxySocket.end();
        });
    }).listen(proxyPort)
}

exports.startProxy = startProxy;
