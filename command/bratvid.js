/*

GitHub   : https://github.com/rizaldevx
YouTube  : https://www.youtube.com/@rizeldev
WhatsApp : https://wa.me/6288213993436
Telegram : @rizeldev

*/

require('../settings/config');

let handler = async (m, { client, text, reaction, reply, prefix, command }) => {
  if (!text) return reply(`\n*ex:* ${prefix + command} apanih cok\n`)
  const media = `https://brat.caliphdev.com/api/brat/animate?text=${text}`;
  await reaction(m.chat, "⚡")

  client.sendVideoAsSticker(m.chat, media, m, {
    packname: packname,
    author: author
  });
}

handler.help = ['sticker brat'];
handler.tags = ['sticker'];
handler.command = ["bratvid", "bratvideo"];

module.exports = handler;
