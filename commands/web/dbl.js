const Discord = require("discord.js");
const config = require("../../config.json");
const db = require("../../util/db.js");
var rp = require("request-promise");
var cheerio = require('cheerio');
const util = require("../../util/util");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    const prefix = await db.getPrefix(message.guild.id);
    const DBL = require("dblapi.js");
    const dbl = new DBL(config.tokens.dbl, client);
    if(args[0] == null) return message.channel.send(strings.getMsg("invalidargscount").replace("#PREFIX#", prefix).replace("#CMD#", "dbl"));

    util.searchUser(message, args[0], false).then(user => {
        if(user.bot) {
            rp(`https://discordbots.org/bot/${user.id}`).then(body => {
                $ = cheerio.load(body);
                let desc = $(".bot-description").text().replace(new RegExp("\n", "g"), "");
                let invite = $(".votebutton").parent().attr("href");
                let site = $("#websitelink").attr("href");
                let github = $("#github").attr("href");
                let prefix = $("#prefix").first().text();
                let owners = [];
                $("#createdby").find("span").each((i, name) => {
                    owners.push($(name).text());
                });
                let votes = $("#points").text();
                let tags = [];
                $(".atag").each((i, name) => {
                    tags.push($(name).text().replace(new RegExp("\n", "g"), ""));
                });
                let lib = $("#libclick").text();

                let embed = new Discord.RichEmbed();
                embed.setColor("#283593");
                embed.setDescription(`${strings.getMsg("dbl_name")}: **${user.tag}**\nID: **${user.id}**\n${strings.getMsg("desc")}: **${desc}**\n[Invite](${invite})\n${strings.getMsg("dbl_website")}: **${site}**\nGithub: **${github}**\nPrefix: **${prefix}**\n${strings.getMsg("lib")}: **${lib}**\n${strings.getMsg("dbl_creator")}: **${owners.join("**, **")}**\n${strings.getMsg("dbl_tags")}: **${tags.join("**, **")}**\n${strings.getMsg("dbl_votes")}: **${votes}**\n[${strings.getMsg("dbl_link")}](https://discordbots.org/bot/${user.id})`);
                embed.setThumbnail(user.avatarURL);
                message.channel.send(embed);
            }).catch(() => message.channel.send(strings.getMsg("notfound")));
        } else {
            rp(`https://discordbots.org/user/${user.id}`).then(body => {
                $ = cheerio.load(body);
                let bio = $(".bio-inner").text();
                let bots = [];
                $('.bot-name').each((i, name) => {
                    bots.push(`${$(name).text()} <@${$(name).attr('id').replace("bot-", "")}>`);
                });
                let badges = [];
                $(".badgecase").find("img").each((i, name) => {
                    badges.push($(name).attr("title"));
                });

                let embed = new Discord.RichEmbed();
                embed.setColor("#283593");
                embed.setThumbnail($(".profilepic").attr("src"));
                embed.setDescription(`${strings.getMsg("user")}: **${user.tag}**\nID: **${user.id}**\nBio: ${bio}\n${badges.join(", ")}`);
                if(bots.length != 0) {
                    embed.addField(`${strings.getMsg("bots")}:`, bots.join("\n"));
                }
                message.channel.send(embed);
            }).catch(() => message.channel.send(strings.getMsg("notfound")));
        }
    }).catch(() => message.channel.send(strings.getMsg("notfound")));
}

module.exports.help = {
    name: "dbl",
    aliases: ["discordbotlist"],
    name2:"dbl <wzmianka/id>",
    desc:"Pokazuje informacje o użytkowniku/bocie z discordbots.org"
}