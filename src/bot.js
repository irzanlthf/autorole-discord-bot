const {
    Client,
    GatewayIntentBits,
} = require("discord.js");

const config = require("../config/config");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ],
});

// ===============================
// Login Bot
// ===============================

async function loginBot() {
    await client.login(config.discordToken);
    return new Promise((resolve) => {

        client.once("clientReady", async () => {
            console.log(`✅ Login sebagai ${client.user.tag}`);
            resolve();
        });
    });
}

// ===============================
// Ambil Guild
// ===============================

async function getGuild() {
    return await client.guilds.fetch(config.guildId);
}

// ===============================
// Fetch Semua Member
// ===============================

async function fetchMembers(guild) {
    console.log("\n📦 Fetching Members...");
    console.time("Fetch Members");

    const members = await guild.members.fetch();

    console.timeEnd("Fetch Members");
    console.log(`👥 Total Member : ${members.size}`);
    return members;
}

// ===============================
// Build Username Map
// ===============================

function buildUsernameMap(members) {

    console.log("\n🗂 Building Username Map...");
    console.time("Build Map");

    const usernameMap = new Map();
    for (const member of members.values()) {

        usernameMap.set(
            member.user.username
                .trim()
                .toLowerCase(),
            member
        );
    }

    console.timeEnd("Build Map");
    console.log(`🧠 Username Loaded : ${usernameMap.size}`);
    return usernameMap;
}

module.exports = {
    client,
    loginBot,
    getGuild,
    fetchMembers,
    buildUsernameMap,
};