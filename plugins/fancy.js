const { bot, styletext, Fancy } = require('../lib/');
const { MODE } = require("../config");
var isPublic = MODE == 'public' ? false : true

bot({pattern: "fancy ?(.*)", fromMe: isPublic, desc: "change text to fancy text fonts", type: "converter"}, async (message, match) => {
if (!message.reply_message && !message.reply_message.text) return await message.reply("*Example :*\nfancy 32 replying text message")
try { var result = await Fancy(message.reply_message.text, match) } catch (e) { return await message.reply(e.message) }
await message.reply(result)
});

bot({pattern: "styletext ?(.*)", fromMe: isPublic, desc: "change text to styletext", type: "converter"}, async (message, match) => {
match = match || message.reply_message.text
if (!match) return await message.reply("_Need Text_\n*Example* : styletext Shefin")
const res = await styletext(match)
let text = '', no = 1
for (let i of res) { text += `${no++}. ${i.result}\n\n` }
await message.reply(text)
});
