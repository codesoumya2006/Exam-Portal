// ---------------- TEACHER PAGE ----------------
if (document.getElementById("addQuestionBtn")) {
  const examTitleInput = document.getElementById("examTitle");
  const examTimerInput = document.getElementById("examTimer"); 
  const questionsContainer = document.getElementById("questions-container");
  const addQuestionBtn = document.getElementById("addQuestionBtn");
  const generateLinkBtn = document.getElementById("generateLinkBtn");
  const examLinkBox = document.getElementById("examLinkBox");
  const examLink = document.getElementById("examLink");
  const qrCode = document.getElementById("qrCode");

  addQuestionBtn.addEventListener("click", () => {
    const qIndex = questionsContainer.children.length;
    const qDiv = document.createElement("div");
    qDiv.className = "border p-3 mb-3 rounded";
    qDiv.innerHTML = `
      <input type="text" placeholder="Question ${qIndex + 1}" class="w-full border p-2 mb-2 question-input"/>
      <div class="options space-y-2">
        ${[1, 2, 3, 4].map(i => `
          <div class="flex items-center">
            <input type="radio" name="correct${qIndex}" value="${i-1}" class="mr-2">
            <input type="text" placeholder="Option ${i}" class="flex-1 border p-2 option-input"/>
          </div>
        `).join("")}
      </div>
    `;
    questionsContainer.appendChild(qDiv);
  });

  generateLinkBtn.addEventListener("click", () => {
    const title = examTitleInput.value.trim();
    const duration = parseInt(examTimerInput.value);
    if (!title) return alert("Please enter an exam title.");
    if (isNaN(duration) || duration <= 0) {
      return alert("Please enter a valid, positive number for the exam duration.");
    }

    const examData = { title, duration, questions: [] };

    let allQuestionsValid = true;
    [...questionsContainer.children].forEach((qDiv, index) => {
      if (!allQuestionsValid) return; 

      const qText = qDiv.querySelector(".question-input").value.trim();
      const options = [...qDiv.querySelectorAll(".option-input")].map(o => o.value.trim());
      const correct = qDiv.querySelector(`input[name="correct${index}"]:checked`);

      if (!qText || options.some(o => !o) || !correct) {
        alert(`Please complete all fields for Question ${index + 1}.`);
        allQuestionsValid = false;
        return;
      }

      examData.questions.push({
        question: qText,
        options,
        correct: parseInt(correct.value)
      });
    });

    if (!allQuestionsValid) return;
    if (examData.questions.length === 0) return alert("Please add at least one question.");

    const encodedData = btoa(encodeURIComponent(JSON.stringify(examData)));
    const link = `${window.location.origin}${window.location.pathname.replace("index.html","")}exam.html?data=${encodedData}`;
    
    examLink.textContent = link;
    examLink.href = link;
    examLinkBox.classList.remove("hidden");

    QRCode.toCanvas(qrCode, link, { width: 200 }, (err) => {
      if (err) console.error(err);
    });
  });
}
