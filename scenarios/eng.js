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
    "You have selected English. Welcome to KODE talents!"
  );
  bot.sendMessage(
    chatId,
    "Do you know what speciality you're interested in?",
    specOptions
  );

  step += 1;

  bot.on("callback_query", (query) => {
    if (step === 1) {
      isSpecKnown = query.data;
      step++;
      bot.sendMessage(chatId, "Enter your fist and lastname");
    }
  });

  bot.on("message", (msg) => {
    if (step === 2) {
      name = msg.text;
      step++;
      bot.sendMessage(chatId, "Enter your age");
    } else if (step === 3) {
      age = msg.text;
      step++;
      bot.sendMessage(chatId, "Enter your city");
    } else if (step === 4) {
      city = msg.text;
      step++;
      bot.sendMessage(chatId, "Send your resume");
    } else if (step === 5) {
      resume = msg.text;

      if (isSpecKnown === "yes") {
        step++;
        bot.sendMessage(chatId, "Describe your commercial experience");
      } else {
        bot.sendMessage(chatId, "Thanks for filling out the information!");
      }
    } else if (step === 6) {
      workexperience = msg.text;
      bot.sendMessage(chatId, "Thanks for filling out the information!");
    }
  });
};

module.exports = (bot, chatId) => {
  bot.sendMessage(chatId, "You have selected English. Welcome to KODE talents!");

  const consentOptions = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "Agree", callback_data: "eng_consent_agree" }],
        [{ text: "Disagree", callback_data: "eng_consent_disagree" }],
      ],
    }),
  };

  const requestConsent = () => {
    return bot.sendMessage(chatId, "Please provide your consent for processing personal data.", consentOptions);
  };

  let consentMessageId;

  requestConsent().then((msg) => {
    consentMessageId = msg.message_id;
  });

  bot.on('callback_query', async (query) => {
    const lang = query.data;
    const messageId = query.message.message_id;

    bot.answerCallbackQuery(query.id);

    try {
      if (lang === "eng_consent_agree") {
        await bot.sendMessage(chatId, "Thank you! You have given consent for data processing.");
        await bot.deleteMessage(chatId, messageId);
        
        if (consentMessageId) {
          await bot.deleteMessage(chatId, consentMessageId);
        }

      } else if (lang === "eng_consent_disagree") {
        await bot.sendMessage(chatId, "You did not provide consent. We cannot proceed without consent.");
        await bot.deleteMessage(chatId, messageId);
        
        if (consentMessageId) {
          await bot.deleteMessage(chatId, consentMessageId);
        }

        requestConsent().then((msg) => {
          consentMessageId = msg.message_id;
        });
      }
    } catch (error) {
      console.error("Error handling callback:", error.message);
      await bot.sendMessage(chatId, "An error occurred while processing your request. Please try again.");
    }
  });
};
