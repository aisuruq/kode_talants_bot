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
  bot.sendMessage(msg.chat.id, 'Выберите язык / Choose a language:', langOptions);
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;

  bot.answerCallbackQuery(query.id);

  if (query.data === 'rus') {
    bot.sendMessage(chatId, 'Вы выбрали русский язык. Приветсвую вас в KODE talants!');
  } else if (query.data === 'eng') {
    bot.sendMessage(chatId, 'You have selected English. Welcome to KODE talents!!');
  }
});

