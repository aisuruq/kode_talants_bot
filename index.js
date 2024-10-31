require("dotenv").config();
const texts = require('./text');
const telegramBot = require(`node-telegram-bot-api`);

const bot = new telegramBot(process.env.API_KEY_BOT, {
  polling: true,
});

bot.setMyCommands(
  [
    { command: "/start", description: "Запуск бота / Start Bot" },
    { command: "/help", description: "Вспомогательные команды / Auxiliary commands" },
    { command: "/link", description: "Наш сайт / Our web-page" }
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

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === "Старт") {
    bot.sendMessage(chatId, "Выберите язык / Choose a language:", langOptions);
  }
});

bot.onText(/\/link/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, `https://kode.ru`);
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
    await bot.sendMessage(chatId, "Для начала запустите бота / First, launch the bot", startOptions);
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
    bot.deleteMessage(chatId, query.message.message_id);
    requestConsent(chatId, selectedLanguage);
  } else if (data === `${selectedLanguage}_spec_no`) {
    await bot.sendMessage(chatId, texts[selectedLanguage].specNoResponse);
    bot.deleteMessage(chatId, query.message.message_id);
    requestConsent(chatId, selectedLanguage);
  }

  else if (data === `${selectedLanguage}_consent_agree`) {
    userResponses[chatId].consent = true;
    await bot.sendMessage(chatId, texts[selectedLanguage].consentAgree);
    bot.deleteMessage(chatId, query.message.message_id);
    startRegistration(chatId);

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
  const userData = userResponses[chatId];
  if (userData && userData.consent) {
    const userLang = userData.language;
    await bot.sendMessage(chatId, texts[userLang].askName);
  } else {
    await bot.sendMessage(chatId, "Пожалуйста, подтвердите согласие на обработку данных.");
  }
};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userData = userResponses[chatId];

  if (msg.text.startsWith("/")) return;

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
        console.log(fileName + "  " + fileLink);
        userData.resume = fileLink;
      } else {
        userData.resume = msg.text;
      }

      await bot.sendMessage(chatId, texts[userLang].askExperience);

    } else if (!userData.experience) {
      userData.experience = msg.text;
      userData.registrationComplete = true;
      await bot.sendMessage(chatId, texts[userLang].thanks);
      await sendTestAssignment(chatId, userLang);
    }
  }
});

const sendTestAssignment = async (chatId, language) => {
  await bot.sendMessage(chatId, texts[language].testTask);
  userResponses[chatId].waitingForTestResponse = true;
};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userData = userResponses[chatId];

  if (userData && userResponses.specThread === true) {
    const userLang = userData.language;

    userData.testResponse = msg.document ? await bot.getFileLink(msg.document.file_id) : msg.text;
    await bot.sendMessage(chatId, texts[userLang].testThanks);

    saveToGoogleSheets(userData);
    delete userResponses[chatId]; 
  }
});
