let questionData = {};

const correctCounter = document.querySelector("#correctCount");
const wrongCounter = document.querySelector("#wrongCount");

const difficultyCard = document.querySelector("#difficultyCard");
const difficultyForm = document.querySelector("#difficultyCard form");

const questionCard = document.querySelector("#questionCard");
const questionForm = document.querySelector("#questionCard form");

const resultCard = document.querySelector("#resultCard");
const resultMain = document.querySelector("#resultCard #resultMain");
const resultButton = document.querySelector("#resultCard #nextButton");

const resetButton = document.querySelector("#resetButton");

resetButton.onclick = e => {
  resultCard.classList.add("d-none");
  questionCard.classList.add("d-none");
  difficultyCard.classList.remove("d-none");
  clearCount();
};

resultButton.onclick = e => {
  resultCard.classList.add("d-none");
  difficultyCard.classList.remove("d-none");
};

difficultyForm.onsubmit = e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const difficultyLevel = formData
    .getAll("difficultyRadio")
    .toString()
    .toLowerCase();
  if (difficultyLevel == "") return;
  fetchQuestion(difficultyLevel);
};

questionForm.onsubmit = e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const selectedAnswer = formData.getAll("option").toString().toLowerCase();
  if (selectedAnswer == "") return;
  checkAnswer(selectedAnswer);
};

function checkAnswer(selectedAnswer) {
  resultCard.classList.remove("d-none");
  questionCard.classList.add("d-none");
  if (questionData["correct_answers"][`${selectedAnswer}_correct`] == "true") {
    resultMain.innerHTML = `
      <h5 class="fw-bold text-success">You Got The Right Answer</h5>
    `;
    incrementCorrectCount();
  } else {
    let correctOption, correctAnswer;
    for (const key in questionData["correct_answers"]) {
      if (questionData["correct_answers"][key] == "true") correctOption = key;
    }
    correctAnswer =
      questionData["answers"][correctOption.replace("_correct", "")];
    resultMain.innerHTML = `
      <h5 class="fw-bold text-danger">You Are Wrong</h5>
      <p class="flex">The Correct Answer is: <strong>${correctAnswer}</strong></p>
    `;
    incrementWrongCount();
  }
}

function fetchQuestion(difficultyLevel) {
  fetch(
    `https://quizapi.io/api/v1/questions?difficulty=${difficultyLevel}&apiKey=1CHcqtB2UbVYdH577Go6PrW0njjlVKx6krEO6ZeG&&limit=1`
  ).then(res =>
    res.json().then(data => {
      questionData = data[0];
      const question = questionCard.querySelector("#question");
      question.innerHTML = data[0].question;

      const optionsCard = questionCard.querySelector("#options");
      optionsCard.innerHTML = "";
      for (const key in data[0].answers) {
        if (data[0].answers[key]) {
          optionsCard.innerHTML += buildOption(key, data[0].answers[key]);
        }
      }

      difficultyCard.classList.add("d-none");
      questionCard.classList.remove("d-none");
    })
  );
}

function buildOption(key, option) {
  const id = option.toString().toLowerCase().replace(" ", "-");
  return `
  <div class="d-flex my-1">
    <input type="radio" data-option="${key}" name="option" id="${id}" class="me-2" value="${key}">
    <label for="${id}">${option}</label>
  </div>
  `;
}

function incrementCorrectCount() {
  let correctCount = localStorage.getItem("correct");
  if (correctCount === null) {
    correctCount = 0;
  }
  correctCount++;
  localStorage.setItem("correct", correctCount);
  correctCounter.innerHTML = correctCount;
}

function incrementWrongCount() {
  let wrongCount = localStorage.getItem("incorrect");
  if (wrongCount === null) {
    wrongCount = 0;
  }
  wrongCount++;
  localStorage.setItem("incorrect", wrongCount);
  wrongCounter.innerHTML = wrongCount;
}

function clearCount() {
  localStorage.removeItem("correct");
  localStorage.removeItem("incorrect");
  wrongCounter.innerHTML = 0;
  correctCounter.innerHTML = 0;
}

window.onload = () => {
  correctCounter.innerHTML = localStorage.getItem("correct")
    ? localStorage.getItem("correct")
    : 0;
  wrongCounter.innerHTML = localStorage.getItem("incorrect")
    ? localStorage.getItem("incorrect")
    : 0;
};
