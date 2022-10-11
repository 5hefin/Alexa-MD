const config = require("../config");
const { bot, parsedJid, isUrl } = require("../lib/");

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
  async (message, match, client) => {
    if (!message.isGroup) return await message.reply("_This bot is for groups_");
    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to add");
    const isbotAdmin = await isBotAdmins(message, message.client)
    if (!isbotAdmin) return await message.reply("I'm not an admin")
    let jid = parsedJid(match);
    await message.add(jid);
    return await message.reply(`@${jid[0].split("@")[0]} added`, { mentions: jid });
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
    if (!message.isGroup) return await message.reply("_This bot is for groups_");
    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to kick");
    const isbotAdmin = await isBotAdmins(message, message.client)
    if (!isbotAdmin) return await message.reply("I'm not an admin")
    let jid = parsedJid(match);
    await message.kick(jid);
    return await message.reply(`@${jid[0].split("@")[0]} kicked`, { mentions: jid });
  }
);

bot(
  {
    pattern: "promote ?(.*)",
    fromMe: true,
    desc: "promote a member",
    type: "group",
  },
  async (message, match, client) => {
    if (!message.isGroup) return await message.reply("_This bot is for groups_");
    const isbotAdmin = await isBotAdmins(message, message.client)
    if (!isbotAdmin) return await message.reply("I'm not an admin")
    if (message.reply_message !== false) {
    const admin = await isAdmin(message, message.reply_message.sender)
    if (admin) return await message.send('*User is already an admin*')
    await message.client.sendMessage(message.chat, { text: `_@${message.reply_message.data.participant.split('@')[0]}, Is promoted as admin!_`, mentions: [message.reply_message.data.participant] })
    await message.client.groupParticipantsUpdate(message.jid, [message.reply_message.data.participant], 'promote')
    } else if (message.reply_message === false && message.mention !== false) {
    var user = '';
    message.mention.map(async (users) => {
    user += '@' + users.split('@')[0] + ',';
    });
    await message.reply(`_${user} promoted as admin!_`, { mentions: message.mention });
    await message.client.groupParticipantsUpdate(message.jid, message.mention, 'promote')
    } else { 
    return await message.reply('*Give me a user!*'); }
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
    if (!message.isGroup) return await message.reply('_This command only works in group chats_')
    const isbotAdmin = await isBotAdmins(message, message.client)
    if (!isbotAdmin) return await message.reply("I'm not an admin")
    if (message.reply_message !== false) {
    const admin = await isAdmin(message, message.reply_message.sender)
    await message.client.sendMessage(message.chat, { text: `_@${message.reply_message.data.participant.split('@')[0]}, Is no longer an admin!_`, mentions: [message.reply_message.data.participant] })
    await message.client.groupParticipantsUpdate(message.jid, [message.reply_message.data.participant], 'demote')
    } else if (message.reply_message === false && message.mention !== false) {
    var user = '';
    message.mention.map(async (users) => {
    user += '@' + users.split('@')[0] + ',';
    });
    await message.client.sendMessage(message.chat, { text: `_${user} Is no longer an admin!_`, mentions: message.mention })
    await message.client.groupParticipantsUpdate(message.jid, message.mention, 'demote')
    } else {
    return await message.reply('*Give me a user!*'); }
  }
);

bot(
  {
    pattern: "mute ?(.*)",
    fromMe: true,
    desc: "mute group",
    type: "group",
  },
  async (message, match, client) => {
    if (!message.isGroup) return await message.reply("_This bot is for groups_");
    const isbotAdmin = await isBotAdmins(message, message.client)
    if (!isbotAdmin) return await message.reply("I'm not an admin")
    await message.reply("_Muting_");
    return await client.groupSettingUpdate(message.jid, "announcement");
  }
);

bot(
  {
    pattern: "unmute ?(.*)",
    fromMe: true,
    desc: "unmute group",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup) return await message.reply("_This bot is for groups_");
    const isbotAdmin = await isBotAdmins(message, message.client)
    if (!isbotAdmin) return await message.reply("I'm not an admin")
    await message.reply("_Unmuting_");
    return await client.groupSettingUpdate(message.jid, "not_announcement");
  }
);

bot(
  {
    pattern: "poll ?(.*)",
    fromMe: true,
    desc: "create poll",
    type: "group",
  },
  async (message, match) => {
    const poll = match.split(',')
    if (poll.length < 3) return await message.send("*Example : question,option1,option2,...*")
    const namee = poll[0]
    const options = []
    for (let i = 1; i < poll.length; i++) options.push({ optionName: poll[i] })
    await message.client.relayMessage(message.jid, { pollCreationMessage: { name: namee, options, selectableOptionsCount: options.length, },
    },
   {},
  )
 }
);
