const {
  bot,
  setMention,
  getMention,
  setStatus,
  getStatus,
  deleteMention,
  mentionManager,
  mentionResponce,
} = require("../lib/");

bot(
  {
    pattern: "mention ?(.*)",
    fromMe: true,
    desc: "To set and Manage mention",
    type: "user",
  },
  async (message, match) => {
    if (!match) {
      return await mentionManager(message);
    }    
    if (match === "get") {
      let msg = await getMention();
      if (!msg) return await message.reply("_There is no Mention msg set_");
      return message.reply(msg.message);
    }
    if (match === "on") {
      let msg = await getMention();
      let status = await getStatus();
      if (!msg) return await message.reply("_There is no Mention message to enable_");
      if (status) return await message.reply("_Mention already enabled_");
      await setStatus();
      return await message.reply("_Mention enabled_");
    }
    if (match === "off") {
      let status = await getStatus();
      if (!status) return await message.reply("_Mention already disabled_");
      await setStatus();
      return await message.reply("_Mention disabled_");
    }
    if (match == "delete") {
      await deleteMention();
      return await message.reply("_Mention deleted succesfully_");
    }
    await setMention(match);
    return await message.reply("_Mention set succesfully_");
  }
);

bot(
  {
    on: "text",
    fromMe: false,
  },
  async (message, m) => {
    await mentionResponce(m, message)
  }
);

