const {
  bot,
} = require("../lib/");
const {
  STICKER_PACKNAME,
} = require("../config");

bot(
  {
    pattern: "sticker ?(.*)",
    fromMe: true,
    desc: "Converts Photo or video to sticker",
    type: "media",
  },
  async (message, match, m) => {
    if (!message.reply_message || (!message.reply_message.video && !message.reply_message.image)) return await message.reply("_Reply to image/video_")
    let buff = await m.quoted.download();
    let [p, a] = match.split(",");
    let [s, n] = STICKER_PACKNAME.split(",");
    await message.sendMessage(buff, { packname: p || s, author: a || n }, "sticker");
  }
);

bot(
  {
    pattern: "take ?(.*)",
    fromMe: true,
    desc: "Changes sticker pack & author info",
    type: "media",
  },
  async (message, match, m) => {
    if (!message.reply_message || !message.reply_message.sticker) return await message.reply("_Reply to sticker_");
    let buff = await m.quoted.download();
    let [p, a] = match.split(",");
    let [s, n] = STICKER_PACKNAME.split(",");
    await message.sendMessage(buff, { packname: p || s, author: a || n }, "sticker");
  }
);
