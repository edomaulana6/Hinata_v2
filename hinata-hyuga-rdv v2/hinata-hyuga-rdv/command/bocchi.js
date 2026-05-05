/*

GitHub   : https://github.com/rizaldevx
YouTube  : https://www.youtube.com/@rizeldev
WhatsApp : https://wa.me/6288213993436
Telegram : @rizeldev

*/

require('../settings/config');

let handler = async (m, { client, text, reaction, reply, prefix, command, fetchJson }) => {
    if (!text) return reply(`\n*ex:* ${prefix + command} haii\n`)
    let a = await fetchJson(`https://www.laurine.site/api/cai/bocchi?query=${text}`)
    let b = a.data
    client.sendMessage(m.chat, { 
        text: b,
        contextInfo: {
            mentionedJid: [m.sender],
            forwardedNewsletterMessageInfo: {
                newsletterName: "silence-md",
                newsletterJid: `120363363009408737@newsletter`
            },
            isForwarded: true,
            externalAdReply: {
                showAdAttribution: false,
                renderLargerThumbnail: true,
                title: `© rizaldev-ai-2022-2025`,
                body: `c-ai rizaldev`,
                mediaType: 1,
                thumbnailUrl: `https://h2rsi9anqnqbkvkf.public.blob.vercel-storage.com/1000583687-DtExHVXUoK0LK8bNS4DxJWcLWNc2d3.png`,
                thumbnail: ``,
                sourceUrl: `https://whatsapp.com/channel/0029Vaw0AGCEQIarHspllG1i`
            }
        }
    }, { quoted: m });
}

handler.help = ['bocchi ai'];
handler.tags = ['Artificial intelligence'];
handler.command = ["rizalai", "rizaldevai"];

module.exports = handler;
