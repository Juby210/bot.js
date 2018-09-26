function load() {
    $.ajax({
        url: "api/discord/user",
        context: document.body,
        success: function(data) {
            if(data.status == "OK") {
                if(data.user.avatar != null) {
                    $("#user-av").attr('src', `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}`);
                }
                $("#user-nick").html(data.user.username);

                $.ajax({
                    url: "botstats",
                    context: document.body,
                    success: function(staty) {
                        $("#ping").html("Ping: " + staty.ping);
                        $("#ram").html(`RAM: ${staty.ram}MB`);
                        $("#cpu").html("CPU: " + staty.cpu);
                        $("#uptime").html("Uptime: " + staty.uptime);
                        $("#guilds").html("Serwery: " + staty.guilds);
                        $("#channels").html("Kanały: " + staty.channels);
                        $("#users").html("Uzytkownicy: " + staty.users);
                        $("#status").html("Status: " + staty.status);
                    }
                });

                $.ajax({
                    url: "api/discord/guilds",
                    context: document.body,
                    success: function(guilds) {
                        guilds.forEach(g => {
                            var serwery = document.getElementById("serwery");

                            var czk = document.getElementById("wait");
                            if(czk) serwery.removeChild(czk);

                            var serwer = document.createElement("div");
                            serwer.className = "serwer";

                            var ikona = document.createElement("img");
                            if(g.guild.icon != null) {
                                ikona.src = `https://cdn.discordapp.com/icons/${g.guild.id}/${g.guild.icon}.png`;
                            } else {
                                ikona.src = "defaultav.png";
                            }
                            serwer.appendChild(ikona);

                            var nazwa = document.createElement("p");
                            nazwa.className = "serwer-nazwa";
                            nazwa.innerText = g.guild.name;
                            serwer.appendChild(nazwa);

                            var prefix = document.createElement("p");
                            prefix.className = "serwer-prefix";
                            prefix.id = g.guild.id;
                            prefix.innerText = `Prefix: ` + g.prefix;
                            if(g.guild.owner) {
                                prefix.innerHTML = prefix.innerText + ` <a href="#" onclick="edytujprefix('${g.guild.id}', '${g.prefix}')" style="text-decoration: none; color: lightgreen; font-size: 15px;">Edytuj</a>`
                            }
                            serwer.appendChild(prefix);

                            var za = document.createElement("span");
                            za.className = "serwer-za";
                            if(g.guild.owner) {za.innerText = "Tym serwerem możesz zarządzać"} else {za.innerText = "Tym serwerem nie możesz zarządzać"}
                            serwer.appendChild(za);
                            serwery.appendChild(serwer);
                        });
                    }
                });
            } else {
                window.location = '/';
            }
        },
        error: function(err) {
            window.location = '/';
        }
    });
}

function edytujprefix(gid, old) {
    var prefix = prompt("Wpisz nowy prefix:", old);
    console.log(prefix);
    if(prefix != null) {
        if(prefix == "") {
            alert("Prefix nie może być pusty");
        } else {
            $.ajax({
                url:`api/discord/prefix?id=${gid}&prefix=${prefix}`,
                context: document.body,
                success: function(data) {
                    if(data.status == "OK") {
                        $(`#${gid}`).html("Prefix: " + prefix + ` <a href="#" onclick="edytujprefix('${gid}', '${prefix}')" style="text-decoration: none; color: lightgreen; font-size: 15px;">Edytuj</a>`);
                    } else {
                        alert(data.message);
                    }
                },
                error: function(err) {
                    alert(err.message);
                }
            });
        }
    }
}