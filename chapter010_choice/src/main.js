// main.js - Multiple Choice Game for Horse Sensations (Single Question)

const questions = [
  {
    prompt: "Which of the following is an ideal approach for introducing new tack to a young horse?",
    correct: 0,
    choices: [
      {
        label: "Go slow, observe closely, support curiosity without pressure",
        desc: `<p class="title">New Sensations, New Responsibilities</p>
  <p class="lead">
    <em>New feelings in the body… new expectations in the partnership.</em>
  </p>
  <p class="sectionTitle">Touch &amp; Feel</p>
  <ul>
    <li>Introduce saddle, girth, and bridle as new sensations</li>
    <li>Allow sniffing, touching, and exploring equipment</li>
    <li>Use short sessions to prevent sensory overwhelm</li>
    <li>Reward calm curiosity around new feelings</li>
  </ul>
  <p><span class="emphasis">Symbolism:</span> Change, awakening, balance, shared growth</p>
  <p><span class="emphasis">Ideal for:</span> Young horses beginning tack work, first rides, and early maturity</p>
  <p><span class="emphasis">Handler cue:</span> Go slow, observe closely, support curiosity without pressure</p>
  <p><span class="emphasis">Common in:</span> Horses transitioning from groundwork to ridden work, or adjusting after gelding</p>`
      }
    ]
  }
];

let current = 0;

function renderQuestion() {
  const q = questions[current];
  document.getElementById('question').innerHTML = q.prompt;
  const choicesDiv = document.getElementById('choices');
  choicesDiv.innerHTML = '';
  q.choices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerText = choice.label;
    btn.onclick = () => checkAnswer(idx);
    choicesDiv.appendChild(btn);
  });
  document.getElementById('feedback').innerHTML = '';
  document.getElementById('nextBtn').style.display = 'none';
}

function checkAnswer(idx) {
  const q = questions[current];
  const feedback = document.getElementById('feedback');
  if (idx === q.correct) {
    feedback.innerHTML = `<div class="correct">Correct!</div>` + q.choices[idx].desc;
  } else {
    feedback.innerHTML = `<div class="incorrect">Try again.</div>`;
  }
  document.getElementById('nextBtn').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', renderQuestion);
