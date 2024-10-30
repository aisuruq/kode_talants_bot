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
