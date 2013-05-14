// This file handles all that socket.io-related stuff.

var socket = io.connect(window.location.host);
var sent = {count: 0, packets: {}};
var recv = {count: 0, packets: {}};

socket.on('connected', function(data)
{
    $('.status').html('Awaiting input');
    var name = prompt('Welcome friend! What is your name?');

    // Usernames are optional, creeper
    if(name)
    {
        $('.status').html('Awaiting response');
        socket.emit('name', {name: name});
    }
});

socket.on('error', function(data)
{
    alert('You done messed up: \n'+data.message)
});

socket.on('count', function(data)
{
    if(data.count == 1)
        $('h1').html(data.count+' user connected');
    else
        $('h1').html(data.count+' users connected');
});

socket.on('users', function(users)
{
    $('.status').html('Connected');
    $('.users').html(users.list.join(' '));
});

socket.on('chat', function(chat)
{
    $('.chat').append("<div><b>"+chat.user+"</b>: "+chat.message+"</div>");
    setTimeout(function() { $('.chat').scrollTop($('.chat')[0].scrollHeight) }, 100);
});

socket.on('packet', function(packet)
{
    packet.data = packet.data.replace(/[\r\n ]/g, '');
    var header = packet.data.substr(4, 4);

    if(packet.source == 'client')
    {
        sent.count++;
        $('.count .sent').text(sent.count);

        // Emotes?
        if(header == '0111')
            console.log(packet);

        // Movement?
        if(header == '0154')
            console.log(packet);

        if(typeof sent.packets[header] === 'undefined')
            sent.packets[header] = {data: packet.data, count: 1};
        else
            sent.packets[header].count++;
    }
    else if(packet.source == 'server')
    {
        recv.count++;
        $('.count .recv').text(recv.count);

        //if(packet.host == '128.241.94.45')
        //    console.log(packet);                        

        // Emotes?
        if(header == '0115')
            console.log(packet);

        if(typeof recv.packets[header] === 'undefined')
            recv.packets[header] = {data: packet.data, count: 1};
        else
            recv.packets[header].count++;
    }
});
