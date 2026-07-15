const { loginBot } = require("./bot");
const { startScheduler } = require("./scheduler");

async function main() {

    console.clear();

    console.log("======================================");
    console.log("AUTO ROLE BOT");
    console.log("======================================");

    await loginBot();

    startScheduler();

}

main();