require("dotenv").config();
const texts = require('./text');
const telegramBot = require(`node-telegram-bot-api`);

const bot = new telegramBot(process.env.API_KEY_BOT, {
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

let selectedLanguage;
let userResponses = {}; // Для временного хранения данных пользователя

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Выберите язык / Choose a language:",
    langOptions
  );
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  bot.answerCallbackQuery(query.id);

  if (data === "rus" || data === "eng") {
    selectedLanguage = data;
    userResponses[chatId] = { language: selectedLanguage };

    await bot.deleteMessage(chatId, query.message.message_id);
    await bot.sendMessage(chatId, texts[selectedLanguage].welcome);
    askSpeciality(chatId, selectedLanguage);

  } else if (data === `${selectedLanguage}_spec_yes`) {
    await bot.sendMessage(chatId, texts[selectedLanguage].specYesResponse);
    bot.deleteMessage(chatId, query.message.message_id);
    requestConsent(chatId, selectedLanguage);
  } else if (data === `${selectedLanguage}_spec_no`) {
    await bot.sendMessage(chatId, texts[selectedLanguage].specNoResponse);
    bot.deleteMessage(chatId, query.message.message_id);
    requestConsent(chatId, selectedLanguage);
  }

  else if (data === `${selectedLanguage}_consent_agree`) {
    await bot.sendMessage(chatId, texts[selectedLanguage].consentAgree);
    bot.deleteMessage(chatId, query.message.message_id);
    startRegistration(chatId, selectedLanguage);

  } else if (data === `${selectedLanguage}_consent_disagree`) {
    bot.answerCallbackQuery(query.id);
    const consentMessage = await bot.sendMessage(chatId, texts[selectedLanguage].consentDisagree);
    setTimeout(async () => {
      await bot.deleteMessage(chatId, consentMessage.message_id);
      requestConsent(chatId, selectedLanguage);
    }, 5000);

    bot.deleteMessage(chatId, query.message.message_id);
  }
});

const askSpeciality = (chatId, language) => {
  const specOptions = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: language === "rus" ? "Да" : "Yes", callback_data: `${language}_spec_yes` }],
        [{ text: language === "rus" ? "Нет" : "No", callback_data: `${language}_spec_no` }],
      ],
    }),
  };

  bot.sendMessage(chatId, texts[language].specialityQuestion, specOptions);
};

const requestConsent = (chatId, language) => {
  const consentOptions = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: language === "rus" ? "Согласен" : "Agree", callback_data: `${language}_consent_agree` }],
        [{ text: language === "rus" ? "Не согласен" : "Disagree", callback_data: `${language}_consent_disagree` }],
      ],
    }),
  };
  bot.sendMessage(chatId, texts[language].consentRequest, consentOptions);
};

const startRegistration = async (chatId) => {
  const userLang = userResponses[chatId].language;
  userResponses[chatId] = { language: userLang };
  await bot.sendMessage(chatId, texts[userLang].askName);
};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userData = userResponses[chatId];



  if (userData && userData.language) {
    const userLang = userData.language;
    if (!userData.name) {
      userData.name = msg.text;
      await bot.sendMessage(chatId, texts[userLang].askAge);
    } else if (!userData.age) {
      userData.age = msg.text;
      await bot.sendMessage(chatId, texts[userLang].askCity);
    } else if (!userData.city) {
      userData.city = msg.text;
      await bot.sendMessage(chatId, texts[userLang].askResume);
    } else if (!userData.resume) {
      if (msg.document) {
        const fileId = msg.document.file_id;
        const fileName = msg.document.file_name;

        const fileLink = await bot.getFileLink(fileId);
        console.log(fileName + "  " + fileLink);
        userData.resume = fileLink;
      }
      else {
        userData.resume = msg.text;
      }
      await bot.sendMessage(chatId, texts[userLang].askExperience);
    } else if (!userData.experience) {
      userData.experience = msg.text;
      await bot.sendMessage(chatId, texts[userLang].thanks);

      saveToGoogleSheets(userData);
      delete userResponses[chatId];
    }
  }
});

bot.on('document', async (msg) => {
  const chatId = msg.chat.id;
  const fileId = msg.document.file_id;
  const fileName = msg.document.file_name;

  const fileLink = await bot.getFileLink(fileId);

  console.log(fileName + "  " + fileLink);
})

const saveToGoogleSheets = (userData) => {
  console.log("Сохранение данных в Google Sheets:", userData);
};