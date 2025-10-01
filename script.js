// Quiz questions data
const quizQuestions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: 1,
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
    correctAnswer: 1,
  },
  {
    question: "Who painted the Mona Lisa?",
    options: [
      "Vincent van Gogh",
      "Pablo Picasso",
      "Leonardo da Vinci",
      "Michelangelo",
    ],
    correctAnswer: 2,
  },
  {
    question: "What is the smallest country in the world?",
    options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
    correctAnswer: 1,
  },
  {
    question:
      "Which programming language is known as the 'language of the web'?",
    options: ["Python", "Java", "JavaScript", "C++"],
    correctAnswer: 2,
  },
  {
    question: "What year did the Titanic sink?",
    options: ["1912", "1905", "1923", "1898"],
    correctAnswer: 0,
  },
  {
    question: "Which animal is known as the 'King of the Jungle'?",
    options: ["Tiger", "Lion", "Elephant", "Gorilla"],
    correctAnswer: 1,
  },
  {
    question: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Platinum"],
    correctAnswer: 2,
  },
];

// Quiz state variables
let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;
let timer;
let timeLeft = 15;

// DOM elements
const introElement = document.getElementById("intro");
const quizElement = document.getElementById("quiz");
const scoreContainerElement = document.getElementById("score-container");
const startButton = document.getElementById("start-btn");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const submitButton = document.getElementById("submit-btn");
const restartButton = document.getElementById("restart-btn");
const questionNumberElement = document.getElementById("question-number");
const questionTextElement = document.getElementById("question-text");
const optionsContainerElement = document.getElementById("options-container");
const feedbackElement = document.getElementById("feedback");
const timerElement = document.getElementById("timer");
const progressElement = document.getElementById("progress");
const scoreValueElement = document.getElementById("score-value");
const scoreMessageElement = document.getElementById("score-message");

// Initialize the quiz
function initQuiz() {
  currentQuestionIndex = 0;
  userAnswers = new Array(quizQuestions.length).fill(null);
  score = 0;
  timeLeft = 15;

  introElement.style.display = "none";
  quizElement.style.display = "block";
  scoreContainerElement.style.display = "none";

  loadQuestion();
  startTimer();
  updateNavigationButtons();
}

// Load the current question
function loadQuestion() {
  const currentQuestion = quizQuestions[currentQuestionIndex];

  // Update question number and text
  questionNumberElement.textContent = `Question ${
    currentQuestionIndex + 1
  } of ${quizQuestions.length}`;
  questionTextElement.textContent = currentQuestion.question;

  // Clear previous options
  optionsContainerElement.innerHTML = "";

  // Create option elements
  currentQuestion.options.forEach((option, index) => {
    const optionElement = document.createElement("div");
    optionElement.classList.add("option");
    optionElement.textContent = option;

    // Check if this option was previously selected
    if (userAnswers[currentQuestionIndex] === index) {
      optionElement.classList.add("selected");
    }

    optionElement.addEventListener("click", () => selectOption(index));
    optionsContainerElement.appendChild(optionElement);
  });

  // Clear feedback
  feedbackElement.textContent = "";
  feedbackElement.className = "feedback";

  // Update progress bar
  progressElement.style.width = `${
    ((currentQuestionIndex + 1) / quizQuestions.length) * 100
  }%`;

  // Reset timer
  resetTimer();
}

// Select an option
function selectOption(optionIndex) {
  // Remove selected class from all options
  const options = document.querySelectorAll(".option");
  options.forEach((option) => option.classList.remove("selected"));

  // Add selected class to clicked option
  options[optionIndex].classList.add("selected");

  // Store user's answer
  userAnswers[currentQuestionIndex] = optionIndex;

  // Check if answer is correct
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isCorrect = optionIndex === currentQuestion.correctAnswer;

  // Show feedback
  feedbackElement.textContent = isCorrect
    ? "Correct! Well done."
    : `Incorrect. The correct answer is: ${
        currentQuestion.options[currentQuestion.correctAnswer]
      }`;
  feedbackElement.className = isCorrect
    ? "feedback correct"
    : "feedback incorrect";

  // Update score if this is the first time answering
  if (
    userAnswers[currentQuestionIndex] !== null &&
    userAnswers[currentQuestionIndex] !== undefined
  ) {
    if (isCorrect) {
      score++;
    }
  }

  // Disable options after selection
  options.forEach((option) => {
    option.style.pointerEvents = "none";
  });

  // Stop timer
  clearInterval(timer);
}

// Navigate to previous question
function goToPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
    updateNavigationButtons();
  }
}

// Navigate to next question
function goToNextQuestion() {
  if (currentQuestionIndex < quizQuestions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
    updateNavigationButtons();
  }
}

// Update navigation buttons state
function updateNavigationButtons() {
  prevButton.disabled = currentQuestionIndex === 0;

  if (currentQuestionIndex === quizQuestions.length - 1) {
    nextButton.style.display = "none";
    submitButton.style.display = "block";
  } else {
    nextButton.style.display = "block";
    submitButton.style.display = "none";
  }
}

// Submit the quiz
function submitQuiz() {
  // Calculate final score
  let finalScore = 0;
  userAnswers.forEach((answer, index) => {
    if (answer === quizQuestions[index].correctAnswer) {
      finalScore++;
    }
  });

  // Display score
  scoreValueElement.textContent = `${finalScore}/${quizQuestions.length}`;

  // Display message based on score
  let message = "";
  if (finalScore === quizQuestions.length) {
    message = "Perfect! You're a quiz master!";
  } else if (finalScore >= quizQuestions.length * 0.7) {
    message = "Great job! You know your stuff.";
  } else if (finalScore >= quizQuestions.length * 0.5) {
    message = "Not bad! Keep learning.";
  } else {
    message = "Keep studying and try again!";
  }
  scoreMessageElement.textContent = message;

  // Show score container
  quizElement.style.display = "none";
  scoreContainerElement.style.display = "block";
}

// Timer functions
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      // Auto-submit if time runs out
      if (userAnswers[currentQuestionIndex] === null) {
        userAnswers[currentQuestionIndex] = -1; // Mark as unanswered
      }

      // Move to next question or submit if last question
      if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
        updateNavigationButtons();
      } else {
        submitQuiz();
      }
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 15;
  timerElement.textContent = `Time: ${timeLeft}s`;
  startTimer();
}

// Event listeners
startButton.addEventListener("click", initQuiz);
prevButton.addEventListener("click", goToPreviousQuestion);
nextButton.addEventListener("click", goToNextQuestion);
submitButton.addEventListener("click", submitQuiz);
restartButton.addEventListener("click", initQuiz);
