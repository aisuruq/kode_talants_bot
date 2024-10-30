const texts = {
  rus: {
    welcome: "Вы выбрали русский язык. Приветствуем вас в KODE talents!",
    specialityQuestion: "Вы знаете какая специальность вам интересна?",
    specYesResponse: "Хорошо, тогда вам нужно пройти регистрацию для дальнейшего определения тестового задания.",
    specNoResponse: "Хорошо, тогда вам нужно пройти регистрацию для прохождения профориентационного теста.",
    consentRequest: "Пожалуйста, дайте согласие на обработку персональных данных.",
    consentAgree: "Спасибо! Вы дали согласие на обработку персональных данных.",
    consentDisagree: "Вы не дали согласие. Мы не сможем продолжить без согласия.",
    help: `
      Вот доступные команды:
      /start - Запуск для взаимодействия с ботом.
      /help - Показать вспомогательные команды.
      Согласие на обработку персональных данных обязательный пунк для взаимодействия с ботом.
    `,
    askName: "Введите вашу фамилию и имя",
    askAge: "Введите ваш возраст",
    askCity: "Введите ваш город",
    askResume: "Отправьте ваше резюме в виде ссылки или файла",
    askExperience: "Опишите ваш коммерческий опыт",
    thanks: "Спасибо за заполнение информации!"
  },
  eng: {
    welcome: "You have selected English. Welcome to KODE talents!",
    specialityQuestion: "Do you know what specialty you're interested in?",
    specYesResponse: "Well, then you need to register to further define the test assignment.",
    specNoResponse: "Well, then you need to register to take a career guidance test.",
    consentRequest: "Please provide your consent for processing personal data.",
    consentAgree: "Thank you! You have given consent for data processing.",
    consentDisagree: "You did not provide consent. We cannot proceed without consent.",
    help: `
      Here are the available commands:
      /start - Start the interaction with the bot.
      /help - Show these аuxiliary commands.
      Consent to the processing of personal data is a mandatory item for interaction with the bot.
    `,
    askName: "Enter your first and last name",
    askAge: "Enter your age",
    askCity: "Enter your city",
    askResume: "Send your resume by link or file",
    askExperience: "Describe your commercial experience",
    thanks: "Thanks for filling out the information!"
  }
};

module.exports = texts;