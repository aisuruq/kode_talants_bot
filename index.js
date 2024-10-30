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

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Выберите язык / Choose a language:",
    langOptions
  );
});

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const lang = query.data;

  bot.answerCallbackQuery(query.id);

  if (lang === "rus") {
    bot.deleteMessage(chatId, messageId);
    const ruScenario = require("./scenarios/rus");
    ruScenario(bot, chatId);
  } else if (lang === "eng") {
    bot.deleteMessage(chatId, messageId);
    const enScenario = require("./scenarios/eng");
    enScenario(bot, chatId);
  }
});
