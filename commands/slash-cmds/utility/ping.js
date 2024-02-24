const { SlashCommandBuilder } = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

async function execute(interaction) {
  await interaction.reply("Pong!");
}

module.exports = {
  data,
  execute,
};
