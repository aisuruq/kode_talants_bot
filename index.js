require("dotenv").config();
const texts = require("./text");
const telegramBot = require(`node-telegram-bot-api`);

const bot = new telegramBot(process.env.API_KEY_BOT, {
  polling: true,
});

bot.setMyCommands([
  { command: "/start", description: "Запуск бота / Start Bot" },
  {
    command: "/help",
    description: "Вспомогательные команды / Auxiliary commands",
  },
]);

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

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === "Старт") {
    bot.sendMessage(chatId, "Выберите язык / Choose a language:", langOptions);
  }
});

bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;

  if (selectedLanguage) {
    await bot.sendMessage(chatId, texts[selectedLanguage].help);
  } else {
    const startOptions = {
      reply_markup: {
        keyboard: [[{ text: "Старт / Start" }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    };
    await bot.sendMessage(
      chatId,
      "Для начала запустите бота / First, launch the bot",
      startOptions
    );
  }
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
    userResponses[chatId];
    userResponses[chatId].isSpecKnown = true;
    bot.deleteMessage(chatId, query.message.message_id);
    requestConsent(chatId, selectedLanguage);
  } else if (data === `${selectedLanguage}_spec_no`) {
    await bot.sendMessage(chatId, texts[selectedLanguage].specNoResponse);
    userResponses[chatId].isSpecKnown = false;
    bot.deleteMessage(chatId, query.message.message_id);
    requestConsent(chatId, selectedLanguage);
  } else if (data === `${selectedLanguage}_consent_agree`) {
    userResponses[chatId].consent = true;
    await bot.sendMessage(chatId, texts[selectedLanguage].consentAgree);
    bot.deleteMessage(chatId, query.message.message_id);
    startRegistration(chatId);
  } else if (data === `${selectedLanguage}_consent_disagree`) {
    bot.answerCallbackQuery(query.id);
    const consentMessage = await bot.sendMessage(
      chatId,
      texts[selectedLanguage].consentDisagree
    );
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
        [
          {
            text: language === "rus" ? "Да" : "Yes",
            callback_data: `${language}_spec_yes`,
          },
        ],
        [
          {
            text: language === "rus" ? "Нет" : "No",
            callback_data: `${language}_spec_no`,
          },
        ],
      ],
    }),
  };

  bot.sendMessage(chatId, texts[language].specialityQuestion, specOptions);
};

const requestConsent = (chatId, language) => {
  const consentOptions = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          {
            text: language === "rus" ? "Согласен" : "Agree",
            callback_data: `${language}_consent_agree`,
          },
        ],
        [
          {
            text: language === "rus" ? "Не согласен" : "Disagree",
            callback_data: `${language}_consent_disagree`,
          },
        ],
      ],
    }),
  };
  bot.sendMessage(chatId, texts[language].consentRequest, consentOptions);
};

const askExp = async (chatId, language) => {
  const expOptions = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          {
            text:
              language === "rus" ? "менее 1.5 лет" : "less than a 1.5 years",
            callback_data: `${language}_exp_below_year`,
          },
        ],
        [
          {
            text: language === "rus" ? "1.5 - 3 лет" : "1.5 - 3 years",
            callback_data: `${language}_exp_between`,
          },
        ],
        [
          {
            text: language === "rus" ? "более 3 лет" : "more than a 3 years",
            callback_data: `${language}_exp_above_three_years`,
          },
        ],
      ],
    }),
  };
  bot.sendMessage(chatId, texts[language].askExperience, expOptions);
  bot.on("callback_query", (query) => {
    userResponses.experience = query.data;
    console.log(userResponses.experience);
    bot.deleteMessage(chatId, query.message.message_id);
    bot.sendMessage(chatId, texts[language].thanks);
  });
};

const startRegistration = async (chatId) => {
  const userData = userResponses[chatId];
  if (userData && userData.consent) {
    const userLang = userData.language;
    await bot.sendMessage(chatId, texts[userLang].askName);
  } else {
    await bot.sendMessage(
      chatId,
      "Пожалуйста, подтвердите согласие на обработку данных."
    );
  }
};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userData = userResponses[chatId];

  if (userData && userData.language && userData.consent) {
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
        userData.resume = fileLink;
      } else {
        userData.resume = msg.text;
      }
      if (userResponses[chatId].isSpecKnown) {
        await askExp(chatId, selectedLanguage);
        saveToGoogleSheets(userData);
        delete userResponses[chatId];
      } else {
        await bot.sendMessage(chatId, texts[userLang].thanks);
        saveToGoogleSheets(userData);
        delete userResponses[chatId];
      }
    } else if (!userData.experience) {
      if (!userResponses[chatId].isSpecKnown) {
        userData.experience = "no exp";
      }
      await bot.sendMessage(chatId, texts[userLang].thanks);
      saveToGoogleSheets(userData);
      delete userResponses[chatId];
    }
  }
});

const saveToGoogleSheets = (userData) => {
  console.log("Сохранение данных в Google Sheets:", userData);
};
