const { Client, GatewayIntentBits } = require('discord.js');
const dgram = require('dgram');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const HOST = '51.38.218.165';
const PORT = 7777;
const RCON_PASSWORD = '123';

function sendRcon(command) {
    const client_socket = dgram.createSocket('udp4');
    // SA-MP RCON protokol zaglavlje
    const packet = Buffer.concat([
        Buffer.from('SAMP'),
        Buffer.from(HOST.split('.').map(Number)),
        Buffer.from([PORT & 0xFF, (PORT >> 8) & 0xFF]),
        Buffer.from('x'), // RCON komanda
        Buffer.from([RCON_PASSWORD.length & 0xFF, (RCON_PASSWORD.length >> 8) & 0xFF]),
        Buffer.from(RCON_PASSWORD),
        Buffer.from([command.length & 0xFF, (command.length >> 8) & 0xFF]),
        Buffer.from(command)
    ]);

    client_socket.send(packet, 0, packet.length, PORT, HOST);
    client_socket.close();
}

client.on('messageCreate', (message) => {
    if (message.content.startsWith('!ban ')) {
        const playerName = message.content.split(' ')[1];
        sendRcon(`ban ${playerName}`);
        message.reply(`Poslata komanda za banovanje igrača: ${playerName}`);
    }
});
client.login(process.env.DISCORD_TOKEN);