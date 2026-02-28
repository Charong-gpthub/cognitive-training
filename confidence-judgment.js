const ALL_QUESTIONS = [
    { id: "cj-1", q: "中国首都是什么？", options: ["上海", "北京", "广州", "深圳"], answer: 1 },
    { id: "cj-2", q: "3 的平方是多少？", options: ["6", "8", "9", "12"], answer: 2 },
    { id: "cj-3", q: "地球围绕哪颗恒星运行？", options: ["月球", "火星", "太阳", "木星"], answer: 2 },
    { id: "cj-4", q: "HTTP 默认端口是？", options: ["21", "80", "443", "3306"], answer: 1 },
    { id: "cj-5", q: "一周有几天？", options: ["5", "6", "7", "8"], answer: 2 },
    { id: "cj-6", q: "2+5×2 = ?", options: ["14", "12", "10", "9"], answer: 1 },
    { id: "cj-7", q: "人体主要用于输氧的血细胞是？", options: ["血小板", "白细胞", "红细胞", "淋巴细胞"], answer: 2 },
    { id: "cj-8", q: "JavaScript 中数组长度属性是？", options: [".size", ".length", ".count", ".len"], answer: 1 }
];
const CONTENT_VERSION = "confidence-judgment-v2-seeded";

let index = 0;
let correctCount = 0;
let confidenceSum = 0;
let selected = null;
let sessionStartedAt = null;
let sessionSeed = "";
let sessionQuestions = [];
let questionOrder = [];
let optionOrder = [];

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("cj-panel");
const questionBox = document.getElementById("question-box");
const optionsBox = document.getElementById("options-box");
const confidenceInput = document.getElementById("confidence");
const confidenceLabel = document.getElementById("confidence-label");
const feedback = document.getElementById("feedback");
const resultModal = document.getElementById("result-modal");

function buildSessionQuestions() {
    const seeded = window.SeededRandom;
    sessionSeed = seeded ? seeded.createSessionSeed("confidence-judgment") : `confidence-judgment-${Date.now()}`;
    const rng = seeded ? seeded.createRngFromSeed(sessionSeed) : Math.random;
    const ordered = seeded
        ? seeded.pickShuffled(ALL_QUESTIONS, rng, ALL_QUESTIONS.length)
        : ALL_QUESTIONS.slice();

    questionOrder = ordered.map((item) => item.id);
    optionOrder = [];
    sessionQuestions = ordered.map((item) => {
        const answerText = item.options[item.answer];
        const options = item.options.slice();
        if (seeded) {
            seeded.shuffleInPlace(options, rng);
        }
        optionOrder.push({ id: item.id, options: options.slice() });
        return {
            id: item.id,
            q: item.q,
            options,
            correctIndex: options.indexOf(answerText)
        };
    });
}

function updateBoard() {
    const answered = index;
    const acc = answered === 0 ? 0 : Math.round((correctCount / answered) * 100);
    const avgConf = answered === 0 ? 0 : Math.round(confidenceSum / answered);
    const gap = Math.abs(avgConf - acc);
    const total = sessionQuestions.length || ALL_QUESTIONS.length;

    document.getElementById("progress").textContent = `${answered}/${total}`;
    document.getElementById("acc").textContent = `${acc}%`;
    document.getElementById("gap").textContent = `${gap}%`;
}

function renderQuestion() {
    const item = sessionQuestions[index];
    selected = null;
    feedback.textContent = "";
    questionBox.innerHTML = `<strong>题目 ${index + 1}</strong><p>${item.q}</p>`;
    optionsBox.innerHTML = "";

    item.options.forEach((text, idx) => {
        const label = document.createElement("label");
        label.className = "cj-option";
        label.innerHTML = `<input type="radio" name="option" value="${idx}"><span>${text}</span>`;
        label.querySelector("input").addEventListener("change", () => {
            selected = idx;
        });
        optionsBox.appendChild(label);
    });
}

function submitAnswer() {
    if (selected === null) {
        feedback.textContent = "请先选择答案。";
        return;
    }
    const conf = Number(confidenceInput.value);
    const item = sessionQuestions[index];
    const isCorrect = selected === item.correctIndex;

    if (isCorrect) {
        correctCount += 1;
    }
    confidenceSum += conf;
    feedback.textContent = isCorrect ? "回答正确。" : "回答错误。";

    index += 1;
    updateBoard();

    if (index >= sessionQuestions.length) {
        finish();
        return;
    }
    setTimeout(renderQuestion, 500);
}

function finish() {
    const total = sessionQuestions.length;
    const acc = Math.round((correctCount / total) * 100);
    const avgConf = Math.round(confidenceSum / total);
    const gap = Math.abs(avgConf - acc);

    document.getElementById("result-acc").textContent = `${acc}%`;
    document.getElementById("result-conf").textContent = `${avgConf}%`;
    document.getElementById("result-gap").textContent = `${gap}%`;

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "confidence-judgment",
            gameName: "置信度判断任务",
            startedAt: sessionStartedAt || new Date(),
            finishedAt: new Date(),
            metrics: {
                accuracy: acc,
                avgConfidence: avgConf,
                calibrationGap: gap,
                seed: sessionSeed,
                contentVersion: CONTENT_VERSION,
                questionOrder,
                optionOrder
            }
        });
    }

    panel.style.display = "none";
    resultModal.style.display = "flex";
}

function startGame() {
    index = 0;
    correctCount = 0;
    confidenceSum = 0;
    sessionStartedAt = new Date();
    buildSessionQuestions();
    startScreen.style.display = "none";
    panel.style.display = "block";
    resultModal.style.display = "none";
    updateBoard();
    renderQuestion();
}

confidenceInput.addEventListener("input", () => {
    confidenceLabel.textContent = `${confidenceInput.value}%`;
});
document.getElementById("submit-btn").addEventListener("click", submitAnswer);

window.startGame = startGame;
