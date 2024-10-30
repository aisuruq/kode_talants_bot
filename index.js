const tgApi = require(`node-telegram-bot-api`);

const token = "7733056715:AAGOCoyBTNjG2qeP6fQxMQsIYhyRL1EmJn8";

const bot = new tgApi(token, { polling: true });

bot.setMyCommands([{ command: "/start", description: "Запуск бота" }]);

bot.on("message", async (msg) => {
  const text = msg.text;
  const chatid = msg.chat.id;

  if (text === "/start") {
    await bot.sendMessage(chatid, "Приветствую!");
  }
});
