const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;
let urls = require("../urls.json");
const request = require("request");
var fs = require("fs");

module.exports.run = async (client, message, args) => {
    if(!config.yourls.useyourls) {message.channel.send("Właściciel bota nie skonfigurował skracacza linków."); return;}
    if(args[0] == null) {message.channel.send(`Nieprawidłowa ilość argumentów. Sprawdź poprawne użycie: ${prefix}info ${command}`); return;}
    var cust = false;
    if(args[1] != null) cust = true;
    if(cust) {
        request({
            method: "POST",
            url: `${config.yourls.apiurl}?signature=${config.yourls.signature}&format=json&action=shorturl&url=${args[0]}&keyword=${args[1]}`
        }, (error, response, body) => {
            if (error) return;
            if (response.statusCode == 200) {
                var result = JSON.parse(body);
                message.channel.send("Oto twój krótki url: " + result.shorturl);
                try{
                    urls[message.author.id].urls.push({short: result.shorturl, full: args[0]});
                } catch(e) {
                    urls[message.author.id] = {};
                    urls[message.author.id].urls = [];
                    urls[message.author.id].urls.push({short: result.shorturl, full: args[0]});
                }
                fs.writeFile("../urls.json", JSON.stringify(urls), function(err) {
                    if (err) console.log(err);
                });
            }
        });
    } else {
        request({
            method: "POST",
            url: `${config.yourls.apiurl}?signature=${config.yourls.signature}&format=json&action=shorturl&url=${args[0]}`
        }, (error, response, body) => {
            if (error) return;
            if (response.statusCode == 200) {
                var result = JSON.parse(body);
                message.channel.send("Oto twój krótki url: " + result.shorturl);
                try{
                    urls[message.author.id].urls.push({short: result.shorturl, full: args[0]});
                } catch(e) {
                    urls[message.author.id] = {};
                    urls[message.author.id].urls = [];
                    urls[message.author.id].urls.push({short: result.shorturl, full: args[0]});
                }
                fs.writeFile("../urls.json", JSON.stringify(urls), function(err) {
                    if (err) console.log(err);
                });
            }
        });
    }
}

module.exports.help = {
    name: "shorten",
    category: "WEB"
}