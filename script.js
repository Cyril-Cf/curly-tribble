document.addEventListener("DOMContentLoaded", () => {
  const userForm = document.getElementById("userForm");
  const questionContainer = document.getElementById("questionContainer");
  const questionContent = document.getElementById("questionContent");

  // Chargement des données
  const questionsFile = "./questions.json";
  const usersFile = "./users.json";

  async function fetchJSON(file) {
    const response = await fetch(file);
    return await response.json();
  }

  async function saveJSON(file, data) {
    await fetch(file, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  userForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = e.target.firstName.value.trim();
    const lastName = e.target.lastName.value.trim();

    if (!firstName || !lastName) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    const users = await fetchJSON(usersFile);
    const questions = await fetchJSON(questionsFile);

    const userKey = `${firstName}_${lastName}`;
    let user = users[userKey];

    if (!user) {
      user = { firstName, lastName, seenQuestions: [] };
      users[userKey] = user;
    }

    const availableQuestions = questions.filter(
      (q) => !user.seenQuestions.includes(q.id)
    );

    if (availableQuestions.length === 0) {
      questionContent.innerHTML = "Toutes les questions ont déjà été posées.";
    } else {
      const randomQuestion =
        availableQuestions[
          Math.floor(Math.random() * availableQuestions.length)
        ];

      user.seenQuestions.push(randomQuestion.id);

      // Sauvegarde des données utilisateur
      await saveJSON(usersFile, users);

      // Affichage de la question
      questionContent.innerHTML = renderQuestion(randomQuestion);
      questionContainer.classList.remove("hidden");
    }
  });

  function renderQuestion(question) {
    if (question.type === "technical") {
      return `<p class="text-blue-600">${question.content}</p>`;
    } else if (question.type === "code_example") {
      return `<pre class="bg-gray-100 p-4 rounded">${question.content}</pre>`;
    } else if (question.type === "code_correction") {
      return `<p class="text-red-600">${question.content}</p>`;
    }
    return `<p>${question.content}</p>`;
  }
});
