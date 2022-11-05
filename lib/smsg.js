const { proto, delay, getContentType } = require('@adiwajshing/baileys')
const fs = require('fs')

exports.smsg = (conn, s, store) => {
    if (!s) return s
    let M = proto.WebMessageInfo
    if (s.key) {
        s.id = s.key.id
        s.isBaileys = s.id.startsWith('BAE5') && s.id.length === 16
        s.chat = s.key.remoteJid
        s.fromMe = s.key.fromMe
        s.isGroup = s.chat.endsWith('@g.us')
        s.sender = conn.decodeJid(s.fromMe && conn.user.id || s.participant || s.key.participant || s.chat || '')
        if (s.isGroup) s.participant = conn.decodeJid(s.key.participant) || ''
    }
    if (s.message) {
        s.mtype = getContentType(s.message)
        s.msg = (s.mtype == 'viewOnceMessage' ? s.message[s.mtype].message[getContentType(s.message[s.mtype].message)] : s.message[s.mtype])
        s.body = s.message.conversation || s.msg.caption || s.msg.text || (s.mtype == 'listResponseMessage') && s.msg.singleSelectReply.selectedRowId || (s.mtype == 'buttonsResponseMessage') && s.msg.selectedButtonId || (s.mtype == 'viewOnceMessage') && s.msg.caption || s.text
        let quoted = s.quoted = s.msg.contextInfo ? s.msg.contextInfo.quotedMessage : null
        s.mentionedJid = s.msg.contextInfo ? s.msg.contextInfo.mentionedJid : []
        if (s.quoted) {
            let type = getContentType(quoted)
			s.quoted = s.quoted[type]
            if (['productMessage'].includes(type)) {
				type = getContentType(s.quoted)
				s.quoted = s.quoted[type]
			}
            if (typeof s.quoted === 'string') s.quoted = {
				text: s.quoted
			}
            s.quoted.mtype = type
            s.quoted.id = s.msg.contextInfo.stanzaId
			s.quoted.chat = s.msg.contextInfo.remoteJid || s.chat
            s.quoted.isBaileys = s.quoted.id ? s.quoted.id.startsWith('BAE5') && s.quoted.id.length === 16 : false
			s.quoted.sender = conn.decodeJid(s.msg.contextInfo.participant)
			s.quoted.fromMe = s.quoted.sender === (conn.user && conn.user.id)
            s.quoted.text = s.quoted.text || s.quoted.caption || s.quoted.conversation || s.quoted.contentText || s.quoted.selectedDisplayText || s.quoted.title || ''
			s.quoted.mentionedJid = s.msg.contextInfo ? s.msg.contextInfo.mentionedJid : []
            s.getQuotedObj = s.getQuotedMessage = async () => {
			if (!s.quoted.id) return false
			let q = await store.loadMessage(s.chat, s.quoted.id, conn)
 			return exports.smsg(conn, q, store)
            }
            let vM = s.quoted.fakeObj = s.fromObject({
                key: {
                    remoteJid: s.quoted.chat,
                    fromMe: s.quoted.fromMe,
                    id: s.quoted.id
                },
                message: quoted,
                ...(s.isGroup ? { participant: s.quoted.sender } : {})
            })

            s.quoted.delete = () => conn.sendMessage(s.quoted.chat, { delete: vs.key })

            s.quoted.copyNForward = (jid, forceForward = false, options = {}) => conn.copyNForward(jid, vM, forceForward, options)

            s.quoted.download = () => conn.downloadMediaMessage(s.quoted)
        }
    }
    if (s.msg.url) s.download = () => conn.downloadMediaMessage(s.msg)
    s.text = s.msg.text || s.msg.caption || s.message.conversation || s.msg.contentText || s.msg.selectedDisplayText || s.msg.title || ''

    s.reply = (text, chatId = s.chat, options = {}) => Buffer.isBuffer(text) ? conn.sendMedia(chatId, text, 'file', '', m, { ...options }) : conn.sendText(chatId, text, m, { ...options })

	s.copy = () => exports.smsg(conn, s.fromObject(s.toObject(m)))

	s.copyNForward = (jid = s.chat, forceForward = false, options = {}) => conn.copyNForward(jid, m, forceForward, options)

    return s
}
