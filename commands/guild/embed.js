const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { MessageEmbedVideo } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Add character name and move, to get a response with all available move data.')
    .addStringOption(character =>
  		character.setName('character')
  			.setDescription('The character name')
  			.setRequired(true))
    .addStringOption(move =>
  		move.setName('move')
  			.setDescription('The move input')
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
            character === 'King of Dinosaurs') {
          character = 'KODino'
            }
        // If character not found, exit.
        if (data.hasOwnProperty(character) === false) {
          return interaction.reply('Could not find specified character: ' + character + '. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1uPQlyMB8pJhCILH0BYZNhJAO2cNq0aEZt_ifYQ6-uiI) for available characters.');
        }
        // Trim extra whitespaces from move.
        let parsedMove = move.trim();
        // parsedMove = parsedMove.trimStart();
        let singleButton = false
        // Check if single button passed.
        if (parsedMove.match(/^[+\-aAbBcCdD() .]+$/g)) {
          singleButton = true
          // Preppend "close" to return valid value.
          parsedMove = 'close ' + parsedMove
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
        console.log(escapedMoves)
        // If move not found, exit.
        if (data[character].hasOwnProperty(escapedMoves) === false) {
          return interaction.reply('Could not find specified move: ' + move + '. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1uPQlyMB8pJhCILH0BYZNhJAO2cNq0aEZt_ifYQ6-uiI) for available data.');
        }
        let moveData = data[character][escapedMoves];
        // const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

        // interaction.messages.create({
        //   "channel_id": `${context.params.event.channel_id}`,
        //   "content": "",
        //   "tts": false,
        //   "embeds": [
        //     {
        //       "type": "rich",
        //       "title": `Iori`,
        //       "description": `Move name `,
        //       "color": 0x1a2c78,
        //       "fields": [
        //         {
        //           "name": `Startup`,
        //           "value": `0`,
        //           "inline": true
        //         },
        //         {
        //           "name": `On hit`,
        //           "value": `0`,
        //           "inline": true
        //         },
        //         {
        //           "name": `On block`,
        //           "value": `0`,
        //           "inline": true
        //         },
        //         {
        //           "name": `Notes`,
        //           "value": `N/A`
        //         }
        //       ],
        //       "image": {
        //         "url": `https://c.tenor.com/dzkvPAgIwfoAAAAC/kof-xv.gif`,
        //         "height": 0,
        //         "width": 0
        //       },
        //       "thumbnail": {
        //         "url": `https://www.snk-corp.co.jp/us/games/kof-xv/img/main/top_slider04.png`,
        //         "height": 0,
        //         "width": 0
        //       }
        //     }
        //   ]
        // });
        const startup = (moveData['START UP'] !== null) ? moveData['START UP'].toString() : 'N/A';
        const oh = (moveData.HIT !== null) ? moveData.HIT.toString() : 'N/A';
        const ob = (moveData.BLOCK !== null) ? moveData.BLOCK.toString() : 'N/A';
        const notes = (moveData.NOTES !== null) ? moveData.NOTES.toString() : 'No notes found.';
        let lowerCaseChar = character.toLowerCase();
        lowerCaseChar = lowerCaseChar.split(/\s+/).join('');
        // Get character number for thumbnail.
        const charNo = this.getCharacterNumber(character);
        console.log(charNo);
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
          (moveData.GIF !== null) ? embed.setImage(moveData.GIF) : embed.addField('No GIF was found for this move', 'Feel free to share a Giphy hosted one with the developers.', true);
          // .addField('Inline field title', 'Some value here', true)
          // .setImage(moveGif[character][escapedMoves]);
          // .setVideo({ url: 'https://www.youtube.com/watch?v=_o7Ip64-Sio' });
        
        // let moveData = data[character][escapedMoves];
        //   response = character + ' - ' + '(' + escapedMoves + ') - ';
        //   response += (moveData["START UP"] !== null) ? '[Startup]: ' + moveData["START UP"] + ' ' : '';
        //   response += (moveData.BLOCK !== null) ? '[on Block]: ' + moveData.BLOCK + ' ' : '';
        //   response += (moveData.HIT !== null) ? '[on Hit]: ' + moveData.HIT + ' ' : '';
        //   response += (moveData.NOTES !== null) ? '[Notes]: ' + moveData.NOTES + ' ' : '';
        //   response += (singleButton) ? '\n*Note: By default, for single buttons we return the "close button" value. For better results, try preppending a button with "close" or "far" (e.g. close A or far D).*' : '';
        //   // console.log(moveData.BLOCK)
          // const channel = interaction.channels.get(row.serverlog)
          // channel.send({ embeds: [exampleEmbed] });
          // return interaction.send({ embeds: [exampleEmbed] });
        return interaction.reply({embeds: [embed]});
          // return interaction.reply(response);
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