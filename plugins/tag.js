const {
  bot,
  menJid,
} = require("../lib/");

bot(
  {
    pattern: "tag ?(.*)",
    fromMe: true,
    desc: "tag participants in the group",
    type: "group",
  },
  async (message, match) => {
    const { participants } = await message.client.groupMetadata(message.jid);
    const mentionedJid = await menJid(participants)
    if (match == "all") {
      let msg = ""
      let count = 1
      mentionedJid.forEach((e) =>(msg += `${count++} @${e.split("@")[0]}\n`))
      return await message.sendMessage(msg.trim(), { mentions: mentionedJid })
    } else if (match == "admin" || match == "admins") {
      let msg = ""
      let mentionedJid = participants.filter((user) => !!user.admin == true).map(({ id }) => id)
      mentionedJid.forEach((e) => (msg += `@${e.split("@")[0]}\n`))
      return await message.sendMessage(msg.trim(), { mentions: mentionedJid })
    } else if (match == "notadmin" || match == "not admins") {
      let msg = ""
      const mentionedJid = participants.filter((user) => !!user.admin != true).map(({ id }) => id)
      mentionedJid.forEach((e) => (msg += `@${e.split("@")[0]}\n`))
      return await message.sendMessage(msg.trim(), { mentions: mentionedJid })
    }
    if (match || message.reply_message.text) {
      return await message.sendMessage(match || message.reply_message.text, { mentions: mentionedJid })
    } else if (message.reply_message.image) {
      const media = await message.reply_message.download()
      return await message.sendMessage(media, { mentions: mentionedJid }, "image");
    } else if (message.reply_message.video) {
      const media = await message.reply_message.download()
      return await message.sendMessage(media, { mentions: mentionedJid }, "video");
    } else if (message.reply_message.audio) {
      const media = await message.reply_message.download()
      return await message.sendMessage(media, { mimetype: "audio/mpeg", mentions: mentionedJid }, "audio")
    } else if (message.reply_message.sticker) {
      const media = await message.reply_message.download()
      return await message.sendMessage(media, { packname: "Alexa MD", mentions: mentionedJid }, "sticker");
    } else if (!message.reply_message) {
      return await message.sendMessage("*_Example :_*\n_tag all_\n_tag admin_\n_tag notadmin_\n_tag text_\n_Reply to a message_")
    }
  }
);
