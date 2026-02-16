// main.js - Timed True/False Quiz for Chapter 14

 const ALL_QUESTIONS = [
  // =========================
  // ANATOMY (30) — learnmobile_018_anatomy_1 (Digestive System / Shows)
  // =========================
  { q: "Show environments can disrupt a horse’s steady grazing rhythm, making gut comfort important for calmness and focus.", a: true },
  { q: "Chewing produces saliva that helps buffer stomach acid.", a: true },
  { q: "Offering familiar hay can encourage relaxation and steady chewing at a show.", a: true },
  { q: "At shows, it’s recommended to create long gaps without forage to build appetite.", a: false },
  { q: "Watching for tension chewing is part of show-day gut awareness.", a: true },
  { q: "The esophagus can reverse direction easily if a horse becomes stressed.", a: false },
  { q: "Slow, familiar feeding can reduce stress during show conditions.", a: true },
  { q: "A horse’s stomach produces acid only when the horse eats a meal.", a: false },
  { q: "An empty stomach can increase discomfort because acid is produced continuously.", a: true },
  { q: "Hay can help buffer stomach acid and support calmness.", a: true },
  { q: "The small intestine processes grain quickly.", a: true },
  { q: "High-starch feeds or new supplements are encouraged at shows for quick energy.", a: false },
  { q: "Sudden changes in hay can disrupt microbial balance in the cecum.", a: true },
  { q: "Bringing hay from home can help support fermentation stability at a show.", a: true },
  { q: "Keeping the horse moving can support fermentation and gut function at shows.", a: true },
  { q: "Hydration can affect comfort and performance through the large colon’s water balance role.", a: true },
  { q: "Offering water often can support comfort and performance at a show.", a: true },
  { q: "Using familiar buckets can help encourage drinking at a show.", a: true },
  { q: "Dry manure can be a sign of dehydration.", a: true },
  { q: "Loose manure can indicate stress or a diet change.", a: true },
  { q: "Normal manure always means the horse is dehydrated.", a: false },
  { q: "Keeping forage available is part of a show-day gut health checklist.", a: true },
  { q: "Maintaining a normal feeding schedule is recommended during shows.", a: true },
  { q: "Allowing hand-grazing can support gut comfort and calmness at shows.", a: true },
  { q: "Introducing brand-new feeds on show day is recommended to improve performance.", a: false },
  { q: "Walking often can support gut motility at a show.", a: true },
  { q: "Mouth function is unrelated to calmness in the show setting.", a: false },
  { q: "The digestive system described is built for constant grazing and steady fermentation.", a: true },
  { q: "Hydration strategies are irrelevant to show-day comfort.", a: false },
  { q: "Avoiding long forage gaps is recommended in the show environment.", a: true },

  // =========================
  // NON-ANATOMY (30) — learnmobile_018_theme_1..5, learnmobile_018_gaits_1,
  //                   learnmobile_018_nutrition_1, learnmobile_018_rider_1, learnmobile_018_horse_1
  // =========================
  { q: "Dressage begins with steady rhythm and straightness.", a: true },
  { q: "Quiet tests can help young horses succeed without overwhelm.", a: true },
  { q: "Walk and trot work are described as the foundation for future movements.", a: true },
  { q: "The show theme emphasizes brilliance before balance.", a: false },
  { q: "Soft rein and leg cues guide direction, bend, and tempo.", a: true },
  { q: "Clarity replaces force to create trust in early dressage training.", a: true },
  { q: "The horse is expected to learn mainly through loud, forceful signals at the show.", a: false },
  { q: "Consistent tempo can calm the mind and organize the body.", a: true },
  { q: "Walk–trot patterns are used to teach predictability and focus.", a: true },
  { q: "Rhythm is described as an anchor in the show ring.", a: true },
  { q: "Bending helps the horse balance through turns in the ring.", a: true },
  { q: "Suppleness can reduce tension and improve responsiveness.", a: true },
  { q: "Circles and corners are discouraged because they increase flexibility.", a: false },
  { q: "Downward transitions can teach patience and listening.", a: true },
  { q: "Upward transitions can teach energy without rushing.", a: true },
  { q: "Each transition can become a moment of communication.", a: true },

  { q: "In the show gaits section, halt symbolizes stillness, readiness, and quiet confidence.", a: true },
  { q: "Training focus for halts includes waiting for the next cue.", a: true },
  { q: "The walk training focus includes a clear four-beat rhythm.", a: true },
  { q: "Walk–halt–walk transitions are included as a confidence-building focus.", a: true },
  { q: "The trot training focus includes a steady, metronome-like trot.", a: true },
  { q: "Circles are used at trot for suppleness and balance.", a: true },
  { q: "Canter work in this show module prioritizes shape over rhythm.", a: false },
  { q: "Canter training focus emphasizes rhythm over shape and encouraging relaxation and confidence.", a: true },

  { q: "A sudden switch from grass to hay can affect digestion and energy during a show.", a: true },
  { q: "Offering hay immediately and feeding small frequent portions is recommended for the pasture-to-stall transition.", a: true },
  { q: "The show nutrition guidance encourages avoiding new grains or supplements.", a: true },
  { q: "For show energy management, the focus is calm, not hot.", a: true },
  { q: "Post-show recovery steps include offering water immediately.", a: true },
  { q: "Post-show recovery steps include keeping treats moderate and familiar.", a: true },

  { q: "The warm-up pattern 'The Soft Circle' begins on a 20m walk circle.", a: true },
  { q: "The rider ritual 'Hands Like Water' emphasizes soft, elastic contact the horse can trust.", a: true },
  { q: "The rider ritual 'The Centered Breath' includes matching breath to footfalls.", a: true }
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
