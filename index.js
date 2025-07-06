const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// Set up the Discord bot
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent
  ] 
});

client.on('ready', () => {
  console.log('Bot準備完了～');
});

client.on('messageCreate', async message => {
  console.log(message.content)
  if (message.author.bot) return;

  if (message.channel.id === process.env.CHANNEL_ID) {
    if (message.content.match(/^omikuji/)) {
      let arr = ["大吉 Dai-kichi", "中吉 Chu-kichi", "小吉 Sho-kichi", "吉 Kichi", "半吉 Han-kichi", "末吉 Sue-kichi", "末小吉 Suesho-kichi", "凶 kyo", "小凶 Sho-kyo", "半凶 Han-kyo", "末凶 Sue-kyo", "大凶 Dai-kyo"];
      let weight = [14.1, 13.4, 9.1, 28.5, 4.1, 5.2, 1.3, 12.9, 4.5, 1.5, 3, 2.4];
      let url = ["bj7bkyycqq", "zwzhutaryi", "irbyx7wnjz", "mdvfqbmqn2", "ap0ydvli2i", "zewm5gdu2i", "vha5fj4uzw", "u4kuflirif", "tee0f1nncn", "y6u1xi0lup", "oi7esvgtao", "odbfpxvgcc"];
      
      // まずおみくじを振るGIFを表示
      const shakingEmbed = new EmbedBuilder()
        .setTitle('🎋 おみくじを振っています... | Drawing Omikuji...')
        .setDescription('運勢を占っています。少々お待ちください...\n\nFortune telling in progress. Please wait...')
        .setImage('https://c.tenor.com/NfUHO82zG5wAAAAC/tenor.gif')
        .setColor(0xFFD700)
        .setFooter({ text: `${message.author.displayName || message.author.username} のおみくじ | ${message.author.displayName || message.author.username}'s Omikuji` })
        .setTimestamp();
      
      // GIFを表示
      const reply = await message.reply({ embeds: [shakingEmbed] });
      
      // 2-3秒待ってから結果を表示
      setTimeout(() => {
        lotteryByWeight(reply, arr, weight, url, message.author);
      }, 2500);
      
      console.log(message.content);
      return;
    }
    if (message.content.match(/^help/)) {
      const helpEmbed = new EmbedBuilder()
        .setTitle('🎋 おみくじ (Omikuji) ヘルプ')
        .setColor(0xFF6B6B)
        .setDescription('**omikuji** - 運勢の結果を得ることができます。\n\nおみくじは古代日本の占いです。詳細については[Wiki](https://en.wikipedia.org/wiki/O-mikuji)をご覧ください。')
        .addFields(
          {
            name: '🌟 良い運勢 (Good Fortune)',
            value: '```' +
                   '1.  大吉 Dai-kichi   14.1%\n' +
                   '2.  中吉 Chu-kichi   13.4%\n' +
                   '3.  小吉 Sho-kichi    9.1%\n' +
                   '4.   吉 Kichi       28.5%\n' +
                   '5.  半吉 Han-kichi    4.1%\n' +
                   '6.  末吉 Sue-kichi    5.2%\n' +
                   '7. 末小吉 Suesho-kichi 1.3%' +
                   '```',
            inline: true
          },
          {
            name: '⚡ 悪い運勢 (Bad Fortune)',
            value: '```' +
                   '8.   凶 Kyo         12.9%\n' +
                   '9.  小凶 Sho-kyo      4.5%\n' +
                   '10. 半凶 Han-kyo      1.5%\n' +
                   '11. 末凶 Sue-kyo      3.0%\n' +
                   '12. 大凶 Dai-kyo      2.4%' +
                   '```',
            inline: true
          }
        )
        .addFields({
          name: '💫 使い方 (How to Use)',
          value: '何度でもおみくじを引くことができます！\n`omikuji` とメッセージを送信してください。\n\nYou can draw your fortune as many times as you like!\nSend a message with `omikuji`.',
          inline: false
        })
        .setFooter({ text: '🍀 良い運勢でありますように！ | May you have good fortune!' })
        .setTimestamp();
      
      message.reply({ embeds: [helpEmbed] });
      return;
    }
  }
});

function lotteryByWeight(replyMessage, arr, weight, url, author) {
  let totalWeight = 0;
  for (let i = 0; i < weight.length; i++) {
    totalWeight += weight[i];
  }
  let random = Math.floor(Math.random() * totalWeight);
  for (let i = 0; i < weight.length; i++) {
    if (random < weight[i]) {
      let luck = i + 1;
      
      // 運勢に応じて色を設定
      let embedColor;
      let emoji;
      if (i <= 6) { // 良い運勢
        embedColor = 0x00FF00; // 緑色
        emoji = '🌟';
      } else { // 悪い運勢
        embedColor = 0xFF0000; // 赤色
        emoji = '⚡';
      }
      
      const fortuneEmbed = new EmbedBuilder()
        .setTitle(`${emoji} おみくじ結果 (Omikuji Result)`)
        .setColor(embedColor)
        .setDescription(`**運勢は ${arr[i]} でした**\n\nYour luck is number ${luck} of 12.`)
        .setImage(`https://www.desmos.com/calc_thumbs/production/${url[i]}.png`)
        .addFields({
          name: '📊 グラフを見る (View Graph)',
          value: `https://www.desmos.com/calculator/${url[i]}`,
          inline: false
        })
        .setFooter({ text: `${author.displayName || author.username} のおみくじ | ${author.displayName || author.username}'s Omikuji` })
        .setTimestamp();
      
      // メッセージを編集して結果を表示
      replyMessage.edit({ embeds: [fortuneEmbed] });
      return;
    } else {
      random -= weight[i];
    }
  }
  console.log("lottery error");
}

// Start the Discord bot
client.login(DISCORD_TOKEN)
  .then(() => console.log('Attempting to log in to Discord...'))
  .catch(error => {
    console.error('Failed to log in to Discord:', error);
    // トークンが無効な場合、プロセスを終了させる
    if (error.code === 'TokenInvalid') {
      console.error('ERROR: The provided Discord token is invalid. Please check your DISCORD_TOKEN environment variable in Railway.');
      process.exit(1); // エラーで終了
    }
  });

