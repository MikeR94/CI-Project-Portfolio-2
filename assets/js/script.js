let nextBtn = document.getElementById("next-btn").addEventListener("click", toCategoryGameArea);
let generalKnowledgeBtn = document.getElementById("general-knowledge-btn").addEventListener("click", runGeneralKnowledgeQuiz);
let constructorsBtn = document.getElementById("constructors-btn").addEventListener("click", runConstructorQuiz);
let driversBtn = document.getElementById("drivers-btn").addEventListener("click", runDriverQuiz);


function toCategoryGameArea() {
  document.getElementById("start-game-area").classList.add("hide");
  document.getElementById("category-game-area").classList.remove("hide");
}

function runDriverQuiz() {
  document.getElementById("category-game-area").classList.add("hide");
  document.getElementById("question-game-area").classList.remove("hide");
}

function runConstructorQuiz() {
  document.getElementById("category-game-area").classList.add("hide");
  document.getElementById("question-game-area").classList.remove("hide");
}

function runGeneralKnowledgeQuiz() {
  document.getElementById("category-game-area").classList.add("hide");
  document.getElementById("question-game-area").classList.remove("hide");
}


/**
 * Loop through the "home-icon" class and add a click event listener to refresh the
 * game and load the home page
 */
let goHome = document.getElementsByClassName("home-icon");
for (let i = 0; i < goHome.length; i++) {
  goHome[i].addEventListener("click", () => {
    window.location.reload();
  })
};

/**
 * Loop through both "hamburger" and "menu" class and add a click event listener to open the menu
 * if the user clicks the hamburger
 */
let toggleMenu = document.getElementsByClassName("hamburger");
let menu = document.getElementsByClassName("menu");
for (let i = 0; i < toggleMenu.length && menu.length; i++) {
  toggleMenu[i].addEventListener("click", () => {
    menu[i].classList.toggle("hide");
  });
}

/**
 * Loop through the rules button and add a click event listener to open the rules page and hide the
 * other relevant pages
 */
let goRules = document.getElementsByClassName("rules-btn");
for (let i = 0; i < goRules.length; i++) {
  goRules[i].addEventListener("click", () => {
    document.getElementById("rules-game-area").classList.remove("hide");
    document.getElementById("hiscores-game-area").classList.add("hide");
    document.getElementById("contact-game-area").classList.add("hide")
    menu[i].classList.toggle("hide");
  });
}

/**
 * Loop through the hiscores button and add a click event listener to open the hiscores page and hide the
 * other relevant pages
 */
let goHiscores = document.getElementsByClassName("hiscores-btn");
for (let i = 0; i < goHiscores.length; i++) {
  goHiscores[i].addEventListener("click", () => {
    document.getElementById("hiscores-game-area").classList.remove("hide");
    document.getElementById("rules-game-area").classList.add("hide");
    document.getElementById("contact-game-area").classList.add("hide")
    menu[i].classList.toggle("hide");
  });
}

/**
 * Loop through the contact button and add a click event listener to open the contact page and hide the
 * other relevant pages
 */
let goContact = document.getElementsByClassName("contact-btn")
for (let i = 0; i < goContact.length; i++) {
  goContact[i].addEventListener("click", () => {
    document.getElementById("contact-game-area").classList.remove("hide")
    document.getElementById("rules-game-area").classList.add("hide");
    document.getElementById("hiscores-game-area").classList.add("hide");
    menu[i].classList.toggle("hide");
  })
}