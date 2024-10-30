module.exports = (bot, chatId) => {
  let step = 0;
  let name, age, city, resume, workexperience, isSpecKnown;

  const specOptions = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "Да", callback_data: "yes" }],
        [{ text: "Нет", callback_data: "no" }],
      ],
    }),
  };

  bot.sendMessage(
    chatId,
    "Вы выбрали русский язык. Приветствуем вас в KODE talents!"
  );
  bot.sendMessage(
    chatId,
    "Вы знаете какая специальность вам интересна?",
    specOptions
  );

  bot.on("callback_query", (query) => {
    if (step === 0) {
      isSpecKnown = query.data;
      step++;
      bot.sendMessage(chatId, "Введите вашу фамилию и имя");
    }
  });

  bot.on("message", (msg) => {
    if (step === 1) {
      name = msg.text;
      step++;
      bot.sendMessage(chatId, "Введите ваш возраст");
    } else if (step === 2) {
      age = msg.text;
      step++;
      bot.sendMessage(chatId, "Введите ваш город");
    } else if (step === 3) {
      city = msg.text;
      step++;
      bot.sendMessage(chatId, "Отправьте ваше резюме");
    } else if (step === 4) {
      resume = msg.text;

      if (isSpecKnown === "yes") {
        step++;
        bot.sendMessage(chatId, "Опишите ваш коммерческий опыт");
      } else {
        bot.sendMessage(chatId, "Спасибо за заполнение информации!");
      }
    } else if (step === 5) {
      workexperience = msg.text;
      bot.sendMessage(chatId, "Спасибо за заполнение информации!");
    }
  });
};

module.exports = (bot, chatId) => {
  bot.sendMessage(
    chatId,
    "Вы выбрали русский язык. Приветствую вас в KODE talents!"
  );

  const consentOptions = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "Согласен", callback_data: "rus_consent_agree" }],
        [{ text: "Не согласен", callback_data: "rus_consent_disagree" }],
      ],
    }),
  };

  const requestConsent = () => {
      return bot.sendMessage(chatId, "Пожалуйста, дайте согласие на обработку персональных данных.", consentOptions);
  };

  let consentMessageId;

  requestConsent().then((msg) => {
    consentMessageId = msg.message_id;
  });

  bot.on('callback_query', (query) => {
    const lang = query.data;
    const messageId = query.message.message_id;

    bot.answerCallbackQuery(query.id);

    if (lang === "rus_consent_agree") {
      bot.sendMessage(chatId, "Спасибо! Вы дали согласие на обработку персональных данных.");
      bot.deleteMessage(chatId, messageId);
      if (consentMessageId) {
        bot.deleteMessage(chatId, consentMessageId); 
      }

    } else if (lang === "rus_consent_disagree") {
      bot.sendMessage(chatId, "Вы не дали согласие. Мы не сможем продолжить без согласия.");
      bot.deleteMessage(chatId, messageId);
      if (consentMessageId) {
        bot.deleteMessage(chatId, consentMessageId); 
      }
      requestConsent().then((msg) => {
        consentMessageId = msg.message_id; 
      });
    }
  });
};
