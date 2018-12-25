const Discord = require("discord.js");
const rp = require("request-promise");
const cheerio = require('cheerio');
const util = require("../../../util/util");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "truckersmp",
            aliases: ["tmp", "ets2", "ets2mp"]
        });
        this.run = this.r;
    }
    async r(a = {}) {
        if(!a.args[0]) return cmd.error(a, a.strings.getMsg("invalidargscount").replace("#PREFIX#", a.prefix).replace("#CMD#", this.name));

        /*if (a.args[0] == "servers") {

        } else*/ if (a.args[0] == "stats") {
            rp("https://stats.truckersmp.com").then(body => {
                let $ = cheerio.load(body);
                let players = $("#current_players").text();
                let eplayers = $("#ets2_current_players").text();
                let aplayers = $("#ats_current_players").text();
                let eeu1p = $("#status-server-1").find(".server-current").text();
                let eeu1m = $("#status-server-1").find(".server-max").text();
                let eeu2p = $("#status-server-4").find(".server-current").text();
                let eeu2m = $("#status-server-4").find(".server-max").text();
                let eeu3p = $("#status-server-5").find(".server-current").text();
                let eeu3m = $("#status-server-5").find(".server-max").text();
                let eeu4p = $("#status-server-8").find(".server-current").text();
                let eeu4m = $("#status-server-8").find(".server-max").text();
                let aeu2p = $("#status-server-9").find(".server-current").text();
                let aeu2m = $("#status-server-9").find(".server-max").text();
                let ausp = $("#status-server-11").find(".server-current").text();
                let ausm = $("#status-server-11").find(".server-max").text();
                let regp = $("#registered_players").text();

                let embed = new Discord.RichEmbed();
                embed.setColor("#b92025");
                embed.setTitle(`${a.strings.getMsg("players_online")}: **${players}**`)
                embed.setDescription(`${a.strings.getMsg("players_ets2")}: **${eplayers}**\n${a.strings.getMsg("players_ats")}: **${aplayers}**`);
                embed.addField(`ETS2:`, `EU1: **${eeu1p}${eeu1m}**\nEU2: **${eeu2p}${eeu2m}**\nEU3: **${eeu3p}${eeu3m}**\nEU4: **${eeu4p}${eeu4m}**`);
                embed.addField(`ATS:`, `EU2: **${aeu2p}${aeu2m}**\nUS: **${ausp}${ausm}**\n\n${a.strings.getMsg("registred_players")}: **${regp}**`);
                a.message.channel.send(embed);
            }).catch(e => util.crash(a.message.channel, e));
        } else {
            rp("https://truckersmp.com/user/search?search=" + encodeURIComponent(a.args[0])).then(body => {
                let $ = cheerio.load(body);
                let player = $(".inner-team").first();
                if(!player.find("a").attr("href")) return cmd.error(a, a.strings.getMsg("notfound"));
                let name = player.find("a").text();
                let rank = player.find("small").text();
                let pid = player.find("a").attr("href").replace("/user/", "");   
                rp("https://truckersmp.com/user/" + pid).then(b => {
                    $ = cheerio.load(b);
                    let ban = $(".label-red").text();
                    let date = null;
                    $(".panel-profile").find("span").each((i, name) => {
                        let ii = (ban) ? 3 : 2;
                        if(i == ii) date = $(name).text().replace("Member since: ", "");
                    });
                    let fprofile = $(".fa-archive").parent().find("a").attr("href");
                    let fb = $(".fa-facebook").parent().find("a").attr("href");
                    let tw = $(".fa-twitter").parent().find("a").attr("href");
                    let twi = $(".fa-twitch").parent().find("a").attr("href");
                    let st = $(".fa-steam").parent().find("a").attr("href");
                    let wot = $(".fa-truck").parent().find("a").attr("href");
                    let yt = $(".fa-youtube").parent().find("a").attr("href");
                    let av = $(".profile-img").attr("src");
                    rp("https://truckersmp.com/api/user/discord/" + pid).then(apidsc2 => {
                        let apidsc = JSON.parse(apidsc2);
                        let dsc = (apidsc.name == "") ? "" : `${apidsc.name}#${apidsc.discriminator}`;
                        let dscid = (dsc == "") ? "" : apidsc2.split(`,"name"`)[0].replace(`{"id":`, "");
                        
                        let embed = new Discord.RichEmbed();
                        embed.setColor("#b92025");
                        embed.setDescription(`${a.strings.getMsg("user")}: **[${name}](https://truckersmp.com/user/${pid})**\n${a.strings.getMsg("role")}: **${rank}**\n${a.strings.getMsg("acc_created")} **${date}**${(ban) ? `${a.strings.getMsg("banned")}: **${ban}**` : ""}`);
                        try {
                            embed.addField(`${a.strings.getMsg("profiles")}:`, `${(fprofile) ? `[Forum](${fprofile})\n` : ""}${(fb) ? `[Facebook](${fb})\n` : ""}${(tw) ? `[Twitter](${tw})\n` : ""}${(twi) ? `[Twitch](${twi})\n` : ""}${(st) ? `[Steam](${st})\n` : ""}${(wot) ? `[World of Trucks](${wot})\n` : ""}${(yt) ? `[YouTube](${yt})\n` : ""}${(dsc == "") ? "" : `${dsc} <@${dscid}>`}`);
                        } catch(e) {}
                        embed.setThumbnail(av);
                        a.message.channel.send(embed);
                    });
                });
            }).catch(e => util.crash(a.message.channel, e));
        }
    }
}