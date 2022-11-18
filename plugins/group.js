const {
  bot,
  isAdmin,
} = require("../lib/");

bot(
  {
    pattern: "add ?(.*)",
    fromMe: true,
    desc: "Adds a person to the group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("_This command only works in group chats_")
    let num = match || message.reply_message.jid
    if (!num) return await message.reply("_Enter the number you want to add_");
    let user = num.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
    let admin = await isAdmin(message);
    if (!admin) return await message.reply("_I'm not admin_");
    await message.client.groupParticipantsUpdate(message.jid, [user], "add")
    return await message.client.sendMessage(message.jid, { text: `_@${user.split("@")[0]}, Added to The Group!_`, mentions: [user] })
  }
);

bot(
  {
    pattern: "kick ?(.*)",
    fromMe: true,
    desc: "kicks a person from group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("_This command only works in group chats_")
    let user = message.mention[0] || message.reply_message.jid
    if (!user) return await message.reply("_Give me a user!_");
    var admin = await isAdmin(message);
    if (!admin) return await message.reply("_I'm not admin_");
    await message.client.groupParticipantsUpdate(message.jid, [user], "remove")
    return await message.client.sendMessage(message.jid, { text: `_@${user.split("@")[0]}, Kicked From The Group!_`, mentions: [user] })
  }
);

bot(
  {
    pattern: "promote ?(.*)",
    fromMe: true,
    desc: "promote a member",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("_This command only works in group chats_")
    let user = message.mention[0] || message.reply_message.jid
    if (!user) return await message.reply("_Give me a user!_");
    var admin = await isAdmin(message);
    if (!admin) return await message.reply("_I'm not admin_");
    await message.client.groupParticipantsUpdate(message.jid, [user], "promote")
    return await message.client.sendMessage(message.jid, { text: `_@${user.split("@")[0]}, Is Promoted as Admin!_`, mentions: [user] })
  }
);

bot(
  {
    pattern: "demote ?(.*)",
    fromMe: true,
    desc: "demote a member",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("_This command only works in group chats_")
    let user = message.mention[0] || message.reply_message.jid
    if (!user) return await message.reply("_Give me a user!_");
    var admin = await isAdmin(message);
    if (!admin) return await message.reply("_I'm not admin_");
    await message.client.groupParticipantsUpdate(message.jid, [user], "demote")
    return await message.client.sendMessage(message.jid, { text: `_@${user.split("@")[0]}, Is no longer an Admin!_`, mentions: [user] })
  }
);

bot(
  {
    pattern: "mute ?(.*)",
    fromMe: true,
    desc: "Mute the group chat. Only the admins can send a message.",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("_This command only works in group chats_")
    var admin = await isAdmin(message);
    if (!admin) return await message.reply("_I'm not admin_");
    if (match) {
      const h2m = function(h) { return (1000*60*60*h) }
      const m2m = function(m) { return (1000*60*m)}
      let duration = match.endsWith("h") ? h2m(match.match(/\d+/)[0]) : m2m(match.match(/\d+/)[0])
      match = match.endsWith("h") ? match+"ours" : match+"mins"
      await message.client.groupSettingUpdate(message.jid, "announcement")
      await message.send(`_Group Muted for ${match}_`)
      await require("timers/promises").setTimeout(duration);
      return await message.client.groupSettingUpdate(message.jid, "not_announcement")
      await message.send("_Group Opened._")
    }
    await message.client.groupSettingUpdate(message.jid, "announcement")
    await message.send("_Group Closed._")
  }
);

bot(
  {
    pattern: "unmute ?(.*)",
    fromMe: true,
    desc: "Unmute the group chat. Anyone can send a message.",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("_This command only works in group chats_")
    var admin = await isAdmin(message);
    if (!admin) return await message.reply("_I'm not admin_");
    if (match) {
      const h2m = function(h) { return (1000*60*60*h) }
      const m2m = function(m) { return (1000*60*m)}
      let duration = match.endsWith("h") ? h2m(match.match(/\d+/)[0]) : m2m(match.match(/\d+/)[0])
      match = match.endsWith("h") ? match+"ours" : match+"mins"
      await message.client.groupSettingUpdate(message.jid, "not_announcement")
      await message.send(`_Group with Unmute for ${match}_`)
      await require("timers/promises").setTimeout(duration);
      return await message.client.groupSettingUpdate(message.jid, "announcement")
      await message.send("_Group Opened._")
    }
    await message.client.groupSettingUpdate(message.jid, "not_announcement")
    await message.send("_Group Opened._")
  }
);

bot(
  {
    pattern: "invite ?(.*)",
    fromMe: true,
    desc: "Provides the group's invitation link.",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("_This command only works in group chats_")
    var admin = await isAdmin(message);
    if (!admin) return await message.reply("_I'm not admin_");
    const response = await message.client.groupInviteCode(message.jid)
    await message.reply(`https://chat.whatsapp.com/${response}`)
  }
);

bot(
  {
    pattern: "revoke ?(.*)",
    fromMe: true,
    desc: "Revoke Group invite link.",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("_This command only works in group chats_")
    var admin = await isAdmin(message);
    if (!admin) return await message.reply("_I'm not admin_");
    await message.client.groupRevokeInvite(message.jid)
    await message.send("_Revoked_")
  }
);

bot(
  {
    pattern: "join ?(.*)",
    fromMe: true,
    desc: "Join in the group",
    type: "group",
  },
  async (message, match) => {
    var rgx = /^(https?:\/\/)?chat\.whatsapp\.com\/(?:invite\/)?([a-zA-Z0-9_-]{22})$/
    if (!match || !rgx.test(match)) return await message.reply("_Need group link_")
    var res = await message.client.groupAcceptInvite(match.split("/")[3])
    if (!res) return await message.reply("_Invalid Group Link!_")
    if (res) return await message.reply("_Joined!_")
  }
);

bot(
  {
    pattern: "left ?(.*)",
    fromMe: true,
    desc: "Left from the group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("_This command only works in group chats_")
    await message.client.groupLeave(message.jid)
  }
);

bot(
  {
    pattern: "lock ?(.*)",
    fromMe: true,
    desc: "only allow admins to modify the group's settings.",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("_This command only works in group chats_")
    var admin = await isAdmin(message);
    if (!admin) return await message.reply("_I'm not admin_");
    return await message.client.groupSettingUpdate(message.jid, "locked")
  }
);

bot(
  {
    pattern: "unlock ?(.*)",
    fromMe: true,
    desc: "allow everyone to modify the group's settings.",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("_This command only works in group chats_")
    var admin = await isAdmin(message);
    if (!admin) return await message.reply("_I'm not admin_");
    return await message.client.groupSettingUpdate(message.jid, "unlocked")
  }
);

bot(
  {
    pattern: "gname ?(.*)",
    fromMe: true,
    desc: "Change group subject",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("_This command only works in group chats_")
    match = match || message.reply_message.text
    if (!match) return await message.send("_Need Subject!_\n_Example: gname New Subject!_.")
    var {restrict} = await message.client.groupMetadata(message.jid);
    if (restrict && !(await isAdmin(message))) return await message.reply("_I'm not admin_");
    await message.client.groupUpdateSubject(message.jid, match)
    return await message.reply("_Subject updated_")
  }
);

bot(
  {
    pattern: "gdesc ?(.*)",
    fromMe: true,
    desc: "Change group description",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("_This command only works in group chats_")
    match = match || message.reply_message.text
    if (!match) return await message.send("_Need Description!\nExample: gdesc New Description!_")
    var {restrict} = await message.client.groupMetadata(message.jid);
    if (restrict && !(await isAdmin(message))) return await message.reply("_I'm not admin_");
    await message.client.groupUpdateDescription(message.jid, match)
    return await message.reply("_Description updated_")
  }
);

bot(
  {
    pattern: "gpp ?(.*)",
    fromMe: true,
    desc: "Change group icon",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("_This command only works in group chats_")
    var admin = await isAdmin(message);
    if (!admin) return await message.reply("_I'm not admin_");
    if (message.reply_message && message.reply_message.image) {
    var img = await message.reply_message.download()
    await message.client.updateProfilePicture(message.jid, {url: img});
    return await message.sendReply("_Successfully Profile Picture Updated_")
    }
  }
);
