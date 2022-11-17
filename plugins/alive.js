const { bot, aliveMessage, isPublic }  = require("../lib");

bot(
  {
    pattern: "alive ?(.*)",
    fromMe: isPublic,
    desc: "Does bot work?",
    type: "info"
  },
  async (message, match) => {
    await aliveMessage(message, match);
  }
);
