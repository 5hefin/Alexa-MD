const { bot, getUrl, PluginDB, setPlugin, getPlugin } = require("../lib/");
const got = require("got");
const axios = require('axios');
const fs = require('fs');
const { format } = require('util')

bot(
  {
    pattern: "install",
    fromMe: true,
    desc: "Installs External plugins",
    type: "user"
  },
  async (message, match) => {
    match = match || message.reply_message.text
    if (!match || !/\bhttps?:\/\/\S+/gi.test(match)) return await message.reply('_Need a URL!\n Example:_ .install https://gist.git....')
    let links = match.match(/\bhttps?:\/\/\S+/gi);
    for (let link of links) {
      try {
        var url = new URL(link);
      } catch {
        return await message.reply("_Invalid url!_");
      }

      if (url.host === "gist.github.com") {
          url.host = "gist.githubusercontent.com";
          url = url.toString() + "/raw"
      } else {
          url = url.toString()
      }

      try {
        var response = await axios(url + "?timestamp=" + new Date());
      } catch {
        return await message.reply("_Invalid url!_")
      }

      let plugin_name = /pattern: ["'](.*)["'],/g.exec(response.data)
      var plugin_name_temp = response.data.match(/pattern: ["'](.*)["'],/g) ? response.data.match(/pattern: ["'](.*)["'],/g).map(e => e.replace("pattern", "").replace(/[^a-zA-Z]/g, "")) : "temp"

      try {
        plugin_name = plugin_name[1].split(" ")[0]
      } catch {
        return await message.reply("_Invalid plugin. No plugin name found!_")
      }

      fs.writeFileSync("./plugins/" + plugin_name + ".js", response.data);

      try {
        require("./" + plugin_name);
      } catch (e) {
        fs.unlinkSync("/root/Alexa/plugins/" + plugin_name + ".js")
        return await message.reply("_Error in plugin!_\n" + format(e));
      }

      await setPlugin(url, plugin_name);
      await message.reply("_Installed: " + plugin_name_temp.join(", ") + " ✅_");
    }
  }
);

bot(
  {
    pattern: "plugin",
    fromMe: true,
    desc: "Plugin list",
    type: "user",
  },
  async (message, match) => {
    const plugins = await getPlugin();
    if (!plugins) return await message.reply("_Plugins not installed_");
    let msg = '';
    plugins.map(({ name, url }) => { msg += `${name} : ${url}\n` });
    return await message.sendMessage('```' + msg + '```');
  }
);

bot(
  {
    pattern: "remove(?: |$)(.*)",
    fromMe: true,
    desc: "Remove external plugins",
    type: 'user'
  },
  async (message, match) => {
    if (!match) return await message.sendMessage("_Need a plugin name_");

    var plugin = await PluginDB.findAll({ where: { name: match } });

    if (plugin.length < 1) {
      return await message.sendMessage("_Plugin not found_");
    } else {
      await plugin[0].destroy();
      delete require.cache[require.resolve("./" + match + ".js")];
      fs.unlinkSync("./plugins/" + match + ".js");
      await message.sendMessage(`Plugin ${match} deleted`);
    }
  }
);
