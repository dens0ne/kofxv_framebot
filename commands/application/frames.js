const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('frames')
    .setDescription('Add character name and move, to get a response with move data.')
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
    fs.readFile("../../assets/framedata.json", "utf8", (err, jsonObject) => {
      if (err) {
        // console.log("Error reading file from disk:", err);
        return interaction.reply('Could not load frame data file. Please contact the bot developers.');
      }
      try {
        const data = JSON.parse(jsonObject);
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
          return interaction.reply('Could not find specified character: ' + character + '.');
        }
        // Trim extra whitespaces from move.
        let parsedMove = move.trimEnd();
        parsedMove = parsedMove.trimStart();
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
          return interaction.reply('Could not find specified move: ' + move + '.');
        }
        let moveData = data[character][escapedMoves];
          response = character + ' - ' + '(' + escapedMoves + ') - ';
          response += (moveData["START UP"] !== null) ? '[Startup]: ' + moveData["START UP"] + ' ' : '';
          response += (moveData.BLOCK !== null) ? '[on Block]: ' + moveData.BLOCK + ' ' : '';
          response += (moveData.HIT !== null) ? '[on Hit]: ' + moveData.HIT + ' ' : '';
          response += (moveData.NOTES !== null) ? '[Notes]: ' + moveData.NOTES + ' ' : '';
          response += (singleButton) ? '\n*Note: By default, for single buttons we return the "close button" value. For better results, try preppending a button with "close" or "far" (e.g. close A or far D).*' : '';
          // console.log(moveData.BLOCK)
          return interaction.reply(response);
      } catch (err) {
        console.log("Error parsing JSON string:", err);
        return interaction.reply('There was an error while processing your request, if the problem persists, contact the bot developers.');
      }
    });
  },
};