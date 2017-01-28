class PacketHandler {
    constructor(id, handler) {
        // The handler is the function called when a packet is recieved
        this.handler = handler;
        this.id = id;
    }
    handle(packet) {
        this.currentPacket = packet;
        return this.handler.call(this, packet);
    }
}

Packet.Handler = {
    "handshake": new PacketHandler("handshake", packet => {
        // Store the client ID the server gave 
        packet.client.cid = packet.obj.clientId;
        // Handshake accepted, send back a subscription packet
        var handsh = new Packet(null, packet.client);
        handsh.timesync(packet.obj);
        // Handshake response doesn't want the ACK extension
        handsh.obj[0].ext.ack = undefined;
        handsh.obj[0].channel = "/meta/subscribe";
        handsh.obj[0].clientId = packet.client.cid;
        // subscribe to the controller channel
        handsh.obj[0].subscription = "/service/controller";
        handsh.obj[0].id = packet.client.msgCount + "";
        packet.client.send(handsh);
    }),
    "subscribe": new PacketHandler("subscribe", packet => {
        // Send info about the client to the server
        var p = new Packet(null, packet.client);
        p.timesync(packet.obj);
        // subscribe to a new channel
        p.obj[0].channel = "/meta/subscribe";
        p.obj[0].clientId = packet.client.cid;
        p.obj[0].subscription = "/service/player";
        packet.client.send(p);
        // send another packet containing connection info
        var p2 = new Packet(null, packet.client);
        p2.timesync(packet.obj);
        p2.obj[0].channel = "/meta/connect";
        p2.obj[0].clientId = packet.client.cid;
        p2.obj[0].connectionType = "websocket";
        p2.obj[0].advice = {
            timeout: 0
        };
        packet.client.send(p2);
        // send another packet to subscribe to the status channel
        var p3 = new Packet(null, packet.client);
        p3.timesync(packet.obj);
        p3.obj[0].channel = "/meta/subscribe";
        p3.obj[0].clientId = packet.client.cid;
        p3.obj[0].subscription = "/service/status";
        packet.client.send(p3);
        // Send a "login" packet to join the game
        var login = [{
            channel: "/service/controller",
            clientId: packet.client.cid,
            data: {
                gameid: window.pid,
                host: 'kahoot.it',
                name: window.name + packet.client.id,
                type: "login"
            },
            id: packet.client.msgCount+""
        }];
        var loginPacket = new Packet(login, packet.client);
        packet.client.send(loginPacket);
    }),
    "keepalive": new PacketHandler('keepalive', packet => {
        var keepalive = new Packet();
        keepalive.timesync(packet.obj);
        keepalive.obj[0].clientId = packet.client.cid;
        keepalive.obj[0].id = packet.client.msgCount+"";
        packet.client.send(keepalive);
    }),
    9: new PacketHandler(9, packet => {
        // Ignore non master messages
        if (packet.client.isMaster) {
            // This packet indicates that the quiz is starting
            // TODO: handle quiz starting
        }
    })
};