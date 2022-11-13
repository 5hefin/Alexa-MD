const { 
   bot,
   webp2mp4,
   gimage,
   toAudio,
   isPublic,
   blackVideo,
} = require("../lib/");

bot(
  {
    pattern: "img ?(.*)",
    fromMe: isPublic,
    desc: "Google Image search",
    type: "download",
  },
  async (message, match) => {
    if (!match) return await message.sendMessage("Enter Search Term, number");
    let [query, amount] = match.split(",");
    let result = await gimage(query, amount);
    await message.sendMessage(
      `_Downloading ${amount || 5} images for ${query}_`
    );
    for (let i of result) {
      await message.sendFromUrl(i);
    }
  }
);

bot(
  {
    pattern: "vv ?(.*)",
    fromMe: isPublic,
    desc: "Forwards The View once messsage",
    type: "tool",
  },
  async (message, match) => {
    if (message.reply_message.type !== "view_once") return await message.reply("_Not a View Once_");
    let media = await message.reply_message.download();
    return await message.sendFile(media);
  }
);

bot(
  {
    pattern: "photo ?(.*)",
    fromMe: isPublic,
    desc: "Changes sticker to Photo",
    type: "converter",
  },
  async (message, match) => {
    if (message.reply_message.mtype !== "stickerMessage") return await message.reply("_Not a sticker_");
    let media = await message.reply_message.download();
    return await message.sendMessage(media, {}, "image");
  }
);

bot(
  {
    pattern: "mp4 ?(.*)",
    fromMe: isPublic,
    desc: "Changes sticker to Video",
    type: "converter",
  },
  async (message, match) => {
    if (message.reply_message.mtype !== "stickerMessage") return await message.reply("_Not a sticker_");
    let media = await message.reply_message.download();
    let webp = await webp2mp4(media);
    return await message.sendMessage(webp, {}, "video");
  }
);

bot(
  {
    pattern: "mp3 ?(.*)",
    fromMe: isPublic,
    desc: "converts video/voice to mp3",
    type: "converter",
  },
  async (message, match) => {
    let media = await message.reply_message.download();
    media = await toAudio(media, "mp3");
    return await message.sendMessage(media, { mimetype: "audio/mpeg" }, "audio");
  }
);

bot(
  {
    pattern: "black ?(.*)",
    fromMe: isPublic,
    desc: "converts audio to black video",
    type: "converter",
  },
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.audio) return await message.sendMessage("_Reply to a audio!_")
    let media = await message.reply_message.download();
    let black_video = await blackVideo(media);
    await message.sendMessage(black_video, { quoted: message }, "video");
  }
);
