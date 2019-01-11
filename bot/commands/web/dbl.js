const Discord = require("discord.js");
const rp = require("request-promise");
const cheerio = require('cheerio');
const util = require("../../../util/util");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "dbl",
            aliases: ["discordbotlist"]
        });
        this.run = this.r;
    }
    async r(a = {}) {
        util.searchUser(a.message, a.args[0], false).then(user => {
            if(user.bot) {
                rp(`https://discordbots.org/bot/${user.id}`).then(body => {
                    let $ = cheerio.load(body);
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
                    embed.setDescription(`${a.strings.getMsg("dbl_name")}: **${user.tag}**\nID: **${user.id}**\n${a.strings.getMsg("desc")}: **${desc}**\n[Invite](${invite})\n${a.strings.getMsg("dbl_website")}: **${site}**\nGithub: **${github}**\nPrefix: **${prefix}**\n${a.strings.getMsg("lib")}: **${lib}**\n${a.strings.getMsg("dbl_creator")}: **${owners.join("**, **")}**\n${a.strings.getMsg("dbl_tags")}: **${tags.join("**, **")}**\n${a.strings.getMsg("dbl_votes")}: **${votes}**\n[${a.strings.getMsg("dbl_link")}](https://discordbots.org/bot/${user.id})`);
                    embed.setThumbnail(user.avatarURL);
                    a.message.channel.send(embed);
                }).catch(() => a.message.channel.send(a.strings.getMsg("notfound")));
            } else {
                rp(`https://discordbots.org/user/${user.id}`).then(body => {
                    let $ = cheerio.load(body);
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
                    embed.setDescription(`${a.strings.getMsg("user")}: **${user.tag}**\nID: **${user.id}**\nBio: ${bio}\n${badges.join(", ")}`);
                    if(bots.length != 0) {
                        embed.addField(`${a.strings.getMsg("bots")}:`, bots.join("\n"));
                    }
                    a.message.channel.send(embed);
                }).catch(() => a.message.channel.send(a.strings.getMsg("notfound")));
            }
        }).catch(() => a.message.channel.send(a.strings.getMsg("notfound")));
    }
}