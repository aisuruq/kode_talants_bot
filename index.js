require("dotenv").config();
const texts = require("./text");
const specialization = require('./specialization');
const telegramBot = require(`node-telegram-bot-api`);

const bot = new telegramBot(process.env.API_KEY_BOT, {
  polling: true,
});

bot.setMyCommands(
  [
    { command: "/start", description: "Запуск бота / Start Bot" },
    { command: "/help", description: "Вспомогательные команды / Auxiliary commands" },
    { command: "/link", description: "Наш сайт / Our web-page" },
    { command: "/specialties", description: "О специальностях компании / About the company's specialties" }
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

  if (msg.text === "Старт / Start") {
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
    await bot.sendMessage(
      chatId,
      "Для начала запустите бота / First, launch the bot",
      startOptions
    );
  }
});

bot.onText(/\/specialties/, async (msg) => {
  const chatId = msg.chat.id;
  const userData = userResponses[chatId]; 
  const selectedLanguage = userData?.language;

  if (selectedLanguage) {
    const specializationsList = specialization[selectedLanguage];

    let messageText = selectedLanguage === "rus" ? "Доступные специальности:\n\n" : "Available Specialties:\n\n";
    specializationsList.forEach((specialty, index) => {
      messageText += `${index + 1}. *${specialty.name}*\n${specialty.desc}\n\n`;
    });

    await bot.sendMessage(chatId, messageText, { parse_mode: "Markdown" });
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

const requestConsent = async (chatId, language) => {
  const filePath = "./consept_agree.pdf"; 

  try {
    const consentOptions = {
      caption: texts[language].consentRequest, 
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
    
    await bot.sendDocument(chatId, filePath, consentOptions);
  } catch (error) {
    console.error("Ошибка отправки файла согласия:", error);
  }
};

let regProcess;

const startRegistration = async (chatId) => {
  const userData = userResponses[chatId];
  if (userData.consent) {
    await askRegistrationStep(chatId, userData, "askName");
    regProcess = true;
  } else {
    await bot.sendMessage(chatId, "Пожалуйста, подтвердите согласие на обработку данных.");
  }
};

const askRegistrationStep = async (chatId, userData, step) => {
  const steps = {
    askName: () => bot.sendMessage(chatId, texts[userData.language].askName),
    askAge: () => bot.sendMessage(chatId, texts[userData.language].askAge),
    askCity: () => bot.sendMessage(chatId, texts[userData.language].askCity),
    askResume: () => bot.sendMessage(chatId, texts[userData.language].askResume),
  };

  if (steps[step]) {
    steps[step]();
    userData.currentStep = step;
  }
};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userData = userResponses[chatId];

  if (userData && userData.consent) {
    if (userData.currentStep === "askName") {
      userData.name = msg.text;
      await askRegistrationStep(chatId, userData, "askAge");
    } else if (userData.currentStep === "askAge") {
      const age = parseInt(msg.text, 10); 
      if (isNaN(age) || age <= 0) {
        await bot.sendMessage(chatId, texts[userData.language].invalidAgeMessage); 
      } else {
        userData.age = age; 
        await askRegistrationStep(chatId, userData, "askCity"); 
      }
    } else if (userData.currentStep === "askCity") {
      userData.city = msg.text;
      await askRegistrationStep(chatId, userData, "askResume");
    } else if (userData.currentStep === "askResume") {
      userData.resume = msg.document ? await bot.getFileLink(msg.document.file_id) : msg.text;
      if (userData.isSpecKnown) {
        await askExperience(chatId, userData.language);
      } else {
        await bot.sendMessage(chatId, texts[userData.language].thanks);
        saveToGoogleSheets(userData);
        delete userResponses[chatId];
      }
    }
  }
});

let experienceMessageId;

const askExperience = (chatId, language) => {
  const expOptions = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: language === "rus" ? "менее 1.5 лет" : "less than 1.5 years", callback_data: `${language}_exp_below` }],
        [{ text: language === "rus" ? "1.5 - 3 лет" : "1.5 - 3 years", callback_data: `${language}_exp_between` }],
        [{ text: language === "rus" ? "более 3 лет" : "more than 3 years", callback_data: `${language}_exp_above` }],
      ],
    }),
  };
  lastMessageId2 = bot.sendMessage(chatId, texts[language].askExperience, expOptions).then((sentMessage) => {
    experienceMessageId = sentMessage.message_id;
  });
}

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const userData = userResponses[chatId];
  userData.experience = data; 
  if (data.endsWith("_exp_below") || data.endsWith("_exp_between") || data.endsWith("_exp_above")) {
    sendTestAssignment(chatId, userData.language);
  }
});

const sendTestAssignment = async (chatId, language) => {
  const userData = userResponses[chatId];

  let testAssignmentLink;
  if (userData.experience === `${language}_exp_below`) {
    testAssignmentLink = texts[language].testAssignments.below_1_5_years;
  } else if (userData.experience === `${language}_exp_between`) {
    testAssignmentLink = texts[language].testAssignments.between_1_5_and_3_years;
  } else if (userData.experience === `${language}_exp_above`) {
    testAssignmentLink = texts[language].testAssignments.above_3_years;
  }

  if (experienceMessageId) {
    await bot.deleteMessage(chatId, experienceMessageId);
  }
  if (testAssignmentLink) {
    regProcess = false;
    await bot.sendMessage(chatId, `${texts[language].testTaskIntro} ${testAssignmentLink}`)
    await bot.sendMessage(chatId, texts[language].askForSubmission)

  } else {
    await bot.sendMessage(chatId, texts[language].thanks);
  }
};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userData = userResponses[chatId];
  if (userData && regProcess === false) {
    if (msg.document) {
      const fileId = msg.document.file_id;
      const fileLink = await bot.getFileLink(fileId); 
      userData.submission = fileLink;
      await bot.sendMessage(chatId, `${texts[userData.language].fileReceived} ${fileLink}`);
    } else if (msg.text) {
      userData.submission = msg.text; 
      await bot.sendMessage(chatId, `${texts[userData.language].textReceived} ${msg.text}`);
    }

    await bot.sendMessage(chatId, texts[userData.language].thanksForSubmission);
    setTimeout( async () => {
      await bot.sendMessage(chatId, texts[userData.language].afterChekTestTask);
    }, 2000)
    

    await bot.deleteMessage(chatId, experienceMessageId);

    delete userResponses[chatId]; 
  }
});