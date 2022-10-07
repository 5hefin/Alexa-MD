const { bot, sendAlive }  = require("../lib");
const { MODE } = require("../config");
var isPublic = MODE == 'public' ? false : true

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
