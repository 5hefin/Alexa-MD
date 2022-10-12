const { bot, sendAlive, isPublic }  = require("../lib");

bot(
  {
    pattern: "alive ?(.*)",
    fromMe: isPublic,
    desc: "Does bot work?",
    type: "info"
  },
  async (message, match) => {
    await sendAlive(message, match);
  }
);
