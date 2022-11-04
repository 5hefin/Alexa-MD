const {
   bot,
   setCmd,
   prepareCmd,
   isPublic,
} = require("../lib/");

bot(
  {
    pattern: 'setcmd ?(.*)',
    fromMe: true,
    desc: 'to set audio/image/video as a cmd',
    type: 'misc'
  },
  async (message, match) => {
    var text = match
    var m = message
    if (!message.reply_messge) return await m.reply('_Reply to a image/video/audio/sticker_')
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
