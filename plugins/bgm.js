const {
    bot,
    getBuffer,
    toAudio
} = require("../lib/");

bot(
  {
    on: "text",
    fromMe: false,
  },
  async (message, match) => {
    const array = ['Ayin','Ayinu','Bgm','Bot','Bye','Da','Good night','Hello','Hi','Neymar','Pm','Sed','alive','assist','ban','bgm','bot','converting','fake','fork','fuck','music','myre','njan','number','oombi','para','poda','raganork','remove','reply','sed','subscribe','umma','xxxtentation']
    array.map( async (a) => {
    let pattern = new RegExp(`\\b${a}\\b`, 'g');
    if(pattern.test(message.text)){
    const Audio = await getBuffer('https://github.com/souravkl11/Raganork-legacy/blob/master/sourav/' + a + '.mp3?raw=true')
    try { var res = await toAudio(Audio, 'mp4') } catch(e) { return await message.sendMessage(`Error on parsing audio \n ${e}`) }
    return messsge.client.sendMessage(message.chat, { audio: Buffer.from(res.arrayBuffer), mimetype:'audio/mpeg', ptt: true }, { quoted: message.data })
    }
   }
  )
 }
);
