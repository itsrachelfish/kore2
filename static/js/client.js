// This file handles all the UI javascript

$(document).ready(function()
{
    $('.chat').css('max-height', $('body').height() - 150);

    $(window).resize(function()
    {
        $('.chat').css('max-height', $('body').height() - 150);
        $('.chat').scrollTop($('.chat')[0].scrollHeight);
    });

    $('.input').keypress(function(event)
    {
        // When a user presses enter
        if(event.which == 13)
            $('.message').trigger('click');
    });

    // When a user submits a message
    $('.message').click(function()
    {
        var message = $('.input').val();
        var command = message.split(' ');

        if(command[0] == 'stats')
        {
            // Initialize 
            sent.sorted = [];
            recv.sorted = [];

            // Loop
            for(var header in sent.packets)
            {
                sent.sorted.push([header, sent.packets[header].count]);
            }

            for(var header in recv.packets)
            {
                recv.sorted.push([header, recv.packets[header].count]);
            }

            // Sort
            sent.sorted = sent.sorted.sort(function(a, b) {return a[1] - b[1]});
            recv.sorted = recv.sorted.sort(function(a, b) {return a[1] - b[1]});

            // Clear previous packet lists
            $('.packets .sent').html('');
            $('.packets .recv').html('');

            // Output sorted packet lists
            for(var i in sent.sorted)
            {
                console.log(sent.sorted);

                var header = sent.sorted[i][0];
                var data = sent.packets[header];

                console.log(header);
                console.log(data);
                $('.packets .sent').append("<div class='packet' title='"+data.data+"'>"+ header +" - "+data.count+"</div>");
            }

            for(var i in recv.sorted)
            {
                var header = recv.sorted[i][0];
                var data = recv.packets[header];

                console.log(header);
                console.log(data);

                $('.packets .recv').append("<div class='packet' title='"+data.data+"'>"+ header +" - "+data.count+"</div>");
            }
        }

        socket.emit('chat', {message: message});
        $('.input').val('');
    });

    function hex2a(hex)
    {
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }

    $('.packets').on('click', '.packet', function()
    {
        socket.emit('chat', {message: $(this).attr('title')});
        socket.emit('chat', {message: hex2a($(this).attr('title'))});
    });
});
