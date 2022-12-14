const { bot } = require("../lib/");

bot(
  {
    pattern: "pp$",
    fromMe: true,
    desc: "Set profile picture",
    type: "user",
  },
  async (message, match) => {
    if (!message.reply_message.image) return await message.reply("_Reply to a photo_");
    let media = await message.reply_message.download();
    await message.client.updateProfilePicture(message.jid, { url: media })
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
    match = match || message.reply_message.text
    if (!match) return await message.reply("_Enter name_");
    await message.updateName(match);
    return await message.reply(`_Username Updated : ${match}_`);
  }
);

bot(
  {
    pattern: "setbio ?(.*)",
    fromMe: true,
    desc: "To change your profile status",
    type: "user",
  },
  async (message, match) => {
    match = match || message.reply_message.text
    if (!match) return await message.reply("_Need Status!_\n_Example: setbio Hey there! I am using WhatsApp._");
    await message.updateBio(match);
    return await message.reply("_Profile status updated_");
  }
);

bot(
  {
    pattern: "block$",
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
    pattern: "unblock$",
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
    pattern: "jid ?(.*)",
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
   await message.react(
     match, message.reply_message.key
   );
  }
);

bot(
  {
    pattern: "pin$",
    fromMe: true,
    desc: "Pin a chat",
    type: "whatsapp",
  },
  async (message, match) => {
    await message.pinChat(message.jid, true)
    await message.reply("_Pined_");
  }
);

bot(
  {
    pattern: "unpin$",
    fromMe: true,
    desc: "Unpin a chat",
    type: "whatsapp",
  },
  async (message, match) => {
    await message.pinChat(message.jid, false)
    await message.reply("_Unpined_");
  }
);

bot(
  {
    pattern: "archive$",
    fromMe: true,
    desc: "Archive a chat",
    type: "whatsapp",
  },
  async (message, match) => {
    await message.archiveChat(message.jid, true)
    await message.reply("_Archived_")
  }
);

bot(
  {
    pattern: "unarchive$",
    fromMe: true,
    desc: "Unarchive a chat",
    type: "whatsapp",
  },
  async (message, match) => {
    await message.archiveChat(message.jid, false)
    await message.reply("_Unarchived_")
  }
);

bot(
  {
    pattern: "onwa ?(.*)",
    fromMe: true,
    desc: "To check if a given ID is on WhatsApp.",
    type: "whatsapp",
  },
  async (message, match) => {
    match = match || message.reply_message.text
    if (!match) return await message.reply("_Need Number!_")
    match = match.replace(/[^0-9]/g, "")
    if (!match) return await message.reply("_Need Number!_")
    const [result] = await message.client.onWhatsApp(match)
    if (!result) await message.reply(match + " doest exists on WhatsApp")
    if (result && result.exists) return await message.reply("*" + match + " exists on WhatsApp*,\njid: " + result.jid)
  }
)
