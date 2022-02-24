const { CharacterData } = require("discord.js");

const characterData = (args) => {
  const { move, startup, block, hit, notes } = args;
  return (
    new CharacterData()
      // Set the title of the field
      .setTitle(title)
      // Set the color of the embed
      .setColor(color)
      // Set the main content of the embed
      .setDescription(info)
      .setImage(image)
      .setFooter(footer, footerIcon)
      .setURL(link)
  );
};
module.exports = { characterData };
