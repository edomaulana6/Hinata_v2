console.clear();
console.log('starting...');
require('./settings/config');
process.on("uncaughtException", console.error);

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    jidDecode,
    proto,
    makeCacheableSignalKeyStore,
    Browsers
} = require("@whiskeysockets/baileys");

const chalk = require('chalk');
const pino = require('pino');
const readline = require("readline");
const fs = require('fs');

const question = (text) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(text, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

async function clientstart() {
    const { state, saveCreds } = await useMultiFileAuthState(`./session`)
    const usePairingCode = true

    const client = makeWASocket({
        printQRInTerminal: false,
        logger: pino({ level: 'fatal' }),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino().child({ level: 'silent' })),
        },
        browser: ["Ubuntu", "Chrome", "20.0.04"],
    });

    // --- LOGIC PAIRING OTOMATIS (MODIFIED) ---
    if (usePairingCode && !client.authState.creds.registered) {
        let phoneNumber = global.owner ? global.owner.replace(/[^0-9]/g, '') : '';

        if (phoneNumber && phoneNumber.length > 5) {
            console.log(chalk.black(chalk.bgCyan(` SYSTEM `)), chalk.cyan(`Nomor Bot Terdeteksi: ${phoneNumber}. Meminta kode pairing...`));
            
            setTimeout(async () => {
                try {
                    let code = await client.requestPairingCode(phoneNumber);
                    code = code?.match(/.{1,4}/g)?.join("-") || code;
                    console.log(chalk.black(chalk.bgGreen(` PAIRING CODE `)), chalk.black(chalk.bgWhite(` ${code} `)));
                } catch (error) {
                    console.error(chalk.red('Gagal meminta pairing code:'), error);
                }
            }, 10000);
        } else {
            const inputNumber = await question(chalk.blue.bold('\nNomor tidak terdeteksi di config. Masukan nomor (628xxx): '));
            const num = inputNumber.replace(/[^0-9]/g, '');
            let code = await client.requestPairingCode(num);
            code = code?.match(/.{1,4}/g)?.join("-") || code;
            console.log(chalk.black(chalk.bgGreen(` PAIRING CODE `)), chalk.black(chalk.bgWhite(` ${code} `)));
        }
    }

    client.ev.on('creds.update', saveCreds);
    
    client.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) clientstart();
        } else if (connection === 'open') {
            console.log(chalk.green('Bot Berhasil Tersambung!'));
        }
    });

    return client;
}

clientstart();
