
document.addEventListener("DOMContentLoaded", function () {

    // QUIZ: Correct answers
    const correctAnswers = {
        q1: "a",
        q2: "b",
        q3: "c",
        q4: "a",
        q5: "b"
    };

    const quizForm = document.getElementById("quizForm");
    const quizResult = document.getElementById("quizResult");

    if (quizForm && quizResult) {
        quizForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const formData = new FormData(quizForm);
            let score = 0;
            let answered = 0;

            for (const question in correctAnswers) {
                const answer = formData.get(question);

                if (answer) answered++;
                if (answer === correctAnswers[question]) score++;
            }

            quizResult.style.display = "block";

            if (answered !== 5) {
                quizResult.textContent = "Please answer all five questions.";
                return;
            }

            quizResult.textContent = `Your Score: ${score} / 5. Saving your result...`;

            try {
                const response = await fetch("/api/quiz", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ score: score, total: 5 })
                });

                const result = await response.json();

                if (!response.ok) throw new Error(result.message);

                quizResult.textContent =
                    `Your Score: ${score} / 5. ${result.message}`;

            } catch (error) {
                console.error("Quiz error:", error);
                quizResult.textContent =
                    `Your Score: ${score} / 5. Unable to save result to backend.`;
            }
        });
    }


    // SURVEY: Save responses
    const surveyForm = document.getElementById("surveyForm");
    const surveyResult = document.getElementById("surveyResult");

    if (surveyForm && surveyResult) {
        surveyForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const surveyData = {
                awareness: document.getElementById("awareness").value,
                knowledge: document.getElementById("knowledge").value,
                safety: document.getElementById("safety").value,
                suggestion: document.getElementById("suggestion").value.trim()
            };

            if (!surveyData.awareness || !surveyData.knowledge || !surveyData.safety) {
                surveyResult.textContent = "Please complete all required fields.";
                return;
            }

            surveyResult.textContent = "Submitting your response...";

            try {
                const response = await fetch("/api/survey", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(surveyData)
                });

                const result = await response.json();

                if (!response.ok) throw new Error(result.message);

                surveyResult.textContent = result.message;
                surveyForm.reset();

            } catch (error) {
                console.error("Survey error:", error);
                surveyResult.textContent =
                    "Unable to save survey. Please check the backend connection.";
            }
        });
    }

    // CONTACT & FEEDBACK SYSTEM

    const feedbackForm = document.getElementById("feedbackForm");
    const feedbackResult = document.getElementById("feedbackResult");

    if (feedbackForm && feedbackResult) {

        feedbackForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const feedbackData = {
                name: document.getElementById("feedbackName").value.trim(),
                email: document.getElementById("feedbackEmail").value.trim(),
                message: document.getElementById("feedbackMessage").value.trim()
            };

            if (!feedbackData.name || !feedbackData.email || !feedbackData.message) {
                feedbackResult.textContent = "Please complete all fields.";
                return;
            }

            feedbackResult.textContent = "Submitting feedback...";

            try {
                const response = await fetch("/api/feedback", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(feedbackData)
                });

                const result = await response.json();

                if (!response.ok) throw new Error(result.message);

                feedbackResult.textContent = result.message;
                feedbackForm.reset();

            } catch (error) {
                console.error("Feedback error:", error);
                feedbackResult.textContent =
                    "Unable to submit feedback. Please check the backend connection.";
            }
        });
    }
});
