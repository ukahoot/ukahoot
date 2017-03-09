class KahootSocket {
    static getReady() {
        return new Promise((resolve, reject) => {
            var check = setInterval(() => {
                if (clientsConnected >= window.clients) {
                    clearInterval(check);
                    resolve();
                }
            }, 100);
        });
    }
    static send(msg) {
        for (var i = 0; i < window.sockets.length; ++i) {
            try {
                sockets[i].send(msg);
            } catch (e) {
                console.debug("socket" + i + " encountered send exception:");
                console.error(e);  
            }
        }
    }
    static sendAns(key) {
        for (var i = 0; i < window.sockets.length; ++i) {
            try {
                var msg = Packet.getAnswer(key, window.pid, window.sockets[i].cid, window.sockets[i].msgCount);
                window.sockets[i].msgCount++;
                msg[0].clientId = window.sockets[i].cid;
                window.sockets[i].ws.send(JSON.stringify(msg));
            } catch (e) {
                console.debug("socket" + i + " encountered a send exception:");
                console.error(e);
            }
        }
    }
    onopen() {
        console.debug('socket opened, sending handshake');
        clientsConnected += 1;
        // Sync the packet time
        Packet.HANDSHAKE[0].ext.timesync.tc = (new Date()).getTime();
        // send the handshake
        this.send(JSON.stringify(Packet.HANDSHAKE));
    }
    onclose() { }
    onmessage(msg, me) {
        var packet = new Packet(msg.data, me);
        // Handle packets
        if (packet.obj.channel == "/meta/handshake" && packet.obj.clientId) {
            console.debug('recieved handshake');
            Packet.Handler["handshake"].handle(packet);
        } else if (packet.obj.channel == "/meta/subscribe" && packet.obj.subscription == "/service/controller" && packet.obj.successful == true) {
            // console.debug('recieved subscribe success packet');
            Packet.Handler["subscribe"].handle(packet);
        } else if (packet.obj.data && packet.obj.data.error) {
            console.debug("recieved error packet", packet.obj.data);
            showAlert("An error has occured:\n" + packet.obj.data.description + ". \nPlease refresh the page.");
        } else if (packet.obj.data && packet.obj.data.content) {
            var content = JSON.parse(packet.obj.data.content);
            if (Packet.Handler[packet.obj.data.id]) {
                Packet.Handler[packet.obj.data.id].handle(new Packet(content, me));
            } else console.warn('Recieved packet with unknown ID:', packet.obj);
        }
        // Control keep alive packets
        if (packet.obj.ext && packet.obj.channel != "/meta/subscribe" && packet.obj.channel != "/meta/handshake") {
            // console.debug('recieved keepalive packet');
            Packet.Handler['keepalive'].handle(packet);
        }
    }
    constructor(ip, isMaster, id) {
        var me = this;
        this.id = id;
        console.debug('Constructed client ' + sockets.length);
        this.ws = new window.WebSocket(ip);
        // The client ID given by the server
        this.cid = null;
        // The master socket will control all the website's events
        if (isMaster) this.isMaster = true;
        else this.isMaster = false;
        this.ws.onopen = this.onopen;
        this.ws.onclose = this.onclose;
        this.ws.onmessage = msg => {
            me.onmessage(msg, me);
        }
        this.msgCount = 0;
    }
    send(packet) {
        var msg = packet.str();
        this.msgCount++;
        try {
            this.ws.send(msg);
        } catch (e) {
            console.debug("socket" + i + " encountered send exception:");
            console.error(e);
        }
    }
}