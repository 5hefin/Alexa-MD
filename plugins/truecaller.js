const {
  bot,
  getJson,
  isPublic,
} = require("../lib");

bot(
  {
    pattern: "true ?(.*)",
    fromMe: isPublic,
    desc: "Searches for number in truecaller!",
    type: "search",
  },
  async (message, match) => {
    try {
      var user =  (message.mention[0] || message.reply_message.jid || match).split("@")[0]
      if (!user) return await message.reply("_Need number/reply/mention_");
      var result = await getJson(`https://alexa-web.vercel.app/true?number=${user}`)
      if (!result) return await message.reply("_Internal Server Busy!_")
      await message.reply(result);
    } catch (error) {
      await message.reply("_Daily limit over_")
    }
  }
);
