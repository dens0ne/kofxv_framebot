const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calc')
    .setDescription('Calculate if a  move is punishable, and return all moves that can punish it.')
    .addStringOption(attacking_character =>
  		attacking_character.setName('attacking_character')
        .setAutocomplete(true)
  			.setDescription('The attacking character name (e.g. Ash, Iori, K)')
  			.setRequired(true))
    .addStringOption(attacking_move_1 =>
  		attacking_move_1.setName('attacking_move_1')
        .setAutocomplete(true)
  			.setDescription('The first move input (e.g. 2C, 236A, close B)')
  			.setRequired(true))
    .addStringOption(attacking_move_2 =>
  		attacking_move_2.setName('attacking_move_2')
        .setAutocomplete(true)
  			.setDescription('The follow-up move input (e.g. 2C, 236A, close B)')
  			.setRequired(true))
    .addStringOption(defending_character =>
  		defending_character.setName('defending_character')
        .setAutocomplete(true)
  			.setDescription('The defending character name (e.g. Ash, Iori, K)')
  			.setRequired(true)),
  async execute(interaction) {
    const attacking_character = interaction.options.getString('attacking_character');
    const defending_character = interaction.options.getString('defending_character');
    const attacking_move_1 = interaction.options.getString('attacking_move_1');
    const attacking_move_2 = interaction.options.getString('attacking_move_2');
    // Load frame data json.
    fs.readFile("./assets/framedata.json", "utf8", (err, jsonObject) => {
      if (err) {
        // console.log("Error reading file from disk:", err);
        return interaction.reply('Could not load frame data file. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1uPQlyMB8pJhCILH0BYZNhJAO2cNq0aEZt_ifYQ6-uiI) for the data.');
      }
      try {
        let data = JSON.parse(jsonObject);
        // Capitilize first letter of character name.
        let character1 = attacking_character.charAt(0).toUpperCase() + attacking_character.slice(1);
        let character2 = defending_character.charAt(0).toUpperCase() + defending_character.slice(1);
        // Temp: validate king of dinosaurs weird name.
        // if (character === 'King of dinosaurs' ||
        //     character === 'Kod' ||
        //     character === 'King of Dinosaurs' ||
        //     character === 'Dinosaur') {
        //   character = 'KODino'
        //     }
        // If character not found, exit.
        if (data.hasOwnProperty(character1) === false) {
          return interaction.reply('Could not find attacking character: ' + character1 + '. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1uPQlyMB8pJhCILH0BYZNhJAO2cNq0aEZt_ifYQ6-uiI) for available characters.');
        }
        if (data.hasOwnProperty(character2) === false) {
          return interaction.reply('Could not find defending character: ' + character2 + '. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1uPQlyMB8pJhCILH0BYZNhJAO2cNq0aEZt_ifYQ6-uiI) for available characters.');
        }
        
        // Move 1.
        let parsedMove1 = attacking_move_1.trim();
        let singleButton = false
        // Check if single button passed.
        if (parsedMove1.match(/^[+\-aAbBcCdD() .]+$/g)) {
          singleButton = true
          // console.log(parsedMove)
          // Preppend "far" to return valid value.
          parsedMove1 = (parsedMove1 === 'cd' || parsedMove1 === 'CD') ? parsedMove1 : 'far ' + parsedMove1;
        }
        // console.log(parsedMove)
        // Convert dots into whitespaces.
        parsedMove1 = parsedMove1.replace('.', ' ')
        // Trim whitespaces and add caps, turning "236 a" into "236A".
        if (parsedMove1.match(/^[\d+ $+\-aAbBcCdD().]+$/g) ) {
          parsedMove1 = parsedMove1.toUpperCase()
          parsedMove1 = parsedMove1.replace(' ', '')
          // console.log("Is this still useful? " + parsedMove)
        }
        let move1 = ''
        let moveArray = parsedMove1.split(" ")
        moveArray.forEach((element) => {
          // Turn ABCD to uppercase if they are not.
          if (element.match(/^[+\-aAbBcCdD() .]+$/g) ) {
            element = element.toUpperCase()
          }
          move1 += element + ' ';
        });
        move1 = move1.trimEnd();
        
        // Move 2.
        let parsedMove2 = attacking_move_2.trim();
        singleButton = false
        // Check if single button passed.
        if (parsedMove2.match(/^[+\-aAbBcCdD() .]+$/g)) {
          singleButton = true
          // Preppend "far" to return valid value.
          parsedMove2 = (parsedMove2 === 'cd' || parsedMove2 === 'CD') ? parsedMove2 : 'far ' + parsedMove2;
        }
        // Convert dots into whitespaces.
        parsedMove2 = parsedMove2.replace('.', ' ')
        // Trim whitespaces and add caps, turning "236 a" into "236A".
        if (parsedMove2.match(/^[\d+ $+\-aAbBcCdD().]+$/g) ) {
          parsedMove2 = parsedMove2.toUpperCase()
          parsedMove2 = parsedMove2.replace(' ', '')
          // console.log("Is this still useful? " + parsedMove)
        }
        let move2 = ''
        moveArray = parsedMove2.split(" ")
        moveArray.forEach((element) => {
          // Turn ABCD to uppercase if they are not.
          if (element.match(/^[+\-aAbBcCdD() .]+$/g) ) {
            element = element.toUpperCase()
          }
          move2 += element + ' ';
        });
        move2 = move2.trimEnd();

        // If move not found, exit.
        if (data[character1].hasOwnProperty(move1) === false) {
          return interaction.reply('Could not find specified attacking move: ' + move + '. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1uPQlyMB8pJhCILH0BYZNhJAO2cNq0aEZt_ifYQ6-uiI) for available data.');
        }
        if (data[character1].hasOwnProperty(move2) === false) {
          return interaction.reply('Could not find specified follow-up move: ' + move + '. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1uPQlyMB8pJhCILH0BYZNhJAO2cNq0aEZt_ifYQ6-uiI) for available data.');
        }

        let move1Data = data[character1][move1];
        let move2Data = data[character1][move2];
        
        const firstMove = (move1Data['BLOCK'] !== null) ? move1Data['BLOCK'].toString() : '-';
        const followupMove = (move2Data['START UP'] !== null) ? move2Data['START UP'].toString() : '-';

        if (firstMove.includes('~') || firstMove.includes('*') || isNaN(firstMove)) {
          return interaction.reply('Cannot calculate this situation, please refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1uPQlyMB8pJhCILH0BYZNhJAO2cNq0aEZt_ifYQ6-uiI) for more details.');
        }

        const gap = parseInt(firstMove) + parseInt(followupMove);

        // console.log(gap);
        let punishingMoves = [];
        Object.keys(data[character2]).forEach(function (defendingCharacterMoveInput) {
          // Skip any kind of air move.
          if (defendingCharacterMoveInput.includes('jump') || defendingCharacterMoveInput.includes('air')) {
            return;
          }
          
          // If move startup is equal or lower than gap, it can punish.
          if (parseInt(data[character2][defendingCharacterMoveInput]['START UP']) <= gap) {
            punishingMoves.push(defendingCharacterMoveInput);
          }
        });

        const embed = new MessageEmbed()
          .setColor('#0x1a2c78')
          .setTitle('Calculating punish options against gap in ' + attacking_character + '\'s ' + attacking_move_1 + ' > ' + attacking_move_2 + '...')
          .setDescription('Defending character ' + defending_character + ' options are:' )
          .setFooter({ text: 'Got feedback? Join the bot server: https://discord.gg/fPyTMgpR4X', iconURL: 'https://cdn.iconscout.com/icon/free/png-128/discord-3-569463.png' });
        
        // Add moves based on generated list.
        punishingMoves.forEach((moveToPrint) =>{
          embed.addField(moveToPrint, data[character2][moveToPrint]['START UP'].toString(), true);
        })
        return interaction.reply({embeds: [embed]});
      } catch (err) {
        console.log("Error parsing JSON string:", err);
        return interaction.reply('There was an error while processing your request, if the problem persists, contact the bot developers. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1uPQlyMB8pJhCILH0BYZNhJAO2cNq0aEZt_ifYQ6-uiI) to look for the data.');
      }
    });
  },
};