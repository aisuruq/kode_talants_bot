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
