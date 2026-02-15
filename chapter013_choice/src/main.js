// main.js - Multiple Choice Game for Horse Sensations (Single Question)

const questions = [
    //QUESTION 1
  {
    prompt: "What is a key benefit of using circles in early horse training?",
    correct: 0,
    choices: [
      {
        label: "They help teach bend through the ribcage and encourage balance on curves.",
        desc: ` <p class="title">Finding Shape in Motion</p>
  <p class="lead">
    <em
      >Two young horses learning to turn chaos into shape and motion into
      meaning.</em
    >
  </p>
  <!-- Circles as Shape -->
  <p class="sectionTitle">Circles as Shape</p>
  <ul>
    <li>Teach bend through the ribcage</li>
    <li>Encourage balance on curves</li>
    <li>Use circles to channel excess energy</li>
    <li>Help the horse find rhythm and organization</li>
  </ul>

  <p>
    <span class="emphasis">Symbolism:</span> Shape, balance, rhythm,
    organization, youthful contrast
  </p>
  <p>
    <span class="emphasis">Ideal for:</span> Young horses learning circles,
    bending, and downward transitions
  </p>
  <p>
    <span class="emphasis">Handler cue:</span> Offer clarity and consistency
    while allowing personality to shine
  </p>
  <p>
    <span class="emphasis">Common in:</span> Early training stages where
    structure meets youthful energy
  </p>`
      },
      {
        label: "They make the horse run as fast as possible in a straight line."
      },
      {
        label: "They prevent the horse from ever relaxing or finding rhythm."
      }
    ]
    },
      //QUESTION 2
  {
    prompt: "How can transitions be used to improve a young horse’s training?",
    correct: 0,
    choices: [
      {
        label: "They introduce “thinking moments,” build responsiveness without tension, and help prevent rushing or drifting.",
        desc: ` <p class="title">Finding Shape in Motion</p>
  <p class="lead">
    <em
      >Two young horses learning to turn chaos into shape and motion into
      meaning.</em
    >
  </p>
  <!-- Transitions as Control -->
  <p class="learn-title">Transitions as Control</p>
  <ul>
    <li>Introduce downward transitions as “thinking moments”</li>
    <li>Build responsiveness without tension</li>
    <li>Reward slowing, stopping, and rebalancing</li>
    <li>Use transitions to prevent rushing or drifting</li>
  </ul>

  <p>
    <span class="emphasis">Symbolism:</span> Shape, balance, rhythm,
    organization, youthful contrast
  </p>
  <p>
    <span class="emphasis">Ideal for:</span> Young horses learning circles,
    bending, and downward transitions
  </p>
  <p>
    <span class="emphasis">Handler cue:</span> Offer clarity and consistency
    while allowing personality to shine
  </p>
  <p>
    <span class="emphasis">Common in:</span> Early training stages where
    structure meets youthful energy
  </p>`
      },
      {
        label: "They encourage the horse to ignore the rider’s cues and move faster at all times.."
      },
      {
        label: "They are only useful for advanced horses and should be avoided in early training."
      }
    ]
    },
    //QUESTION 3
  {
    prompt: "What is an important lesson from observing harmony through contrast in young horses?",
    correct: 0,
    choices: [
      {
        label: "Letting each horse learn at their own pace and using their differences to highlight the lesson.",
        desc: `   <p class="title">Finding Shape in Motion</p>
  <p class="lead">
    <em
      >Two young horses learning to turn chaos into shape and motion into
      meaning.</em
    >
  </p>
  <!-- Harmony Through Contrast -->
  <p class="sectionTitle">Harmony Through Contrast</p>
  <ul>
    <li>Let each horse learn at their own pace</li>
    <li>Use their differences to highlight the lesson</li>
    <li>Show how structure supports both chaos and precision</li>
    <li>Celebrate the moment both colts find true shape in motion</li>
  </ul>
    <p class="learn-title">Mudslide’s Precision</p>
  <ul>
    <li>Offer challenges that match her focus</li>
    <li>Refine bend, timing, and responsiveness</li>
    <li>Use circles to build suppleness, not just discipline</li>
    <li>Reinforce her natural desire to organize</li>
  </ul>
   <p class="learn-title">Gigabyte’s Chaos</p>
  <ul>
    <li>Expect distraction, wiggles, and creative interpretations</li>
    <li>Use humor and patience to guide him</li>
    <li>Keep sessions short and varied</li>
    <li>Celebrate every moment he finds balance</li>
  </ul>
  <p>
    <span class="emphasis">Symbolism:</span> Shape, balance, rhythm,
    organization, youthful contrast
  </p>
  <p>
    <span class="emphasis">Ideal for:</span> Young horses learning circles,
    bending, and downward transitions
  </p>
  <p>
    <span class="emphasis">Handler cue:</span> Offer clarity and consistency
    while allowing personality to shine
  </p>
  <p>
    <span class="emphasis">Common in:</span> Early training stages where
    structure meets youthful energy
  </p>`
      },
      {
        label: "Forcing both horses to move identically, regardless of their needs."
      },
      {
        label: "Ignoring differences and focusing only on speed and competition."
      }
    ]
    },
  
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
