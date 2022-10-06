const { 
  bot,
  webp2mp4,
  isUrl,
  gimage,
  yta,
  ytIdRegex,
  ytv,
  toAudio,
  isPublic
} = require("../lib/");
const { search } = require("yt-search");

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
  async (message, match, m) => {
    if (message.reply_message.type !== "view_once")
      return await message.reply("_Not a View Once_");
    let buff = await m.quoted.download();
    return await message.sendFile(buff);
  }
);

bot(
  {
    pattern: "photo ?(.*)",
    fromMe: isPublic,
    desc: "Changes sticker to Photo",
    type: "converter",
  },
  async (message, match, m) => {
    if (message.reply_message.mtype !== "stickerMessage")
      return await message.reply("_Not a sticker_");
    let buff = await m.quoted.download();
    return await message.sendMessage(buff, {}, "image");
  }
);

bot(
  {
    pattern: "mp4 ?(.*)",
    fromMe: isPublic,
    desc: "Changes sticker to Video",
    type: "converter",
  },
  async (message, match, m) => {
    if (message.reply_message.mtype !== "stickerMessage")
      return await message.reply("_Not a sticker_");
    let buff = await m.quoted.download();
    let buffer = await webp2mp4(buff);
    return await message.sendMessage(buffer, {}, "video");
  }
);

bot(
  {
    pattern: "song ?(.*)",
    fromMe: isPublic,
    desc: "Downloads Song",
    type: "download",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (ytIdRegex.test(match)) {
      yta(match.trim()).then(({ dl_link, title }) => {
        message.sendFromUrl(dl_link, { filename: title });
      });
    }
    search(match + "song").then(async ({ all }) => {
      await message.reply(`_Downloading ${all[0].title}_`);
      yta(all[0].url).then(({ dl_link, title }) => {
        message.sendFromUrl(dl_link, { filename: title, quoted: message });
      });
    });
  }
);

bot(
  {
    pattern: "video ?(.*)",
    fromMe: isPublic,
    desc: "Downloads video",
    type: "download",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (ytIdRegex.test(match)) {
      ytv(match.trim()).then(({ dl_link, title }) => {
        message.sendFromUrl(dl_link, { filename: title });
      });
    }
    search(match + "song").then(async ({ all }) => {
      await message.reply(`_Downloading ${all[0].title}_`);
      ytv(all[0].url).then(({ dl_link, title }) => {
        message.sendFromUrl(dl_link, { filename: title, quoted: message });
      });
    });
  }
);

bot(
  {
    pattern: "mp3 ?(.*)",
    fromMe: isPublic,
    desc: "converts video/voice to mp3",
    type: "converter",
  },
  async (message, match, m) => {
    let buff = await m.quoted.download();
    buff = await toAudio(buff, "mp3");
    return await message.sendMessage(buff, { mimetype: "audio/mpeg" }, "audio");
  }
);
