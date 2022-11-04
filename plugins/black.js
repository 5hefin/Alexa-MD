const {
   bot,
   isPublic,
   getBuffer,
} = require('../lib/');
const fs = require('fs');
const {
    avMix, 
} = require('../lib/database/db');

bot(
  {
    pattern: "black ?(.*)",
    fromMe: isPublic,
    desc: "Audio to black video",
    type: "media",
  },
  async (message, match) => {
    if (!fs.existsSync("./media/black")) {
        fs.mkdirSync("./media/black")
    }
    let files = fs.readdirSync("./media/black/")
    if (!message.reply_message || !message.reply_message.audio) return await message.reply("_Need audio!_");
    var savedFile = await message.reply_message.download();
    await fs.writeFileSync('./media/black/audio.mp3', fs.readFileSync(savedFile));
    await fs.writeFileSync('./media/black/video.mp4', await getBuffer("https://i.imgur.com/TsesS9x.mp4"));
    await message.reply("_Processing..._")
    var video = await avMix('./media/black/video.mp4','./media/black/audio.mp3');
    await message.sendMessage(video, 'video');
    await fs.unlinkSync('./media/black/video.mp4');
    await fs.unlinkSync('./media/black/audio.mp3');
    await fs.unlinkSync('./merged.mp4');
    return;
  }
);
