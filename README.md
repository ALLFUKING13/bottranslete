# Discord Tarjimon Bot

Ushbu bot Discord-dagi xabarlarni Google Translate yordamida tarjima qiladi. Vercel Serverless Functions-da ishlashga moslashtirilgan.

## O'rnatish va Sozlash

### 1. Discord Botini Yaratish
1. [Discord Developer Portal](https://discord.com/developers/applications) sahifasiga o'ting.
2. **New Application** tugmasini bosing va nom bering.
3. **Bot** bo'limida **Reset Token** tugmasini bosing va tokenni nusxalab oling (`DISCORD_TOKEN`).
4. **General Information** bo'limidan **Application ID** (`DISCORD_APP_ID`) va **Public Key** (`DISCORD_PUBLIC_KEY`) nusxalab oling.

### 2. GitHub-ga Yuklash
Ushbu papkadagi barcha fayllarni yangi GitHub repozitoriyasiga yuklang.

### 3. Vercel-ga Joylashtirish (Deploy)
1. [Vercel](https://vercel.com/) sahifasiga kiring va GitHub repozitoriyangizni import qiling.
2. **Environment Variables** bo'limiga quyidagilarni qo'shing:
   - `DISCORD_TOKEN`: (Siz olgan token)
   - `DISCORD_APP_ID`: (Siz olgan App ID)
   - `DISCORD_PUBLIC_KEY`: (Siz olgan Public Key)
3. **Deploy** tugmasini bosing.

### 4. Aktivlashtirish
Vercel-ga joylashtirgandan so'ng, "Translate" buyrug'ini Discord-da paydo bo'lishi uchun quyidagilarni bajaring:
1. `.env` fayliga ma'lumotlarni kiriting.
2. Terminalda: `npm install` va so'ngra `node scripts/register.js`.

### 5. Interactions Endpoint URL
Vercel manzilingizni Discord Developer Portal-da `Interactions Endpoint URL` qismiga saqlang.

## Foydalanish
1. Discord-da istalgan xabarni ustiga oling.
2. **O'ng tugmani bosing** (yoki mobile'da bosing turing) -> **Apps** -> **Translate**.
3. Bot sizning Discord tilingizga qarab avtomatik tarjima qiladi.
4. Agar boshqa til kerak bo'lsa, xabar ostidagi **🇺🇿 O'zbekcha**, **🇬🇧 English** yoki **🇷🇺 Русский** tugmalaridan birini bosing.
