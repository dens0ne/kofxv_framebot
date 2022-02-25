const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('frames')
    .setDescription('Add character name and move, to get a response with move data.')
    .addStringOption(option =>
  		option.setName('character')
  			.setDescription('The character name')
  			.setRequired(true)),
  async execute(interaction) {
    return interaction.reply('WIP!');
  },
};