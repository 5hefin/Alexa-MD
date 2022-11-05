const simpleGit = require('simple-git');
const git = simpleGit();
const { bot, updateCheck, updateNow, secondsToHms, sendButton } = require('../lib');
const config = require('../config');
const { SUDO } = require('../config');
const Heroku = require('heroku-client');
const heroku = new Heroku({ token: config.HEROKU_API_KEY })
const baseURI = '/apps/' + config.HEROKU_APP_NAME

bot(
  {
    pattern: 'restart',
    fromMe: true,
    desc: 'Restart the bot',
    type: 'heroku',
  },
  async (message) => {
    await message.send(`_Restarting_`)
    await heroku.delete(baseURI + '/dynos').catch(async (error) => {
    await message.send(`HEROKU : ${error.body.message}`);})
  }
);

bot(
  {
    pattern: 'shutdown',
    fromMe: true,
    desc: 'Shutdown the bot.',
    type: 'heroku',
  },
  async (message) => {
    await heroku.get(baseURI + '/formation').then(async (formation) => {
    await message.send(`_Shuttind down._`)
    await heroku.patch(baseURI + '/formation/' + formation[0].id, { body: { quantity: 0 }, }) }).catch(async (error) => {
    await message.send(`HEROKU : ${error.body.message}`);})
  }
);

bot(
  {
    pattern: "setvar ?(.*)",
    fromMe: true,
    desc: "Set heroku env",
    type: "heroku",
  },
  async (message, match) => {
    if (!match) return await message.sendMessage(`_Example: .setvar SUDO:919567489404_`);
    const [key, value] = match.split(":");
    if (!key || !value) return await message.sendMessage(`_Example: .setvar SUDO:918113921898_`);
    heroku.patch(baseURI + "/config-vars", {
    body: { [key.toUpperCase()]: value },
    }).then(async () => {
    await message.sendMessage(`_${key.toUpperCase()}: ${value}_`);
    }).catch(async (error) => {
    await message.sendMessage(`HEROKU : ${error.body.message}`);
    });
  }
);

bot(
  {
    pattern: "delvar ?(.*)",
    fromMe: true,
    desc: "Delete Heroku env",
    type: "heroku",
  },
  async (message, match) => {
    if (!match) return await message.sendMessage(`_Example: delvar sudo_`);
    heroku.get(baseURI + "/config-vars").then(async (vars) => {
    const key = match.trim().toUpperCase();
    if (vars[key]) { await heroku.patch(baseURI + "/config-vars", {
    body: { [key]: null },
    });
    return await message.sendMessage(`_Deleted ${key}_`);
    }
    await message.sendMessage(`_${key} not found_`);
    }).catch(async (error) => {
    await message.sendMessage(`HEROKU : ${error.body.message}`);
    });
  }
);

bot(
  {
    pattern: "getvar ?(.*)",
    fromMe: true,
    desc: "Show heroku env",
    type: "heroku",
  },
  async (message, match) => {
    if (!match) return await message.sendMessage(`_Example: getvar sudo_`);
    const key = match.trim().toUpperCase();
    heroku.get(baseURI + "/config-vars").then(async (vars) => {
    if (vars[key]) {
    return await message.sendMessage("_{} : {}_".replace("{}", key).replace("{}", vars[key]));
    }
    await message.sendMessage(`${key} not found`);
    }).catch(async (error) => {
    await message.sendMessage(`HEROKU : ${error.body.message}`);
    });
  }
);

bot(
  {
    pattern: "allvar",
    fromMe: true,
    desc: "Heroku all env",
    type: "heroku",
  },
  async (message) => {
    let msg = "```Here your all Heroku vars\n\n\n";
    heroku.get(baseURI + "/config-vars").then(async (keys) => {
    for (const key in keys) {
    msg += `${key} : ${keys[key]}\n\n`;
    }
    return await message.sendMessage(msg + "```");
    }).catch(async (error) => {
    await message.sendMessage(`HEROKU : ${error.body.message}`);
    });
  }
);

bot(
  {
    pattern: "mode ?(.*)",
    fromMe: true,
    desc: "Change bot mode to public & private",
    type: "heroku",
  },
  async (message) => {
    const { HANDLERS } = require("../config");
    var a = HANDLERS.replace("[", "").replace("]", "");
    var g;
    if (a == "null") g = "";
    else g = a.split("")[0]
    // const prefix = HANDLERS == "null" ? " " : a.split("")[0]
    // const s = HANDLERS == "null" ? "Hlo" : a.split("")[0]   
    const buttons = [
      {buttonId: g+'setvar MODE:public', buttonText: {displayText: 'Public'}, type: 1},
      {buttonId: g+'setvar MODE:private', buttonText: {displayText: 'Private'}, type: 1}
    ]
    await sendButton(buttons, "*Working mode control panel*", "Bot is currently running on "+config.MODE+" mode now", message)
    await message.reply(g+"alive");
  }
);

bot(
  {
    pattern: "update ?(.*)",
    fromMe: true,
    desc: "Check or start bot updates.",
    type: "heroku",
  },
  async (message, match) => {
    if (!match || match === "check") { return await updateCheck(message); }
    else if (match === "now" || match === "start") { return await updateNow(message); }
  }
);

bot(
  {
    pattern: "setsudo ?(.*)",
    fromMe: true,
    desc: "Add replied or mentioned or given num to sudo",
    type: "heroku",
  },
  async (message, match) => {
    var newSudo = (message.mention[0] || message.reply_message.jid || match).split("@")[0]
    if (!newSudo) return await message.reply("_Need number/reply/mention_");
    var setSudo = (SUDO+","+newSudo).replace(/,,/g,",");
    setSudo = setSudo.startsWith(",") ? setSudo.replace(",","") : setSudo
    await message.reply('```New SUDO Numbers are: ```'+setSudo)
    await heroku.patch(baseURI + '/config-vars', {body: {"SUDO": setSudo}}).then(async (app) => {});
  }
);

bot(
  {
    pattern: "delsudo ?(.*)",
    fromMe: true,
    desc: "Remove replied or mentioned or given num to sudo",
    type: "heroku",
  },
  async (message, match) => {
    var newSudo = (message.mention[0] || message.reply_message.jid || match).split("@")[0]
    if (!newSudo) return await message.reply("_Need number/reply/mention_");
    var setSudo = SUDO.replace(newSudo,"").replace(/,,/g,",");
    setSudo = setSudo.startsWith(",") ? setSudo.replace(",","") : setSudo
    await message.reply('```New SUDO Numbers are: ```'+setSudo)
    await heroku.patch(baseURI + '/config-vars', {body: { "SUDO": setSudo}}).then(async (app) => {});
  }
);

bot(
  {
    pattern: "getsudo ?(.*)",
    fromMe: true,
    desc: "shows sudo",
    type: "heroku",
  },
  async (message, match) => {
    const vars = await heroku.get(baseURI + '/config-vars').catch(async (error) => {
    return await message.send('HEROKU : ' + error.body.message) })
    await message.reply('```' + `SUDO Numbers are : ${vars.SUDO}` + '```')
  }
);
