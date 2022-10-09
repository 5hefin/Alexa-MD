const {
  bot,
  parsedJid,
  isUrl
} = require("../lib/");

const isBotAdmins = async (message) => {
const groupMetadata = await message.client.groupMetadata(message.chat)
const admins = await groupMetadata.participants.filter(v => v.admin !== null).map(v => v.id)
return admins.includes(message.user_id)
}

const isAdmin = async (message, user) => {
const groupMetadata = await message.client.groupMetadata(message.chat)
const admins = await groupMetadata.participants.filter(v => v.admin !== null).map(v => v.id)
return admins.includes(user)
}

bot(
  {
    pattern: "add ?(.*)",
    fromMe: true,
    desc: "Adds a person to group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply('_This command only works in group chats_')
    const isbotAdmin = await isBotAdmins(message, client)
    if (!isbotAdmin) return await message.reply("I'm not an admin")
    if(!match || !message.reply_message) return await message.reply('_Enter the number you want to add_')
    let users = match.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
    if(!users) return message.reply('_Enter the number you want to add_')
    let v = await client.onWhatsApp(users);
    n = v.map((n_jid) => n_jid.jid);
    if (!n.includes(users)) return await message.reply("_This number doesn't exists on whatsapp_");
    let vs = await client.GroupParticipantsUpdate(message, users)
    if (vs == '403') { await client.sendMessage(message.chat, { text: `_Couldn't add. Invite sent!_`, mentions: [users] }) }
    else if (vs == '408') { await client.sendMessage(message.chat, { text: `_Couldn't add @${users.split('@')[0]} because they left the group recently. Try again later._`, mentions: [users] }, { quoted: message.data }) }
    else if (vs == '401') { await client.sendMessage(message.chat, { text: `_Couldn't add @${users.split('@')[0]} because they blocked the bot number._`, mentions: [users] }, { quoted: message.data }) }
    else if (vs == '200') { await client.sendMessage(m.chat, { text: `@${users.split('@')[0]}, Added to The Group`, mentions: [users] }) }
    else if (vs == '409') { await client.sendMessage(m.chat, { text: `@${users.split('@')[0]}, Already in Group`, mentions: [users] }) }
    else { await client.sendMessage(message.chat, { text: vs }) }
  }
);

bot(
  {
    pattern: "kick ?(.*)",
    fromMe: true,
    desc: "kicks a person from group",
    type: "group",
  },
  async (message, match, client) => {
    if (!message.isGroup) return await message.reply('_This command only works in group chats_')
    const isbotAdmin = await isBotAdmins(message, message.client)
    if (!isbotAdmin) return await message.reply("I'm not an admin")
    if (message.reply_message !== false) { if (message.reply_message.data.key.fromMe) return false
    await message.client.sendMessage(message.jid, { text: `@${message.reply_message.data.participant.split('@')[0]}, Kicked From The Group`, mentions: [message.reply_message.data.participant] })
    await message.client.groupParticipantsUpdate(message.jid, [message.reply_message.data.participant], 'remove')
    } else if (message.reply_message === false && message.mention !== false) { var etiketler = '';
    message.mention.map(async (user) => { etiketler += '@' + user.split('@')[0] + ','; });
    await message.client.sendMessage(message.jid, { text: `${etiketler} Kicked From The Group`, mentions: message.mention })
    await message.client.groupParticipantsUpdate(message.jid, message.mention, 'remove') } else {
    return await message.reply('*Give me a user!*'); } 
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
    if (!message.isGroup) return await message.reply("_This command is for groups_");
    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to promote_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("_I'm not admin_");
    let jid = parsedJid(match);
    await message.promote(jid);
    return await message.reply(`@${jid[0].split("@")[0]} promoted as admin`, { mentions: jid, });
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
    if (!message.isGroup) return await message.reply("_This command is for groups_");
    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to demote");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("_I'm not admin_");
    let jid = parsedJid(match);
    await message.demote(jid);
    return await message.reply(`@${jid[0].split("@")[0]} demoted from admin`, { mentions: jid, });
  }
);

bot(
  {
    pattern: "mute ?(.*)",
    fromMe: true,
    desc: "nute group",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup) return await message.reply("_This command is for groups_");
    if (!isAdmin(message.jid, message.user, message.client)) return await message.reply("_I'm not admin_");
    await message.reply("_Muting_");
    return await client.groupSettingUpdate(message.jid, "announcement");
  }
);

bot(
  {
    pattern: "unmute",
    fromMe: true,
    desc: "unmute group",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup) return await message.reply("_This command is for groups_");
    if (!isAdmin(message.jid, message.user, message.client)) return await message.reply("_I'm not admin_");
    await message.reply("_Unmuting_");
    return await client.groupSettingUpdate(message.jid, "not_announcement");
  }
);

bot(
  {
    pattern: "poll ?(.*)",
    fromMe: true,
    desc: "create poll",
    type: "tool",
  },
  async (message, match) => {
    let [poll, opt] = match.split(",");
    if (match.split(",") < 2) return await message.reply("poll question;option1,option2,option3...");
    let options = [];
    for (let i of opt.split(',')) {
      options.push({ optionName: i });
    }
    return await message.client.relayMessage(
      message.jid,
      {
        pollCreationMessage: {
          name: poll,
          options,
          selectableOptionsCount: 0,
        },
      },
      {}
    );
  }
);
