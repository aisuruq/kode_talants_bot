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
