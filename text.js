const texts = {
  rus: {
    welcome: "Вы выбрали русский язык. Приветствуем вас в KODE talents! 👋🏻",
    specialityQuestion: "Вы знаете какая специальность вам интересна? 🫶🏻",
    specYesResponse: "Хорошо, тогда вам нужно пройти регистрацию для дальнейшего определения тестового задания 🤳🏻",
    specNoResponse: "Хорошо, тогда вам нужно пройти регистрацию для прохождения профориентационного теста 🤳🏻",
    consentRequest: "Пожалуйста, дайте согласие на обработку персональных данных ✍🏼",
    consentAgree: "Спасибо! Вы дали согласие на обработку персональных данных ✅",
    consentDisagree: "Вы не дали согласие. Мы не сможем продолжить без согласия ⛔️",
    help: `
      Вот доступные команды:
      /start - Запуск для взаимодействия с ботом.
      /help - Показать вспомогательные команды.
      Согласие на обработку персональных данных обязательный пунк для взаимодействия с ботом.
    `,
    askName: "Введите вашу фамилию и имя",
    askAge: "Введите ваш возраст",
    invalidAgeMessage: "Пожалуйста, введите корректный возраст ⛔️",
    ageResponse: "Ты слишком мал для нас :(",
    ageErrorResponse: "Введите число",
    askCity: "Введите ваш город",
    askResume: "Отправьте ваше резюме в виде ссылки, файла или опишите себя сообщениям",
    askExperience: "Опишите ваш опыт работы",
    thanks: "Спасибо за прохождение регистрация! ✅",
    testTaskIntro: "Для прохождения на собеседование, выполните тестовое задание: ",
    testAssignments: {
      below_1_5_years: "https://example.com/test-beginner",
      between_1_5_and_3_years: "https://example.com/test-intermediate",
      above_3_years: "https://example.com/test-advanced",
    },
    askForSubmission: "Пожалуйста, отправьте мне ваш ответ в виде файла, ссылки или текста. 📓",
    fileReceived: "Я получил ваш файл:",
    textReceived: "Я получил ваше сообщение:",
    thanksForSubmission: "Вы успешно отправили свое тестовое задание ✅",
    afterChekTestTask: "После проверки тестового задания и вашего резюме, мы свяжимся с вами для дальнейшего конаткта. А пока вы можете перейти на наш сайт с помощью команды /link и почитать дополнительную инофрмацию 💌",
  },
  eng: {
    welcome: "You have selected English. Welcome to KODE talents! 👋🏻",
    specialityQuestion: "Do you know what specialty you're interested in? 🫶🏻",
    specYesResponse: "Well, then you need to register to further define the test assignment 🤳🏻",
    specNoResponse: "Well, then you need to register to take a career guidance test 🤳🏻",
    consentRequest: "Please provide your consent for processing personal data ✍🏼",
    consentAgree: "Thank you! You have given consent for data processing ✅",
    consentDisagree: "You did not provide consent. We cannot proceed without consent ⛔️",
    help: `
      Here are the available commands:
      /start - Start the interaction with the bot.
      /help - Show these аuxiliary commands.
      Consent to the processing of personal data is a mandatory item for interaction with the bot.
    `,
    askName: "Enter your first and last name",
    askAge: "Enter your age",
    invalidAgeMessage: "Please enter a valid age ⛔️",
    ageResponse: "You're too young for us :(",
    ageErrorResponse: "Enter a number",
    askCity: "Enter your city",
    askResume: "Send your resume by link or file",
    askExperience: "describe your work experience",
    thanks: "Thank you for completing the registration! ✅",
    testTaskIntro: "To proceed to the interview, complete the test assignment: ",
    testAssignments: {
      below_1_5_years: "https://example.com/test-beginner",
      between_1_5_and_3_years: "https://example.com/test-intermediate",
      above_3_years: "https://example.com/test-advanced",
    },
    askForSubmission: "Please send me your answer as a file, link, or text 📓",
    fileReceived: "I received your file:",
    textReceived: "I received your message:",
    thanksForSubmission: "You have successfully submitted your test assignment ✅", 
    afterChekTestTask: "After checking the test assignment and your resume, we will contact you for further contact. In the meantime, you can go to our website using the /link command and read additional information 💌",
  }
};

module.exports = texts;

