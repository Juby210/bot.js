const qc = require("./f/queue");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "shuffle"
        });
        this.run = this.r;
        this.shuffle = this.shuffle;
    }
    async r(a = {}) {
        const player = a.client.player.get(a.message.guild.id);
        if (!player) return cmd.error(a, a.strings.getMsg("music_playernull"));

        if(!a.client.queue[a.message.guild.id]) new qc(a.message.guild.id, a.client);
        a.client.queue[a.message.guild.id].songs = this.shuffle(a.client.queue[a.message.guild.id].songs)
        
        cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis["done_green"])} | ${global.up(this.name)}\n${a.strings.getMsg("music_shuffle")}`, "#00ff00");
    }
    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 != currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
}