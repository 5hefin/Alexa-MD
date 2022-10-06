const { bot, sendAlive }  = require("../lib");

bot(
  {
    pattern: "alive ?(.*)",
    fromMe: true,
    desc: "Does bot work?",
    type: "info"
  },
  async (message, match) => {
    await sendAlive(message, match);
  }
);
