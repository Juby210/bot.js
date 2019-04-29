const config = require("../config.json");
const rp = require('request-promise');

module.exports = (id, server_count) => {
    if(!config.settings.poststats) return;
    const tokens = config.tokens.stats;
    console.log("Posting stats..");
    rp({
        url: `https://discordbots.org/api/bots/${id}/stats`,
        method: 'POST',
        headers: {
            Authorization: tokens.discordbots
        },
        json: { server_count }
    }).catch(() => {});
    rp({
        url: `https://botblock.org/api/count`,
        method: 'POST',
        json: {
            server_count,
            bot_id: id,
            "botsfordiscord.com": tokens.botsfordiscord,
            "discordapps.dev": tokens.discordapps,
            "discordbotreviews.xyz": tokens.discordbotreviews,
            "discordbot.world": tokens.discordbotworld,
            "discordbots.group": tokens.discordbotsgroup,
            "discordsbestbots.xyz": tokens.discordsbestbots
        }
    }).then(body => {
        let res = JSON.parse(body);
        console.log(`Posted stats to: discordbots.org, ${Object.keys(res.success).join(', ')} | Fail: ${Object.keys(res.failure).join(', ')}`);
    }).catch(() => {});
};