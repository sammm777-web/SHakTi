
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve SHakti frontend files safely
const frontendFolder = path.join(__dirname, "..");

app.use("/css", express.static(path.join(frontendFolder, "css")));
app.use("/js", express.static(path.join(frontendFolder, "js")));

// Local storage (no database installation required)
const dataFolder = path.join(__dirname, "data");

if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
}

function saveData(filename, data) {
    const filePath = path.join(dataFolder, filename);

    let records = [];

    if (fs.existsSync(filePath)) {
        records = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    records.push({
        id: Date.now().toString(),
        ...data,
        submittedAt: new Date().toISOString()
    });

    fs.writeFileSync(filePath, JSON.stringify(records, null, 2));
}

// Serve website pages
const pages = {
    "/": "index.html",
    "/index.html": "index.html",
    "/quiz.html": "quiz.html",
    "/rights.html": "rights.html",
    "/emergency.html": "emergency.html",
    "/legal-support.html": "legal-support.html",
    "/cyber-safety.html": "cyber-safety.html",
    "/workplace.html": "workplace.html"
};

app.get(Object.keys(pages), (req, res) => {
    res.sendFile(path.join(frontendFolder, pages[req.path]));
});

// Health API
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "SHakti backend is running!"
    });
});

// Survey API
app.post("/api/survey", (req, res) => {
    const { awareness, knowledge, safety, suggestion } = req.body;

    if (!awareness || !knowledge || !safety) {
        return res.status(400).json({
            success: false,
            message: "Please complete all required survey fields."
        });
    }

    try {
        saveData("surveys.json", {
            awareness,
            knowledge,
            safety,
            suggestion: suggestion || ""
        });

        res.status(201).json({
            success: true,
            message: "Survey response saved successfully!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to save survey response."
        });
    }
});

// Quiz API
app.post("/api/quiz", (req, res) => {
    const { score, total } = req.body;

    if (
        !Number.isInteger(score) ||
        !Number.isInteger(total) ||
        total <= 0 ||
        score < 0 ||
        score > total
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid quiz result."
        });
    }

    try {
        saveData("quiz-results.json", { score, total });

        res.status(201).json({
            success: true,
            message: "Quiz result saved successfully!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to save quiz result."
        });
    }
});

// Contact and feedback API
app.post("/api/feedback", (req, res) => {
    const { name, email, message } = req.body;

    if (
        typeof name !== "string" || !name.trim() ||
        typeof email !== "string" || !email.trim() ||
        typeof message !== "string" || !message.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: "Please provide your name, email and message."
        });
    }

    try {
        saveData("feedback.json", {
            name: name.trim(),
            email: email.trim(),
            message: message.trim()
        });

        res.status(201).json({
            success: true,
            message: "Thank you! Your feedback has been received."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to save feedback."
        });
    }
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found."
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`SHakti backend running at http://localhost:${PORT}`);
});
