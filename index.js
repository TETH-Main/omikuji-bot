const { Client, GatewayIntentBits } = require('discord.js');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
console.log("TOKEN check:", DISCORD_TOKEN ? "FOUND" : "NOT FOUND");

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
      lotteryByWeight(message, arr, weight, url);
      console.log(message.content);
      return;
    }
    if (message.content.match(/^help/)) {
      let help = "";
      help += "omikuji - You will get the result of your fortune. \n";
      help += "Omikuji is an ancient Japanese divination of fortune. For more information, please see Wiki. \n https://en.wikipedia.org/wiki/O-mikuji \n";
      help += "\n The names and probabilities of all fortunes are as follows. \n";
      help += "good \n" + 
              "|  1.　大吉 Dai-kichi 14.1% \n" + 
              "|  2.　中吉 Chu-kichi 13.4% \n" + 
              "|  3.　小吉 Sho-kichi  9.1% \n" + 
              "|  4.　　吉 Kichi     28.5% \n" + 
              "|  5.　半吉 Han-kichi  4.1% \n" + 
              "|  6.　末吉 Sue-kichi  5.2% \n" + 
              "|  7.末小吉 Suesho-kichi  1.3% \n" + 
              "|  8.　　凶 Kyo       12.9% \n" + 
              "|  9.　小凶 Sho-kyo    4.5% \n" + 
              "| 10.　半凶 Han-kyo    1.5% \n" + 
              "| 11.　末凶 Sue-kyo    3.0% \n" + 
              "| 12.　大凶 Dai-kyo    2.4% \n" +
              "bad \n\n";
      help += "You can draw your fortune as many times as you like. \n";
      message.reply(help);
      return;
    }
  }
});

function lotteryByWeight(msg, arr, weight, url) {
  let totalWeight = 0;
  let text = "";
  for (let i = 0; i < weight.length; i++) {
    totalWeight += weight[i];
  }
  let random = Math.floor(Math.random() * totalWeight);
  for (let i = 0; i < weight.length; i++) {
    if (random < weight[i]) {
      let luck = i + 1;
      text += "====================\n";
      text += "運勢は " + "**" + arr[i] + "**" + " でした\n";
      text += "Your luck is number " + luck + " of 12.\n\n";
      text += "https://www.desmos.com/calculator/" + url[i] + "\n";
      text += "====================\n";
      msg.reply(text);
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

