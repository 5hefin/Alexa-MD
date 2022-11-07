const { bot, parseJid } = require("../lib/");

bot(
  {
    pattern: "tag ?(.*)",
    fromMe: true,
    desc: "tag participants in the group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return;
    const { participants } = await message.client.groupMetadata(message.jid);
    if (match == "all") {
      let msg = ""
      let count = 1
      for (let participant of participants) {
        msg += `${count++} @${participant.id.split('@')[0]}\n`
      }
      return await message.reply(msg, { mentions: participants.map((a) => a.id) });
    } else if (match == "admin" || match == "admins") {
      let admins = message.isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : "";
      let msg = ""
      let count = 1
      for (let admin of admins) {
        msg += `${count++} @${admin.split('@')[0]}\n`
      }
      return await message.reply(msg, { mentions: parseJid(msg) });
    }
  }
);
