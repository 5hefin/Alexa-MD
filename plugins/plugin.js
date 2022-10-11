const {
  bot,
  PluginDB,
  setPlugin,
  getPlugin,
  delPlugin,
} = require("../lib/");
const fs = require("fs");
const got = require("got");
const axios = require("axios");

bot(
  {
    pattern: "plugin ?(.*)",
    fromMe: true,
    desc: "Installs External plugins",
    type: "user",
  },
  async (message, match) => {
    match = match || message.reply_message.text
    if (!match && match !== "list") return await message.reply("_Example :_\nplugin url\nplugin list")
    if (match == "list") {
    const plugins = await getPlugin();
    if (!plugins) return await message.reply("_Plugins not installed_");
    let msg = "";
    plugins.map(({ name, url }) => { msg += `*${name}* : ${url}\n` })
    return await message.reply(msg);
    }
    let links = match.match(/\bhttps?:\/\/\S+/gi);
    if (!links) {
    const getplugin = await getPlugin(match);
    if (!getplugin) return await message.reply("_Plugins not installed_");
    let snkl = "";
    getplugin.map(({ name }) => { snkl += url })
    return await message.reply(snkl);
    }
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
    await message.reply("_Newly installed plugin: " + plugin_name_temp.join(", ") + "_");
    }
  }
);

bot(
  {
    pattern: "remove ?(.*)",
    fromMe: true,
    desc: "Remove external plugins",
    type: "user",
  },
  async (message, match) => {
    if (!match) return await message.reply("_Example :_\nremove emoji\nremove all")
    if (match == "all") { 
      await delPlugin()
      return await message.send("_All plugins deleted Successfully_");
    }
    const isDeleted = await delPlugin(match)
    if (!isDeleted) return await message.reply(`_Plugin ${match} not found_`);
    delete require.cache[require.resolve("./" + match + ".js")]
    fs.unlinkSync("./plugins/" + match + ".js");
    await message.reply(`Plugin ${match} deleted`);
  }
);
