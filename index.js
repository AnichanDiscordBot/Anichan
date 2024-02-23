const fs = require("node:fs");
const dotenv = require("dotenv");

const path = require("node:path");
require("./deploy-cmd.js");
const { Client, Collection, GatewayIntentBits } = require("discord.js");

dotenv.config();

const token = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands/slash-cmds");

const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);

  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);

    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const eventsPath = path.join(__dirname, "events");

const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);

  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

//const fs = require('fs');
//client.commands = new Discord.Collection();

const prefixCommandFolders = fs.readdirSync("./commands/prefix-cmds");

for (const folder of prefixCommandFolders) {
  //console.log("@")
  const commandFiles = fs
    .readdirSync(`./commands/prefix-cmds/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/prefix-cmds/${folder}/${file}`);
    client.commands.set(command.name, command);
    //console.log(command)
  }
}

client.login(token);
