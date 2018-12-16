const Discord = require("discord.js");
const request = require("request");
const config = require("../../config.json");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    if(!args[0]) {message.channel.send(`${strings.getMsg("invalidarg")}`); return;}
    if(!message.member.hasPermission("MANAGE_CHANNELS")) {message.channel.send(`${strings.getMsg("reqperms")} \`${strings.getMsg("managechannels")}\``); return;}
    if(isNaN(args[0])) {message.channel.send(`${strings.getMsg("slowmode_error")}  ``${args[0]}```); return;}
    if(args[0] >= 121) {message.channel.send(`${strings.getMsg("slowmode_errortime")}`); return;}
    req("PATCH", `https://discordapp.com/api/channels/${message.channel.id}`, config.tokens.token, args[0]).then(body => {
        if(args[0] == 0) {
            message.channel.send(`${strings.getMsg("slowmode_remove")}`);
        } else {
            message.channel.send(`${strings.getMsg("slowmode_success")} ` + `**${args[0]}s!**`);
        }
    }).catch(err => require("../../util/util").crash(message.channel, err));
}

function req(method, url, token, num) {
    return new Promise((resolve, reject) => {
        request({
            method: method,
            url: url,
            json: {rate_limit_per_user: num},
            headers: {
                Authorization: "Bot " + token
            },
            form: ""
        }, (error, response, body) => {
            if (error) return reject(error);
            resolve(body);
        });
    }).catch(err => console.log(err));
}

module.exports.help = {
    name:"slowmode",
    name2:"slowmode <sekundy>",
    desc:"Ustawia slowmode na kanał, 0 resetuje",
    perms:"Zarządzanie kanałami"
}