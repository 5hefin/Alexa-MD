const { bot } = require("../lib/");

bot(
  {
    pattern: "setpp ?(.*)",
    fromMe: true,
    desc: "Set profile picture",
    type: "user",
  },
  async (message, match) => {
    if (!message.reply_message.image) return await message.reply("_Reply to a photo_");
    let media = await message.reply_message.download();
    await message.setPP(message.user, media);
    return await message.reply("_Profile Picture Updated_");
  }
);

bot(
  {
    pattern: "setname ?(.*)",
    fromMe: true,
    desc: "Set User name",
    type: "user",
  },
  async (message, match) => {
    if (!match) return await message.reply("_Enter name_");
    await message.updateName(match);
    return await message.reply(`_Username Updated : ${match}_`);
  }
);

bot(
  {
    pattern: "block ?(.*)",
    fromMe: true,
    desc: "Block a person",
    type: "user",
  },
  async (message, match) => {
    if (message.isGroup) {
      let jid = message.mention[0] || message.reply_message.jid;
      if (!jid) return await message.reply("_Reply to a person or mention_");
      await message.block(jid);
      return await message.send(`_@${jid.split("@")[0]} Blocked_`, { mentions: [jid] });
    } else {
      await message.block(message.jid);
      return await message.reply("_User blocked_");
    }
  }
);

bot(
  {
    pattern: "unblock ?(.*)",
    fromMe: true,
    desc: "Unblock a person",
    type: "user",
  },
  async (message, match) => {
    if (message.isGroup) {
      let jid = message.mention[0] || message.reply_message.jid;
      if (!jid) return await message.reply("_Reply to a person or mention_");
      await message.block(jid);
      return await message.send(`_@${jid.split("@")[0]} unblocked_`, { mentions: [jid] });
    } else {
      await message.unblock(message.jid);
      return await message.reply("_User unblocked_");
    }
  }
);

bot(
  {
    pattern: "jid",
    fromMe: true,
    desc: "Give jid of chat/user",
    type: "user",
  },
  async (message, match) => {
    return await message.send(
      message.mention[0] || message.reply_message.jid || message.jid
    );
  }
);

bot(
  {
    pattern: "react ?(.*)",
    fromMe: true,
    desc: "sends reaction",
    type: "user" ,
  },
  async (message, match) => {
   await message.react(match, message.reply_message.key)
  }
);
