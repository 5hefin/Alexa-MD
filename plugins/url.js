const { bot, upload, isPublic } = require("../lib/");
const ffmpeg = require('fluent-ffmpeg');

bot(
  {
    pattern: "url ?(.*)",
    fromMe: isPublic,
    desc: "upload files to imgur.com",
    type: "media",
  },
  async (message, match) => {
    if (message.reply_message.audio) {
      try {
        var media = await message.reply_message.download();
        ffmpeg(media).outputOptions(["-y", "-filter_complex", "[0:a]showvolume=f=1:b=4:w=720:h=68,format=yuv420p[vid]", "-map", "[vid]", "-map 0:a"]).save('output.mp4').on('end', async () => {
        var res = await upload('output.mp4');
        await message.reply(res.link);
        });
      } catch (e) {
	await message.reply(e.message)
      }
    }

    else if (message.reply_message.image || message.reply_message.video) {
      try {
        var media = await message.reply_message.download();
        var res = await upload(media);
        await message.reply(res.link)
      } catch (e) {
	await message.reply(e.message)
      }
    }

    else return await message.reply("_Reply to image/video/audio_");
  }
);
