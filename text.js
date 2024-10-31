const texts = {
  rus: {
    welcome: "Вы выбрали русский язык. Приветствуем вас в KODE talents!",
    specialityQuestion: "Вы знаете какая специальность вам интересна?",
    specYesResponse:
      "Хорошо, тогда вам нужно пройти регистрацию для дальнейшего определения тестового задания.",
    specNoResponse:
      "Хорошо, тогда вам нужно пройти регистрацию для прохождения профориентационного теста.",
    consentRequest:
      "Пожалуйста, дайте согласие на обработку персональных данных.",
    consentAgree: "Спасибо! Вы дали согласие на обработку персональных данных.",
    consentDisagree:
      "Вы не дали согласие. Мы не сможем продолжить без согласия.",
    help: `
      Вот доступные команды:
      /start - Запуск для взаимодействия с ботом.
      /help - Показать вспомогательные команды.
      Согласие на обработку персональных данных обязательный пунк для взаимодействия с ботом.
    `,
    askName: "Введите вашу фамилию и имя",
    askAge: "Введите ваш возраст",
    ageResponse: "Ты слишком мал для нас :(",
    ageErrorResponse: "Введите число",
    askCity: "Введите ваш город",
    askResume: "Отправьте ваше резюме в виде ссылки или файла",
    askExperience: "Опишите ваш коммерческий опыт",
    thanks: "Спасибо за заполнение информации!",
    askTestRequest: "Желаете пройти проф. ориентационный тест?",
    askQuestionOne:
      "1. Какой из вариантов вам ближе?\n- А) Создание программного обеспечения\n- Б) Работа с данными и аналитика\n- В) Дизайн интерфейсов и пользовательского опыта\n- Г) Управление проектами и командами",
    askQuestionTwo:
      "2. Какая деятельность вам приносит наибольшее удовольствие?\n- А) Решение логических задач\n- Б) Исследование данных\n- В) Творческое оформление идей\n- Г) Организация процессов",
    askQuestionThree:
      "3. Как вы предпочитаете работать?\n- А) В одиночку\n- Б) В команде\n- В) В сотрудничестве с клиентами\n- Г) В управлении группой",
    askQuestionFour:
      "4. На какие навыки вы хотите сделать акцент?\n- А) Программирование\n- Б) Анализ данных\n- В) Дизайн\n- Г) Лидерство и управление",
    askQuestionFive:
      "5. Как вы справляетесь с новыми вызовами?\n- А) Ищу новые решения\n- Б) Анализирую и планирую\n- В) Оцениваю визуально\n- Г) Организую команду для обсуждения",
  },
  eng: {
    welcome: "You have selected English. Welcome to KODE talents!",
    specialityQuestion: "Do you know what specialty you're interested in?",
    specYesResponse:
      "Well, then you need to register to further define the test assignment.",
    specNoResponse:
      "Well, then you need to register to take a career guidance test.",
    consentRequest: "Please provide your consent for processing personal data.",
    consentAgree: "Thank you! You have given consent for data processing.",
    consentDisagree:
      "You did not provide consent. We cannot proceed without consent.",
    help: `
      Here are the available commands:
      /start - Start the interaction with the bot.
      /help - Show these аuxiliary commands.
      Consent to the processing of personal data is a mandatory item for interaction with the bot.
    `,
    askName: "Enter your first and last name",
    askAge: "Enter your age",
    ageResponse: "You're too young for us :(",
    ageErrorResponse: "Enter a number",
    askCity: "Enter your city",
    askResume: "Send your resume by link or file",
    askExperience: "Describe your commercial experience",
    thanks: "Thanks for filling out the information!",
    askTestRequest: "Would you like to take a career guidance test?",
    askQuestionOne:
      "1. Which option is closer to you?\n- A) Software development\t-B) Data management and analytics\t- C) Interface design and user experience\t- D) Project and team management",
    askQuestionTwo:
      "2. Which activity brings you the most pleasure?\n- A) Solving logical problems\t- B) Data research\t- C) Creative design of an idea\t- D) Organization of processes",
    askQuestionThree:
      "3. How do you prefer to work?\n- A) Alone\t- B) In a team\t- C) In cooperation with clients\t- D) In the management of the group",
    askQuestionFour:
      "4. What skills do you want to focus on?\n- A) Programming\t- B) Data Analysis\t- C) Design\t- D) Leadership and Management",
    askQuestionFive:
      "5. How do you cope with new challenges?\n-A) Looking for new solutions \t- B) Analyzing and planning \t- C) Evaluating visually\t- D) Organizing a team for discussion",
  },
};

module.exports = texts;
