/*

GitHub   : https://github.com/rizaldevx
YouTube  : https://www.youtube.com/@rizeldev
WhatsApp : https://wa.me/6288213993436
Telegram : @zal_x_u

*/

const fetch = require('node-fetch');

async function igdl(query) {
  try {
    const response = await fetch(`https://api.siputzx.my.id/api/d/igdl?url=${query}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

module.exports = { igdl }
