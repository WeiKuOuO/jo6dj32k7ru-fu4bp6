  const Discord = require("discord.js");
  const moment = require("moment");
  const mcapi = require('mcapi');
  const request = require('request');
  const fs = require('fs');
  const token = process.env.token
  const prefix = process.env.prefix
  const bot = new Discord.Client();
  bot.commands = new Discord.Collection();
  require("moment-duration-format");

  bot.on("ready", () => {
    console.log(`${bot.user.username}成功啟動了!^w^, [ ${bot.guilds.size} | ${bot.channels.size} | ${bot.users.size} ]`);
  });

  bot.on("guildCreate", guild => {
    console.log(`加入群組 ${guild.name} [ ${guild.memberCount} ](id: ${guild.id})`);
  });

  bot.on("guildDelete", guild => {
    console.log(`退出群組 ${guild.name} [ ${guild.memberCount} ] (id: ${guild.id})`);
  });

  bot.on("message", async message => {
    // TEST
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;
    if(message.member.id == "476049616341565440"){
      message.delete()
    }
    // 單字簡化
    const sender = message.author;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const msg = message.content.toUpperCase();

    //伺服器資訊
  if(command === "server") {
    const ip = args.join(" ");
    const text = "**" + (ip) + "** 的狀態";
    const urlTitle = "**IP** - " + (ip);
    const urlMain = "https://mcapi.us/server/status?ip=" + (ip);
    const url = "https://mcapi.us/server/image?ip=" + (ip);
    request(urlMain, function(err, response, body) {
        if(err) {
            console.log(err);
            return message.channel.send('在查詢時出了點問題:P (IP錯誤)...');
        }
        body = JSON.parse(body);
        var status = '**伺服器**現在是**關閉**的!';
        var member = "關閉";
        if(body.online) {
            status = '**伺服器**現在是**開啟**的!  -  ';
            if(body.players.now) {
                member = "**" + body.players.now + "** / **" + body.players.max + "**";
                status += '**' + body.players.now + '** 人正在遊玩!!';
            } else {
                member = "**0** / **" + body.players.max + "**";
                status += '**Nobody is playing now!**';
            }
        }
        message.channel.send({embed:{
          title: (text),
          description: (status),
          fields: [
            {
              name: "• 核心",
              value: body.server.name,
              inline: true
            },
            {
              name: "• 人數",
              value: (member),
              inline: true
            },
            {
              name: "• 運行時間",
              value: moment.duration(body.duration).format(" D [天], H [時], m [分], s [秒]"),
              inline: true
            }
          ],
          image:{
            url: (url),
          },
          color: 0x0080ff
        }});
    });
    message.delete().catch(O_o=>{});
    }
    //玩家資訊
    if(command === "user"){
    const id = args.join(" ");
    const uuid = await mcapi.usernameToUUID(id);
    const url1 = "https://visage.surgeplay.com/face/400/" + (uuid)
    const url2 = "https://visage.surgeplay.com/head/400/" + (uuid)
    const url3 = "https://visage.surgeplay.com/full/400/" + (uuid)
    const url4 = "https://visage.surgeplay.com/frontfull/400/" + (uuid)
    if(!id){
      return message.channel.send("請輸入玩家名稱，不可空白");
    }
    if(uuid === null){
      return message.channel.send("查無此玩家資訊，請確認玩家是否存在");
    }
    message.channel.send({embed: {
      title: "玩家資訊",
      color: 3447003,
      author: {
        name: (id) + "的資訊",
        icon_url: (url1)
      },
      fields: [{
          name: "• 名稱",
          value: (id),
          inline: true
        },
        {
          name: "• UUID",
          value: (uuid),
          inline: true
        },
        {
          name: "• Skin",
          value: "此玩家的Skin",
          inline: true
        },
      ],
      image :{
        url: (url3)
      },
      thumbnail :{
        url: (url2)
      },
      timestamp: new Date(),
      footer: {
        icon_url: bot.user.avatarURL,
        text: bot.user.username
      }
    }})
  }
})

bot.login(token);
