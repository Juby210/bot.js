const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (client, message, args) => {
    var embed = new Discord.RichEmbed();
    embed.setColor("#0088FF");
    embed.setAuthor(`${client.user.username} - Komenda info, czyli informacje o komendach`, client.user.avatarURL);
    switch (args[0]) {
        case "user":
            embed.addField(`${prefix}user [wzmianka/nazwa]`, "Wyświetla informacje o użytkowniku");
            break;
        case "ban":
            embed.addField(`${prefix}ban <wzmianka>`, `Banuje wzmienioną osobę`);
            embed.setFooter("Wymagane uprawnienia: Banowanie członków");
            break;
        case "kick":
            embed.addField(`${prefix}kick <wzmianka>`, `Kickuje wzmienioną osobę`);
            embed.setFooter("Wymagane uprawnienia: Wyrzucanie członków");
            break;
        case "resetall":
            embed.addField(`${prefix}resetall`, `Resetuje wszystkim pseudonimy`);
            embed.setFooter("Wymagane uprawnienia: Zarządzanie pseudonimami");
            break;
        case "renameall":
            embed.addField(`${prefix}renameall <pseudonim>`, `Zmienia wszystkim pseudonimy na wpisany przez ciebie`);
            embed.setFooter("Wymagane uprawnienia: Zarządzanie pseudonimami");
            break;
        case "rename":
            embed.addField(`${prefix}rename <wzmianka/nazwa> <pseudnim>`, `Zmienia pseudonim`);
            embed.setFooter("Wymagane uprawnienia: Zarządzanie pseudonimami");
            break;
        case "voicekick":
            embed.addField(`${prefix}voicekick <wzmianka/osoba>`, `Kickuje z kanału głosowego wybraną osobę`);
            embed.setFooter("Wymagane uprawnienia: Przenieś członków");
            break;
        case "voiceban":
            embed.addField(`${prefix}voiceban <wzmianka/osoba>`, `Blokuje możliwość wejścia na kanały głosowe wskazanej osobie na zawsze`);
            embed.setFooter("Wymagane uprawnienia: Przenieś członków");
            break;
        case "voiceunban":
            embed.addField(`${prefix}voiceunban <wzmianka>`, `Odblokuje możliwość wejścia na kanały głosowe osobie która dostała bana`);
            embed.setFooter("Wymagane uprawnienia: Przenieś członków");
            break;
        case "uptime":
            embed.addField(`${prefix}uptime`, "Pokazuje ile bot jest aktywny od ostatniego restartu");
            break;
        case "github":
            embed.addField(`${prefix}github`, "Link do kodu bota na githubie");
            break;
        case "invite":
            embed.addField(`${prefix}invite`, "Link do zaproszenia bota");
            break;
        case "botinfo":
            embed.addField(`${prefix}botinfo`, "Informacje o użyciu zasobów przez bota oraz liczba serwerów/kanałów/użytkowników");
            break;
        case "dbl":
            embed.addField(`${prefix}dbl <user/bot> <wzmianka>`, "Pokazuje informacje o użytkowniku/bocie z discordbots.org");
            break;
        case "shorten":
            embed.addField(`${prefix}shorten <link> [własny skrót]`, "Skraca link");
            break;
        case "urls":
            embed.addField(`${prefix}urls`, "Pokazuje twoje skrócone linki");
            break;
        case "play":
            embed.addField(`${prefix}play <link/wyszukiwanie>`, "Odtwarza/Dodaje do kolejki podany link/wyszukanie");
            embed.setFooter("Ta komenda działa tylko jeśli bot gra!");
            break;
        case "search":
            embed.addField(`${prefix}search <wyszukiwanie>`, "Wyszukuje podaną frazę oraz wyświetla wybór 10 wyników");
            break;
        case "q":
            embed.addField(`${prefix}q`, "Pokazuje kolejkę dla serwera");
            break;
        case "clearqueue":
            embed.addField(`${prefix}clearqueue`, "Czyści kolejkę dla serwera");
            break;
        case "leave":
            embed.addField(`${prefix}leave`, "Bot wychodzi z kanału głosowego");
            break;
        case "join":
            embed.addField(`${prefix}join`, "Bot dołącza na twój kanał głosowy");
            break;
        case "pause":
            embed.addField(`${prefix}pause`, "Zatrzymuje odtwarzacz");
            embed.setFooter("Ta komenda działa tylko jeśli bot gra!");
            break;
        case "resume":
            embed.addField(`${prefix}resume`, "Wznawia odtwarzacz");
            embed.setFooter("Ta komenda działa tylko jeśli bot gra!");
            break;
        case "skip":
            embed.addField(`${prefix}skip`, "Pomija utwór");
            embed.setFooter("Ta komenda działa tylko jeśli bot gra!");
            break;
        case "vol":
            embed.addField(`${prefix}vol <głośność>`, "Zmienia głośność");
            embed.setFooter("Ta komenda działa tylko jeśli bot gra!");
            break;
        case "np":
            embed.addField(`${prefix}np`, "Pokazuje co aktualnie jest odtwarzane");
            embed.setFooter("Ta komenda działa tylko jeśli bot gra!");
            break;
        case "info":
            embed.setDescription("Naprawdę chcesz wyświetlić info o komendzie info? Eh.. no dobra");
            embed.addField(`${prefix}info <komenda>`, "Pokazuje informacje o komendzie, którą wpiszesz.");
            break;
        default:
            embed.setTitle("Nie znam takiej komendy, polecam sprawdzić `" + prefix + "help`");
    }
    if(args[0] == null) embed.setTitle("Może byś dał jakąś komendę bo chyba nie chcesz info o komendzie info?");
    message.channel.send(embed);
}

module.exports.help = {
    name:"info"
  }