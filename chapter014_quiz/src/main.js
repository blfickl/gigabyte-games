// main.js - Timed True/False Quiz for Chapter 14

const ALL_QUESTIONS = [
  // --- learnmobile_014_theme_1 ---
  { q: "The trail is treated as an active teacher rather than just a place to exercise.", a: true },
  { q: "Nature is used as a classroom to develop balance and body awareness.", a: true },

  // --- learnmobile_014_theme_2 ---
  { q: "Hill work is designed primarily to increase speed and intensity.", a: false },
  { q: "Uphill work builds hind-end strength and focus.", a: true },
  { q: "Downhill work encourages the horse to move faster for confidence.", a: false },
  { q: "The incline naturally encourages bending and engagement.", a: true },
  { q: "The hill is described as a moment of clarity for the young horse.", a: true },

  // --- learnmobile_014_theme_3 ---
  { q: "The handler is expected to micromanage each step the horse takes.", a: false },
  { q: "Purpose is expected to emerge naturally through movement and terrain.", a: true },
  { q: "Distraction is treated as failure rather than information.", a: false },
  { q: "Movement becomes meaningful when effort connects to outcome.", a: true },

  // --- learnmobile_014_theme_4 ---
  { q: "Transitions happen naturally on varied terrain.", a: true },

  // --- learnmobile_014_gaits_1 ---
  { q: "The halt is used to reset attention before beginning the climb.", a: true },
  { q: "Stillness at the halt can reveal emotional readiness.", a: true },
  { q: "Uphill walking builds hind-end strength and engagement.", a: true },
  { q: "Downhill walking teaches careful foot placement and slowing.", a: true },
  { q: "A steady four-beat rhythm is encouraged despite terrain changes.", a: true },
  { q: "Long, sustained uphill trots are recommended for conditioning.", a: false },
  { q: "Short uphill trots strengthen stifles and hocks.", a: true },
  { q: "Transitions are used to regulate speed naturally.", a: true },
  { q: "Canter work on hills is focused on increasing speed.", a: false },

  // --- learnmobile_014_anatomy_1 (original set) ---
  { q: "The hill strengthens only the horse’s muscles, not his senses.", a: false },
  { q: "A young horse’s head functions as a sensory hub.", a: true },
  { q: "Horses see most of the horizon but have limited depth perception.", a: true },
  { q: "Depth perception occurs primarily in a small binocular zone.", a: true },
  { q: "Head movement on hills helps the horse judge footing.", a: true },
  { q: "A high head posture improves depth perception on steep terrain.", a: false },
  { q: "Sudden changes in light can cause spooking.", a: true },
  { q: "Ears act as both emotional indicators and environmental sensors.", a: true },
  { q: "Independent ear movement allows scanning of multiple inputs.", a: true },
  { q: "Ear movement has little relevance to rider communication.", a: false },

  // --- learnmobile_014_nutrition_1 ---
  { q: "Hill work increases muscle exertion and heat production.", a: true },
  { q: "Hydration is essential before and after hill work.", a: true },
  { q: "Lush pasture removes the need for mineral balance.", a: false },
  { q: "Calcium and phosphorus support bone and tendon strength.", a: true },
  { q: "Proper mineral balance supports emotional steadiness.", a: true },
  { q: "Nutrition focus in Month 1 is primarily about adding calories.", a: false },

  // --- learnmobile_014_rider_1 ---
  { q: "Rider relaxation supports the horse’s balance on uneven terrain.", a: true },
  { q: "Riders are encouraged to brace their bodies uphill.", a: false },

  // --- learnmobile_014_horse_1 ---
  { q: "Breathing rituals help synchronize horse and rider.", a: true },
  { q: "Stretching on a loose rein supports relaxation and engagement.", a: true },
  { q: "Pausing at the top of the hill allows a reset.", a: true },

  // --- learnmobile_014_anatomy_1 (additional 20) ---
  { q: "The eyes, ears, nostrils, and jaw work together on the trail.", a: true },
  { q: "Vision shifts between monocular and binocular depending on head position.", a: true },
  { q: "Horses rely primarily on binocular vision for general navigation.", a: false },
  { q: "Lowering the head improves footing awareness on hills.", a: true },
  { q: "A wide monocular field allows scanning of the environment.", a: true },
  { q: "Young horses should keep their heads fixed for balance.", a: false },
  { q: "Ear flicking can indicate processing rather than distraction.", a: true },
  { q: "One ear locked on the environment always signals disobedience.", a: false },
  { q: "Wind and rustling brush can heighten sensory input.", a: true },
  { q: "Sensory awareness contributes to balance and confidence.", a: true },
  { q: "Sensory engagement interferes with learning on the trail.", a: false },
  { q: "The hill encourages attention to the ground beneath the feet.", a: true },
  { q: "Over-focusing on distant objects can reduce footing awareness.", a: true },
  { q: "Visual challenges on hills are unrelated to posture.", a: false },
  { q: "Sensory systems mature through real-world terrain exposure.", a: true },
  { q: "The jaw reflects both physical and emotional processing.", a: true },
  { q: "Sensory overload is best addressed through restriction of movement.", a: false },
  { q: "Natural terrain helps integrate sensory information.", a: true },
  { q: "The hill awakens awareness, not just strength.", a: true },
  { q: "Sensory development supports focus without force.", a: true }
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
