const ITEMS = [
    { triad: ["白", "雪", "公主"], answer: "王子" },
    { triad: ["火", "山", "口"], answer: "喷" },
    { triad: ["手", "机", "屏"], answer: "触" },
    { triad: ["海", "水", "军"], answer: "蓝" },
    { triad: ["书", "包", "桌"], answer: "课" },
    { triad: ["电", "脑", "程"], answer: "编" },
    { triad: ["晨", "跑", "鞋"], answer: "运" },
    { triad: ["杯", "子", "茶"], answer: "水" },
    { triad: ["风", "筝", "线"], answer: "放" },
    { triad: ["红", "灯", "停"], answer: "绿" },
    { triad: ["语", "文", "字"], answer: "汉" },
    { triad: ["月", "亮", "夜"], answer: "晚" }
];

let index = 0;
let correctCount = 0;
let elapsed = 0;
let timer = null;
let sessionStartedAt = null;

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("rat-panel");
const resultModal = document.getElementById("result-modal");
const triadEl = document.getElementById("triad");
const answerEl = document.getElementById("answer");
const feedback = document.getElementById("feedback");

function updateBoard() {
    document.getElementById("progress").textContent = String(index + 1);
    document.getElementById("correct").textContent = String(correctCount);
    document.getElementById("time").textContent = `${elapsed}s`;
}

function normalize(text) {
    return String(text || "").trim().toLowerCase();
}

function renderQuestion() {
    const item = ITEMS[index];
    triadEl.textContent = item.triad.join("  ·  ");
    answerEl.value = "";
    answerEl.focus();
    updateBoard();
}

function submit() {
    if (index >= ITEMS.length) {
        return;
    }
    const item = ITEMS[index];
    const isCorrect = normalize(answerEl.value) === normalize(item.answer);
    if (isCorrect) {
        correctCount += 1;
        feedback.textContent = "正确";
    } else {
        feedback.textContent = `不正确，参考答案：${item.answer}`;
    }

    index += 1;
    if (index >= ITEMS.length) {
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
    const total = ITEMS.length;
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
                avgTimeSec: Number(avgTime)
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
