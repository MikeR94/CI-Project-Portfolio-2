let nextBtn = document.getElementById("next-btn").addEventListener("click", toDifficultyGameArea);
let reloadWebsite = document.getElementById("play-again-btn").addEventListener("click", reload);
let loadEasy = document.getElementById("difficulty-easy").addEventListener("click", runQuiz);
let loadMedium = document.getElementById("difficulty-medium").addEventListener("click", runQuiz);
let loadHard = document.getElementById("difficulty-hard").addEventListener("click", runQuiz);
let nextQuestionIcon = document.getElementById("next-question");
nextQuestionIcon.addEventListener("click", nextQuestion);
let answer1 = answer1;
let answer2 = answer2;
let answer3 = answer3;
let answer4 = answer4;
let questionText = document.getElementById("question-text");
let audioOffIcon = document.getElementsByClassName("sound-off");
let audioOnIcon = document.getElementsByClassName("sound-on");
let playerName = document.getElementById("player-name");
let currentQuestion = 0;
let answerClicked = false;
let shuffledQuestions = 0;
let quizLength = 8;
let currentQuestionSet = {};
let score = 0;
let determineColour = "unanswered";
let timeLeft;
let timer;
let isPlaying = true;
let answeredCorrect = 0;
let answeredWrong = 0;
let regEx = /^(?! )[A-Za-z\s\xC0-\uFFFF]*$/;

/**
 * When the player clicks the next button whilst in the question screen, this function will load the next question
 * and reset the answer buttons so that they are not disabled. It also loops through the answer buttons and removes
 * any styles that have been added on checkAnswer()
 */
function nextQuestion() {
  document.getElementById("timer").innerHTML = 30;
  currentQuestion++;
  buildQuestions();
  startTimer();
  buttonSound();
  nextQuestionIcon.classList.add("greyscale");
  nextQuestionIcon.setAttribute("disabled", "disabled");
  nextQuestionIcon.classList.remove("hover");
  answer1.removeAttribute("disabled", "disabled");
  answer2.removeAttribute("disabled", "disabled");
  answer3.removeAttribute("disabled", "disabled");
  answer4.removeAttribute("disabled", "disabled");
  answer1.classList.add("answer-buttons-hover");
  answer2.classList.add("answer-buttons-hover");
  answer3.classList.add("answer-buttons-hover");
  answer4.classList.add("answer-buttons-hover");
  let answerButtons = document.getElementsByClassName("answer-btn");
  for (let i = 0; i < answerButtons.length; i++) {
    answerButtons[i].classList.remove("correct");
    answerButtons[i].classList.remove("wrong");
  }
}

/**
 * Small delay to show the next question icon
 */
function showNextQuestionIcon() {
  setTimeout(function () {
    nextQuestionIcon.classList.remove("greyscale");
    nextQuestionIcon.removeAttribute("disabled", "disabled");
    nextQuestionIcon.classList.add("hover");
  }, 500);
}

/**
 * Depending on what difficulty the player selects, this function then randomly shuffles the questions,
 * removes the difficulty screen and displays the question screen. It then calls buildQuestions() to
 * create a list of questions for the player
 * @param {the target value that the player selected} event
 */
function runQuiz(event) {
  let difficulty = event.target.value;
  if (difficulty === "easy") {
    shuffledQuestions = easyQuestions.sort(() => Math.random() - 0.5);
    currentQuestionSet = shuffledQuestions;
    playerDifficulty = "easy";
    document.getElementById("difficulty-easy").innerText = "Loading...";
  } else if (difficulty === "medium") {
    shuffledQuestions = mediumQuestions.sort(() => Math.random() - 0.5);
    currentQuestionSet = shuffledQuestions;
    playerDifficulty = "medium";
    document.getElementById("difficulty-medium").innerText = "Loading...";
  } else if (difficulty === "hard") {
    shuffledQuestions = hardQuestions.sort(() => Math.random() - 0.5);
    currentQuestionSet = shuffledQuestions;
    playerDifficulty = "hard";
    document.getElementById("difficulty-hard").innerText = "Loading...";
  }
  buttonSound();
  document.getElementById("difficulty-easy").setAttribute("disabled", "disabled");
  document.getElementById("difficulty-medium").setAttribute("disabled", "disabled");
  document.getElementById("difficulty-hard").setAttribute("disabled", "disabled");
  document.getElementById("difficulty-easy").classList.remove("hover");
  document.getElementById("difficulty-medium").classList.remove("hover");
  document.getElementById("difficulty-hard").classList.remove("hover");

  setTimeout(function () {
    document.getElementById("difficulty-game-area").classList.add("hide");
    document.getElementById("question-game-area").classList.remove("hide");
    nextQuestionIcon.setAttribute("disabled", "disabled");
    buildQuestions();
    startTimer();
  }, 2000);
}

/**
 * Checks if the player has answered 10 questions and if not, loop through the questions and
 * display them to the player. It also listens for the players answer and then calls checkAnswer()
 * to validate the answer
 */
function buildQuestions() {
  if (currentQuestion >= quizLength) {
    document.getElementById("question-game-area").classList.add("hide");
    document.getElementById("results-game-area").classList.remove("hide");
    let player = playerName.value;
    document.getElementById(
      "results-main-text"
    ).innerText = `${player}, you managed to answer ${answeredCorrect} ${playerDifficulty} questions correctly resulting in the total score below.`;
    updateHiscore();
  } else {
    for (let i = 0; i < currentQuestionSet.length; i++) {
      questionText.innerHTML = currentQuestionSet[currentQuestion].question;
      answer1.innerHTML = currentQuestionSet[currentQuestion].a;
      answer2.innerHTML = currentQuestionSet[currentQuestion].b;
      answer3.innerHTML = currentQuestionSet[currentQuestion].c;
      answer4.innerHTML = currentQuestionSet[currentQuestion].d;
      answer1.onclick = checkAnswer;
      answer2.onclick = checkAnswer;
      answer3.onclick = checkAnswer;
      answer4.onclick = checkAnswer;
    }
  }
}

/**
 * Validates the players answer
 */
function checkAnswer() {
  answer1.setAttribute("disabled", "disabled");
  answer2.setAttribute("disabled", "disabled");
  answer3.setAttribute("disabled", "disabled");
  answer4.setAttribute("disabled", "disabled");
  answer1.classList.remove("answer-buttons-hover");
  answer2.classList.remove("answer-buttons-hover");
  answer3.classList.remove("answer-buttons-hover");
  answer4.classList.remove("answer-buttons-hover");

  let playerAnswer = this.value;
  let correctAnswer = currentQuestionSet[currentQuestion].answer;
  if (playerAnswer === correctAnswer) {
    answerClicked = true;
    determineColour = "correct";
    answeredCorrect++;
    incrementScore();
    colorPlanets();
    stopTimer();
    correctSound();
    showNextQuestionIcon();
  } else {
    answerClicked = true;
    determineColour = "incorrect";
    answeredWrong++;
    colorPlanets();
    stopTimer();
    incorrectSound();
    showNextQuestionIcon();
  }

  document.getElementById("question-score").innerText = score;

  /**
   * Loops through the answer buttons and displays the correct answer if the player has selected the wrong
   * answer. If hte player has selected the wrong answer, it will also highPlanet that red
   */
  let answerButtons = document.getElementsByClassName("answer-btn");
  for (let i = 0; i < answerButtons.length; i++) {
    if (answerButtons[i].value === correctAnswer) {
      answerButtons[i].classList.add("correct");
    } else if (playerAnswer !== correctAnswer) {
      this.classList.add("wrong");
    }
  }
}

/**
 * When the player clicks the next button, hide the start screen and unhide the the difficulty
 * game screen. If the player does not enter a name, display the error text
 */
function toDifficultyGameArea() {
  buttonSound();
  if (playerName.value.match(regEx) && playerName.value != null && playerName.value != undefined && playerName.value != "") {
    document.getElementById("start-game-area").classList.add("hide");
    document.getElementById("difficulty-game-area").classList.remove("hide");
    let player = playerName.value;
    let difficultyText = document.getElementById("difficulty-main-text");
    difficultyText.innerText = `Great stuff ${player},  how difficult would you like your questions?`;
  }

  if (!playerName.value.match(regEx)) {
    playerName.setCustomValidity("Your name can only include letters and spaces");
  } else {
    playerName.setCustomValidity("");
  }
}

/**
 * Increments the player score depending on the difficulty of the questions
 */
function incrementScore() {
  if (currentQuestionSet === easyQuestions) {
    document.getElementById("result-score").innerText = score += 10 + timeLeft;
  } else if (currentQuestionSet === mediumQuestions) {
    document.getElementById("result-score").innerText = score += 20 + timeLeft;
  } else if (currentQuestionSet === hardQuestions) {
    document.getElementById("result-score").innerText = score += 40 + timeLeft;
  }
}

/**
 * A switch case statement to change the colour of the planets depending on whether the user answers
 * correctly or not
 */
function colorPlanets() {
  let answerPlanet = 0;

  switch (determineColour) {
    case "correct":
      answerPlanet = "grayscale(0%)";
      break;
    case "incorrect":
      answerPlanet = "grayscale(100%)";
      break;
    case null:
    case undefined:
    case "unanswered":
      answerPlanet = "grayscale(100%)";
      break;
  }
  document.getElementsByClassName("answer-planet")[currentQuestion].style.filter = answerPlanet 
  determineColour = "unanswered";
}

/**
 * Reload the website
 */
function reload() {
  window.location.reload();
}

/**
 * Loop through the home-icon-logo situated on the game-bar and add an event listener to reload the
 * website if clicked
 */
let goHomeIcon = document.getElementsByClassName("home-icon-logo");
for (let i = 0; i < goHomeIcon.length; i++) {
  goHomeIcon[i].addEventListener("click", () => {
    window.location.reload();
  });
}

/**
 * Loop through the "home-icon" class and add a click event listener to refresh the
 * game and load the home page
 */
let goHome = document.getElementsByClassName("home-icon");
for (let i = 0; i < goHome.length; i++) {
  goHome[i].addEventListener("click", () => {
    window.location.reload();
  });
}

/**
 * Loop through both "hamburger" and "menu" class and add a click event listener to open the menu
 * if the player clicks the hamburger
 */
let crossButton = document.getElementsByClassName("cross");
let toggleMenu = document.getElementsByClassName("hamburger");
let menu = document.getElementsByClassName("menu");
for (let i = 0; i < toggleMenu.length && menu.length; i++) {
  toggleMenu[i].addEventListener("click", () => {
    buttonSound();
    menu[i].classList.toggle("hide");
    toggleMenu[i].classList.toggle("hide");
    crossButton[i].classList.toggle("hide");
  });
}

/**
 * Loop through the cross class and add a click event listener to replace the hamburger with a cross
 */
for (let i = 0; i < crossButton.length; i++) {
  crossButton[i].addEventListener("click", () => {
    buttonSound();
    crossButton[i].classList.toggle("hide");
    menu[i].classList.toggle("hide");
    toggleMenu[i].classList.toggle("hide");
  });
}

/**
 * Loop through the rules button and add a click event listener to open the rules page and hide the
 * other relevant pages
 */
let goRules = document.getElementsByClassName("rules-btn");
for (let i = 0; i < goRules.length; i++) {
  goRules[i].addEventListener("click", () => {
    buttonSound();
    selectMenu("rules-game-area");
    menu[i].classList.toggle("hide");
    toggleMenu[i].classList.toggle("hide");
    crossButton[i].classList.toggle("hide");
  });
}

/**
 * Loop through the hiscores button and add a click event listener to open the hiscores page and hide the
 * other relevant pages
 */
let goHiscores = document.getElementsByClassName("hiscores-btn");
for (let i = 0; i < goHiscores.length; i++) {
  goHiscores[i].addEventListener("click", () => {
    buttonSound();
    selectMenu("hiscores-game-area");
    menu[i].classList.toggle("hide");
    toggleMenu[i].classList.toggle("hide");
    crossButton[i].classList.toggle("hide");
  });
}

/**
 * Loop through the contact button and add a click event listener to open the contact page and hide the
 * other relevant pages
 */
let goContact = document.getElementsByClassName("contact-btn");
for (let i = 0; i < goContact.length; i++) {
  goContact[i].addEventListener("click", () => {
    buttonSound();
    selectMenu("contact-game-area");
    menu[i].classList.toggle("hide");
    toggleMenu[i].classList.toggle("hide");
    crossButton[i].classList.toggle("hide");
  });
}

function selectMenu(selectedMenu) {
  let gameAreas = [
    "contact-game-area",
    "rules-game-area",
    "hiscores-game-area",
    "results-game-area",
    "start-game-area",
    "question-game-area",
    "difficulty-game-area",
  ];

  let indexOfSelectedMenu = gameAreas.indexOf(selectedMenu);

  gameAreas.splice(indexOfSelectedMenu, 1);

  for (let i = 0; i < gameAreas.length; i++) {
    document.getElementById(gameAreas[i]).classList.add("hide");
  }

  document.getElementById(selectedMenu).classList.remove("hide");
}