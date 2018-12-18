const Discord = require("discord.js");
const request = require("request");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    req("GET", `https://www.humblebundle.com/androidapp/v2/service_check`).then(body => {
        var res = JSON.parse(body);
        var zn = false;
        var embed = new Discord.RichEmbed();
        embed.setDescription("<:mlist:488406259230310440> | " + `${strings.getMsg("hb_desc")}`);
        res.forEach(b => {
            zn = true; 
            embed.addField(b.bundle_name, b.url);
        });
        if(!zn) {
            embed.setDescription(embed.description + `\n${strings.getMsg("v_none")}`);
        }
        message.channel.send(embed);
    }).catch(err => require("../../util/util").crash(message.channel, err));
}

function req(method, url) {
    return new Promise((resolve, reject) => {
        request({
            method: method,
            url: url,
            form: ""
        }, (error, response, body) => {
            if (error) return reject(error);
            resolve(body);
        });
    }).catch(err => console.log(err));
}

module.exports.help = {
    name:"humblebundle",
    aliases:["hb"]
}