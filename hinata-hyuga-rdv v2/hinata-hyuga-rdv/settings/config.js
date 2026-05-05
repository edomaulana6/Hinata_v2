/*

GitHub   : https://github.com/rizaldevx
YouTube  : https://www.youtube.com/@rizeldev
WhatsApp : https://wa.me/6288213993436
Telegram : @zal_x_u

*/
const fs = require('fs')

//~~~~~~~~~ Setting Owner ~~~~~~~~~~//
global.owner = "6283119115977"
global.namaowner = "rizaldev"

//~~~~~~~~~ Setting Channel ~~~~~~~~~~//
global.namach = "rizaldev informasi bot WhatsApp 💭"
global.linkch = "https://whatsapp.com/channel/0029Vaw0AGCEQIarHspllG1i"
global.idch = "120363363009408737@newsletter"

//~~~~~~~~~ Setting Packname ~~~~~~~~~~//
global.packname = "srizaldev"
global.author = "https://wa.me/6283119115977"

//~~~~~~~~~ Setting Status ~~~~~~~~~~//
global.status = true
global.welcome = true

//~~~~~~~~~ Setting Apikey ~~~~~~~~~~//
global.KEY = "GET APIKEY elevenlabs.io"
global.IDVOICE = "GET ON elevenlabs.io"

global.pairing = "RIZALDEV"

//~~~~~~~~~ Setting Message ~~~~~~~~~~//
global.mess = {
    owner: "Fitur ini khusus untuk owner!", 
    group: "Fitur ini untuk dalam grup!", 
    private: "Fitur ini untuk dalam private chat!", 
}

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
