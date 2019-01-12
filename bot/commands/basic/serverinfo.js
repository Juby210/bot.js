const Discord = require("discord.js");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "serverinfo"
        });
        this.run = this.r;
    }
    async r(a = {}) {
        if(a.args[0] == null) {
        const guild = a.message.guild;
        const verificationLevels = [a.strings.getMsg("v_none"), a.strings.getMsg("v_low"), a.strings.getMsg("v_medium"), a.strings.getMsg("v_crazy"), a.strings.getMsg("v_extreme")];
        const textChannels = guild.channels.filter(c => c.type === 'text');
        const voiceChannels = guild.channels.filter(c => c.type === 'voice');
        var online = guild.members.filter(m => m.user.presence.status === "online").size
        var dnd = guild.members.filter(m => m.user.presence.status === "dnd").size
        var offline = guild.members.filter(m => m.user.presence.status === "offline").size
        var bots = guild.members.filter(m => m.user.bot).size

        let icon = guild.iconURL;
        let embed = new Discord.RichEmbed()
        embed.setAuthor(`ServerInfo - ${guild.name}`, client.user.avatarURL);
        embed.setThumbnail(icon);
        embed.addField(`${a.strings.getMsg("users")} [${guild.memberCount}]:`, `Online: ${online}\n${a.strings.getMsg("s_dnd")}: ${dnd}\n${a.strings.getMsg("s_offline")}: ${offline}\n${a.strings.getMsg("bots")}: ${bots}`);
        embed.addField(`${a.strings.getMsg("channels")} [${guild.channels.size}]:`, `${a.strings.getMsg("voice_channels")}: ${voiceChannels.size}\n ${a.strings.getMsg("text_channels")}: ${textChannels.size}`);
        embed.addField(`${a.strings.getMsg("roles")} [${guild.roles.size}]:`, `${a.strings.getMsg("serverinfo_roles").replace("#prefix#", a.prefix)}`);
        embed.addField(`${a.strings.getMsg("verification")}:`, verificationLevels[guild.verificationLevel]);
        embed.addField(`${a.strings.getMsg("region")}:`, guild.region);
        embed.addField(`${a.strings.getMsg("owner")}:`, guild.owner);
        embed.addField(`${a.strings.getMsg("created")}:`, guild.createdAt);
        embed.setFooter("© Juby210 & hamster" + " | " + "ID: " + guild.id, client.user.avatarURL);
        embed.setTimestamp();
        a.message.channel.send(embed);
        }

    if(a.args[0] == "roles") {
        const guild = a.message.guild;
        var roleList = guild.roles.sort((a, b) => a.position - b.position).map(role => role.toString()).slice(1).reverse().join(",")
        let rolesem = new Discord.RichEmbed()
        rolesem.addField(`${a.strings.getMsg("roles")} [${guild.roles.size}]:`, roleList);
        rolesem.setTimestamp();
        a.message.channel.send(rolesem);
    }
    }
}