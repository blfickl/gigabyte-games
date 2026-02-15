// main.js - Timed True/False Quiz for Chapter 1

const ALL_QUESTIONS = [
  { q: "The horse's Cervical region is in the neck.", a: true },
  { q: "The Sacral region is found in the horse's tail.", a: false },
  { q: "A Suspension Bridge back is floating and elastic.", a: true },
  { q: "Drawbridge backs are common in rescue horses.", a: true },
  { q: "The Thoracic region supports the ribcage.", a: true },
  { q: "Lumbar vertebrae are the most flexible.", a: false },
  { q: "Arched Bridge backs are ideal for horses with natural strength but tightness.", a: true },
  { q: "The Coccygeal region is also called the tail.", a: true },
  { q: "A horse's back never changes shape.", a: false },
  { q: "Suspension Bridge backs are common in older horses.", a: false },
  { q: "Drawbridge backs are responsive and intentional.", a: true },
  { q: "The Sacral region transfers power from the hind legs.", a: true },
  { q: "Arched Bridge backs are always weak.", a: false },
  { q: "Pole work is suggested for Suspension Bridge backs.", a: true },
  { q: "Stretching trot is a suggestion for Arched Bridge backs.", a: true },
  { q: "Trust-building exercises are for Drawbridge backs.", a: true },
  { q: "The Thoracic region is in the horse's head.", a: false },
  { q: "Serpentines are not helpful for Arched Bridge backs.", a: false },
  { q: "Cervical region has 7 vertebrae.", a: true },
  { q: "The Lumbar region connects to the hindquarters.", a: true },
  { q: "Back lifts from the ground are for Suspension Bridge backs.", a: false },
  { q: "Hill work at walk is suggested for Suspension Bridge backs.", a: true },
  { q: "Drawbridge backs are never found in green horses.", a: false },
  { q: "Lateral work is suggested for Suspension Bridge backs.", a: true }
];

const QUESTIONS_PER_GAME = 8;
const TIME_PER_QUESTION = 5; // seconds

let questions = [];
let current = 0;
let score = 0;
let timer = null;
let timeLeft = TIME_PER_QUESTION;
let startTime = 0;
let totalTime = 0;
let userAnswers = [];

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function startQuiz() {
  questions = ALL_QUESTIONS.slice();
  shuffle(questions);
  questions = questions.slice(0, QUESTIONS_PER_GAME);
  current = 0;
  score = 0;
  totalTime = 0;
  userAnswers = [];
  document.getElementById('score').textContent = '';
  document.getElementById('startBtn').style.display = 'none';
  document.getElementById('restartBtn').style.display = 'none';
  document.getElementById('tf-buttons').style.display = 'block';
  startTime = Date.now();
  showQuestion();
}

function showQuestion() {
  if (current >= questions.length) {
    endQuiz();
    return;
  }
  document.getElementById('question').textContent = `Q${current+1}: ` + questions[current].q;
  timeLeft = TIME_PER_QUESTION;
  document.getElementById('timer').textContent = `Time: ${timeLeft.toFixed(1)}s`;
  enableButtons(true);
  timer = setInterval(() => {
    timeLeft -= 0.1;
    document.getElementById('timer').textContent = `Time: ${Math.max(0, timeLeft).toFixed(1)}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      answer(false, true); // timed out
    }
  }, 100);
}

function enableButtons(enable) {
  document.getElementById('trueBtn').disabled = !enable;
  document.getElementById('falseBtn').disabled = !enable;
}

document.getElementById('trueBtn').onclick = () => answer(true, false);
document.getElementById('falseBtn').onclick = () => answer(false, false);

document.getElementById('startBtn').onclick = startQuiz;
document.getElementById('restartBtn').onclick = startQuiz;

function answer(val, timedOut) {
  clearInterval(timer);
  enableButtons(false);
  let correct = (!timedOut && val === questions[current].a);
  if (correct) {
    score++;
  }
  userAnswers.push({
    q: questions[current].q,
    correct: questions[current].a,
    user: timedOut ? null : val,
    timedOut: timedOut
  });
  totalTime += (TIME_PER_QUESTION - timeLeft);
  setTimeout(() => {
    current++;
    showQuestion();
  }, 400);
}

function endQuiz() {
  document.getElementById('question').textContent = 'Quiz Complete!';
  document.getElementById('timer').textContent = '';
  document.getElementById('tf-buttons').style.display = 'none';
  let summary = `<div style='margin-top:16px;'><b>Score:</b> ${score} / ${questions.length}<br><b>Total Time:</b> ${totalTime.toFixed(1)}s</div>`;
  summary += `<div style='margin-top:18px;'><b>Review:</b><ol style='padding-left:18px;'>`;
  userAnswers.forEach((ans, i) => {
    let userStr = ans.timedOut ? '<span style="color:#c62828">No answer (timed out)</span>' : (ans.user === true ? 'True' : 'False');
    let correctStr = ans.correct === true ? 'True' : 'False';
    let result = (ans.user === ans.correct && !ans.timedOut) ? '<span style="color:#388e3c">✔</span>' : '<span style="color:#c62828">✘</span>';
    summary += `<li>${ans.q}<br>Your answer: ${userStr}<br>Correct answer: <b>${correctStr}</b> ${result}</li>`;
  });
  summary += '</ol></div>';
  document.getElementById('score').innerHTML = summary;
  document.getElementById('restartBtn').style.display = 'inline-block';
}
