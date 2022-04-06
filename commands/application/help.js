const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Describes how to use the commands to retrieve frame data'),
  async execute(interaction) {
    const embed = new MessageEmbed()
          .setColor('#0x1a2c78')
          .setTitle('Need Help?')
          .setAuthor({ name: 'KOF XV FrameBot', iconURL: 'https://cdn.discordapp.com/app-icons/946480362245206028/7387b282160ebc16b18098635dd1682f.png', url: 'https://discord.gg/fPyTMgpR4X' })
          .addFields(
            { name: 'Getting started', value: 'The bot provides a "move per command" response where you get to ask for information from a certain move of a certain character individually per request. The bot uses autocomplete, and it will display the first 25 items within the autocomplete options. If you do not see the character or move you are expecting, continue typing to keep filtering the results to your needs. The bot has a **/frames** slash command which accept 2 arguments:', inline: false },
            { name: '\u200B', value: '\u200B' },
            { name: 'Character', value: 'The **character** which is a case insensitive string (e.g. vanessa, Chris, iori)', inline: false },
            { name: 'Move', value: 'The **move** which is a case insensitive string (e.g. 2a, close c, 236b)', inline: false },
            { name: '\u200B', value: '\u200B' },
            { name: 'Demo', value: 'The following is a visual representation of how the bot works:', inline: false },
          )
          .setImage('https://media.giphy.com/media/5g5IdYOiHc4RosbyBn/giphy.gif')
          .setFooter({ text: 'Got feedback? Join the bot server: https://discord.gg/fPyTMgpR4X', iconURL: 'https://cdn.iconscout.com/icon/free/png-128/discord-3-569463.png' });
        return interaction.reply({embeds: [embed]});
  },
};
