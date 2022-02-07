const listenChannels = {};

function subscribe(channel, fn) {
    if (!listenChannels[channel]) {
        listenChannels[channel] = []
    }
    console.log(`Subscribe to channel ${channel}`);
    listenChannels[channel].push(fn);
}

function publish(channel, message) {
    if (!listenChannels[channel]) { return; }

    for (const fn of listenChannels[channel]) {
        fn(message)
    }
}

function clientA(message) {
    console.log(`Received message: ${message} in client A`);
}

function clientB(message) {
    console.log(`Received message: ${message} in client B`);
}

subscribe('foo', clientA);
subscribe('foo', clientB);

publish('foo', 'My first message');



