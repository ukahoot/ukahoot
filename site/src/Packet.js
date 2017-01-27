class Packet {
    constructor(rawString, client) {
        this.outgoing = true;
        this.raw = null;
        this.obj = [{}];
        if (client) this.client = client;
        else this.client = null;
        if (rawString) {
            this.outgoing = false;
            this.raw = rawString;
            this.obj = JSON.parse(rawString)[0];
        }
    }
    timesync(packet2) {
        if (typeof packet2 == "string") packet2 = JSON.parse(packet2);
        var that = this;
        this.obj[0].channel = packet2.channel;
        this.obj[0].ext = {
            ack: packet2.ext.ack,
            timesync: {
                l: ((new Date).getTime() - packet2.ext.timesync.tc - packet2.ext.timesync.p) / 2,
                o: (packet2.ext.timesync.ts - packet2.ext.timesync.tc - 1),
                tc: (new Date()).getTime()
            }
        }
        this.raw = JSON.stringify(that.obj);
    }
    str() {
        var that = this;
        this.raw = JSON.stringify(that.obj[0]);
        return this.raw;
    }
}
Packet.HANDSHAKE = [{
    advice: {
        interval: 0,
        timeout: 60000
    },
    channel: '/meta/handshake',
    ext: {
        ack: true,
        timesync: {
            l: 0,
            o: 0,
            tc: (new Date).getTime()
        },
        id: "1",
        minimumVersion: "1.0",
        supportedConnectionTypes: [
            "websocket",
            "long-polling"
        ],
        version: "1.0"
    }
}];