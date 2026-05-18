const { Client, GatewayIntentBits } = require('discord.js');
const dgram = require('dgram');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

const HOST = '51.38.218.165';
const PORT = 7700;
const RCON_PASSWORD = '123';

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!ban ')) {
        const args = message.content.split(' ');
        const playerID = args[1];
        // Uzimamo sve ostalo kao razlog, ako nije uneto, stavljamo "DiscordBot"
        const reason = args.slice(2).join(' ') || "DiscordBot";
        
        if (!playerID) return message.reply("Moras uneti ID igraca! Primer: !ban 2 Razlog");
        if (isNaN(playerID)) return message.reply("ID mora biti broj!");

        const client_socket = dgram.createSocket('udp4');
        
        // Sada saljemo "ban 2 DiscordBot" - to tvoj sscanf mora da prihvati!
        const command = `ban ${playerID} ${reason}`;
        
        const packet = Buffer.concat([
            Buffer.from('SAMP'),
            Buffer.from(HOST.split('.').map(Number)),
            Buffer.from([PORT & 0xFF, (PORT >> 8) & 0xFF]),
            Buffer.from('x'),
            Buffer.from([RCON_PASSWORD.length & 0xFF, (RCON_PASSWORD.length >> 8) & 0xFF]),
            Buffer.from(RCON_PASSWORD),
            Buffer.from([command.length & 0xFF, (command.length >> 8) & 0xFF]),
            Buffer.from(command)
        ]);

        client_socket.send(packet, 0, packet.length, PORT, HOST);
        client_socket.close();
        
        message.reply(`Poslata RCON komanda: Banovanje ID ${playerID}, Razlog: ${reason}`);
    }
});

client.login(process.env.DISCORD_TOKEN);
