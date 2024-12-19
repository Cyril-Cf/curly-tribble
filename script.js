document.addEventListener("DOMContentLoaded", () => {
  const userForm = document.getElementById("userForm");
  const questionContainer = document.getElementById("questionContainer");
  const questionContent = document.getElementById("questionContent");

  function fetchJSONFromLocalStorage(key, fallback) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  }

  function saveJSONToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  userForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstName = e.target.firstName.value.trim();
    const lastName = e.target.lastName.value.trim();

    if (!firstName || !lastName) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    const users = fetchJSONFromLocalStorage("users", {});
    const userKey = `${firstName}_${lastName}`;
    let user = users[userKey];

    if (!user) {
      user = { firstName, lastName, seenQuestions: [] };
      users[userKey] = user;
    }

    const availableQuestions = questions.filter(
      (q) => !user.seenQuestions.some((seenQ) => seenQ.id === q.id)
    );

    if (availableQuestions.length === 0) {
      questionContent.innerHTML = "Toutes les questions ont déjà été posées.";
    } else {
      const randomQuestion =
        availableQuestions[
          Math.floor(Math.random() * availableQuestions.length)
        ];

      user.seenQuestions.push(randomQuestion);

      // Sauvegarde des données utilisateur
      saveJSONToLocalStorage("users", users);

      // Affichage de la question
      questionContent.innerHTML = renderQuestion(randomQuestion);
      questionContainer.classList.remove("hidden");
    }
  });

  function renderQuestion(question) {
    if (question.type === "technical") {
      return `<div class='bg-blue-50 p-4 rounded border border-blue-200'>
                <p class='text-blue-800 font-medium'>${escapeHTML(
                  question.content
                )}</p>
              </div>`;
    } else if (question.type === "code_example") {
      return `<div class='bg-gray-50 p-4 rounded border border-gray-200'>
                <p class='text-red-800 mb-2 font-medium'>${escapeHTML(
                  question.content
                )}</p>
                <pre class='bg-gray-900 text-white p-4 rounded overflow-auto'><code>${escapeHTML(
                  question.code_content
                )}</code></pre>
              </div>`;
    } else if (question.type === "code_correction") {
      return `<div class='bg-red-50 p-4 rounded border border-red-200'>
                <p class='text-red-800 mb-2 font-medium'>${question.content}</p>
                <pre class='bg-gray-900 text-white p-4 rounded overflow-auto'><code>${escapeHTML(
                  question.code_content
                )}</code></pre>
              </div>`;
    }
    return `<div class='bg-gray-50 p-4 rounded border border-gray-200'>
              <p>${escapeHTML(question.content)}</p>
            </div>`;
  }

  function escapeHTML(html) {
    return html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
