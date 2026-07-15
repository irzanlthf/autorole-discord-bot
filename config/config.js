require("dotenv").config();

module.exports = {
    discordToken: process.env.DISCORD_TOKEN,
    guildId: process.env.GUILD_ID,
    roleId: process.env.ROLE_ID,
    logChannelId: process.env.LOG_CHANNEL_ID,

    sheetId: process.env.GOOGLE_SHEET_ID,
    sheetName: process.env.SHEET_NAME
};