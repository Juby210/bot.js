const Discord = require("discord.js");
const db = require("../../util/db.js");

module.exports.run = async (client, message, args) => {
    let guildID;
    if(!message.guild) {
        guildID = '0';
    } else {
        guildID = message.guild.id;
    }
    const prefix = await db.getPrefix(guildID);
    var embed = new Discord.RichEmbed();
    embed.setColor("#0088FF");
    embed.setAuthor(`${client.user.username} - Komenda info, czyli informacje o komendach`, client.user.avatarURL);
    switch (args[0]) {
		case "avatar":
			embed.addField(`${prefix}avatar [wzmianka/nazwa]`, "Wyświetla oraz daje link do avatara wybranej osoby/twojego");
            break;
        case "prune":
            embed.addField(`${prefix}prune [ilość wiadomości]`, "Kasuje daną ilość wiadomości z kanału. Maksymalna wartość: 100");
            embed.addField(`Aliasy:`, "clear");
            embed.setFooter("Wymagane uprawnienia: Zarządzanie wiadomościami");
            break;
        case "userinfo":
            embed.addField(`${prefix}userinfo [wzmianka/nazwa]`, "Wyświetla informacje o użytkowniku");
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
        case "github":
            embed.addField(`${prefix}github`, "Link do kodu bota na githubie");
            break;
        case "bot":
            embed.addField(`${prefix}bot <info/invite/uptime>`, "Komenda o bocie\nbot info: Informacje o użyciu zasobów przez bota oraz liczba serwerów/kanałów/użytkowników\nbot invite: Link do zaproszenia bota\nbot uptime: Pokazuje ile bot jest aktywny od ostatniego restartu");
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
        case "tag":
            embed.addField(`${prefix}tag [tag]`, "Sprawdź kto ma tag taki sam jak ty!");
        case "play":
            embed.addField(`${prefix}play <link/wyszukiwanie>`, "Odtwarza/Dodaje do kolejki podany link/wyszukanie\nMoże to być również link do radia");
            break;
        case "radio":
            embed.addField(`${prefix}radio [numer]`, `Bez numeru wyświetla listę stacji radiowych, z numerem odtwarza numer z listy`);
			break;
        case "search":
            embed.addField(`${prefix}search <wyszukiwanie>`, "Wyszukuje podaną frazę oraz wyświetla wybór 10 wyników");
            break;
        case "queue":
            embed.addField(`${prefix}queue`, "Pokazuje kolejkę dla serwera");
            embed.addField(`Aliasy:`, "q");
            break;
        case "clearqueue":
            embed.addField(`${prefix}clearqueue`, "Czyści kolejkę dla serwera");
            embed.addField(`Aliasy:`, "cq");
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
        case "volume":
            embed.addField(`${prefix}volume <głośność>`, "Zmienia głośność");
            embed.addField(`Aliasy:`, "vol");
            embed.setFooter("Ta komenda działa tylko jeśli bot gra!");
            break;
        case "np":
            embed.addField(`${prefix}np`, "Pokazuje co aktualnie jest odtwarzane");
            embed.addField(`Aliasy:`, "nowplaying");
            embed.setFooter("Ta komenda działa tylko jeśli bot gra!");
            break;
        case "prefix":
            embed.addField(`${prefix}prefix <nowy prefix>`, `Ustawia nowy prefix dla bota na danym serwerze.`);
            embed.setFooter("Wymagane uprawnienia: Zarządzanie serwerem");
            break;
        case "warn": 
        embed.addField(`${prefix}warn <użytkownik> <powód>`, `Nadaje ostrzeżenie użytkownikowi z powodem.`);
        embed.setFooter("Wymagane uprawnienia: Zarządzanie serwerem");
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
    name:"info",
  }