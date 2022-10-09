const {
  bot,
  setCmd,
  prepareCmd
} = require("../lib/");
const { MODE } = require("../config");
var isPublic = MODE == 'public' ? false : true

bot(
  {
    pattern: "setcmd ?(.*)",
    fromMe: true,
    desc: "to set sticker as a cmd",
    type: "user"
  },
  async (m, text) => {
    if (message.reply_message) return await m.reply('_Reply to a sticker_')
    if (!text) return await m.reply('_Example : setcmd help_')
    const setcmd = await setCmd(m, text);
    if (!setcmd) return await m.reply('_Failed_')
    await m.reply('_Success_')
  }
);

bot(
  {
    pattern: "setcmd ?(.*)",
    fromMe: true,
    desc: "to set sticker as a cmd",
    type: "user"
  },
  async (message) => {
    await prepareCmd(message)
  }
);
