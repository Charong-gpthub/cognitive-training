const ALL_ITEMS = [
    { id: "rat-1", triad: ["白", "雪", "公主"], answer: "王子" },
    { id: "rat-2", triad: ["火", "山", "口"], answer: "喷" },
    { id: "rat-3", triad: ["手", "机", "屏"], answer: "触" },
    { id: "rat-4", triad: ["海", "水", "军"], answer: "蓝" },
    { id: "rat-5", triad: ["书", "包", "桌"], answer: "课" },
    { id: "rat-6", triad: ["电", "脑", "程"], answer: "编" },
    { id: "rat-7", triad: ["晨", "跑", "鞋"], answer: "运" },
    { id: "rat-8", triad: ["杯", "子", "茶"], answer: "水" },
    { id: "rat-9", triad: ["风", "筝", "线"], answer: "放" },
    { id: "rat-10", triad: ["红", "灯", "停"], answer: "绿" },
    { id: "rat-11", triad: ["语", "文", "字"], answer: "汉" },
    { id: "rat-12", triad: ["月", "亮", "夜"], answer: "晚" }
];
const CONTENT_VERSION = "remote-associates-v2-seeded";

let index = 0;
let correctCount = 0;
let elapsed = 0;
let timer = null;
let sessionStartedAt = null;
let sessionSeed = "";
let sessionItems = [];
let itemOrder = [];

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("rat-panel");
const resultModal = document.getElementById("result-modal");
const triadEl = document.getElementById("triad");
const answerEl = document.getElementById("answer");
const feedback = document.getElementById("feedback");

function updateBoard() {
    document.getElementById("progress").textContent = String(Math.min(index + 1, sessionItems.length));
    document.getElementById("correct").textContent = String(correctCount);
    document.getElementById("time").textContent = `${elapsed}s`;
}

function normalize(text) {
    return String(text || "").trim().toLowerCase();
}

function buildSessionItems() {
    const seeded = window.SeededRandom;
    sessionSeed = seeded ? seeded.createSessionSeed("remote-associates") : `remote-associates-${Date.now()}`;
    const rng = seeded ? seeded.createRngFromSeed(sessionSeed) : Math.random;
    sessionItems = seeded
        ? seeded.pickShuffled(ALL_ITEMS, rng, ALL_ITEMS.length)
        : ALL_ITEMS.slice();
    itemOrder = sessionItems.map((item) => item.id);
}

function renderQuestion() {
    const item = sessionItems[index];
    triadEl.textContent = item.triad.join("  ·  ");
    answerEl.value = "";
    answerEl.focus();
    updateBoard();
}

function submit() {
    if (index >= sessionItems.length) {
        return;
    }
    const item = sessionItems[index];
    const isCorrect = normalize(answerEl.value) === normalize(item.answer);
    if (isCorrect) {
        correctCount += 1;
        feedback.textContent = "正确";
    } else {
        feedback.textContent = `不正确，参考答案：${item.answer}`;
    }

    index += 1;
    if (index >= sessionItems.length) {
        finish();
        return;
    }
    setTimeout(() => {
        feedback.textContent = "";
        renderQuestion();
    }, 450);
}

function finish() {
    if (timer) {
        clearInterval(timer);
    }
    const total = sessionItems.length;
    const accuracy = Math.round((correctCount / total) * 100);
    const avgTime = (elapsed / total).toFixed(1);

    document.getElementById("result-acc").textContent = `${accuracy}%`;
    document.getElementById("result-avg-time").textContent = `${avgTime}s`;
    document.getElementById("result-total-time").textContent = `${elapsed}s`;

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "remote-associates",
            gameName: "远距离联想测验",
            startedAt: sessionStartedAt || new Date(),
            finishedAt: new Date(),
            score: correctCount,
            metrics: {
                total,
                correct: correctCount,
                accuracy,
                avgTimeSec: Number(avgTime),
                seed: sessionSeed,
                contentVersion: CONTENT_VERSION,
                itemOrder
            }
        });
    }

    panel.style.display = "none";
    resultModal.style.display = "flex";
}

function startGame() {
    index = 0;
    correctCount = 0;
    elapsed = 0;
    sessionStartedAt = new Date();
    buildSessionItems();

    if (timer) {
        clearInterval(timer);
    }
    timer = setInterval(() => {
        elapsed += 1;
        document.getElementById("time").textContent = `${elapsed}s`;
    }, 1000);

    feedback.textContent = "";
    renderQuestion();
    startScreen.style.display = "none";
    panel.style.display = "block";
    resultModal.style.display = "none";
}

document.getElementById("submit-btn").addEventListener("click", submit);
answerEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        submit();
    }
});

window.startGame = startGame;
