import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path'
import config from './config.json' assert { type: 'json' };
const clientId = config.clientId;
const token = config.token;

const commands = [];

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
                        commands.push(command.data.toJSON());
                } else {
                        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
        }
};

// Construct and prepare an instance of the REST module

const rest = new REST().setToken(token);

        try {

            console.log(`Started refreshing ${commands.length} application (/) commands.`);              
            const data = await rest.put(
                       Routes.applicationCommands(clientId),
                        { body: commands },

             );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
})();