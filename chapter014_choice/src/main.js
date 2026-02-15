// main.js - Multiple Choice Game for Horse Sensations (Single Question)

const questions = [
    // Placeholder for questions. Add your questions here.
];

let current = 0;
let answered = false;

function showQuestion(idx) {
    const q = questions[idx];
    document.getElementById('question').textContent = q ? q.prompt : '';
    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';
    document.getElementById('feedback').textContent = '';
    document.getElementById('nextBtn').style.display = 'none';
    answered = false;
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
    if (answered) return;
    answered = true;
    const q = questions[current];
    const feedback = document.getElementById('feedback');
    if (i === q.correct) {
        feedback.textContent = 'Correct!';
        feedback.className = 'feedback correct';
    } else {
        feedback.textContent = 'Incorrect.';
        feedback.className = 'feedback incorrect';
    }
    document.getElementById('nextBtn').style.display = (current < questions.length - 1) ? 'inline-block' : 'none';
}

document.getElementById('nextBtn').onclick = () => {
    if (current < questions.length - 1) {
        current++;
        showQuestion(current);
    }
};

// Start with the first question (if any)
if (questions.length > 0) showQuestion(0);
