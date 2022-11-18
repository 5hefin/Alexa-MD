const {
   bot,
   isAdmin,
   setWarn,
   resetWarn,
} = require("../lib/");
const {
   WARN_LIMIT
} = require("../config");

bot(
  {
    pattern: "warn ?(.*)",
    fromMe: true,
    desc: "warn users in chat",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("_This command only works in group chats_")
    if (match == "reset") {
      const user = message.mention[0] || message.reply_message.jid
      if (!user) return await message.reply("_Reply or Mention to a user_")
      try {
        await resetWarn(user, message.jid)
      } catch {
        return await message.reply("_The user doesn't have warn yet_")
      }
      return await message.client.sendMessage(message.jid, { text: `*Reset Warning*\n*User :* @${user.split("@")[0]}\n*Remaining :* ${WARN_LIMIT}`, mentions: [user] })
    } else {
      const user = message.mention[0] || message.reply_message.jid
      if (!user) return await message.reply("_Reply or Mention to a user_")
      const count = await setWarn(user, message.jid)
      if (count > WARN_LIMIT) {
        const isimAdmin = await isAdmin(message);
        const isUserAdmin = await isAdmin(message, user)
        if (!isimAdmin) return await message.reply("_I'm not an admin_")
        if (isUserAdmin) return await message.reply("_Given user is an admin_")
        await message.client.sendMessage(message.jid, { text: `@${user.split("@")[0]}, *Kicked From The Group*,\n_Reached Max warning._`, mentions: [user] })
        await resetWarn(user, message.jid)
        return await message.client.groupParticipantsUpdate(message.jid, [user], "remove")
      }
      var reasons = "Reason"
      if (message.mention[0]) reasons = "No Reason"
      if (message.reply_message) reasons = message.reply_message.mtype.replace("Message", "")
      if (message.reply_message.text) reasons = message.reply_message.text.length > 40 ? "Replied message" : message.reply_message.text
      var reason = match ? match.replace(`@${user.split("@")[0]}`, "") : reasons
      await message.client.sendMessage(message.jid, { text: `*⚠️WARNING⚠️*\n*User :* @${user.split("@")[0]}\n*Warn :* ${count}\n*Reason :* ${reason}\n*Remaining :* ${WARN_LIMIT - count}`, mentions: [user] })
    }
  }
);
