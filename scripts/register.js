require('dotenv').config();
const fetch = require('node-fetch');

const APP_ID = process.env.DISCORD_APP_ID;
const TOKEN = process.env.DISCORD_TOKEN;

const commands = [
    {
        name: 'Translate',
        type: 3 // MESSAGE context menu
    }
];

async function registerCommands() {
    const url = `https://discord.com/api/v10/applications/${APP_ID}/commands`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bot ${TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(commands)
    });

    if (response.ok) {
        console.log('Slash buyruqlari muvaffaqiyatli ro\'yxatdan o\'tdi!');
    } else {
        const error = await response.json();
        console.error('Xatolik:', error);
    }
}

registerCommands();
