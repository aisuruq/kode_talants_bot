require("dotenv").config();
const tgApi = require(`node-telegram-bot-api`);

const bot = new tgApi(process.env.API_KEY_BOT, {
  polling: true,
});

bot.setMyCommands(
  [
    { command: "/start", description: "Запуск бота" },
    { command: "/help", description: "Помощь" }
  ] 
);

const langOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: `Русский`, callback_data: `rus` }],
      [{ text: `English`, callback_data: `eng` }],
    ],
  }),
};

let selectedLanguage = "rus";

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Выберите язык / Choose a language:', langOptions);
});

let helpMessageRus = `
Вот доступные команды:
  /start - Запуск взаимодействия с ботом.
  /help - Показать это сообщение помощи.
Пожалуйста, дайте согласие на обработку данных для продолжения.`;

let helpMessageEng = `
Here are the available commands:
  /start - Start the interaction with the bot.
  /help - Show this help message.
Please provide your consent for data processing to continue.`;

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const lang = query.data;
  const MessageId = query.message.message_id;

  bot.answerCallbackQuery(query.id);
  bot.deleteMessage(chatId, MessageId).catch((err) => console.log('Error deleting message:', err));

  selectedLanguage = lang;

  if (lang === "rus") {
    const ruScenario = require("./scenarios/rus");
    ruScenario(bot,chatId);

  } else if (lang === "eng") {
    const enScenario = require("./scenarios/eng");
    enScenario(bot,chatId);
  }

  bot.onText(/\/help/, (msg) => {
    const helpMessage = selectedLanguage === "rus" ? helpMessageRus : helpMessageEng;
    bot.sendMessage(msg.chat.id, helpMessage);
  });
});
