const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { MessageEmbedVideo } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('frames')
    .setDescription('Add character name and move, to get a response with all available move data.')
    .addStringOption(character =>
  		character.setName('character')
  			.setDescription('The character name (e.g. Ash, Iori, K).')
  			.setRequired(true))
    .addStringOption(move =>
  		move.setName('move')
  			.setDescription('The move input (e.g. 2C, 236A, close B).')
  			.setRequired(true)),
  async execute(interaction) {
    const char = interaction.options.getString('character');
    const move = interaction.options.getString('move');
    // Load frame data json.
    fs.readFile("./assets/framedata.json", "utf8", (err, jsonObject) => {
      if (err) {
        // console.log("Error reading file from disk:", err);
        return interaction.reply('Could not load frame data file. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1uPQlyMB8pJhCILH0BYZNhJAO2cNq0aEZt_ifYQ6-uiI) for the data.');
      }
      try {
        let data = JSON.parse(jsonObject);
        // Capitilize first letter of character name.
        let character = char.charAt(0).toUpperCase() + char.slice(1);
        // Temp: validate king of dinosaurs weird name.
        if (character === 'King of dinosaurs' ||
            character === 'Kod' ||
            character === 'King of Dinosaurs' ||
            character === 'Dinosaur') {
          character = 'KODino'
            }
        // If character not found, exit.
        if (data.hasOwnProperty(character) === false) {
          return interaction.reply('Could not find specified character: ' + character + '. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1uPQlyMB8pJhCILH0BYZNhJAO2cNq0aEZt_ifYQ6-uiI) for available characters.');
        }
        // Trim extra whitespaces from move.
        let parsedMove = move.trim();
        let singleButton = false
        // Check if single button passed.
        if (parsedMove.match(/^[+\-aAbBcCdD() .]+$/g)) {
          singleButton = true
          // Preppend "far" to return valid value.
          parsedMove = 'far ' + parsedMove
        }
        // Convert dots into whitespaces.
        parsedMove = parsedMove.replace('.', ' ')
        // Trim whitespaces and add caps, turning "236 a" into "236A".
        if (parsedMove.match(/^[\d+ $+\-aAbBcCdD().]+$/g) ) {
          parsedMove = parsedMove.toUpperCase()
          parsedMove = parsedMove.replace(' ', '')
          console.log("Is this still useful? " + parsedMove)
        }
        let escapedMoves = ''
        const moveArray = parsedMove.split(" ")
        moveArray.forEach((element) => {
          // Turn ABCD to uppercase if they are not.
          if (element.match(/^[+\-aAbBcCdD() .]+$/g) ) {
            element = element.toUpperCase()
          }
          escapedMoves += element + ' ';
        });
        escapedMoves = escapedMoves.trimEnd();
        // If move not found, exit.
        if (data[character].hasOwnProperty(escapedMoves) === false) {
          return interaction.reply('Could not find specified move: ' + move + '. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1uPQlyMB8pJhCILH0BYZNhJAO2cNq0aEZt_ifYQ6-uiI) for available data.');
        }
        let moveData = data[character][escapedMoves];
        const startup = (moveData['START UP'] !== null) ? moveData['START UP'].toString() : 'N/A';
        const oh = (moveData.HIT !== null) ? moveData.HIT.toString() : 'N/A';
        const ob = (moveData.BLOCK !== null) ? moveData.BLOCK.toString() : 'N/A';
        const notes = (moveData.NOTES !== null) ? moveData.NOTES.toString() : 'No notes found.';
        // Get lowercase trimmed character name for official site url.
        let lowerCaseChar = character.toLowerCase();
        lowerCaseChar = lowerCaseChar.split(/\s+/).join('');
        // Get character number for thumbnail.
        const charNo = this.getCharacterNumber(character);
        // console.log(charNo);
        const embed = new MessageEmbed()
          .setColor('#0x1a2c78')
          .setTitle(character)
          .setURL('https://www.snk-corp.co.jp/us/games/kof-xv/characters/characters_' + lowerCaseChar + '.php')
          .setAuthor({ name: escapedMoves, iconURL: 'https://pbs.twimg.com/profile_images/1150082025673625600/m1VyNZtc_400x400.png', url: 'https://docs.google.com/spreadsheets/d/1uPQlyMB8pJhCILH0BYZNhJAO2cNq0aEZt_ifYQ6-uiI' })
          // .setDescription('Move input')
          .setThumbnail('https://www.snk-corp.co.jp/us/games/kof-xv/img/main/top_slider' + charNo + '.png')
          .addFields(
            { name: 'Startup', value: startup, inline: true },
            { name: 'On hit', value: oh, inline: true },
            { name: 'On block', value: ob, inline: true },
            // { name: '\u200B', value: '\u200B' },
            { name: 'Notes', value: notes },
            // { name: 'Inline field title', value: 'Some value here', inline: true },
          );
          (moveData.GIF !== null) ? embed.setImage(moveData.GIF) : embed.addField('No GIF was found for this move', 'Feel free to share a Giphy hosted GIF with the [developers](https://github.com/dens0ne/kofxv_framebot/issues) if you have one.', true);
        return interaction.reply({embeds: [embed]});
      } catch (err) {
        console.log("Error parsing JSON string:", err);
        return interaction.reply('There was an error while processing your request, if the problem persists, contact the bot developers. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1uPQlyMB8pJhCILH0BYZNhJAO2cNq0aEZt_ifYQ6-uiI) to look for the data.');
      }
    });
  },
  getCharacterNumber: function(character) {
    const charOrder = {
      'Shunei': '01',
      'Meitenkun': '02',
      'Benimaru': '03',
      'Iori': '04',
      'Joe': '05',
      'Kyo': '06',
      'Chizuru': '07',
      'Andy': '08',
      'Yuri': '09',
      'Terry': '10',
      'Yashiro': '11',
      'King': '12',
      'Mai': '13',
      'Shermie': '14',
      'Chris': '15',
      'Ryo': '16',
      'Robert': '17',
      'Leona': '18',
      'Ralf': '19',
      'Clark': '20',
      'Blue Mary': '21',
      'Luong': '22',
      'Vanessa': '23',
      'Ramon': '24',
      'KODino': '25',
      'Athena': '26',
      'Antonov': '27',
      'Ash': '28',
      'Kukri': '29',
      'Isla': '30',
      'K': '31',
      'Heidern': '32',
      'Dolores': '33',
      'Whip': '34',
      'Angel': '35',
      'Krohnen': '36',
      'Maxima': '37',
      'Kula': '38',
      'Elizabeth': '39'
    };
    return charOrder[character];
  }
};