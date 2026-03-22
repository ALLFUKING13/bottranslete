const { InteractionType, InteractionResponseType, verifyKey } = require('discord-interactions');
const { translateText } = require('../lib/translator');

module.exports = async (req, res) => {
    // Faqat POST so'rovlarini qabul qilamiz
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // Discord imzosini tekshirish (Xavfsizlik uchun)
    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    const isValidRequest = verifyKey(
        JSON.stringify(req.body),
        signature,
        timestamp,
        process.env.DISCORD_PUBLIC_KEY
    );

    if (!isValidRequest) {
        return res.status(401).send('Bad request signature');
    }

    const { type, data } = req.body;

    /**
     * Handle PING (Type 1)
     * Discord URL-ni tekshirganda yuboradi
     */
    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }

    /**
     * Handle APPLICATION_COMMAND (Type 2)
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name, type: cmdType, resolved, target_id } = data;
        const locale = req.body.locale || 'en-US'; 
        // Discord locale-ni Google Translate formatiga o'tkazish (masalan 'en-US' -> 'en')
        const targetLang = locale.split('-')[0];

        // Message Context Menu (Type 3)
        if (cmdType === 3 && name === 'Translate') {
            const message = resolved.messages[target_id];
            const text = message.content;

            if (!text) {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: { content: 'Xabarda matn topilmadi.', flags: 64 }
                });
            }

            try {
                const translated = await translateText(text, targetLang);
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: `**Original:** ${text}\n**Tarjima (${targetLang}):** ${translated}`,
                        components: [
                            {
                                type: 1, // Action Row
                                components: [
                                    { type: 2, label: '🇺🇿 O\'zbekcha', style: 1, custom_id: `tr_uz_${target_id}` },
                                    { type: 2, label: '🇬🇧 English', style: 1, custom_id: `tr_en_${target_id}` },
                                    { type: 2, label: '🇷🇺 Русский', style: 1, custom_id: `tr_ru_${target_id}` }
                                ]
                            }
                        ]
                    }
                });
            } catch (error) {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: { content: `Xatolik: ${error.message}`, flags: 64 }
                });
            }
        }
    }

    /**
     * Handle MESSAGE_COMPONENT (Type 3) - Tugmalar bosilganda
     */
    if (type === InteractionType.MESSAGE_COMPONENT) {
        const { custom_id } = data;
        const { message } = req.body;
        
        if (custom_id.startsWith('tr_')) {
            const [_, lang] = custom_id.split('_');
            
            // Xabar tarkibidan asl matnni aniqroq ajratib olish
            const lines = message.content.split('\n');
            const originalLine = lines.find(l => l.startsWith('**Original:**'));
            const originalText = originalLine ? originalLine.replace('**Original:** ', '') : null;

            if (!originalText) {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: { content: 'Asl matnni aniqlab bo\'lmadi.', flags: 64 }
                });
            }

            try {
                const translated = await translateText(originalText, lang);
                return res.send({
                    type: InteractionResponseType.UPDATE_MESSAGE,
                    data: {
                        content: `**Original:** ${originalText}\n**Tarjima (${lang}):** ${translated}`
                    }
                });
            } catch (error) {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: { content: `Xatolik: ${error.message}`, flags: 64 }
                });
            }
        }
    }

    return res.status(400).send('Unknown interaction type');
};
