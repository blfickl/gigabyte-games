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
      },
   
      {
        label: "Immediate full tack and long session"
      },
      {
        label: "Ignore the horse's reactions and push through"
      }
    ]
    },

    //QUESTION 2
     {
    prompt: "Which of the following is not recommended for introducing new sensations under saddle?",
    correct: 0,
    choices: [
      {
        label: "Jump on, grab the reins, and go as fast as you can.",
        desc: `<p class="title">New Sensations, New Responsibilities</p>
  <p class="lead">
    <em>New feelings in the body… new expectations in the partnership.</em>
  </p>
  <p class="learn-title">Harmony in Motion</p>
  <ul>
    <li>Take the first steps under saddle with softness</li>
    <li>Find shared rhythm at the walk before progressing</li>
    <li>Use breath and balance to communicate clearly</li>
    <li>Celebrate the beginning of true riding partnership</li>
  </ul>
  <p>
    <span class="emphasis">Symbolism:</span> Change, awakening, balance, shared
    growth
  </p>
  <p>
    <span class="emphasis">Ideal for:</span> Young horses beginning tack work,
    first rides, and early maturity
  </p>
  <p>
    <span class="emphasis">Handler cue:</span> Go slow, observe closely, support
    curiosity without pressure
  </p>
  <p>
    <span class="emphasis">Common in:</span> Horses transitioning from
    groundwork to ridden work, or adjusting after gelding
  </p>`
      },
   
      {
        label: " Take the first steps under saddle with softness",
        },
         {
        label: " Find shared rhythm at the walk before progressing",
      },
      {
        label: " Use breath and balance to communicate clearly",
      }
    ]
    },
    //QUESTION 3
     {
    prompt: "Which of the following best supports a horse’s emotional regulation during training?",
    correct: 0,
    choices: [
      {
        label: "Pause when the horse shows uncertainty, celebrate small tries, and match the session to the horse’s emotional bandwidth.",
        desc: `
  <p class="sectionTitle">Emotional Regulation</p>
  <ul>
    <li>Pause when the horse shows uncertainty</li>
    <li>Celebrate small tries and moments of relaxation</li>
    <li>Use repetition to build confidence</li>
    <li>Match the session to the horse’s emotional bandwidth</li>
  </ul>
  <p>
    <span class="emphasis">Symbolism:</span> Change, awakening, balance, shared
    growth
  </p>
  <p>
    <span class="emphasis">Ideal for:</span> Young horses beginning tack work,
    first rides, and early maturity
  </p>
  <p>
    <span class="emphasis">Handler cue:</span> Go slow, observe closely, support
    curiosity without pressure
  </p>
  <p>
    <span class="emphasis">Common in:</span> Horses transitioning from
    groundwork to ridden work, or adjusting after gelding
  </p>`
      },
   
      {
        label: " Ignore signs of uncertainty and push the horse to continue until the task is complete.",
        },
         {
        label: " Only reward the horse at the end of the session, regardless of their emotional state.",
      },
    ]
    },
      //QUESTION 4
     {
    prompt: "Which practice best develops a young horse’s body awareness during early training?",
    correct: 0,
    choices: [
      {
        label: "Help the horse find balance under saddle and teach soft responses to rein and leg pressure.",
        desc: `
  <p class="sectionTitle">Body Awareness</p>
  <ul>
    <li>Help the horse find balance under saddle</li>
    <li>Teach soft responses to rein and leg pressure</li>
    <li>Encourage slow, organized movement during first rides</li>
    <li>Support post-gelding adjustments in posture and comfort</li>
  </ul>
  <p>
    <span class="emphasis">Symbolism:</span> Change, awakening, balance, shared
    growth
  </p>
  <p>
    <span class="emphasis">Ideal for:</span> Young horses beginning tack work,
    first rides, and early maturity
  </p>
  <p>
    <span class="emphasis">Handler cue:</span> Go slow, observe closely, support
    curiosity without pressure
  </p>
  <p>
    <span class="emphasis">Common in:</span> Horses transitioning from
    groundwork to ridden work, or adjusting after gelding
  </p>`
      },
   
      {
        label: "Focus only on speed and long, fast rides from the start.",
        },
         {
        label: "Ignore the horse’s posture and comfort after gelding or tack changes.",
      },
    ]
    },
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
