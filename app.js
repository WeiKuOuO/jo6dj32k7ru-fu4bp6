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

  // JSON Files
  let userData = JSON.parse(fs.readFileSync('./Storage/userData.json', 'utf8'));

  const ip = "geht.sytes.net&port=27599                                                                  "
  const text = "**★ geht.sytes.net;27599  **的狀態";
  const urlMain = "https://mcapi.us/server/status?ip=" + (ip);

  bot.on("ready", async () => {
    bot.channels.get('519551184369877012').bulkDelete('50')
    const serverstatus = new Discord.RichEmbed()
      .setAuthor(bot.user.username)
      .setTitle("**伺服器資訊資訊**")
      .setDescription("偵測中")
      .setColor("RANDOM")
      .addField(":desktop: 人數","偵測中", true)
      .addField(":stopwatch: 延遲程度 ", "偵測中", true)
    const m = await bot.channels.get('519551184369877012').send(serverstatus)
        
    setInterval(function(){
      request(urlMain, function(err, response, body) {
        body = JSON.parse(body);
        var status = '伺服器現在是關閉的!';
        var lag = '關閉';
        var member = "關閉";
        if(body.online) {
            status = '伺服器現在是開啟的!  -  ';
            if(body.players.now) {
                member = body.players.now + " / " + body.players.max ;
                status += '' + body.players.now + ' 人正在遊玩!!';
            } else {
                member = "0 / " + body.players.max ;
                status += '沒人在玩喔! 快進去搶頭香吧!';
            }
            if(body.players.now < 3){
              lag = '順暢';
            }
            if(body.players.now < 6){
               lag = '一般';
             }
            if(body.players.now < 9){
              lag = '小lag';
            }
             if(body.players.now > 9){
              lag = '很lag';
             }
            if(body.players.now < 12){
               lag = '非常lag';
            }
             if(body.players.now > 12){
               lag = '超級無敵宇宙霹靂lag';
             }
        }
        const serverinfo = new Discord.RichEmbed()
          .setAuthor(bot.user.username)
          .setTitle(text)
          .setDescription(status)
          .setColor("RANDOM")
          .addField(":desktop: 人數",`\`\`\`xl\n${member}\`\`\``, true)
          .addField(":stopwatch: 延遲程度 ", `\`\`\`fix\n${lag}\`\`\``, true)
        m.edit(serverinfo)
      });
    },2200)
  })
  bot.on("ready", () => {
    console.log(`${bot.user.username}成功啟動了!^w^, [ ${bot.guilds.size} | ${bot.channels.size} | ${bot.users.size} ]`);
    bot.user.setActivity(`我正在 ${bot.guilds.size} 個群組潛水`,'https://www.twitch.tv/weikuouo');
  });

  bot.on("guildCreate", guild => {
    console.log(`加入群組 ${guild.name} [ ${guild.memberCount} ](id: ${guild.id})`);
    bot.user.setActivity(`我正在 ${bot.guilds.size} 個群組潛水`,'https://www.twitch.tv/weikuouo');
  });

  bot.on("guildDelete", guild => {
    console.log(`退出群組 ${guild.name} [ ${guild.memberCount} ] (id: ${guild.id})`);
    bot.user.setActivity(`我正在 ${bot.guilds.size} 個群組潛水`,'https://www.twitch.tv/weikuouo');
  });


  bot.on("message", async message => {
    // TEST
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;

    // 單字簡化
    const sender = message.author;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const msg = message.content.toUpperCase();

    // FS
    if (!userData[sender.id]) userData[sender.id] = {}
    if (!userData[sender.id].money) userData[sender.id].money = 1000;

    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
      if (err) console.error(err);
    })

    //經濟系統
    if (command === "bal" || command === "money") {
      const BankAcc = message.author.username;
      const BankBal = userData[sender.id].money;
      message.channel.send({embed:{
        title: "金錢銀行",
        description: "此銀行是所有伺服器通用喔",
        fields:[{
          name: "銀行帳戶",
          value: (BankAcc),
          inline: true
        },
        {
          name: "銀行存款",
          value: (BankBal),
          inline: true
        },
      ],
      color: 0xF1C40F
    }})
    message.delete().catch(O_o=>{});
  }

    //Ping
    if(command === "ping") {
      const sayMessage = args.join(" ");
      message.delete().catch(O_o=>{});
      const m = await message.channel.send("Ping?");
      m.edit({embed:{
        author: {
          name: "微苦小助手Ping觀測系統",
          icon_url: bot.user.avatarURL
        },
        color: 3447003,
        description:"機器人 | **" + (Math.round(bot.ping)) + " ms**\n伺服器 | **" + (m.createdTimestamp - message.createdTimestamp) + " ms**"
      }});
    }

    //公告
    if(command === "say") {
      const sayMessage = args.join(" ");
      message.delete().catch(O_o=>{});
      message.channel.send(sayMessage);
    }
    //改變遊戲狀態
    if(command === "cg") {
      message.delete().catch(O_o=>{});
      const changegame = args.join(" ");
      bot.user.setActivity(changegame);
      message.channel.send({embed:{
        title: "改變遊戲狀態",
        description: "已經成功改變遊戲狀態摟",
        color: 0x28B463
      }})
    }
    //自訂embed訊息
    if(command === "all"){
      message.delete().catch(O_o=>{});
      const word = args.join(" ");
      message.channel.send({embed:{
        title: "",
        description: (word),
        color: 0x0CFFFF
      }})
    }
    //測試是否正確進入伺服器或是正常載入
    if(command === "test"){
        message.delete().catch(O_o=>{});
        message.channel.send({embed:{
          description: "我就可愛的待在這裡哦w",
          color: 0x28B463,
          timestamp: new Date(),
          footer: {
            text: '微苦的小助手 | WeiKu Helper',
            icon_url: 'https://i.imgur.com/HPaSMOl.jpg',
          }
        }})
      }
      //可愛的cute
    if(command === "cute"){
      message.delete().catch(O_o=>{});
      message.channel.send({embed:{
        title: "",
        description: "",
        image: {
          url: 'https://i.imgur.com/q69jlX3.png',
        },
        color: 0x28B463,
      }})
    }
    //踢出
    if(command === "kick") {
      message.delete().catch(O_o=>{});
      if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("沒權限的狗狗QAQ");
      let member = message.mentions.members.first() || message.guild.members.get(args[0]);
      if(!member)
      return message.reply("請輸入一個這個伺服器的人");
      if(!member.kickable)
      return message.reply("我沒有權限封鎖他喔");
      let reason = args.slice(1).join(' ');
      if(!reason) reason = "你不能沒理由亂踢人喔";
      await member.kick(reason)
      .catch(error => message.reply(` ${message.author} 我不能踢掉她\n原因 - ${error}`));
      message.reply(`${member.user.tag} 已經被 ${message.author.tag} 踢出了\n原因 - ${reason}`);

      }
    //封鎖
    if(command === "ban") {
      message.delete().catch(O_o=>{});
      if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("沒權限的狗狗QAQ");

      let member = message.mentions.members.first();
      if(!member)
      return message.reply("test");
      if(!member.bannable)
      return message.reply("我不能ban掉這個使用者 大哥你有權限嗎?");

      let reason = args.slice(1).join(' ');
      if(!reason) reason = "打理由阿大哥";

      await member.ban(reason)
      .catch(error => message.reply(`${message.author} 我無法封鎖\n原因 - ${error}`));
      message.reply(`${member.user.tag} 被 ${message.author.tag} 封鎖\n原因 - ${reason}`);
    }
    //清除聊天室
    if(command === "purge") {
      message.delete().catch(O_o=>{});
      const deleteCount = parseInt(args[0], 10);
      if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("請輸入一個2~100的數字");
      const fetched = await message.channel.fetchMessages({limit: deleteCount});
      const msgdelete = "成功刪除了 " + (deleteCount) + " 則訊息";
      message.channel.bulkDelete(fetched)
      message.channel.send({embed: {
        description: (msgdelete)
      }})
      .catch(error => message.reply(`無法刪除,原因: ${error}`));
    }
    //資料庫
    if(command === "info") {
      message.delete().catch(O_o=>{});
      const duration = moment.duration(bot.uptime).format(" [days]天 [hrs]小時");
      const time = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + " MB";
      message.channel.send({embed: {
      color: 3447003,
      author: {
        name: bot.user.username,
        icon_url: bot.user.avatarURL
      },
      title: "這是這個Bot的資訊",
      description: "歡迎看看他的資訊哦 順便給點建議",
      fields: [{
          name: "• 名稱",
          value: "微苦的小助手",
          inline: true
        },
        {
          name: "• 作者",
          value: "微苦#3402",
          inline: true
        },
        {
          name: "• 版本",
          value: "v1.1.0",
          inline: true
        },
        {
          name: "• 群組",
          value: bot.guilds.size,
          inline: true
        },
        {
          name: "• 頻道",
          value: bot.channels.size,
          inline: true
        },
        {
          name: "• 人數",
          value: bot.users.size,
          inline: true
        },
        {
          name: "• 系統版本",
          value: process.version,
          inline: true
        },
        {
          name: "• 記憶體用量",
          value: (time),
          inline: true
        },
        {
          name: "• 運行時間",
          value: moment.duration(bot.uptime).format(" D [天], H [時], m [分], s [秒]"),
          inline: true
        }
      ],
      timestamp: new Date(),
      footer: {
        icon_url: bot.user.avatarURL,
        text: bot.user.username
      }
    }
  });
    }
    //伺服器資訊
  if(command === "server") {
    const ip = args.join(" ");
    const text = "**★  " + (ip) + "** 的狀態";
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
                status += '**沒人在玩喔! 快進去搶頭香吧!**';
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
    message.delete().catch(O_o=>{});
    const id = args.join(" ");
    const uuid = await mcapi.usernameToUUID(id);
    const url1 = "https://visage.surgeplay.com/face/400/" + (uuid)
    const url2 = "https://visage.surgeplay.com/head/400/" + (uuid)
    const url3 = "https://visage.surgeplay.com/full/400/" + (uuid)
    const url4 = "https://visage.surgeplay.com/frontfull/400/" + (uuid)
    if(!id)
      return message.channel.send("請輸入玩家名稱，不可空白");
    if(uuid === undefined)
      return message.channel.send("查無此玩家資訊，請確認玩家是否存在");
    message.channel.send({embed: {
      title: "玩家資訊",
      description: "這裡可以讓你知道**玩家**的資訊\n此系統**正在開發中**，有問題請見諒",
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
    //指令列表
    if(command === "help"){
      message.delete().catch(O_o=>{});
        message.channel.send({embed: {
          title: "指令列表",
          description: "這裡可以讓你知道這隻機器人的**所有**資訊，但是請勿**濫用**指令來刷頻\n某些指令我們已經做了權限控制\n",
          color: 3447003,
          author: {
            name: bot.user.username,
            icon_url: bot.user.avatarURL
          },
          fields: [{
            name: "• 指令",
            value: "```py\n 1# wk!cute\n 2# wk!user \n 3# wk!server\n 4# wk!info\n 5# wk!purge (並未完整開發)\n 6# wk!ban   (並未完整開發)\n 7# wk!kick  (並未完整開發)\n 8# wk!test\n 9# wk!help\n10# wk!say\n11# wk!all\n12# wk!ping```",
            inline: true
          },
          {
            name: "• 說明",
            value: "```http\nCute RainWolf\n查看玩家資訊\n查看伺服資訊\n查看機器人資訊\n可以清除聊天室\n封鎖帳戶\n踢出群組\n測試Bot\n開啟此列表\n說話\n公告\n可以看Ping值```",
            inline: true
          },
          {
            name: "• 建議",
            value: "如果有任何有關於指令的建議，像是想要新增指令或是功能\n還歡迎聯絡 ***微苦#3402***\n我會很樂意為你服務的\n[Youtube](https://www.youtube.com/channel/UCuER7v8bBXWcgDQYhP0sdjA?view_as=subscriber) | [Discord](https://discord.gg/UzmMwqc) | [Website](https://WeiKuNet.weebly.com) | [Invite](https://discordapp.com/api/oauth2/authorize?client_id=460042585663340545&permissions=8&scope=bot)\n如果可以的話請把Bot邀請到你的Discord群 你的支持是我的動力",
            inline: true
          },
        ],
        timestamp: new Date(),
        footer: {
          icon_url: bot.user.avatarURL,
          text: bot.user.username
        }
      }})
    }
    //不同顏色
    //綠色
    if(command === "green"){
      const text = args.join(" ");
      message.delete().catch(O_o=>{});
        message.channel.send({embed: {
          description: (text),
          color: 0x00FF04,
      }})
    }
    //紫色
    if(command === "purple"){
      const text = args.join(" ");
      message.delete().catch(O_o=>{});
        message.channel.send({embed: {
          description: (text),
          color: 0xD500FF,
      }})
    }
    //教學
    if(command === "tur"){
      message.delete().catch(O_o=>{});
        message.channel.send({embed: {
          title: "嗨我叫title",
          description: "嗨我叫description",
          color: 3447003,
          author: {
            name: "嗨我叫author",
          },
          fields: [{
            name: "嗨是我是field 1號",
            value: "嗨我是field 1號的value",
            inline: true
          },
          {
            name: "嗨是我是field 2號",
            value: "嗨我是field 2號的value",
            inline: true
          },
          {
            name: "嗨是我是field 3號",
            value: "嗨我是field 3號的value",
            inline: true
          },
        ],
        timestamp: new Date(),
        footer: {
          text: "嗨我是footer"
        }
      }})
    }



    })
  bot.login(token);
