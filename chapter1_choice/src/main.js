// main.js - Multiple Choice Game for Horse Back Bridge Types

const questions = [
  {
    prompt: "Which bridge type describes a horse's back that floats, is elastic, and anchored?",
    correct: 0,
    choices: [
      {
        label: "Suspension Bridge",
        desc: "Floating Strength: This horse's back floats...",
        symbolism: "Floating, elastic, anchored",
        ideal: "Horses with good core engagement...",
        cue: "Match the sway. Don't brace...",
        common: "Young horses or dressage horses",
        suggestions: [
          "Hill work at walk",
          "Transitions within gait",
          "Lateral work",
          "Pole work"
        ]
      },
      {
        label: "Arched Bridge",
        desc: "Grounded Grace: This horse's back is strong and grounded...",
        symbolism: "Grounded, powerful, elegant",
        ideal: "Horses with natural strength but tightness...",
        cue: "Invite breath. Use lateral work...",
        common: "Stock breeds, older horses...",
        suggestions: [
          "Spiral circles",
          "Serpentines",
          "Stretching trot",
          "Back lifts from ground"
        ]
      },
      {
        label: "Drawbridge",
        desc: "Intentional Access: This horse's back opens and closes...",
        symbolism: "Responsive, selective, intentional",
        ideal: "Sensitive horses learning to trust...",
        cue: "Be present, not pushy...",
        common: "Rescue horses, green horses...",
        suggestions: [
          "In-hand work",
          "Short, clear sessions",
          "Walk-trot transitions",
          "Trust-building exercises"
        ]
      }
    ]
  },
  {
    prompt: "Which bridge type describes a horse's back that is strong, grounded, and elegant?",
    correct: 1,
    choices: [
      {
        label: "Suspension Bridge",
        desc: "Floating Strength: This horse's back floats...",
        symbolism: "Floating, elastic, anchored",
        ideal: "Horses with good core engagement...",
        cue: "Match the sway. Don't brace...",
        common: "Young horses or dressage horses",
        suggestions: [
          "Hill work at walk",
          "Transitions within gait",
          "Lateral work",
          "Pole work"
        ]
      },
      {
        label: "Arched Bridge",
        desc: "Grounded Grace: This horse's back is strong and grounded...",
        symbolism: "Grounded, powerful, elegant",
        ideal: "Horses with natural strength but tightness...",
        cue: "Invite breath. Use lateral work...",
        common: "Stock breeds, older horses...",
        suggestions: [
          "Spiral circles",
          "Serpentines",
          "Stretching trot",
          "Back lifts from ground"
        ]
      },
      {
        label: "Drawbridge",
        desc: "Intentional Access: This horse's back opens and closes...",
        symbolism: "Responsive, selective, intentional",
        ideal: "Sensitive horses learning to trust...",
        cue: "Be present, not pushy...",
        common: "Rescue horses, green horses...",
        suggestions: [
          "In-hand work",
          "Short, clear sessions",
          "Walk-trot transitions",
          "Trust-building exercises"
        ]
      }
    ]
  },
  {
    prompt: "Which bridge type describes a horse's back that opens and closes, is responsive and intentional?",
    correct: 2,
    choices: [
      {
        label: "Suspension Bridge",
        desc: "Floating Strength: This horse's back floats...",
        symbolism: "Floating, elastic, anchored",
        ideal: "Horses with good core engagement...",
        cue: "Match the sway. Don't brace...",
        common: "Young horses or dressage horses",
        suggestions: [
          "Hill work at walk",
          "Transitions within gait",
          "Lateral work",
          "Pole work"
        ]
      },
      {
        label: "Arched Bridge",
        desc: "Grounded Grace: This horse's back is strong and grounded...",
        symbolism: "Grounded, powerful, elegant",
        ideal: "Horses with natural strength but tightness...",
        cue: "Invite breath. Use lateral work...",
        common: "Stock breeds, older horses...",
        suggestions: [
          "Spiral circles",
          "Serpentines",
          "Stretching trot",
          "Back lifts from ground"
        ]
      },
      {
        label: "Drawbridge",
        desc: "Intentional Access: This horse's back opens and closes...",
        symbolism: "Responsive, selective, intentional",
        ideal: "Sensitive horses learning to trust...",
        cue: "Be present, not pushy...",
        common: "Rescue horses, green horses...",
        suggestions: [
          "In-hand work",
          "Short, clear sessions",
          "Walk-trot transitions",
          "Trust-building exercises"
        ]
      }
    ]
  }
  // Add more questions here if desired
];

let current = 0;
let answered = false;

function renderQuestion() {
  const q = questions[current];
  document.getElementById('question').textContent = q.prompt;
  const choicesDiv = document.getElementById('choices');
  choicesDiv.innerHTML = '';
  document.getElementById('feedback').innerHTML = '';
  document.getElementById('nextBtn').style.display = 'none';
  answered = false;
  // Shuffle choices and track the mapping to the original index
  const indexedChoices = q.choices.map((choice, idx) => ({ ...choice, origIdx: idx }));
  for (let i = indexedChoices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexedChoices[i], indexedChoices[j]] = [indexedChoices[j], indexedChoices[i]];
  }
  // Store the mapping for answer checking
  q._shuffled = indexedChoices;
  indexedChoices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<b>${choice.label}</b>`;
    btn.onclick = () => selectChoice(idx);
    choicesDiv.appendChild(btn);
  });
}

function selectChoice(idx) {
  if (answered) return;
  answered = true;
  const q = questions[current];
  const feedback = document.getElementById('feedback');
  // Use the shuffled mapping to check correctness
  const picked = q._shuffled[idx];
  if (picked.origIdx === q.correct) {
    const c = picked;
    feedback.innerHTML = `<span class='correct'>Correct!</span><br><b>Symbolism:</b> ${c.symbolism}<br><b>Ideal for:</b> ${c.ideal}<br><b>Rider cue:</b> ${c.cue}<br><b>Common in:</b> ${c.common}<br><b>Suggestions:</b><ul>${c.suggestions.map(s=>`<li>${s}</li>`).join('')}</ul>`;
  } else {
    feedback.innerHTML = `<span class='incorrect'>Incorrect. Try again!</span>`;
    answered = false;
    return;
  }
  document.getElementById('nextBtn').style.display = (current < questions.length-1) ? 'inline-block' : 'none';
}

document.getElementById('nextBtn').onclick = () => {
  current++;
  renderQuestion();
};

renderQuestion();
