const { Client, GatewayIntentBits } = require('discord.js');
const Rcon = require('samp-rcon');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

const config = {
    host: '51.38.218.165',
    port: 7777,
    password: '123'
};

client.on('messageCreate', (message) => {
    // Sprečavamo bota da odgovara sam sebi
    if (message.author.bot) return;

    if (message.content.startsWith('!ban ')) {
        const playerName = message.content.split(' ')[1];
        
        if (!playerName) {
            return message.reply("Moraš uneti ime igrača! Primer: !ban Ime_Prezime");
        }

        const rcon = new Rcon(config);
        
        rcon.execute(`ban ${playerName}`, (err, res) => {
            if (err) {
                console.error("RCON Error:", err);
                message.reply("Greška pri povezivanju sa serverom. Proveri RCON šifru!");
            } else {
                message.reply(`Komanda za banovanje je poslata za: ${playerName}`);
            }
        });
    }
});

client.login(process.env.DISCORD_TOKEN);