const { bot } = require("../lib/");
const { MODE } = require("../config");
var isPublic = MODE == 'public' ? false : true

/*
bot(
  {
    pattern: "react ?(.*)",
    fromMe: true,
    desc: "React to msg.",
    type: "misc",
  },
  async (message, match) => {
    if (!match || !message.reply_message) return await message.reply("_Example : react ❣_");
    const reactionMessage = {
      react: {
        text: match,
        key: message.reply_message.key
      }
    }
    await message.sendMessage(reactionMessage);
  }
);
*/

bot(
  {
    pattern: "ping ?(.*)",
    fromMe: isPublic,
    desc: "Bot response in second.",
    type: "info",
  },
  async (message) => {
    var start = new Date().getTime();
    var msg = await message.reply('*Testing Speed..*');
    var end = new Date().getTime();
    await message.reply('⟪ *Response in ' + (end - start) + ' msec* ⟫');
  }
);

bot(
  {
    pattern: "reboot ?(.*)",
    fromMe: true,
    desc: "Reboot bot.",
    type: "misc",
  },
  async (message) => {
    await message.reply("_Rebooting..._")
    require("pm2").restart("index.js");
  }
);

bot(
  {
    pattern: "readmore ?(.*)",
    fromMe: isPublic,
    desc: "Readmore generator",
    type: "whatsapp",
  },
  async (message, match) => {
    await message.reply(match.replace(/\+/g, (String.fromCharCode(8206)).repeat(4001)))
  }
);

bot(
  {
    pattern: "wame ?(.*)",
    fromMe: isPublic,
    desc: "wame generator",
    type: "whatsapp",
  },
  async (message, match) => {
    let sender = 'https://wa.me/' + (message.reply_message.jid || message.mention[0] || match).split('@')[0];
    await message.reply(sender)
  }
);
