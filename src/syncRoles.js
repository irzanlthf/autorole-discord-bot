const config = require("../config/config");

const {
    getSheetData,
    batchUpdateStatus,
} = require("./googleSheet");

const {
    getGuild,
    fetchMembers,
    buildUsernameMap,
} = require("./bot");

function getTimestamp() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    const parts = Object.fromEntries(
        formatter.formatToParts(now).map(part => [part.type, part.value])
    );

    return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}

async function syncRoles() {

    console.log("\n===================");
    console.log("ROLE SYNCHRONIZATION");
    console.log("=====================\n");

    // ==========================
    // Ambil Data Google Sheet
    // ==========================

    const sheet = await getSheetData();
    const rows = sheet.rows;
    const usernameIndex = sheet.usernameIndex;
    const statusIndex = sheet.statusIndex;
    const startTime = Date.now();
    const timestamp = getTimestamp();

    // ==========================
    // Discord
    // ==========================

    const guild = await getGuild();
    const role = await guild.roles.fetch(config.roleId);
    const members = await fetchMembers(guild);
    const usernameMap = buildUsernameMap(members);

    // ==========================
    // Summary
    // ==========================

    const summary = {
        checked: 0,
        success: 0,
        alreadyRole: 0,
        userNotFound: [],
        updates: [],
        syncTime: timestamp,
    };

    // ==========================
    // Loop
    // ==========================

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNumber = i + 2;
        const username = (row[usernameIndex] || "")
            .trim()
            .toLowerCase();
        const status = (row[statusIndex] || "")
            .trim();

        // Username kosong
        if (!username) {
            continue;
        }

        // Sudah diproses
        if (status !== "") {
            continue;
        }
        summary.checked++;

        // Cari Member
        const member = usernameMap.get(username);

        if (!member) {
            console.log(`❌ ${username}`);
            summary.userNotFound.push(username);
            summary.updates.push({
                rowNumber,
                columnIndex: statusIndex,
                value: `❌ USER_NOT_FOUND | ${timestamp}`,
            });
            continue;
        }

        // Sudah punya role

        if (member.roles.cache.has(role.id)) {
            console.log(`⚠ ${username} sudah memiliki role`);
            summary.alreadyRole++;
            summary.updates.push({
                rowNumber,
                columnIndex: statusIndex,
                value: `✅ DONE | ${timestamp}`,
            });
            continue;
        }

        // Tambah Role

        try {
            await member.roles.add(role);
            console.log(`✅ ${username}`);
            summary.success++;
            summary.updates.push({
                rowNumber,
                columnIndex: statusIndex,
                value: `✅ DONE | ${timestamp}`,
            });
        }

        catch (err) {
            console.log(`🔥 Gagal assign ${username}`);
            console.error(err);
        }
    }

    // ==========================
    // Update Google Sheet
    // ==========================

    await batchUpdateStatus(summary.updates);

    console.log("\n========================================");
    console.log(summary);
    console.log("========================================\n");
    summary.executionTime =
        `${((Date.now() - startTime) / 1000).toFixed(2)} s`;
    return summary;
}

module.exports = {
    syncRoles,
};