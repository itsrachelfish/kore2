kore2.js
========

A bot for Ragnarok Online 2 - Legend of The Second written with node.js


Dependencies
------------
    npm install express socket.io validator hexy


Iptables
--------

Until we manage to completely unravel RO2's packet structure this script simply acts as a proxy between the official client and server.
This proxy requires you have a router with iptables and a computer with two IP addresses, or simply two computers.

You'll likely want to run wireshark or another packet sniffing program on windows in case the IPs/Ports ever change, but for my friends playing on channel 14, the following commands should suffice:

    iptables -t nat -A PREROUTING -s (LAN IP Running Ragnarok) -d 128.241.94.34 -j DNAT --to-dest (LAN IP Running Kore)
    iptables -t nat -A PREROUTING -s (LAN IP Running Ragnarok) -d 128.241.94.35 -j DNAT --to-dest (LAN IP Running Kore)
    iptables -t nat -A PREROUTING -s (LAN IP Running Ragnarok) -d 128.241.94.45 -j DNAT --to-dest (LAN IP Running Kore)
    iptables -t nat -A PREROUTING -s (LAN IP Running Ragnarok) -d 128.241.94.53 -j DNAT --to-dest (LAN IP Running Kore)
    iptables -t nat -A PREROUTING -s (LAN IP Running Ragnarok) -d 128.241.94.54 -j DNAT --to-dest (LAN IP Running Kore)
    iptables -t nat -A POSTROUTING -s (LAN IP Running Ragnarok) -d (LAN IP Running Kore) -j SNAT --to-source (Router IP)

Alternatively, on a Windows host running the game client run this AFTER the game has luanched:

    route add 128.241.94.0 mask 255.255.255.0 (LAN IP Running Kore)

remove to re-launch:

    route delete 128.241.94.0 mask 255.255.255.0

Proxy
-----

Once you've got all that set up, run this script and connect to it through your web browser! By default it runs on port 1024. Type the following lines and you'll be ready to RAG IT UP!!

    proxy 128.241.94.35 7101
    proxy 128.241.94.45 7203
    proxy 128.241.94.53 7401
    proxy 128.241.94.54 7402
    proxy 128.241.94.54 7403
