require('dotenv').config()
const tgApi = require(`node-telegram-bot-api`);

const bot = new tgApi(process.env.API_KEY_BOT, {
    polling: true
});

bot.setMyCommands([{ command: "/start", description: "Запуск бота" }]);

bot.on("message", async (msg) => {
  const text = msg.text;
  const chatid = msg.chat.id;

  if (text === "/start") {
    await bot.sendMessage(chatid, "Приветствую!");
  }
});
