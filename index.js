console.clear();
console.log('starting...');
require('./settings/config');

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers,
    getContentType
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const { Boom } = require("@hapi/boom");
const { exec } = require("child_process");
const fs = require("fs");
const chalk = require("chalk");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        browser: ["Ubuntu", "Chrome", "20.0.04"],
    });

    // --- LOGIKA PAIRING OTOMATIS & VALID ---
    if (!sock.authState.creds.registered) {
        let phoneNumber = global.pairing ? global.pairing.replace(/[^0-9]/g, '') : '';
        
        if (phoneNumber) {
            // Beri jeda 10 detik agar koneksi internet di server stabil dulu
            console.log(chalk.cyan(`[ SYSTEM ] Menunggu koneksi stabil sebelum meminta kode...`));
            setTimeout(async () => {
                try {
                    console.log(chalk.yellow(`[ SYSTEM ] Meminta kode pairing untuk: ${phoneNumber}`));
                    let code = await sock.requestPairingCode(phoneNumber);
                    code = code?.match(/.{1,4}/g)?.join("-") || code;
                    console.log(chalk.black(chalk.bgGreen(` PAIRING CODE `), chalk.bgWhite(chalk.black(` ${code} `))));
                } catch (err) {
                    console.log(chalk.red(` Gagal mendapatkan kode, mencoba ulang...`));
                }
            }, 10000); 
        }
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const error = lastDisconnect?.error;
            const shouldReconnect = (error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log(chalk.green('--- BOT BERHASIL TERSAMBUNG ---'));
        }
    });

    // --- BAGIAN PESAN (UPSERT) ---
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;
        const from = msg.key.remoteJid;

        // Abaikan Grup & Broadcast
        if (from.endsWith('@g.us') || from.endsWith('@broadcast')) return; 

        const type = getContentType(msg.message);
        const body = (type === 'conversation') ? msg.message.conversation : 
                     (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : '';
        
        const command = body.trim().split(/ +/)[0].toLowerCase();
        
        if (command === '.menu') {
            await sock.sendMessage(from, { text: 'Bot Online!' }, { quoted: msg });
        }
    });
}

startBot();
