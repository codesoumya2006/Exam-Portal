// ---------------- STUDENT PAGE ----------------
if (document.getElementById("studentExamContainer")) {
  const urlParams = new URLSearchParams(window.location.search);
  const encodedData = urlParams.get("data");
  const examTitleEl = document.getElementById("examTitle");
  const studentExamContainer = document.getElementById("studentExamContainer");
  const submitExamBtn = document.getElementById("submitExamBtn");
  const resultBox = document.getElementById("resultBox");
  const timerDisplay = document.getElementById("timerDisplay");

  let timerInterval;

  if (!encodedData) {
    examTitleEl.textContent = "No Exam Data Found!";
    timerDisplay.classList.add('hidden');
  } 
  else {
    const examData = JSON.parse(decodeURIComponent(atob(encodedData)));
    examTitleEl.textContent = examData.title;

    if (examData.duration) {
      let totalSeconds = examData.duration * 60;
      timerDisplay.classList.remove('hidden');

      // CHANGED: Assign to the timerInterval declared above
      timerInterval = setInterval(() => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (totalSeconds <= 0) {
          clearInterval(timerInterval);
          alert("Time's up! Your exam will be submitted automatically.");
          
          document.querySelectorAll('input[type="radio"]').forEach(input => input.disabled = true);
          submitExamBtn.click();
        }
        totalSeconds--;
      }, 1000);
    } 
    else {
      timerDisplay.classList.add('hidden');
    }

    examData.questions.forEach((q, idx) => {
      const qDiv = document.createElement("div");
      qDiv.className = "mb-4";
      qDiv.innerHTML = `
        <h3 class="font-semibold mb-2">Q${idx+1}: ${q.question}</h3>
        <div class="space-y-2">
        ${q.options.map((opt, i) => `
          <label class="block border rounded-lg p-3 cursor-pointer option-label">
            <input type="radio" name="q${idx}" value="${i}" class="mr-3"> ${opt}
          </label>
        `).join("")}
        </div>
      `;
      studentExamContainer.appendChild(qDiv);
    });

    submitExamBtn.classList.remove("hidden");

    submitExamBtn.addEventListener("click", () => {
      // CHANGED: Stop the timer when the submit button is clicked
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      
      let score = 0;
      examData.questions.forEach((q, idx) => {
        const ans = document.querySelector(`input[name="q${idx}"]:checked`);
        if (ans && parseInt(ans.value) === q.correct) score++;
      });

      resultBox.innerHTML = `
        <h2 class="text-2xl font-bold mb-2 text-white">Your Score</h2>
        <p class="text-4xl font-bold text-white">${score} / ${examData.questions.length}</p>
      `;
      resultBox.classList.remove("hidden");
      submitExamBtn.disabled = true;
      submitExamBtn.textContent = "Submitted";
    });
  }
}