const {
  bot,
  isPublic,
  trueCaller
} = require("../lib");

bot(
  {
    pattern: "true ?(.*)",
    fromMe: isPublic,
    desc: "Searches for number in truecaller!",
    type: "search",
  },
  async (message, match) => {
    var user =  (message.mention[0] || message.reply_message.jid || match).split("@")[0]
    if (!user) return await message.reply("_Need number/reply/mention_");
    await trueCaller(message, user);
  }
);
