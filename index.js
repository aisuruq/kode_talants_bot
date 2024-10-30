require("dotenv").config();
const tgApi = require(`node-telegram-bot-api`);

const bot = new tgApi(process.env.API_KEY_BOT, {
  polling: true,
});

bot.setMyCommands([{ command: "/start", description: "Запуск бота" }]);

const langOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: `Русский`, callback_data: `rus` }],
      [{ text: `English`, callback_data: `eng` }],
    ],
  }),
};

bot.on("message", async (msg) => {
  const text = msg.text;
  const chatid = msg.chat.id;

  if (text === "/start") {
    await bot.sendMessage(
      chatid,
      "Приветствую! Для начала выбери язык \n\n Hello! Choose a language",
      langOptions
    );
  }
});

bot.on("callback_query", (msg) => {
  console.log(msg);
});
