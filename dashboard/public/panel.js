function load() {
    $.ajax({
        url: "api/dashboard/user",
        context: document.body,
        success: function(data) {
            if(data.status == "OK") {
                if(data.user.avatar != null) {
                    $("#user-av").attr('src', `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}`);
                }
                $("#user-nick").html(data.user.username);

                ladujstaty();
                setInterval(() => {
                    ladujstaty();
                }, 1000);

                $.ajax({
                    url: "api/dashboard/guilds",
                    context: document.body,
                    success: function(guilds) {
                        guilds.forEach(g => {
                            var serwery = document.getElementById("serwery");

                            var czk = document.getElementById("wait");
                            if(czk) serwery.removeChild(czk);

                            var serwerd = document.createElement("div");
                            serwerd.className = "serwer";
                            serwerd.id = `${g.guild.id}div`;

                            var serwer = document.createElement("div");

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
                            prefix.innerText = `Prefix: ` + g.prefix;
                            if(g.perms) {
                                prefix.innerHTML = prefix.innerText + ` <a href="#" id="${g.guild.id}z" onclick="zarzadzaj('${g.guild.id}')" style="text-decoration: none; color: lightgreen; font-size: 15px; margin-left: 15px;">Zarządzaj serwerem</a>`
                            }
                            serwer.appendChild(prefix);

                            var za = document.createElement("span");
                            za.className = "serwer-za";
                            if(g.guild.owner) {
                                za.innerText = "Jesteś właścicielem, Możesz zarządzać tym serwerem";
                            } else if (g.perms && !g.guild.owner) {
                                za.innerText = "Masz uprawnienia do zarządzania tym serwerem";
                            } else {
                                za.innerText = "Nie możesz zarządzać tym serwerem";
                            }
                            serwer.appendChild(za);
                            serwerd.appendChild(serwer);
                            serwery.appendChild(serwerd);
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

function szczegoly(gid) {
}

function zarzadzaj(gid) {
    var serwer = document.getElementById(`${gid}div`);
    if(document.getElementById(gid + "z").innerHTML == "Ukryj szczegóły") {
        serwer.removeChild(document.getElementById(gid + "s2"));
        serwer.style.height = '50px';
        $(`#${gid}z`).html("Zarządzaj serwerem");
        return;
    }
    var serwer2 = document.createElement("div");
    serwer2.className = "serwer2";
    serwer2.id = gid + "s2"

    $.ajax({
        url: "api/dashboard/guild?id=" + gid,
        context: document.body,
        success: function(data) {
            var prefix = document.createElement('p');
            prefix.id = data.guild.id;
            prefix.innerHTML = "Prefix: " + data.prefix + ` <a href="#" onclick="edytujprefix('${data.guild.id}', '${data.prefix}')" style="text-decoration: none; color: lightgreen; font-size: 15px;">Edytuj</a>`;
            serwer2.appendChild(prefix);

            // Welcome: //

            var welcome = document.createElement('p');
            welcome.innerHTML = "<br>Welcome:";
            welcome.style.fontSize = '20px';
            welcome.style.fontWeight = 'bold';
            serwer2.appendChild(welcome);

            var wenable = document.createElement('p');
            wenable.innerHTML = "Status: " + data.welcome.enabled.toString();
            if(wenable.innerHTML.includes("false")) {
                wenable.innerHTML = `Status: Wyłączone <a href="#" onclick="edytujwelcome('${data.guild.id}', 'true', '${data.welcome.channel}', '${data.welcome.msg.replace(new RegExp("#", 'g'), "3ee3")}');" class="edytuj">Włącz</a>`;
            } else {
                wenable.innerHTML = `Status: Włączone <a href="#" onclick="edytujwelcome('${data.guild.id}', 'false', '${data.welcome.channel}', '${data.welcome.msg.replace(new RegExp("#", 'g'), "3ee3")}');" style="color: red;" class="edytuj">Wyłącz</a>`;
            }
            serwer2.appendChild(wenable);
            serwer.style.height = 'auto';
            $(`#${gid}z`).html("Ukryj szczegóły");
            if(data.welcome.enabled) {
                var channel = document.createElement('p');
                $.ajax({
                    url: "api/dashboard/channel?id=" + data.welcome.channel,
                    context: document.body,
                    success: function(channelr) {
                        channel.innerHTML = `Kanał: #${JSON.parse(channelr).name} <a href="#" onclick="edytujwelcomechannel('${gid}');" class="edytuj">Edytuj</a>`;
                    },
                    error: function(err) {
                        channel.innerHTML = `Kanał: błąd`;
                    }
                });
                serwer2.appendChild(channel);
                var msg = document.createElement('p');
                msg.innerHTML = `Wiadomość: ${data.welcome.msg} <a href="#" onclick="edytujwelcomemsg('${data.guild.id}', 'true', '${data.welcome.channel}', '${data.welcome.msg}');" class="edytuj">Edytuj</a>`;
                serwer2.appendChild(msg);
            }

            // Goodbye: //

            var goodbye = document.createElement('p');
            goodbye.innerHTML = "<br>Goodbye:";
            goodbye.style.fontSize = '20px';
            goodbye.style.fontWeight = 'bold';
            serwer2.appendChild(goodbye);

            var genable = document.createElement('p');
            genable.innerHTML = "Status: " + data.goodbye.enabled.toString();
            if(genable.innerHTML.includes("false")) {
                genable.innerHTML = `Status: Wyłączone <a href="#" onclick="edytujgoodbye('${data.guild.id}', 'true', '${data.goodbye.channel}', '${data.goodbye.msg.replace(new RegExp("#", 'g'), "3ee3")}');" class="edytuj">Włącz</a>`;
            } else {
                genable.innerHTML = `Status: Włączone <a href="#" onclick="edytujgoodbye('${data.guild.id}', 'false', '${data.goodbye.channel}', '${data.goodbye.msg.replace(new RegExp("#", 'g'), "3ee3")}');" style="color: red;" class="edytuj">Wyłącz</a>`;
            }
            serwer2.appendChild(genable);
            serwer.style.height = 'auto';
            $(`#${gid}z`).html("Ukryj szczegóły");
            if(data.goodbye.enabled) {
                var channel = document.createElement('p');
                $.ajax({
                    url: "api/dashboard/channel?id=" + data.goodbye.channel,
                    context: document.body,
                    success: function(channelr) {
                        channel.innerHTML = `Kanał: #${JSON.parse(channelr).name} <a href="#" onclick="edytujgoodbyechannel('${gid}');" class="edytuj">Edytuj</a>`;
                    },
                    error: function(err) {
                        channel.innerHTML = `Kanał: błąd`;
                    }
                });
                serwer2.appendChild(channel);
                var msg = document.createElement('p');
                msg.innerHTML = `Wiadomość: ${data.goodbye.msg} <a href="#" onclick="edytujgoodbyemsg('${data.guild.id}', 'true', '${data.goodbye.channel}', '${data.goodbye.msg}');" class="edytuj">Edytuj</a>`;
                serwer2.appendChild(msg);
            }            

            // Autorole: //

            var autorole = document.createElement('p');
            autorole.innerHTML = "<br>Autorole:";
            autorole.style.fontSize = '20px';
            autorole.style.fontWeight = 'bold';
            serwer2.appendChild(autorole);

            var aenable = document.createElement('p');
            aenable.innerHTML = "Status: " + data.autorole.enabled.toString();
            if(aenable.innerHTML.includes("false")) {
                aenable.innerHTML = `Status: Wyłączone <a href="#" onclick="edytujautorole('${data.guild.id}', 'true', '');" class="edytuj">Włącz</a>`;
            } else {
                aenable.innerHTML = `Status: Włączone <a href="#" onclick="edytujautorole('${data.guild.id}', 'false', '');" style="color: red;" class="edytuj">Wyłącz</a>`;
            }
            serwer2.appendChild(aenable);

            if(data.autorole.enabled) {
                var rolat = document.createElement('p');
                var rolap = null;
                data.guild.roles.forEach(r => {
                    if(r.id == data.autorole.role) rolap = r.name;
                });
                rolat.innerHTML = `Rola: ${rolap} <a href="#" onclick="edytujautorole('${data.guild.id}', 'true', '${rolap}');" class="edytuj">Edytuj</a`;
                serwer2.appendChild(rolat);
            }
            serwer.appendChild(serwer2);
        }
    });
}

function edytujwelcome(gid, enabled, channel, msg) {
    var ch = channel;
    var m = msg;
    if(channel == '' && enabled == 'true') {
        var channelse = prompt("Wpisz nazwę kanału:");
        if(channelse != null) {
            if(channelse == "") {
                alert("Nazwa kanału nie może być pusta");
            } else {
                $.ajax({
                    url:`api/dashboard/welcomechannel?id=${gid}&channel=${channelse.replace("#", "")}`,
                    context: document.body,
                    success: function(data) {
                        if(data.status == "OK") {
                            ch = data.channel;
                        } else {
                            alert(data.message);
                        }
                    },
                    error: function(err) {
                        alert(err);
                    }
                });
            }
        } else return;
    }
    if(msg == '' && enabled == 'true') {
        var msg2 = prompt("Edytuj wiadomość: \n#USER# - zamieniane jest na nazwę użytkownika\n#MENTION# - zamieniane jest na wzmiankę użytkownika\n#TAG# - zamieniane jest na tag użytkownika np. #1234\n#GUILD# - zamieniane jest na nazwę serwera");
        if(msg2 != null) {
            if(msg2 == "") {
                alert("Wiadomość nie może być pusta");
            } else {
                m = msg2.replace(new RegExp("#", 'g'), "3ee3");
            }
        } else return;
    }
    setTimeout(() => {
        $.ajax({
            url:`api/dashboard/welcome?id=${gid}&enabled=${enabled}&channel=${ch}&msg=${m}`,
            context: document.body,
            success: function(data) {
                if(data.status == "OK") {
                    zarzadzaj(gid);
                    setTimeout(() => zarzadzaj(gid), 2);
                } else {
                    alert(data.message);
                }
            },
            error: function(err) {
                alert(err);
            }
        });
    }, 10);
}

function edytujwelcomemsg(gid, enabled, channel, oldmsg) {
    var msg = prompt("Edytuj wiadomość: \n#USER# - zamieniane jest na nazwę użytkownika\n#MENTION# - zamieniane jest na wzmiankę użytkownika\n#TAG# - zamieniane jest na tag użytkownika np. #1234\n#GUILD# - zamieniane jest na nazwę serwera", oldmsg);
    if(msg != null) {
        if(msg == "") {
            alert("Wiadomość nie może być pusta");
        } else {
            edytujwelcome(gid, enabled, channel, msg.replace(new RegExp("#", 'g'), "3ee3"));
        }
    }
}

function edytujwelcomechannel(gid) {
    var channelse = prompt("Wpisz nazwę kanału:");
    if(channelse != null) {
        if(channelse == "") {
            alert("Nazwa kanału nie może być pusta");
        } else {
            $.ajax({
                url:`api/dashboard/welcomechannel?id=${gid}&channel=${channelse.replace("#", "")}`,
                context: document.body,
                success: function(data) {
                    if(data.status == "OK") {
                        zarzadzaj(gid);
                        setTimeout(() => zarzadzaj(gid), 2);
                    } else {
                        alert(data.message);
                    }
                },
                error: function(err) {
                    alert(err);
                }
            });
        }
    }
}

function edytujgoodbye(gid, enabled, channel, msg) {
    var ch = channel;
    var m = msg;
    if(channel == '' && enabled == 'true') {
        var channelse = prompt("Wpisz nazwę kanału:");
        if(channelse != null) {
            if(channelse == "") {
                alert("Nazwa kanału nie może być pusta");
            } else {
                $.ajax({
                    url:`api/dashboard/goodbyechannel?id=${gid}&channel=${channelse.replace("#", "")}`,
                    context: document.body,
                    success: function(data) {
                        if(data.status == "OK") {
                            ch = data.channel;
                        } else {
                            alert(data.message);
                        }
                    },
                    error: function(err) {
                        alert(err);
                    }
                });
            }
        } else return;
    }
    if(msg == '' && enabled == 'true') {
        var msg2 = prompt("Edytuj wiadomość: \n#USER# - zamieniane jest na nazwę użytkownika\n#MENTION# - zamieniane jest na wzmiankę użytkownika\n#TAG# - zamieniane jest na tag użytkownika np. #1234\n#GUILD# - zamieniane jest na nazwę serwera");
        if(msg2 != null) {
            if(msg2 == "") {
                alert("Wiadomość nie może być pusta");
            } else {
                m = msg2.replace(new RegExp("#", 'g'), "3ee3");
            }
        } else return;
    }
    setTimeout(() => {
        $.ajax({
            url:`api/dashboard/goodbye?id=${gid}&enabled=${enabled}&channel=${ch}&msg=${m}`,
            context: document.body,
            success: function(data) {
                if(data.status == "OK") {
                    zarzadzaj(gid);
                    setTimeout(() => zarzadzaj(gid), 2);
                } else {
                    alert(data.message);
                }
            },
            error: function(err) {
                alert(err);
            }
        });
    }, 10);
}

function edytujgoodbyemsg(gid, enabled, channel, oldmsg) {
    var msg = prompt("Edytuj wiadomość: \n#USER# - zamieniane jest na nazwę użytkownika\n#MENTION# - zamieniane jest na wzmiankę użytkownika\n#TAG# - zamieniane jest na tag użytkownika np. #1234\n#GUILD# - zamieniane jest na nazwę serwera", oldmsg);
    if(msg != null) {
        if(msg == "") {
            alert("Wiadomość nie może być pusta");
        } else {
            edytujgoodbye(gid, enabled, channel, msg.replace(new RegExp("#", 'g'), "3ee3"));
        }
    }
}

function edytujgoodbyechannel(gid) {
    var channelse = prompt("Wpisz nazwę kanału:");
    if(channelse != null) {
        if(channelse == "") {
            alert("Nazwa kanału nie może być pusta");
        } else {
            $.ajax({
                url:`api/dashboard/goodbyechannel?id=${gid}&channel=${channelse.replace("#", "")}`,
                context: document.body,
                success: function(data) {
                    if(data.status == "OK") {
                        zarzadzaj(gid);
                        setTimeout(() => zarzadzaj(gid), 2);
                    } else {
                        alert(data.message);
                    }
                },
                error: function(err) {
                    alert(err);
                }
            });
        }
    }
}

function edytujautorole(gid, enabled, rola) {
    if(enabled == 'false') {
        $.ajax({
            url:`api/dashboard/autorole?id=${gid}&enabled=false`,
            context: document.body,
            success: function(data) {
                if(data.status == "OK") {
                    zarzadzaj(gid);
                    setTimeout(() => zarzadzaj(gid), 2);
                } else {
                    alert(data.message);
                }
            },
            error: function(err) {
                alert(err);
            }
        });
    } else {
        var nrola = prompt("Wpisz rolę:", rola);
        if(nrola != null) {
            if(nrola == "") {
                alert("Rola nie może być pusta");
            } else {
                $.ajax({
                    url:`api/dashboard/autorole?id=${gid}&enabled=true&role=${nrola}`,
                    context: document.body,
                    success: function(data) {
                        if(data.status == "OK") {
                            zarzadzaj(gid);
                            setTimeout(() => zarzadzaj(gid), 2);
                        } else {
                            alert(data.message);
                        }
                    },
                    error: function(err) {
                        alert(err);
                    }
                });
            }
        }
    }
}

function ladujstaty() {
    $.ajax({
        url: "botstats",
        context: document.body,
        success: function(staty) {
            $("#ping").html(staty.ping);
            $("#ram").html(`${staty.ram}MB`);
            $("#cpu").html(staty.cpu);
            $("#uptime").html(staty.uptime);
            $("#guilds").html(staty.guilds);
            $("#channels").html(staty.channels);
            $("#users").html(staty.users);
            $("#status").html(staty.status);
        }
    });
}

function edytujprefix(gid, old) {
    var prefix = prompt("Wpisz nowy prefix:", old);
    if(prefix != null) {
        if(prefix == "") {
            alert("Prefix nie może być pusty");
        } else {
            $.ajax({
                url:`api/dashboard/prefix?id=${gid}&prefix=${prefix}`,
                context: document.body,
                success: function(data) {
                    if(data.status == "OK") {
                        $(`#${gid}`).html("Prefix: " + prefix + ` <a href="#" onclick="edytujprefix('${gid}', '${prefix}')" style="text-decoration: none; color: lightgreen; font-size: 15px;">Edytuj</a>`);
                    } else {
                        alert(data.message);
                    }
                },
                error: function(err) {
                    alert(err);
                }
            });
        }
    }
}