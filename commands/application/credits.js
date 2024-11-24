const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('credits')
    .setDescription('Provide a list of all who have contributed to this project'),
  async execute(interaction) {
    const embed = new MessageEmbed()
          .setColor('#0x1a2c78')
          .setTitle('Thank you, the user, for giving this bot the opportunity to serve you. And also...')
          .setAuthor({ name: 'Feel free to reach out if you want to help this become a better tool. For now, we want to say:', iconURL: 'https://cdn.discordapp.com/app-icons/946480362245206028/7387b282160ebc16b18098635dd1682f.png', url: 'https://discord.gg/fPyTMgpR4X' })
          .addFields(
          )
          .setFooter({ text: 'Got feedback? Join the bot server: https://discord.gg/fPyTMgpR4X', iconURL: 'https://cdn.iconscout.com/icon/free/png-128/discord-3-569463.png' });
    const contributors = {
      'Lantors/dens0ne': 'Developer',
      'LAW_XimGama': 'Developer',
      'Karla Rey': 'Designer',
      'Chase': 'Main data provider',
      'Amedo': 'Main data provider',
      'The Dream Cancel Wiki team': 'Data providers',
      'Shingo2K1': 'Data manager & Tester',
      'thefakesoji': 'Data manager & Tester',
      'LionHeartP': 'Data provider & Tester',
      'karn': 'Tester',
      'seadx6': 'Data provider',
      'Sebba': 'Data manager',
      'Reiki': 'Data provider',
    };
    for (const contributor in contributors) {
      const role = contributors[contributor];
       embed.addField(contributor, role, false);
    }

    return interaction.reply({embeds: [embed]});
  },
};
