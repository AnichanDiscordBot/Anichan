import fs from 'node:fs';
import path from 'node:path';
import './deploy-cmd.js';
import config from './config.json' assert { type: 'json' };
const token  = config.token;

// Discord.js setup and commands loading...

import { Client, Collection, GatewayIntentBits } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds,
                                      GatewayIntentBits.GuildMessages,
 GatewayIntentBits.MessageContent] });

client.commands = new Collection();
( async () => {
const foldersPath = path.join(process.cwd(), 'commands/slash-cmds');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {

        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {

                const filePath = path.join(commandsPath, file);
                const command = await import(filePath);

                if ('data' in command && 'execute' in command) {
                        client.commands.set(command.data.name, command);

                } else {
                        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);

                }
        }
};

const eventsPath = path.join(process.cwd(), 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {

        const filePath = path.join(eventsPath, file);
        const event = await import(filePath);

        if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));

        } else {
                client.on(event.name, (...args) => event.execute(...args));
        }

};


const prefixCommandFolders = fs.readdirSync('./commands/prefix-cmds');

for (const folder of prefixCommandFolders) {
    const commandFiles = fs.readdirSync(`./commands/prefix-cmds/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = await import(`./commands/prefix-cmds/${folder}/${file}`);
      client.commands.set(command.name, command);
    }
};

})();

client.login(token);