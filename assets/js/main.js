// Variables
const nextQuestionIcon = document.getElementById("next-question");
const answer1 = document.getElementById("answer1-btn");
const answer2 = document.getElementById("answer2-btn");
const answer3 = document.getElementById("answer3-btn");
const answer4 = document.getElementById("answer4-btn");
const currentQuestionNumber = document.getElementById("show-current-question");
const questionText = document.getElementById("question-text");
const audioOffIcon = document.getElementsByClassName("sound-off");
const audioOnIcon = document.getElementsByClassName("sound-on");
const playerName = document.getElementById("player-name");
const gameTimer = document.getElementById("timer");
const difficultyEasyBtn = document.getElementById("difficulty-easy");
const difficultyMediumBtn = document.getElementById("difficulty-medium");
const difficultyHardBtn = document.getElementById("difficulty-hard");
const startGameArea = document.getElementById("start-game-area");
const difficultyGameArea = document.getElementById("difficulty-game-area");
const questionGameArea = document.getElementById("question-game-area");
const rulesGameArea = document.getElementById("rules-game-area");
const hiscoresGameArea = document.getElementById("hiscores-game-area");
const contactGameArea = document.getElementById("contact-game-area");
const resultsGameArea = document.getElementById("results-game-area");
const resultScore = document.getElementById("result-score");
const regEx = /^(?! )[A-Za-z\s\xC0-\uFFFF]*$/;
let displayedQuestionNumber = 1;
let currentQuestion = 0;
let answerClicked = false;
let shuffledQuestions = 0;
let quizLength = 8;
let currentQuestionSet = {};
let score = 0;
let determineColour = "unanswered";
let timeLeft;
let timer;
let playerDifficulty;
let isPlaying = true;
let answeredCorrect = 0;
let answeredWrong = 0;
let gameState = "start-game-area";

// Event Listeners
difficultyEasyBtn.addEventListener("click", runQuiz);
difficultyMediumBtn.addEventListener("click", runQuiz);
difficultyHardBtn.addEventListener("click", runQuiz);
nextQuestionIcon.addEventListener("click", nextQuestion);
document.getElementById("next-btn").addEventListener("click", toDifficultyGameArea);
document.getElementById("play-again-btn").addEventListener("click", reload);
window.addEventListener("resize", checkForLandscapeOnMobile);

/**
 * Used to immediately check the orientation on loading
 */
window.onload = function () {
  checkForLandscapeOnMobile();
};

/**
 * Checks the current gameState and if it meets the correct condition, hides that game-area and displays the error message
 */
function addLandscapeMobileMessage() {
  if (gameState === "start-game-area") {
    startGameArea.classList.add("hide");
  }
  if (gameState === "contact-game-area") {
    contactGameArea.classList.add("hide");
  }
  if (gameState === "rules-game-area") {
    rulesGameArea.classList.add("hide");
  }
  if (gameState === "hiscores-game-area") {
    hiscoresGameArea.classList.add("hide");
  }
  if (gameState === "difficulty-game-area") {
    difficultyGameArea.classList.add("hide");
  }
  if (gameState === "question-game-area") {
    questionGameArea.classList.add("hide");
  }
  if (gameState === "results-game-area") {
    resultsGameArea.classList.add("hide");
  }
  document.getElementById("size-error").classList.remove("hide");
}

/**
 * Checks the current gameState and if it meets the correct condition, un-hides that game-area and hides the error message
 */
function removeLandscapeMobileMessage() {
  if (gameState === "start-game-area") {
    startGameArea.classList.remove("hide");
  }
  if (gameState === "contact-game-area") {
    contactGameArea.classList.remove("hide");
  }
  if (gameState === "rules-game-area") {
    rulesGameArea.classList.remove("hide");
  }
  if (gameState === "hiscores-game-area") {
    hiscoresGameArea.classList.remove("hide");
  }
  if (gameState === "difficulty-game-area") {
    difficultyGameArea.classList.remove("hide");
  }
  if (gameState === "question-game-area") {
    questionGameArea.classList.remove("hide");
  }
  if (gameState === "results-game-area") {
    resultsGameArea.classList.remove("hide");
  }
  document.getElementById("size-error").classList.add("hide");
}

/**
 * Checks if the width is greater than the height and if also if the user is on a mobile device, both conditions are
 * true, the error message will show. If not, the error message will not show
 */
function checkForLandscapeOnMobile() {
  let mobileLandscape = window.innerWidth > window.innerHeight;
  let androidLandscape = screen.availWidth > screen.availHeight;
  let mobileDevice = /iPhone|webOS|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  let androidDevice = /Android/i.test(navigator.userAgent);
  let widthDimensions = screen.availWidth <= 1000;
  let heightDimensions = screen.availHeight <= 900;

  if (mobileDevice) {
    if (mobileLandscape && widthDimensions && heightDimensions) {
      addLandscapeMobileMessage();
    } else {
      removeLandscapeMobileMessage();
    }
  }
  if (androidDevice) {
    if (androidLandscape && widthDimensions && heightDimensions) {
      addLandscapeMobileMessage();
    } else {
      removeLandscapeMobileMessage();
    }
  }
}

/**
 * When the player clicks the next button whilst in the question screen, this function will load the next question
 * and reset the answer buttons so that they are not disabled. It also loops through the answer buttons and removes
 * any styles that have been added on checkAnswer()
 */
function nextQuestion() {
  displayedQuestionNumber++;
  gameTimer.innerHTML = 30;
  currentQuestionNumber.innerText = displayedQuestionNumber;
  currentQuestion++;
  buildQuestions();
  startTimer();
  buttonSound();
  gameTimer.style.color = "#faf9f6";
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
    difficultyEasyBtn.innerText = "Loading...";
  } else if (difficulty === "medium") {
    shuffledQuestions = mediumQuestions.sort(() => Math.random() - 0.5);
    currentQuestionSet = shuffledQuestions;
    playerDifficulty = "medium";
    difficultyMediumBtn.innerText = "Loading...";
  } else if (difficulty === "hard") {
    shuffledQuestions = hardQuestions.sort(() => Math.random() - 0.5);
    currentQuestionSet = shuffledQuestions;
    playerDifficulty = "hard";
    difficultyHardBtn.innerText = "Loading...";
  }

  buttonSound();

  difficultyEasyBtn.setAttribute("disabled", "disabled");
  difficultyMediumBtn.setAttribute("disabled", "disabled");
  difficultyHardBtn.setAttribute("disabled", "disabled");
  difficultyEasyBtn.classList.remove("hover");
  difficultyMediumBtn.classList.remove("hover");
  difficultyHardBtn.classList.remove("hover");

  setTimeout(function () {
    difficultyGameArea.classList.add("hide");
    questionGameArea.classList.remove("hide");
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
    gameState = "results-game-area";
    questionGameArea.classList.add("hide");
    resultsGameArea.classList.remove("hide");
    let player = playerName.value;
    document.getElementById(
      "results-main-text"
    ).innerText = `${player}, you managed to answer ${answeredCorrect} ${playerDifficulty} questions correctly resulting in the total score below.`;
    updateHiscore();
  } else {
    gameState = "question-game-area";
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
    startGameArea.classList.add("hide");
    difficultyGameArea.classList.remove("hide");
    gameState = "difficulty-game-area";
    let player = playerName.value;
    let difficultyText = document.getElementById("difficulty-main-text");
    difficultyText.innerText = `Great stuff ${player},  how difficult would you like your questions?`;
  }

  if (!playerName.value.match(regEx)) {
    playerName.setCustomValidity("Your name can only include letters and spaces. Check there are no spaces before the first letter");
  } else {
    playerName.setCustomValidity("");
  }
}

/**
 * Increments the player score depending on the difficulty of the questions
 */
function incrementScore() {
  if (currentQuestionSet === easyQuestions) {
    resultScore.innerText = score += 10 + timeLeft;
  } else if (currentQuestionSet === mediumQuestions) {
    resultScore.innerText = score += 20 + timeLeft;
  } else if (currentQuestionSet === hardQuestions) {
    resultScore.innerText = score += 40 + timeLeft;
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
  document.getElementsByClassName("answer-planet")[currentQuestion].style.filter = answerPlanet;
  determineColour = "unanswered";
}

/**
 * Reload the website
 */
function reload() {
  window.location.reload();
}

/**
 *  Passes in the selected menu, splice it from the array and then add the hide class to all remaining items in the array but remove the
 *  hide class for the item that has been spliced
 * @param {Takes the string of the game-areas as an argument} selectedMenu
 */

function selectMenu(selectedMenu) {
  gameState = selectedMenu;

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

