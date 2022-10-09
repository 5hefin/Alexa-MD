const {
  bot,
  parsedJid,
  isUrl,
  isAdmin
} = require("../lib/");

bot(
  {
    pattern: "add",
    fromMe: true,
    desc: "Adds a person to group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("_This command is for groups_");
    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to add");
    let admin = await isAdmin(message.jid, message.user, message.client);
    if (!admin) return await message.reply("_I'm not admin_");
    let jid = parsedJid(match);
    await message.add(jid);
    return await message.reply(`@${jid[0].split("@")[0]} added`, { mentions: jid });
  }
);

bot(
  {
    pattern: "kick",
    fromMe: true
    desc: "kicks a person from group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("_This command is for groups_");
    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to kick");
    let admin = await isAdmin(message.jid, message.user, message.client);
    if (!admin) return await message.reply("_I'm not admin_");
    let jid = parsedJid(match);
    await message.kick(jid);
    return await message.reply(`@${jid[0].split("@")[0]} kicked`, { mentions: jid });
  }
);

bot(
  {
    pattern: "promote",
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
    pattern: "demote",
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
    pattern: "mute",
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
    if (match.split(",") < 2) return await message.reply("_Need options!_\n*Example: poll head,option1,option2,option3...*")    
    let options = [];
    for (let i of opt.split(',')) { options.push({ optionName: i }); }
    return await message.client.relayMessage(message.jid, { pollCreationMessage: { name: poll, options, selectableOptionsCount: 0, }, }, {});
  }
);
