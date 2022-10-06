/*
const {
  bot,
  setFilter,
  getFilter,
  deleteFilter
} = require("../lib/");

bot(
  {
    pattern: "filter ?(.*)",
    fromMe: true,
    desc: "filter in groups.",
    type: "user",
  },
  async (message, match) => {
    match = match.match(/[\'\"](.*?)[\'\"]/gms)
    if (!match) { const filters = await getFilter(message.jid)
    if (!filters) return await message.send(`_Not set any filter_\n*Example filter 'hi' 'hello'*`)
    let msg = ''
    filters.map(({ pattern }) => {
    msg += `=> ${pattern} \n`
    })
    return await message.send(msg.trim())
    } else {
    if (match.length < 2) { return await message.send(`Example filter 'hi' 'hello'`) }
    await setFilter(
        message.jid,
        match[0].replace(/['"]+/g, ''),
        match[1].replace(/['"]+/g, ''),
        match[0][0] === "'" ? true : false
    );
    await message.send(`_${match[0].replace(/['"]+/g, '')}_ added to filters.`)
    }
  }
);
*/
