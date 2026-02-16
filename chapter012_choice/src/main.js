// main.js - Multiple Choice Game for Horse Sensations (Single Question)

const questions = [
    //QUESTION 1
  {
    prompt: "What is a key principle in helping a horse achieve lift when jumping?",
    correct: 0,
    choices: [
      {
        label: "Build power from the hind end, maintain rhythm and balance, and encourage lightness without rushing.",
        desc: `  <p class="title">The Art of Flight</p>
  <p class="lead"><em>When mastery meets momentum, the ground lets go.</em></p>

  <!-- Lift -->
  <p class="learn-title">Lift</p>
  <ul>
    <li>Build power from the hind end</li>
    <li>Maintain a rhythmic, balanced canter</li>
    <li>Encourage lightness without rushing</li>
    <li>Support the horse’s natural desire to rise</li>
  </ul>

  <p>
    <span class="emphasis">Symbolism:</span> Lift, arc, timing, trust,
    purposeful landing
  </p>
  <p>
    <span class="emphasis">Ideal for:</span> Mature jumpers at peak physical and
    mental performance
  </p>
  <p>
    <span class="emphasis">Handler cue:</span> Offer rhythm, clarity, and quiet
    confidence
  </p>
  <p>
    <span class="emphasis">Common in:</span> Experienced horses with strong
    partnership foundations
  </p>`
      },
      {
        label: "Focus only on speed and push the horse to rush forward."
      },
      {
        label: "Make sure the horse has all its weight on the forehand."
      }
    ]
    },
      //QUESTION 2
  {
    prompt: "What helps a horse achieve a proper arc (bascule) when jumping?",
    correct: 0,
    choices: [
      {
        label: "Shape the bascule with a correct approach, allow shoulder freedom, maintain soft contact, and let the horse find her natural curve.",
        desc: ` <p class="title">The Art of Flight</p>
  <p class="lead"><em>When mastery meets momentum, the ground lets go.</em></p>

  <!-- Arc -->
  <p class="learn-title">Arc</p>
  <ul>
    <li>Shape the bascule through correct approach</li>
    <li>Allow freedom of the shoulders</li>
    <li>Maintain soft contact over the fence</li>
    <li>Let the horse find her natural curve</li>
  </ul>
  <p>
    <span class="emphasis">Symbolism:</span> Lift, arc, timing, trust,
    purposeful landing
  </p>
  <p>
    <span class="emphasis">Ideal for:</span> Mature jumpers at peak physical and
    mental performance
  </p>
  <p>
    <span class="emphasis">Handler cue:</span> Offer rhythm, clarity, and quiet
    confidence
  </p>
  <p>
    <span class="emphasis">Common in:</span> Experienced horses with strong
    partnership foundations
  </p>`
      },
      {
        label: "Restrict the horse’s shoulders and keep a tight, rigid contact over the fence."
      },
      {
        label: "Focus only on speed and ignore the horse’s jumping form."
      }
    ]
    },
    //QUESTION 3
  {
    prompt: "What is important for achieving good timing when jumping a horse?",
    correct: 0,
    choices: [
      {
        label: "Refine stride adjustments before takeoff, use subtle aids to influence distance, stay consistent in rhythm, and trust the horse’s instinct.",
        desc: ` <p class="title">The Art of Flight</p>
  <p class="lead"><em>When mastery meets momentum, the ground lets go.</em></p>

  <!-- Timing -->
  <p class="learn-title">Timing</p>
  <ul>
    <li>Refine stride adjustments before takeoff</li>
    <li>Use subtle aids to influence distance</li>
    <li>Stay consistent in rhythm and intention</li>
    <li>Trust the horse’s instinct in the final moment</li>
  </ul>

  <p>
    <span class="emphasis">Symbolism:</span> Lift, arc, timing, trust,
    purposeful landing
  </p>
  <p>
    <span class="emphasis">Ideal for:</span> Mature jumpers at peak physical and
    mental performance
  </p>
  <p>
    <span class="emphasis">Handler cue:</span> Offer rhythm, clarity, and quiet
    confidence
  </p>
  <p>
    <span class="emphasis">Common in:</span> Experienced horses with strong
    partnership foundations
  </p>`
      },
      {
        label: "Change rhythm constantly and override the horse’s instinct with strong, abrupt aids.."
      },
      {
        label: "Ignore stride adjustments and rely only on luck for takeoff."
      }
    ]
    },
  
    //QUESTION 4
  {
    prompt: "What is essential for a purposeful landing after a jump?",
    correct: 0,
    choices: [
      {
        label: "Rebalance immediately after the jump, prepare for the next question on course, maintain softness through transitions, and support the horse’s athletic recovery.",
        desc: `  <p class="title">The Art of Flight</p>
  <p class="lead"><em>When mastery meets momentum, the ground lets go.</em></p>
  <!-- Landing With Purpose -->
  <p class="learn-title">Landing With Purpose</p>
  <ul>
    <li>Rebalance immediately after the jump</li>
    <li>Prepare for the next question on course</li>
    <li>Maintain softness through transitions</li>
    <li>Support the horse’s athletic recovery</li>
  </ul>
  <p>
    <span class="emphasis">Symbolism:</span> Lift, arc, timing, trust,
    purposeful landing
  </p>
  <p>
    <span class="emphasis">Ideal for:</span> Mature jumpers at peak physical and
    mental performance
  </p>
  <p>
    <span class="emphasis">Handler cue:</span> Offer rhythm, clarity, and quiet
    confidence
  </p>
  <p>
    <span class="emphasis">Common in:</span> Experienced horses with strong
    partnership foundations
  </p>`
      },
      {
        label: "Ignore transitions and let the horse rush after landing."
      },
      {
        label: "Focus only on speed and neglect the horse’s balance and recovery."
      }
    ]
    }  
  // ...existing questions remain unchanged...
];

let current = 0;

function shuffleChoices(q) {
  // Attach original index to each choice
  const choicesWithIndex = q.choices.map((choice, idx) => ({ ...choice, _originalIdx: idx }));
  // Fisher-Yates shuffle
  for (let i = choicesWithIndex.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choicesWithIndex[i], choicesWithIndex[j]] = [choicesWithIndex[j], choicesWithIndex[i]];
  }
  // Find new index of the correct answer
  const newCorrect = choicesWithIndex.findIndex(c => c._originalIdx === q.correct);
  // Remove helper property
  q.choices = choicesWithIndex.map(({ _originalIdx, ...rest }) => rest);
  q.correct = newCorrect;
}

function renderQuestion() {
  const q = questions[current];
  shuffleChoices(q);
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
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.style.display = 'none';
  nextBtn.innerText = (current < questions.length - 1) ? 'Next' : 'Done';
  nextBtn.onclick = () => {
    if (current < questions.length - 1) {
      current++;
      renderQuestion();
    } else {
      document.getElementById('question').innerHTML = 'All questions complete!';
      document.getElementById('choices').innerHTML = '';
      document.getElementById('feedback').innerHTML = '';
      nextBtn.style.display = 'none';
    }
  };
}

function checkAnswer(idx) {
  const q = questions[current];
  const feedback = document.getElementById('feedback');
  if (idx === q.correct) {
    feedback.innerHTML = `<div class="correct">Correct!</div>` + q.choices[idx].desc;
    document.getElementById('nextBtn').style.display = '';
  } else {
    feedback.innerHTML = `<div class="incorrect">Try again.</div>`;
    document.getElementById('nextBtn').style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', renderQuestion);
