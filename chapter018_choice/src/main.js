// main.js - Multiple Choice Game for Horse Sensations (Single Question)
const questions = [
	//QUESTION 1
	{ prompt: "What is a key principle emphasized in a young horse’s first dressage experiences?",
		 correct: 0,
		choices: [
			{
				label: "Dressage begins with steady rhythm and straightness, helping the horse build confidence and balance.",
				desc: ` <p class="title">The Quiet Debut</p>
  <p class="lead">
    <em
      >In the stillness of the dressage ring, a young horse discovers the power
      of balance and communication.</em
    >
  </p>

  <!-- Balance Before Brilliance -->
  <p class="learn-title">Balance Before Brilliance</p>
  <ul>
    <li>Dressage begins with steady rhythm and straightness</li>
    <li>Walk and trot work build the foundation for future movements</li>
    <li>Balance helps the horse carry themselves with confidence</li>
    <li>Quiet tests allow young horses to succeed without overwhelm</li>
  </ul>

  <p>
    <span class="emphasis">Symbolism:</span> Harmony, clarity, balance,
    communication, quiet confidence
  </p>
  <p>
    <span class="emphasis">Ideal for:</span> Young horses beginning dressage and
    riders learning foundational skills
  </p>
  <p>
    <span class="emphasis">Handler cue:</span> Keep aids soft and consistent to
    build trust and understanding
  </p>
  <p>
    <span class="emphasis">Common in:</span> Early dressage training and first
    walk–trot shows
  </p>`
			},
     
			{ label: "Dressage should focus on advanced movements before the horse learns basic balance." },
			{ label: "Young horses should be tested with difficult challenges to see how much pressure they can handle." }
   
		]
		},
			//QUESTION 2
	{
		prompt:"What is a key lesson for a young horse in the dressage ring regarding communication?",
  
		correct: 0,
			choices: [
		{ label: "Dressage teaches a shared language between horse and rider, where soft cues and clarity build trust." ,
		desc: `  <p class="title">The Quiet Debut</p>
  <p class="lead">
    <em
      >In the stillness of the dressage ring, a young horse discovers the power
      of balance and communication.</em
    >
  </p>
  <!-- Communication Through Aids -->
  <p class="learn-title">Communication Through Aids</p>
  <ul>
    <li>Dressage teaches a shared language between horse and rider</li>
    <li>Soft rein and leg cues guide direction, bend, and tempo</li>
    <li>The horse learns to listen to subtle signals</li>
    <li>Clarity replaces force, creating trust</li>
  </ul>

  <p>
    <span class="emphasis">Symbolism:</span> Harmony, clarity, balance,
    communication, quiet confidence
  </p>
  <p>
    <span class="emphasis">Ideal for:</span> Young horses beginning dressage and
    riders learning foundational skills
  </p>
  <p>
    <span class="emphasis">Handler cue:</span> Keep aids soft and consistent to
    build trust and understanding
  </p>
  <p>
    <span class="emphasis">Common in:</span> Early dressage training and first
    walk–trot shows
  </p>`
			},
			{ label: "Dressage relies on strong force and loud signals to control the horse." },
			{ label: "The horse should only respond to rein cues and ignore leg aids." }
		]
		},
		//QUESTION 3
	{
		prompt: "Why is rhythm important for a young horse in the dressage ring?",
		correct: 0,
		choices: [
  
				{ label: "Consistent rhythm calms the mind, organizes the body, and supports smooth transitions. ." ,
			desc: `  <p class="title">The Quiet Debut</p>
  <p class="lead">
    <em
      >In the stillness of the dressage ring, a young horse discovers the power
      of balance and communication.</em
    >
  </p>
  <!-- The Power of Rhythm -->
  <p class="learn-title">The Power of Rhythm</p>
  <ul>
    <li>Consistent tempo calms the mind and organizes the body</li>
    <li>Rhythm supports smooth transitions</li>
    <li>Walk–trot patterns teach predictability and focus</li>
    <li>Rhythm becomes Mudslide’s anchor in the show ring</li>
  </ul>

  <p>
    <span class="emphasis">Symbolism:</span> Harmony, clarity, balance,
    communication, quiet confidence
  </p>
  <p>
    <span class="emphasis">Ideal for:</span> Young horses beginning dressage and
    riders learning foundational skills
  </p>
  <p>
    <span class="emphasis">Handler cue:</span> Keep aids soft and consistent to
    build trust and understanding
  </p>
  <p>
    <span class="emphasis">Common in:</span> Early dressage training and first
    walk–trot shows
  </p>`
			},   { label: "Rhythm is only important for advanced movements, not for young horses" },
			{ label: "Changing the tempo frequently helps the horse stay unpredictable and distracted.." }
    
		]
    },
    	//QUESTION 4
	{
		prompt: "What is the main benefit of practicing bending exercises with a young horse in dressage?",
		correct: 0,
		choices: [
  
				{ label: "Bending improves flexibility, balance through turns, and reduces tension for better responsiveness." ,
			desc: `  <p class="title">The Quiet Debut</p>
  <p class="lead">
    <em
      >In the stillness of the dressage ring, a young horse discovers the power
      of balance and communication.</em
    >
  </p>
  <!-- Bending as Flexibility -->
  <p class="sectionTitle">Bending as Flexibility</p>
  <ul>
    <li>Downward transitions teach patience and listening</li>
    <li>Upward transitions teach energy without rushing</li>
    <li>Each transition becomes a moment of communication</li>
    <li>Mudslide learns to stay present, step by step</li>
  </ul>

  <p>
    <span class="emphasis">Symbolism:</span> Harmony, clarity, balance,
    communication, quiet confidence
  </p>
  <p>
    <span class="emphasis">Ideal for:</span> Young horses beginning dressage and
    riders learning foundational skills
  </p>
  <p>
    <span class="emphasis">Handler cue:</span> Keep aids soft and consistent to
    build trust and understanding
  </p>
  <p>
    <span class="emphasis">Common in:</span> Early dressage training and first
    walk–trot shows
  </p>`
			},   { label: "Bending is only useful for making the horse move faster in straight lines." },
			{ label: "Bending should be avoided because it distracts the horse from focusing on the rider." }
    
		]
		},
  	//QUESTION 5
	{
		prompt: "How does practicing circles and corners benefit a young horse in dressage?",
		correct: 0,
		choices: [
  
				{ label: "Circles and corners encourage flexibility, balance through turns, and reduce tension for better responsiveness." ,
			desc: `  <p class="title">The Quiet Debut</p>
  <p class="lead">
    <em
      >In the stillness of the dressage ring, a young horse discovers the power
      of balance and communication.</em
    >
  </p>
  <!-- Bending for Suppleness -->
  <p class="learn-title">Bending for Suppleness</p>
  <ul>
    <li>Circles and corners encourage flexibility</li>
    <li>Bending helps the horse balance through turns</li>
    <li>Suppleness reduces tension and improves responsiveness</li>
    <li>Mudslide’s natural focus makes bending a joy</li>
  </ul>

  <p>
    <span class="emphasis">Symbolism:</span> Harmony, clarity, balance,
    communication, quiet confidence
  </p>
  <p>
    <span class="emphasis">Ideal for:</span> Young horses beginning dressage and
    riders learning foundational skills
  </p>
  <p>
    <span class="emphasis">Handler cue:</span> Keep aids soft and consistent to
    build trust and understanding
  </p>
  <p>
    <span class="emphasis">Common in:</span> Early dressage training and first
    walk–trot shows
  </p>`
			},   { label: "Circles and corners are mainly used to speed up the horse." },
			{ label: "Practicing circles and corners makes the horse less focused and more tense.." }
    
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