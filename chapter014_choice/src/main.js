// main.js - Multiple Choice Game for Horse Sensations (Single Question)
const questions = [
  //QUESTION 1
  { prompt: "What is a key lesson a young horse can learn from working on natural terrain?",
     correct: 0,
    choices: [
      {
        label: "It helps teach balance and body awareness by letting the horse adjust to the landscape.",
        desc: `<p class="title">The Hill That Changed Him</p>
  <p class="lead">
    <em
      >When the trail becomes the teacher, a young horse finds purpose in every
      step.</em
    >
  </p>

  <!-- Nature as Classroom -->
  <p class="learn-title">Nature as Classroom</p>
  <ul>
    <li>Use terrain to teach balance and body awareness</li>
    <li>Let natural boundaries shape the horse’s path</li>
    <li>Encourage curiosity without losing direction</li>
    <li>Allow the horse to discover his own adjustments</li>
  </ul>

  <p>
    <span class="emphasis">Symbolism:</span> Nature as teacher, grounding,
    purpose, focus, embodied learning
  </p>
  <p>
    <span class="emphasis">Ideal for:</span> Young horses who learn best through
    terrain, movement, and real-world challenges
  </p>
  <p>
    <span class="emphasis">Handler cue:</span> Let the environment guide the
    lesson while you support lightly
  </p>
  <p>
    <span class="emphasis">Common in:</span> Trail-based training and early
    conditioning for horses needing focus
  </p>`
      },
     
      { label: "It encourages the horse to ignore natural boundaries and run without direction." },
      { label: "It prevents the horse from making any adjustments on its own." }
   
    ]
    },
      //QUESTION 2
  {
    prompt:"What is one benefit of working a young horse on a hill?",
  
    correct: 0,
      choices: [
    { label: "Uphill work builds hind-end strength and focus." ,
    desc: ` 
  <p class="title">The Hill That Changed Him</p>
  <p class="lead">
    <em
      >When the trail becomes the teacher, a young horse finds purpose in every
      step.</em
    >
  </p>
  <!-- The Hill as Teacher -->
  <p class="sectionTitle">The Hill as Teacher</p>
  <ul>
    <li>Uphill work builds hind-end strength and focus</li>
    <li>Downhill steps teach careful placement and slowing</li>
    <li>The incline naturally encourages bending and engagement</li>
    <li>The hill becomes a moment of clarity for the young horse</li>
  </ul>

  <p>
    <span class="emphasis">Symbolism:</span> Nature as teacher, grounding,
    purpose, focus, embodied learning
  </p>
  <p>
    <span class="emphasis">Ideal for:</span> Young horses who learn best through
    terrain, movement, and real-world challenges
  </p>
  <p>
    <span class="emphasis">Handler cue:</span> Let the environment guide the
    lesson while you support lightly
  </p>
  <p>
    <span class="emphasis">Common in:</span> Trail-based training and early
    conditioning for horses needing focus
  </p>`
      },
      { label: "Downhill steps make the horse rush and lose balance." },
      { label: "The incline encourages the horse to ignore bending and engagement." }
    ]
    },
    //QUESTION 3
  {
    prompt: "How does riding on varied terrain help a young horse learn about transitions?",
    correct: 0,
    choices: [
  
        { label: "Downward transitions happen naturally, teaching the horse to regulate speed for safety." ,
      desc: `   <p class="title">The Hill That Changed Him</p>
  <p class="lead">
    <em
      >When the trail becomes the teacher, a young horse finds purpose in every
      step.</em
    >
  </p>
  <!-- Transitions in the Wild -->
  <p class="sectionTitle">Transitions in the Wild</p>
  <ul>
    <li>Downward transitions happen naturally on varied terrain</li>
    <li>The horse learns to regulate speed for safety</li>
    <li>Bending occurs around trees, rocks, and curves</li>
    <li>The rider supports without micromanaging</li>
  </ul>

  <p>
    <span class="emphasis">Symbolism:</span> Nature as teacher, grounding,
    purpose, focus, embodied learning
  </p>
  <p>
    <span class="emphasis">Ideal for:</span> Young horses who learn best through
    terrain, movement, and real-world challenges
  </p>
  <p>
    <span class="emphasis">Handler cue:</span> Let the environment guide the
    lesson while you support lightly
  </p>
  <p>
    <span class="emphasis">Common in:</span> Trail-based training and early
    conditioning for horses needing focus
  </p>`
      },   { label: "The horse ignores changes in terrain and always moves at the same speed." },
      { label: "The rider must micromanage every step to keep the horse safe." }
    
    ]
    }
  
  // ...existing questions remain unchanged...
];


let current = 0;
let answered = false;
let correctShown = false;

// Shuffle choices and update correct index
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

function showQuestion(idx) {
    const q = questions[idx];
    shuffleChoices(q);
    document.getElementById('question').textContent = q ? q.prompt : '';
    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';
    document.getElementById('feedback').textContent = '';
    document.getElementById('nextBtn').style.display = 'none';
    answered = false;
    correctShown = false;
    if (!q) return;
    q.choices.forEach((choice, i) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice.label;
      btn.onclick = () => selectChoice(i);
      choicesDiv.appendChild(btn);
    });
}

function selectChoice(i) {
    const q = questions[current];
    const feedback = document.getElementById('feedback');
    if (i === q.correct) {
        // Show card/desc if present, like chapter013_choice
        let desc = q.choices[i].desc ? q.choices[i].desc : '';
        feedback.innerHTML = `<div class="correct">Correct!</div>` + desc;
        feedback.className = 'feedback correct';
        correctShown = true;
        document.getElementById('nextBtn').style.display = (current < questions.length - 1) ? 'inline-block' : 'none';
    } else {
        feedback.textContent = 'Incorrect.';
        feedback.className = 'feedback incorrect';
        // If user previously got it correct, keep showing the card
        if (correctShown && q.choices[q.correct].desc) {
            feedback.innerHTML += q.choices[q.correct].desc;
        }
        document.getElementById('nextBtn').style.display = 'none';
    }
    answered = (i === q.correct);
}

document.getElementById('nextBtn').onclick = () => {
    if (current < questions.length - 1) {
        current++;
        showQuestion(current);
    }
};

// Start with the first question (if any)
if (questions.length > 0) showQuestion(0);
