const { bot, upload, isPublic } = require("../lib/");

bot(
  {
    pattern: "url ?(.*)",
    fromMe: isPublic,
    desc: "upload files to imgur.com",
    type: "media",
  },
  async (message, match) => {
    if (message.reply_message.image || message.reply_message.video) return await message.reply("_Reply to image|video_");
    var shefin = await message.reply_message.downloadMediaMessage();
    var res = await upload(shefin);
    await message.reply(res.url)
  }
);
