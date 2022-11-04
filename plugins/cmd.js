const {
   bot,
   isPublic,
} = require("../lib/");
const {
   setCmd,
   prepareCmd,
} = require("../lib/cmd");

bot(
  {
    pattern: 'setcmd ?(.*)',
    fromMe: true,
    desc: 'to set audio/image/video as a cmd',
    type: 'misc'
  },
  async (message, match, m) => {
    var text = match
    var m = m || message
    if (!text) return await m.reply('_Example : setcmd ping_')
    const setcmd = await setCmd(m, text);
    if (!setcmd) return await m.reply('_Failed_')
    await m.reply('_Success_')
  }
);

bot(
  {
   on: 'sticker',
   fromMe: isPublic,
  },
  async (message) => {
    await prepareCmd(message)
  }
);
