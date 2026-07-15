const { google } = require("googleapis");
const path = require("path");
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
const config = require("../config/config");

let auth;

if (process.env.GOOGLE_CREDENTIALS) {

    auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
        scopes: [
            "https://www.googleapis.com/auth/spreadsheets",
        ],
    });

} else {

    auth = new google.auth.GoogleAuth({
        keyFile: path.join(
            __dirname,
            "../credentials/discord-role-bot-502513-7f93320d1cf4.json"
        ),
        scopes: [
            "https://www.googleapis.com/auth/spreadsheets",
        ],
    });

}

const sheets = google.sheets({
    version: "v4",
    auth,
});

async function getSheetData() {

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: config.sheetId,
        range: config.sheetName,
    });
    const values = response.data.values || [];

    if (values.length === 0) {
        throw new Error("Google Sheet kosong.");
    }
    const headers = values[0];

    return {
        headers,
        rows: values.slice(1),
        usernameIndex: headers.indexOf("Username Discord"),
        statusIndex: headers.indexOf("Statuses"),
    };
}

// ==============================
// Convert Column Number -> Letter
// contoh:
// 0 = A
// 1 = B
// 10 = K
// ==============================

function columnToLetter(columnIndex) {
    let temp = "";
    let letter = "";
    let col = columnIndex + 1;

    while (col > 0) {
        temp = (col - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        col = (col - temp - 1) / 26;
    }
    return letter;
}

async function batchUpdateStatus(updates) {
    if (updates.length === 0) return;

    const data = updates.map(update => {
        const columnLetter = columnToLetter(update.columnIndex);

        return {
            range: `${config.sheetName}!${columnLetter}${update.rowNumber}`,
            values: [[update.value]]
        };
    });

    await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: config.sheetId,
        requestBody: {
            valueInputOption: "RAW",
            data
        }
    });
}

module.exports = {
    getSheetData,
    batchUpdateStatus,
};