const {
    bot,
    isAdmin,
    parseJid
} = require('../lib/');

bot({
    pattern: 'promote ?(.*)',
    fromMe: true,
    type: 'group',
    desc: "test"
}, async (message, match) => {
    const user = message.mention[0] || message.reply_message.jid
    if (!user) return await message.reply("Test")
    if (!message.isGroup) return await message.reply("group")
    var admin = await isAdmin(message);
    if (!admin) return await message.reply("not edmin")
    await message.client.sendMessage(message.jid, {
        text: parseJid(user) + "Promote",
        mentions: [user]
    })
    await message.client.groupParticipantsUpdate(message.jid, [user], "promote")
})
