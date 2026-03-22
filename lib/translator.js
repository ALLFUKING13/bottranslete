const translate = require('google-translate-api-x');

/**
 * Tarjima qilish funksiyasi
 * @param {string} text - Tarjima qilinadigan matn
 * @param {string} to - Qaysi tilga (kod: 'uz', 'en', 'ru' va h.k.)
 * @returns {Promise<string>}
 */
async function translateText(text, to) {
    try {
        const res = await translate(text, { to: to });
        return res.text;
    } catch (err) {
        console.error('Tarjima xatosi tafsiloti:', err);
        // Aniqroq xatoni Discord-ga qaytaramiz
        throw new Error(`Tarjima xatosi: ${err.message || 'Noma\'lum xato'}`);
    }
}

module.exports = { translateText };
