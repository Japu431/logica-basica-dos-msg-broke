const net = require('net');
const path = require('path');

const socketPath = path.resolve(__dirname, 'my-first-ipc');

const server = net.createServer().listen(socketPath, () => {
    console.log(`Pub sub server initialized`)
})

const listenChannels = {};

function subscribe(channel, socket) {
    if (!listenChannels[channel]) {
        listenChannels[channel] = []
    }
    console.log(`Subscribe to channel ${channel}`);
    listenChannels[channel].push(socket);
}

function publish(channel, message) {
    if (!listenChannels[channel]) { return; }

    for (const socket of listenChannels[channel]) {
        socket.write(message)
    }
}

const regexes = {
    sub: /^sub_(.*)$/,
    pub: /^pub_(.*)_(.*)$/
}

server.on('connection', (socket) => {
    console.log(`a new socket were connected`);

    socket.on('data', (data) => {

        const msg = data.toString();
        const matchSub = msg.match(regexes.sub);

        if (matchSub && matchSub[1]) {
            const channel = matchSub[1];
            subscribe(channel, socket);
            return;
        }

        const matchPub = msg.match(regexes.pub);

        if (matchPub && matchPub[1]) {
            const channel = matchPub[1];
            const message = matchPub[2];
            publish(channel, message);

            return;
        }
        console.error(new Error(`Unknown command ${msg}`));
    })

})