const { syncRoles } = require("./syncRoles");
const { sendLog } = require("./logger");
const { getGuild } = require("./bot");
const config = require("../config/config");

let isRunning = false;

async function runSync() {

    if (isRunning) {

        console.log("⚠ Sinkronisasi sebelumnya masih berjalan.");

        return;

    }

    isRunning = true;

    try {

        console.log("\n======================================");
        console.log("AUTO ROLE SYNC");
        console.log("======================================");

        const summary = await syncRoles();

        // Tidak kirim log jika tidak ada data baru
        if (summary.checked > 0) {

            const guild = await getGuild();

            const channel = await guild.channels.fetch(config.logChannelId);

            await sendLog(channel, summary);

        } else {

            console.log("📭 Tidak ada data baru.");

        }

    }

    catch (err) {

        console.error(err);

    }

    finally {

        isRunning = false;

    }

}

function startScheduler() {

    console.log("⏰ Scheduler Started");

    // Jalankan sekali saat startup
    runSync();

    // Jalankan setiap 20 menit
    //setInterval(runSync, 20 * 60 * 1000);
    
    // 1 menit (untuk test)
    setInterval(runSync, 60 * 1000);

}

module.exports = {

    startScheduler,

};