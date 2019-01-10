const Channel = require('../lib/Channel');

module.exports = ({ socket, instance, name, subscribe }) => {
	for(const channel of await Channel.find(instance)) {
		socket.emit('channel', channel);
	}

	socket.on('channel', async name => {
		const channel = new Channel(instance, name);
		await channel.save();
	});

	subscribe(`${instance}:channel`, async id => {
		socket.emit('channel', await Channel.get(instance, id));
	});
};
