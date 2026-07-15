const { EmbedBuilder } = require("discord.js");

async function sendLog(channel, summary) {
    console.log("========== LOGGER ==========");
    // console.log(summary);
    console.log("Channel :", channel.name);

    if (!channel) {
        console.log("❌ Channel log tidak ditemukan.");
        return;
    }

    const embed = new EmbedBuilder()
        .setColor(summary.userNotFound.length > 0 ? 0xE74C3C : 0x2ECC71)
        .setTitle("🤖 AUTO ROLE REPORT")

        .addFields(
            {
                name: "📊 Checked",
                value: `${summary.checked}`,
                inline: true,
            },
            {
                name: "✅ Success",
                value: `${summary.success}`,
                inline: true,
            },
            {
                name: "⚠ Already Role",
                value: `${summary.alreadyRole}`,
                inline: true,
            },
            {
                name: "❌ USER_NOT_FOUND",
                value:
                    summary.userNotFound.length === 0
                        ? "Tidak ada"
                        : summary.userNotFound.join("\n"),
            },
            {
                name: "⚡ Execution Time",
                value: summary.executionTime,
                inline: true,
                
            },
            {
                name: "🕒 Sync Time",
                value: `${summary.syncTime} WIB`,
                inline: true,
            }
        )
        .setTimestamp();

    await channel.send({
        embeds: [embed],
    });
}

module.exports = {
    sendLog,
};